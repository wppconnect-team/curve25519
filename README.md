**English** | [Português (Brasil)](./README.pt-BR.md)

<p align="center">
  <a href="https://wppconnect.io/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://wppconnect-team.github.io/brand/wppconnect-dark.png" />
      <img src="https://wppconnect-team.github.io/brand/wppconnect-light.png" alt="WPPConnect" width="220" height="121" />
    </picture>
  </a>
</p>

# WPPConnect/Curve25519

Expose Curve25519 operations through a function-based TypeScript API.

A WPPConnect Team fork in the WPPConnect ecosystem. Original project credits and license are preserved.

[Getting started](#getting-started) | [Documentation](#documentation) | [Contributing](#contributing) | [Support WPPConnect](#support-the-project)

[![License: GPL-3.0-only](https://img.shields.io/badge/license-GPL--3.0--only-blue)](./LICENSE) [![npm version](https://img.shields.io/npm/v/@wppconnect/curve25519)](https://www.npmjs.com/package/@wppconnect/curve25519) [![CI](https://github.com/wppconnect-team/curve25519/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/wppconnect-team/curve25519/actions/workflows/build.yml) [![Open Collective](https://img.shields.io/badge/Open%20Collective-WPPConnect-blue)](https://opencollective.com/wppconnect)

## Overview

For cryptographic integration developers. This WPPConnect Team fork of [privacyresearchgroup/curve25519-typescript](https://github.com/privacyresearchgroup/curve25519-typescript) exposes named functions instead of the upstream class interface. It supplies curve operations used by the libsignal-protocol fork.

## Features

- `generateKeyPair`, `sharedSecret`, `sign`, `verify` and `signatureIsValid` exports.
- C implementation compiled to JavaScript with Emscripten.

## Getting started

Use Node.js/npm. Save the local key-agreement example as `index.mjs`, then run `node index.mjs`. It prints `true` without contacting any service.

```sh
npm install @wppconnect/curve25519
```

```javascript
import { randomBytes } from "node:crypto";
import { generateKeyPair, sharedSecret } from "@wppconnect/curve25519";

const alice = generateKeyPair(new Uint8Array(randomBytes(32)));
const bob = generateKeyPair(new Uint8Array(randomBytes(32)));
const a = sharedSecret(bob.pubKey, alice.privKey);
const b = sharedSecret(alice.pubKey, bob.privKey);
console.log(a.every((value, index) => value === b[index]));
```

## Configuration

Inputs are `Uint8Array`. **`verify` returns `true` for an invalid signature**; prefer `signatureIsValid` for conventional validity semantics. See [tests](src/__tests__/) for vectors. Emscripten is required only to rebuild the C sources using [compile.sh](compile.sh).

## Documentation

- [Function implementation](./src/curve-wrapper.ts)
- [Native sources](./native/)
- [Retained technical details and acknowledgments](documentation/readme-reference.md)

## WPPConnect ecosystem

| Project | Purpose | When to use it |
| --- | --- | --- |
| [@wppconnect/libsignal-protocol](https://github.com/wppconnect-team/libsignal-protocol) | Implement Signal Protocol sessions and key handling in TypeScript. | Implement Signal session/key persistence. |

## Support the project

The WPPConnect contribution below supports maintenance of this fork within the ecosystem; it does not imply funding or endorsement of upstream maintainers.

WPPConnect is maintained by an open-source community. Your support helps fund maintenance, infrastructure, documentation, and the people working on the ecosystem.

If WPPConnect helps your project or business, consider making a one-time contribution or becoming a recurring supporter.

**[Support WPPConnect on Open Collective](https://opencollective.com/wppconnect)**

Contributions are voluntary. See the official page for current financial information. You can also help with code, tests, documentation, translations and well-described issue reports.

## Contributing

Contributions of code, tests, examples, documentation and translations are welcome. For larger changes, discuss the approach in an issue first. Include the project/runtime versions, a minimal reproduction and sanitized logs when reporting a problem. Update both `README.md` and `README.pt-BR.md` in the same change when installation, configuration, features, examples, licensing or funding changes.

After installing the development dependencies, use the repository checks relevant to your change:

```sh
npm run build
npm run lint
npm test
```

Account-dependent examples and tests require separate validation with an authorized test account. Never attach credentials or session files to an issue.

## Community and support

Use [repository issues](https://github.com/wppconnect-team/curve25519/issues) for reproducible bugs and feature proposals. For usage questions, join the community through the official channels:

- [Discord](https://discord.gg/JU5JGGKGNG)
- [Telegram](https://t.me/wppconnect)
- [YouTube](https://www.youtube.com/c/wppconnect)

This project is independent and is not affiliated with or endorsed by WhatsApp or Meta. Follow applicable terms and obtain authorization for account and messaging operations.

## License

[GNU General Public License v3.0 only (GPL-3.0-only)](./LICENSE).

Copyright 2020 Privacy Research, LLC. Based on work by Signal and Privacy Research.

The original legal document and existing copyright notices are preserved. Third-party components retain their own terms.
