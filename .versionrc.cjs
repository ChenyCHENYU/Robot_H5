module.exports = {
    types: [
        { type: 'feat', section: '✨ 新功能' },
        { type: 'fix', section: '🐛 Bug 修复' },
        { type: 'perf', section: '⚡ 性能优化' },
        { type: 'refactor', section: '♻️ 重构' },
        { type: 'docs', section: '📝 文档', hidden: true },
        { type: 'style', section: '🎨 代码格式', hidden: true },
        { type: 'build', section: '📦 构建', hidden: true },
        { type: 'chore', section: '🔧 杂项', hidden: true },
        { type: 'revert', section: '⏪ 回退' },
    ],
    commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
    compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
};
