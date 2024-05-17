module.exports = {
    root: true,
    extends: ['plugin:@next/next/recommended', '@payloadcms', 'prettier'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
    ignorePatterns: ['**/payload-types.ts'],
    plugins: ['prettier'],
};
