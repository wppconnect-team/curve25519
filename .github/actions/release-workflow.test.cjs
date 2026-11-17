const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

const workflow = readFileSync(path.join(__dirname, '../workflows/release.yml'), 'utf8')
const command = workflow.split('      - name: Trigger publish')[1].match(/run: (.+)/)[1]

for (const version of ['1.2.3', '2.0.0-rc.1']) {
    test(`dispatches publication at the release tag v${version}`, (t) => {
        const cwd = mkdtempSync(path.join(tmpdir(), 'release-dispatch-'))
        t.after(() => rmSync(cwd, { recursive: true, force: true }))
        writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({ version }))
        const result = spawnSync(
            process.env.WORKFLOW_TEST_BASH || 'bash',
            ['-e', '-c', `gh() { printf '%s\\n' "$*"; }\n${command}`],
            { cwd, encoding: 'utf8', timeout: 20000 }
        )
        assert.ifError(result.error)
        assert.equal(result.status, 0, result.stdout + result.stderr)
        assert.equal(result.stdout.trim(), `workflow run publish.yml --ref v${version}`)
    })
}
