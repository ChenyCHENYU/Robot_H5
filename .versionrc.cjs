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
        { type: 'wip', section: '🚧 开发中', hidden: true },
        { type: 'deps', section: '📦 依赖更新', hidden: true },
        { type: 'test', section: '✅ 测试', hidden: true },
    ],
    commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
    compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
};
