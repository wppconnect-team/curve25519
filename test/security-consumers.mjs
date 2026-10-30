import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const jestOwner = createRequire(require.resolve('jest-config'));
const merge = jestOwner('deepmerge');
const writer = createRequire(import.meta.resolve('conventional-changelog-writer'));
const handlebars = writer('handlebars');
const malicious = () => JSON.parse('{"__proto__":{"unexpected":true}}');
function safe(value) {
  assert.equal(Object.getPrototypeOf(value), Object.prototype);
  assert.equal(value.unexpected, undefined);
  assert.equal(Object.hasOwn(value, '__proto__'), false);
  assert.equal({}.unexpected, undefined);
}

test('Jest merger rejects prototype keys from null targets and defaults', () => {
  safe(merge(Object.create(null), malicious()));
  safe(merge(malicious(), { enabled: true }));
  safe(merge({ options: null }, { options: malicious() }).options);
  safe(merge({ list: [] }, { list: [malicious()] }).list[0]);
});

test('Jest merger preserves ordinary nested configuration and arrays', () => {
  assert.deepEqual(merge({ nested: { a: 1 }, args: ['a'] }, { nested: { b: 2 }, args: ['b'] }), {
    nested: { a: 1, b: 2 }, args: ['a', 'b'],
  });
});

test('changelog Handlebars rejects a confused AST numeric literal', () => {
  const ast = handlebars.parse('{{helper 1}}');
  ast.body[0].params[0].value = '0';
  assert.throws(() => handlebars.precompile(ast), /value must be a number/);
});

test('changelog templates remain renderable and safe to embed in a script', () => {
  const template = '</script><script>example</script> {{name}}';
  assert.equal(handlebars.compile(template)({ name: 'A&B' }), '</script><script>example</script> A&amp;B');
  assert.equal(handlebars.precompile(template).includes('</script>'), false);
});

test('Socks IPv6 parsing rejects an oversized zone identifier within a bounded subprocess', () => {
  const code = String.raw`const {createRequire}=require('node:module');
    const owner=createRequire(require.resolve('socks'));
    const {Address6}=owner('ip-address');
    require('node:assert/strict').throws(()=>new Address6('fe80::1%'+'%'.repeat(65536)+'\ninvalid'));
    require('node:assert/strict').equal(new Address6('::1').correctForm(),'::1');
    require('node:assert/strict').equal(new Address6('fe80::1%eth0').zone,'%eth0');`;
  execFileSync(process.execPath, ['-e', code], { cwd: root, timeout: 2000 });
});

for (const name of ['ftp-consumer.cjs', 'undici-encoding.cjs']) {
  test(`release tooling passes real ${name} integration`, () => {
    const output = execFileSync(process.execPath, [path.join(__dirname, 'helpers', name), root], {
      cwd: root, timeout: 20000, encoding: 'utf8',
    });
    assert.match(output, /version/);
  });
}

test('the FTP consumer rejects a malformed listing without blocking', () => {
  execFileSync(process.execPath, [path.join(__dirname, 'helpers/ftp-consumer.cjs'), root, 'attack'], {
    cwd: root, timeout: 3000,
  });
});
