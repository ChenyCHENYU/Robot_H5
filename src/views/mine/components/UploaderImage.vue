<template>
    <VanUploader
        :max-size="700 * 1024"
        :max-count="1"
        :before-read="beforeRead"
        :after-read="afterRead"
        accept="image/*"
    >
        <template #default>
            <slot name="default" />
        </template>
    </VanUploader>
</template>

<script setup lang="ts">
    import { type UploaderFileListItem, showFailToast } from 'vant';

    function beforeRead(file: File | File[]) {
        const files = Array.isArray(file) ? file : [file];
        return files.every(f => ['image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) || (showFailToast('请上传正确格式的图片'), false);
    }

    function afterRead(file: UploaderFileListItem | UploaderFileListItem[]) {
        console.log('%c [ file ]-43', 'font-size:13px; background:pink; color:#bf2c9f;', file);
        // 这里写上传逻辑
    }
</script>
