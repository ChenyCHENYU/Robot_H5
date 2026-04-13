<script setup lang="ts">
    import './index.scss';

    // 设置组件名
    defineOptions({
        name: 'VirtualStatusBar',
    });

    // 获取当前时间
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // 获取电池电量百分比
    const getBatteryLevel = () => {
        // 这里可以集成真实的电池API，目前返回模拟值
        return 100;
    };
</script>

<template>
    <div class="virtual-status-bar">
        <div class="content">
            <div class="left">
                <span class="time">{{ getCurrentTime() }}</span>
            </div>

            <div class="right">
                <div class="signal">
                    <div class="signal-bars">
                        <div class="signal-bar active"></div>
                        <div class="signal-bar active"></div>
                        <div class="signal-bar active"></div>
                        <div class="signal-bar"></div>
                    </div>
                </div>

                <div class="battery">
                    <div class="battery-container">
                        <div class="battery-level">
                            <div class="battery-fill" :style="{ width: getBatteryLevel() + '%' }" />
                        </div>
                        <div class="battery-tip" />
                    </div>
                    <span class="battery-percentage">{{ getBatteryLevel() }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- styles extracted to ./index.scss -->
