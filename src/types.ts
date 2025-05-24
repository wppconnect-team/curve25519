/*
 * Created April 2020
 *
 * Copyright (c) 2020 Privacy Research, LLC
 *
 *  Licensed under GPL v3 (https://www.gnu.org/licenses/gpl-3.0.en.html)
 *
 */
export interface KeyPair {
    pubKey: Uint8Array
    privKey: Uint8Array
}

export interface Curve {
    keyPair(privKey: Uint8Array): KeyPair
    sharedSecret(pubKey: Uint8Array, privKey: Uint8Array): Uint8Array
    sign(privKey: Uint8Array, message: Uint8Array): Uint8Array
    verify(pubKey: Uint8Array, message: Uint8Array, sig: Uint8Array): boolean
}
