<template>
    <VanUploader :max-size="700 * 1024" :max-count="1" :before-read="beforeRead" :after-read="handleAfterRead" accept="image/jpeg,image/png" :disabled="uploading" @oversize="showFailToast('图片不能超过700KB')">
        <slot />
    </VanUploader>
</template>
<script setup lang="ts">
    import { type UploaderFileListItem, showFailToast } from 'vant';
    import { useFileUpload, compressImage } from '@robot-h5/core';
    defineOptions({ name: 'UploaderImage' });
    const { upload, uploading } = useFileUpload();
    const emit = defineEmits<{ uploaded: [url: string] }>();
    function beforeRead(file: File | File[]) {
        return (Array.isArray(file) ? file : [file]).every(item => ['image/jpeg', 'image/png'].includes(item.type)) || (showFailToast('请选择 JPG 或 PNG 图片'), false);
    }
    async function handleAfterRead(value: UploaderFileListItem | UploaderFileListItem[]) {
        const item = Array.isArray(value) ? value[0] : value;
        if (!item?.file) return;
        try {
            if (String(import.meta.env.VITE_USE_MOCK) === 'true') {
                const image = await compressImage(item.file, { maxSize: 200, quality: 0.8 });
                const url = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result));
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(image);
                });
                emit('uploaded', url);
            } else {
                const result = await upload(item.file);
                if (!result.url) throw new Error('上传接口没有返回图片地址');
                emit('uploaded', result.url);
            }
        } catch { showFailToast('图片上传失败，请重试'); }
    }
</script>
