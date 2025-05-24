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
import { KeyPair } from './types'

interface CurveModule extends EmscriptenModule {
    _curve25519_donna(mypublic_ptr: number, secret_ptr: number, basepoint_ptr: number): number
    _curve25519_sign(signature_ptr: number, privateKey_ptr: number, message_ptr: number, message_len: number): number
    _curve25519_verify(signature_ptr: number, privateKey_ptr: number, message_ptr: number, message_len: number): number
}

const instance = factory() as CurveModule

// The basepoint for Curve25519
export const basepoint = new Uint8Array(32).fill(0)
basepoint[0] = 9

function _allocate(bytes: Uint8Array) {
    const address = instance._malloc(bytes.length)
    instance.HEAPU8.set(bytes, address)
    return address
}

function _readBytes(address: number, length: number, array: Uint8Array) {
    array.set(instance.HEAPU8.subarray(address, address + length))
}

/**
 * Generate a key pair from a private key
 */
export function generateKeyPair(privKey: Uint8Array): KeyPair {
    const priv = new Uint8Array(privKey)
    priv[0] &= 248
    priv[31] &= 127
    priv[31] |= 64

    // Where to store the result
    const publicKey_ptr = instance._malloc(32)

    // Get a pointer to the private key
    const privateKey_ptr = _allocate(priv)

    // The basepoint for generating public keys
    const basepoint_ptr = _allocate(basepoint)

    // The return value is just 0, the operation is done in place
    const err = instance._curve25519_donna(publicKey_ptr, privateKey_ptr, basepoint_ptr)
    if (err !== 0) {
        throw new Error(`Error performing curve scalar multiplication: ${err}`)
    }

    const res = new Uint8Array(32)
    _readBytes(publicKey_ptr, 32, res)

    instance._free(publicKey_ptr)
    instance._free(privateKey_ptr)
    instance._free(basepoint_ptr)

    return { pubKey: res, privKey: priv }
}

/**
 * Compute a shared secret from a public and private key
 */
export function sharedSecret(pubKey: Uint8Array, privKey: Uint8Array): Uint8Array {
    // Where to store the result
    const sharedKey_ptr = instance._malloc(32)

    // Get a pointer to our private key
    const privateKey_ptr = _allocate(new Uint8Array(privKey))

    // Get a pointer to their public key, the basepoint when you're
    // generating a shared secret
    const basepoint_ptr = _allocate(new Uint8Array(pubKey))

    // Return value is 0 here too of course
    const err = instance._curve25519_donna(sharedKey_ptr, privateKey_ptr, basepoint_ptr)
    if (err !== 0) {
        throw new Error(`Error performing curve scalar multiplication: ${err}`)
    }

    const res = new Uint8Array(32)
    _readBytes(sharedKey_ptr, 32, res)

    instance._free(sharedKey_ptr)
    instance._free(privateKey_ptr)
    instance._free(basepoint_ptr)

    return res
}

/**
 * Sign a message with a private key
 */
export function sign(privKey: Uint8Array, message: Uint8Array): Uint8Array {
    // Where to store the result
    const signature_ptr = instance._malloc(64)

    // Get a pointer to our private key
    const privateKey_ptr = _allocate(new Uint8Array(privKey))

    // Get a pointer to the message
    const message_ptr = _allocate(new Uint8Array(message))

    instance._curve25519_sign(signature_ptr, privateKey_ptr, message_ptr, message.byteLength)

    const res = new Uint8Array(64)
    _readBytes(signature_ptr, 64, res)

    instance._free(signature_ptr)
    instance._free(privateKey_ptr)
    instance._free(message_ptr)

    return res
}

/**
 * Verify a signature for a message and public key
 */
export function verify(pubKey: Uint8Array, message: Uint8Array, sig: Uint8Array): boolean {
    // Get a pointer to their public key
    const publicKey_ptr = _allocate(new Uint8Array(pubKey))

    // Get a pointer to the signature
    const signature_ptr = _allocate(new Uint8Array(sig))

    // Get a pointer to the message
    const message_ptr = _allocate(new Uint8Array(message))

    const res = instance._curve25519_verify(signature_ptr, publicKey_ptr, message_ptr, message.byteLength)

    instance._free(publicKey_ptr)
    instance._free(signature_ptr)
    instance._free(message_ptr)

    return res !== 0
}

/**
 * Syntactic sugar for verify with explicit semantics.  The fact that verify returns true when
 * a signature is invalid could be confusing. The meaning of this function should be clear.
 */
export function signatureIsValid(pubKey: Uint8Array, message: Uint8Array, sig: Uint8Array): boolean {
    return !verify(pubKey, message, sig)
}
