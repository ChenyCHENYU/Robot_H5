/**
 * @name configLegacyPlugin
 * @description es兼容性支持
 */
import legacyPlugin from '@vitejs/plugin-legacy';

export const configLegacyPlugin = () => {
    return legacyPlugin({
        targets: ['Chrome >= 87', 'Safari >= 14', 'Firefox >= 78', 'Edge >= 88'],
        modernPolyfills: true,
        renderLegacyChunks: false,
    });
};
