# Build dependency security backport

The local `deepmerge` artifact carries the prototype-key fix from upstream PR274
on the compatible 4.x implementation. The version `4.3.2+wppconnect.1` identifies
this repository-maintained patch. It is private and must not be published to a
registry. Upstream has not published this version.

Both object-copy loops reject `__proto__` before assigning a property. The complete
implementation and the local `is-mergeable-object` helper retain their MIT notices.
Readable sources are in `vendor/deepmerge`; the checked-in tarball contains the
same runtime files. The npm override selects this artifact for Jest configuration
merging. These are development dependencies; the package's native crypto runtime
and published file list are unchanged.

The tarball SHA256 is 041ba6e59cb425f111ea0956baed6d05ff7e80957128d09db0b6ca658e49110c.
Source references and MIT notices are retained in vendor/deepmerge.

The release-it-owned Undici override selects compatible 7.30.1 without changing
other consumers. The Handlebars override advances the existing pin to 4.7.10.
Install with npm ci, run the native tests and security consumer regressions.

The proxy-tooling FTP parser selects basic-ftp 6.2.4, validated with real get-uri
FTP transfers and a bounded malformed listing. Socks IPv6 parsing uses ip-address
10.7.4 to avoid quadratic zone scanning. The regression suite also covers
Handlebars AST validation and inline precompilation, actual Jest-owned merger
semantics, and the release-it-owned HTTP decoder. It does not run a release.

Source references:
- https://github.com/TehShrike/deepmerge/tree/5b87756a5671635679001cbac72aa42f23472c81
- https://github.com/TehShrike/deepmerge/pull/274/commits/c5ad573121574db1c625b0aabcc6114ed7df6c5a
- https://github.com/TehShrike/is-mergeable-object/tree/v1.1.0

Run `node --test test/security-consumers.mjs` and `npm test` after `npm ci`.
