export default {
    extends: ['@commitlint/config-conventional'],
    ignores: [(commit) => /^(initial|first) commit$/i.test(commit)],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'docs', 'chore', 'style', 'refactor', 'perf', 'ci', 'test', 'build', 'revert']
        ]
    }
}