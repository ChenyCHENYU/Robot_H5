<template>
    <VanUploader
        :max-size="700 * 1024"
        :max-count="1"
        :before-read="beforeRead"
        :after-read="handleAfterRead"
        accept="image/*"
    >
        <template #default>
            <slot name="default" />
        </template>
    </VanUploader>
</template>

<script setup lang="ts">
    import { type UploaderFileListItem, showFailToast, showSuccessToast } from 'vant';

    const emit = defineEmits<{
        uploaded: [url: string];
    }>();

    function beforeRead(file: File | File[]) {
        const files = Array.isArray(file) ? file : [file];
        return (
            files.every(f => ['image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) ||
            (showFailToast('请上传正确格式的图片'), false)
        );
    }

    function handleAfterRead(file: UploaderFileListItem | UploaderFileListItem[]) {
        const item = Array.isArray(file) ? file[0] : file;
        if (item?.file) {
            const url = URL.createObjectURL(item.file);
            emit('uploaded', url);
            showSuccessToast('上传成功');
        }
    }
</script>
