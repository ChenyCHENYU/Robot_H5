import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from './_util';

const CHAR_POOL = '123456789';

function randomCode(len = 4): string {
    let code = '';
    for (let i = 0; i < len; i++) {
        code += CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
    }
    return code;
}

function generateCaptchaSvg(code: string): string {
    const colors = ['#667eea', '#764ba2', '#0071e3', '#5856d6', '#e040fb', '#00bcd4'];
    const width = 120;
    const height = 40;

    let textElements = '';
    for (let i = 0; i < code.length; i++) {
        const x = 12 + i * 26 + (Math.random() * 8 - 4);
        const y = 22 + (Math.random() * 10 - 5);
        const rotate = Math.random() * 36 - 18;
        const fontSize = 20 + Math.random() * 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        textElements += `<text x="${x}" y="${y}" font-size="${fontSize}" font-family="monospace" font-weight="bold" fill="${color}" transform="rotate(${rotate} ${x} ${y})">${code[i]}</text>`;
    }

    let lines = '';
    for (let i = 0; i < 4; i++) {
        const x1 = Math.random() * width;
        const y1 = Math.random() * height;
        const x2 = Math.random() * width;
        const y2 = Math.random() * height;
        const color = colors[Math.floor(Math.random() * colors.length)];
        lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${0.6 + Math.random() * 0.6}" opacity="${0.3 + Math.random() * 0.3}"/>`;
    }

    let dots = '';
    for (let i = 0; i < 25; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = 0.5 + Math.random() * 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        dots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${0.25 + Math.random() * 0.3}"/>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f8f9fa" rx="6"/>${lines}${dots}${textElements}</svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export default [
    {
        url: '/api/captcha',
        method: 'get',
        response: () => {
            const code = randomCode(4);
            return resultSuccess({
                captchaId: `mock_${Date.now()}_${code}`,
                image: generateCaptchaSvg(code),
            });
        },
    },
] as MockMethod[];
