/*
 * Created April 2020
 *
 * Copyright (c) 2020 Privacy Research, LLC
 *
 *  Licensed under GPL v3 (https://www.gnu.org/licenses/gpl-3.0.en.html)
 *
 */

/// <reference types="emscripten" />
import factory from './built/curveasm'
import { KeyPair, Curve } from './types'

interface CurveModule extends EmscriptenModule {
    _curve25519_donna(mypublic_ptr: number, secret_ptr: number, basepoint_ptr: number): number
    _curve25519_sign(signature_ptr: number, privateKey_ptr: number, message_ptr: number, message_len: number): number
    _curve25519_verify(signature_ptr: number, privateKey_ptr: number, message_ptr: number, message_len: number): number
}

const instance = factory() as CurveModule

export class Curve25519Wrapper implements Curve {
    private _module: CurveModule
    basepoint: Uint8Array
    constructor(module?: CurveModule) {
        this._module = module || instance
        this.basepoint = new Uint8Array(32).fill(0)
        this.basepoint[0] = 9
    }

    private _allocate(bytes: Uint8Array) {
        const address = this._module._malloc(bytes.length)
        this._module.HEAPU8.set(bytes, address)

        return address
    }

    private _readBytes(address: number, length: number, array: Uint8Array) {
        array.set(this._module.HEAPU8.subarray(address, address + length))
    }

    keyPair(privKey: Uint8Array): KeyPair {
        const priv = new Uint8Array(privKey)
        priv[0] &= 248
        priv[31] &= 127
        priv[31] |= 64

        // Where to store the result
        const publicKey_ptr = this._module._malloc(32)

        // Get a pointer to the private key
        const privateKey_ptr = this._allocate(priv)

        // The basepoint for generating public keys
        const basepoint_ptr = this._allocate(this.basepoint)

        // The return value is just 0, the operation is done in place
        const err = this._module._curve25519_donna(publicKey_ptr, privateKey_ptr, basepoint_ptr)
        if (err !== 0) {
            throw new Error(`Error performing curve scalar multiplication: ${err}`)
        }

        const res = new Uint8Array(32)
        this._readBytes(publicKey_ptr, 32, res)

        this._module._free(publicKey_ptr)
        this._module._free(privateKey_ptr)
        this._module._free(basepoint_ptr)

        return { pubKey: res, privKey: priv }
    }

    sharedSecret(pubKey: Uint8Array, privKey: Uint8Array): Uint8Array {
        // Where to store the result
        const sharedKey_ptr = this._module._malloc(32)

        // Get a pointer to our private key
        const privateKey_ptr = this._allocate(new Uint8Array(privKey))

        // Get a pointer to their public key, the basepoint when you're
        // generating a shared secret
        const basepoint_ptr = this._allocate(new Uint8Array(pubKey))

        // Return value is 0 here too of course
        const err = this._module._curve25519_donna(sharedKey_ptr, privateKey_ptr, basepoint_ptr)
        if (err !== 0) {
            throw new Error(`Error performing curve scalar multiplication: ${err}`)
        }

        const res = new Uint8Array(32)
        this._readBytes(sharedKey_ptr, 32, res)

        this._module._free(sharedKey_ptr)
        this._module._free(privateKey_ptr)
        this._module._free(basepoint_ptr)

        return res
    }

    sign(privKey: Uint8Array, message: Uint8Array): Uint8Array {
        // Where to store the result
        const signature_ptr = this._module._malloc(64)

        // Get a pointer to our private key
        const privateKey_ptr = this._allocate(new Uint8Array(privKey))

        // Get a pointer to the message
        const message_ptr = this._allocate(new Uint8Array(message))

        this._module._curve25519_sign(signature_ptr, privateKey_ptr, message_ptr, message.byteLength)

        const res = new Uint8Array(64)
        this._readBytes(signature_ptr, 64, res)

        this._module._free(signature_ptr)
        this._module._free(privateKey_ptr)
        this._module._free(message_ptr)

        return res
    }

    verify(pubKey: Uint8Array, message: Uint8Array, sig: Uint8Array): boolean {
        // Get a pointer to their public key
        const publicKey_ptr = this._allocate(new Uint8Array(pubKey))

        // Get a pointer to the signature
        const signature_ptr = this._allocate(new Uint8Array(sig))

        // Get a pointer to the message
        const message_ptr = this._allocate(new Uint8Array(message))

        const res = this._module._curve25519_verify(signature_ptr, publicKey_ptr, message_ptr, message.byteLength)

        this._module._free(publicKey_ptr)
        this._module._free(signature_ptr)
        this._module._free(message_ptr)

        return res !== 0
    }

    /**
     * Syntactic sugar for verify with explicit semantics.  The fact that verify returns true when
     * a signature is invalid could be confusing. The meaning of this function should be clear.
     *
     * @param pubKey
     * @param message
     * @param sig
     */
    signatureIsValid(pubKey: Uint8Array, message: Uint8Array, sig: Uint8Array): boolean {
        return !this.verify(pubKey, message, sig)
    }
}
