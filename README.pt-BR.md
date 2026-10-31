[English](./README.md) | **Português (Brasil)**

<p align="center">
  <a href="https://wppconnect.io/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://wppconnect-team.github.io/brand/wppconnect-dark.png" />
      <img src="https://wppconnect-team.github.io/brand/wppconnect-light.png" alt="WPPConnect" width="220" height="121" />
    </picture>
  </a>
</p>

# WPPConnect/Curve25519

Exponha operações Curve25519 por uma API TypeScript baseada em funções.

Um fork da WPPConnect Team no ecossistema WPPConnect. Os créditos e a licença do projeto original são preservados.

[Primeiros passos](#primeiros-passos) | [Documentação](#documentação) | [Como contribuir](#como-contribuir) | [Apoie a WPPConnect](#apoie-o-projeto)

[![License: GPL-3.0-only](https://img.shields.io/badge/license-GPL--3.0--only-blue)](./LICENSE) [![npm version](https://img.shields.io/npm/v/@wppconnect/curve25519)](https://www.npmjs.com/package/@wppconnect/curve25519) [![CI](https://github.com/wppconnect-team/curve25519/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/wppconnect-team/curve25519/actions/workflows/build.yml) [![Open Collective](https://img.shields.io/badge/Open%20Collective-WPPConnect-blue)](https://opencollective.com/wppconnect)

## Visão geral

Para desenvolvedores de integrações criptográficas. Este fork da WPPConnect Team de [privacyresearchgroup/curve25519-typescript](https://github.com/privacyresearchgroup/curve25519-typescript) expõe funções nomeadas no lugar da interface de classes do upstream. Ele fornece operações de curva usadas pelo fork libsignal-protocol.

## Funcionalidades

- Exports `generateKeyPair`, `sharedSecret`, `sign`, `verify` e `signatureIsValid`.
- Implementação C compilada para JavaScript com Emscripten.

## Primeiros passos

Use Node.js/npm. Salve o exemplo local de acordo de chaves como `index.mjs` e execute `node index.mjs`. Ele imprime `true` sem contatar serviços.

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

## Configuração

As entradas são `Uint8Array`. **`verify` retorna `true` para uma assinatura inválida**; prefira `signatureIsValid` para a semântica convencional de validade. Consulte os vetores nos [testes](src/__tests__/). Emscripten é necessário apenas para recompilar os fontes C com [compile.sh](compile.sh).

## Documentação

- [Implementação das funções](./src/curve-wrapper.ts)
- [Fontes nativos](./native/)
- [Detalhes técnicos e agradecimentos preservados](documentation/readme-reference.md)

## Ecossistema WPPConnect

| Projeto | Finalidade | Quando usar |
| --- | --- | --- |
| [@wppconnect/libsignal-protocol](https://github.com/wppconnect-team/libsignal-protocol) | Implemente sessões e gerenciamento de chaves Signal Protocol em TypeScript. | Implementar persistência de sessões/chaves Signal. |

## Apoie o projeto

A contribuição à WPPConnect abaixo apoia a manutenção deste fork no ecossistema; ela não implica financiamento ou endosso dos mantenedores do upstream.

A WPPConnect é mantida por uma comunidade de código aberto. Seu apoio ajuda a financiar a manutenção, a infraestrutura, a documentação e o trabalho das pessoas que desenvolvem o ecossistema.

Se a WPPConnect ajuda seu projeto ou sua empresa, considere fazer uma contribuição pontual ou apoiar de forma recorrente.

**[Apoie a WPPConnect no Open Collective](https://opencollective.com/wppconnect)**

As contribuições são voluntárias. Consulte a página oficial para acompanhar as informações financeiras atuais. Você também pode ajudar com código, testes, documentação, traduções e relatos de problemas bem descritos.

## Como contribuir

Contribuições de código, testes, exemplos, documentação e traduções são bem-vindas. Para mudanças maiores, discuta a proposta em uma issue primeiro. Ao relatar um problema, informe as versões do projeto/runtime, uma reprodução mínima e logs sem dados sensíveis. Atualize `README.md` e `README.pt-BR.md` na mesma alteração quando mudar instalação, configuração, funcionalidades, exemplos, licença ou arrecadação.

Após instalar as dependências de desenvolvimento, use as verificações pertinentes à sua alteração:

```sh
npm run build
npm run lint
npm test
```

Exemplos e testes que dependem de conta exigem validação separada com uma conta de teste autorizada. Nunca anexe credenciais ou arquivos de sessão a uma issue.

## Comunidade e suporte

Use as [issues do repositório](https://github.com/wppconnect-team/curve25519/issues) para bugs reproduzíveis e propostas de funcionalidades. Para dúvidas de uso, participe pelos canais oficiais:

- [Discord](https://discord.gg/JU5JGGKGNG)
- [Telegram](https://t.me/wppconnect)
- [YouTube](https://www.youtube.com/c/wppconnect)

Este projeto é independente e não é afiliado nem endossado pelo WhatsApp ou pela Meta. Siga os termos aplicáveis e obtenha autorização para operações de conta e mensagens.

## Licença

[GNU General Public License v3.0 only (GPL-3.0-only)](./LICENSE).

Copyright 2020 Privacy Research, LLC. Based on work by Signal and Privacy Research.

O documento jurídico original e os avisos de autoria existentes são preservados. Componentes de terceiros mantêm seus próprios termos.
