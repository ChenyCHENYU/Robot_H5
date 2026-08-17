<template>
    <div class="hook-demo">
        <C_NavBar title="useFilePreview" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #8E8E93">
                <C_Icon name="ph:eye-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">文件预览</h2>
            <p class="hook-demo__header-desc">PDF / Office / 图片 / 视频在线预览</p>
        </div>

        <!-- 示例文件列表 -->
        <div class="hook-demo__section">
            <p class="hook-demo__section-title">示例文件</p>
            <div v-for="group in fileGroups" :key="group.label" style="margin-bottom: 16px">
                <p style="font-size: 13px; font-weight: 600; color: var(--ds-text-secondary); margin: 0 0 8px">
                    {{ group.label }}
                </p>
                <div style="display: flex; flex-direction: column; gap: 8px">
                    <div
                        v-for="file in group.files"
                        :key="file.url"
                        class="hook-demo__file-item"
                        @click="previewFile(file)"
                    >
                        <div class="hook-demo__file-icon">
                            <C_Icon :name="file.icon" :size="22" :color="file.color" />
                        </div>
                        <div class="hook-demo__file-info">
                            <span class="hook-demo__file-name">{{ file.name }}</span>
                            <span class="hook-demo__file-size">{{ file.size }}</span>
                        </div>
                        <VanTag :type="file.tagType" round size="medium">{{ file.ext }}</VanTag>
                    </div>
                </div>
            </div>
        </div>

        <!-- 自定义 URL -->
        <div class="hook-demo__playground">
            <VanField
                v-model="customUrl"
                label="自定义 URL"
                placeholder="输入文件地址"
                clearable
            />
            <div class="hook-demo__btn-group" style="margin-top: 12px">
                <VanButton
                    type="primary"
                    size="small"
                    :loading="loading"
                    :disabled="!customUrl"
                    @click="preview(customUrl)"
                >
                    预览文件
                </VanButton>
            </div>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useFilePreview } from '@robot-h5/core';

    defineOptions({ name: 'HookFilePreview' });

    interface SampleFile {
        name: string;
        url: string;
        ext: string;
        size: string;
        icon: string;
        color: string;
        tagType: 'primary' | 'success' | 'warning' | 'danger' | 'default';
    }

    const { loading, error, preview } = useFilePreview();
    const customUrl = ref('');

    const fileGroups = [
        {
            label: '📄 文档',
            files: [
                {
                    name: 'W3C 测试 PDF',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    ext: 'PDF', size: '13 KB', icon: 'ph:file-pdf-bold', color: '#FF3B30', tagType: 'danger' as const,
                },
                {
                    name: 'Excel 示例表格',
                    url: 'https://go.microsoft.com/fwlink/?LinkID=521962',
                    ext: 'XLSX', size: '30 KB', icon: 'ph:file-xls-bold', color: '#34C759', tagType: 'success' as const,
                },
                {
                    name: 'Word 示例文档',
                    url: 'https://calibre-ebook.com/downloads/demos/demo.docx',
                    ext: 'DOCX', size: '357 KB', icon: 'ph:file-doc-bold', color: '#007AFF', tagType: 'primary' as const,
                },
                {
                    name: 'PPT 示例演示',
                    url: 'https://scholar.harvard.edu/files/torber/files/sample-slides.pptx',
                    ext: 'PPTX', size: '209 KB', icon: 'ph:file-ppt-bold', color: '#FF9500', tagType: 'warning' as const,
                },
            ],
        },
        {
            label: '🖼 图片',
            files: [
                {
                    name: 'JPG 风景照',
                    url: 'https://picsum.photos/id/10/800/600.jpg',
                    ext: 'JPG', size: '~120 KB', icon: 'ph:image-bold', color: '#5856D6', tagType: 'primary' as const,
                },
                {
                    name: 'PNG 透明图',
                    url: 'https://www.w3.org/Graphics/PNG/nurbcup2si.png',
                    ext: 'PNG', size: '87 KB', icon: 'ph:image-bold', color: '#5AC8FA', tagType: 'primary' as const,
                },
                {
                    name: 'SVG 矢量图',
                    url: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/ruby.svg',
                    ext: 'SVG', size: '2 KB', icon: 'ph:image-bold', color: '#FF2D55', tagType: 'danger' as const,
                },
            ],
        },
        {
            label: '🎬 音视频',
            files: [
                {
                    name: 'MP4 短视频',
                    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    ext: 'MP4', size: '375 KB', icon: 'ph:film-strip-bold', color: '#FF9500', tagType: 'warning' as const,
                },
                {
                    name: 'MP3 音频',
                    url: 'https://www.w3schools.com/html/horse.mp3',
                    ext: 'MP3', size: '26 KB', icon: 'ph:music-note-bold', color: '#AF52DE', tagType: 'default' as const,
                },
            ],
        },
        {
            label: '📦 其他',
            files: [
                {
                    name: 'TXT 纯文本',
                    url: 'https://www.w3.org/TR/PNG/iso_8859-1.txt',
                    ext: 'TXT', size: '10 KB', icon: 'ph:file-text-bold', color: '#8E8E93', tagType: 'default' as const,
                },
                {
                    name: 'JSON 数据',
                    url: 'https://jsonplaceholder.typicode.com/todos/1',
                    ext: 'JSON', size: '~1 KB', icon: 'ph:brackets-curly-bold', color: '#FFCC00', tagType: 'warning' as const,
                },
            ],
        },
    ];

    function previewFile(file: SampleFile) {
        preview(file.url);
    }
</script>
