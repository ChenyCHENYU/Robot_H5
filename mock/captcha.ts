import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from './_util';

/**
 * 生成简单的 SVG 验证码图片（Base64）
 * Mock 环境下固定验证码为 "1234"，方便开发调试
 */
function generateCaptchaSvg(): string {
    const chars = '1234';
    const colors = ['#667eea', '#764ba2', '#0071e3', '#5856d6'];
    const width = 120;
    const height = 40;

    let textElements = '';
    for (let i = 0; i < chars.length; i++) {
        const x = 15 + i * 26 + Math.random() * 6;
        const y = 24 + Math.random() * 8;
        const rotate = Math.random() * 30 - 15;
        const color = colors[i % colors.length];
        textElements += `<text x="${x}" y="${y}" font-size="22" font-weight="bold" fill="${color}" transform="rotate(${rotate} ${x} ${y})">${chars[i]}</text>`;
    }

    // 干扰线
    let lines = '';
    for (let i = 0; i < 4; i++) {
        const x1 = Math.random() * width;
        const y1 = Math.random() * height;
        const x2 = Math.random() * width;
        const y2 = Math.random() * height;
        const color = colors[i % colors.length];
        lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="0.8" opacity="0.4"/>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#f8f9fa" rx="6"/>
        ${lines}
        ${textElements}
    </svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export default [
    {
        url: '/api/captcha',
        method: 'get',
        response: () => {
            return resultSuccess({
                captchaId: `mock_${Date.now()}`,
                image: generateCaptchaSvg(),
            });
        },
    },
] as MockMethod[];
