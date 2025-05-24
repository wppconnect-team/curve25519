# WPPConnect/Curve25519

[![npm version](https://img.shields.io/npm/v/@wppconnect/curve25519.svg?color=green)](https://www.npmjs.com/package/@wppconnect/curve25519)
[![Downloads](https://img.shields.io/npm/dm/@wppconnect/curve25519.svg)](https://www.npmjs.com/package/@wppconnect/curve25519)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/wppconnect-team/wa-proto.svg)](https://isitmaintained.com/project/wppconnect/wa-proto 'Average time to resolve an issue')
[![Percentage of issues still open](https://isitmaintained.com/badge/open/wppconnect-team/wa-proto.svg)](https://isitmaintained.com/project/wppconnect/wa-proto 'Percentage of issues still open')
[![Build Status](https://img.shields.io/github/actions/workflow/status/wppconnect-team/wa-proto/update-proto.yml?branch=main)](https://github.com/wppconnect/wa-proto/actions)
[![release-it](https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-release--it-e10079.svg)](https://github.com/release-it/release-it)

> **WPPConnect/WA-Proto** This library isolates the implementation of the X25519 curves used in [libsignal-protocol-javascript](https://github.com/signalapp/libsignal-protocol-javascript)
and exposes the basic functions in an easy-to-use TypeScript package.

> **This project is a fork of [privacyresearchgroup/curve25519-typescript](https://github.com/privacyresearchgroup/curve25519-typescript).**
> Modifications were made to expose the API only as functions (no classes) and to make usage easier in modern TypeScript projects.

## Installation

Use [yarn](https://yarnpkg.com/) or npm to install:

```sh
yarn add @wppconnect/curve25519
# or
npm install @wppconnect/curve25519
```

## Usage

The API is now function-based. Example usage for Diffie-Hellman:

```typescript
import { generateKeyPair, sharedSecret, sign, verify, signatureIsValid } from '@wppconnect/curve25519'

const alicePair = generateKeyPair(alice_bytes)
const bobPair = generateKeyPair(bob_bytes)

const aliceSecret = sharedSecret(bobPair.pubKey, alicePair.privKey)
const bobSecret = sharedSecret(alicePair.pubKey, bobPair.privKey)
```

Signing and verifying:

```typescript
// pub, priv, msg are Uint8Array
import { sign, verify, signatureIsValid } from '@wppconnect/curve25519'

const sig = sign(priv, msg)
const verified = verify(pub, msg, sig)
if (verified) {
  // Yes, this is correct.  `verify` returns `true` for invalid signatures
  throw new Error('INVALID SIGNATURE!')
}

// To avoid confusion, use:
const isValid = signatureIsValid(pub, msg, sig)
if (!isValid) {
  throw new Error('INVALID SIGNATURE!')
}
```

See the [tests](src/__tests__) for details on how to create input Uint8Arrays and for sample data.

## About this fork

- **Function-based API:** There are no more classes, only named functions for all operations (generateKeyPair, sharedSecret, sign, verify, signatureIsValid).
- **Compatibility:** Usage is simpler and more direct for modern TypeScript projects.

## Build

The main curve implementation is written in C and can be found in the [native/](native/) directory. It is compiled to Javascript with [Emscripten](https://emscripten.org/), as shown in the [compile.sh](compile.sh) script.

If you want to modify the C code or the compilation arguments, you will need to install Emscripten.

## Acknowledgements

This project is based on the work of the folks at [Signal](https://signal.org) and the original repository [privacyresearchgroup/curve25519-typescript](https://github.com/privacyresearchgroup/curve25519-typescript).

## License

Copyright 2020 Privacy Research, LLC

Licensed under GPLv3: [http://www.gnu.org/licenses/gpl-3.0.html](http://www.gnu.org/licenses/gpl-3.0.html)
