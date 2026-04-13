// prettier.config.js
/**
 * @type {import('prettier').Config}
 * @see https://www.prettier.cn/docs/options.html
 */

export default {
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    vueIndentScriptAndStyle: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    bracketSpacing: true,
    trailingComma: 'es5',
    bracketSameLine: false,
    jsxSingleQuote: true,
    arrowParens: 'avoid',
    insertPragma: false,
    requirePragma: false,
    proseWrap: 'always',
    htmlWhitespaceSensitivity: 'strict',
    endOfLine: 'lf',
    rangeStart: 0,
    rangeEnd: Infinity,
    embeddedLanguageFormatting: 'auto',
    experimentalTernaries: false,
    singleAttributePerLine: false,
};
