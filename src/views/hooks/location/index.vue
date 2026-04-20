<template>
    <div class="hook-demo">
        <C_NavBar title="useLocation" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #34C759">
                <C_Icon name="ph:map-pin-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">GPS 定位</h2>
            <p class="hook-demo__header-desc">单次 / 持续定位 + 反向地理编码</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" :loading="loading || geocoding" @click="locateAndGeocode">
                    获取当前位置
                </VanButton>
                <VanButton v-if="!isWatching" size="small" @click="startWatch">
                    持续追踪
                </VanButton>
                <VanButton v-else type="danger" plain size="small" @click="stopWatchAndMark">
                    停止追踪
                </VanButton>
            </div>
        </div>

        <div v-if="position" class="hook-demo__state">
            <p class="hook-demo__state-label">坐标信息</p>
            <div class="hook-demo__state-body">
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">经度</span>
                    <span class="hook-demo__info-value">{{ position.longitude.toFixed(6) }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">纬度</span>
                    <span class="hook-demo__info-value">{{ position.latitude.toFixed(6) }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">精度</span>
                    <span class="hook-demo__info-value">{{ position.accuracy?.toFixed(1) ?? '-' }} m</span>
                </div>
            </div>
        </div>

        <div v-if="address" class="hook-demo__state">
            <p class="hook-demo__state-label">地址信息</p>
            <div class="hook-demo__state-body">
                <div v-if="address.country" class="hook-demo__info-row">
                    <span class="hook-demo__info-label">国家</span>
                    <span class="hook-demo__info-value">{{ address.country }}</span>
                </div>
                <div v-if="address.province" class="hook-demo__info-row">
                    <span class="hook-demo__info-label">省份</span>
                    <span class="hook-demo__info-value">{{ address.province }}</span>
                </div>
                <div v-if="address.city" class="hook-demo__info-row">
                    <span class="hook-demo__info-label">城市</span>
                    <span class="hook-demo__info-value">{{ address.city }}</span>
                </div>
                <div v-if="address.district" class="hook-demo__info-row">
                    <span class="hook-demo__info-label">区县</span>
                    <span class="hook-demo__info-value">{{ address.district }}</span>
                </div>
                <div v-if="address.street" class="hook-demo__info-row">
                    <span class="hook-demo__info-label">街道</span>
                    <span class="hook-demo__info-value">{{ address.street }}</span>
                </div>
                <div v-if="address.full" class="hook-demo__info-row">
                    <span class="hook-demo__info-label">详细地址</span>
                    <span class="hook-demo__info-value" style="text-align: right; max-width: 60%">{{ address.full }}</span>
                </div>
            </div>
        </div>

        <div v-if="geocoding" class="hook-demo__section">
            <span class="hook-demo__badge hook-demo__badge--info">
                <C_Icon name="ph:spinner-bold" :size="14" />
                正在解析地址...
            </span>
        </div>

        <div v-if="isWatching" class="hook-demo__section">
            <span class="hook-demo__badge hook-demo__badge--success">
                <C_Icon name="ph:broadcast-bold" :size="14" />
                持续追踪中
            </span>
        </div>

        <div v-if="error || geocodeError" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ (error || geocodeError)?.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useLocation } from '@robot-h5/core';

    defineOptions({ name: 'HookLocation' });

    interface AddressInfo {
        country?: string;
        province?: string;
        city?: string;
        district?: string;
        street?: string;
        full?: string;
    }

    const { position, loading, error, getCurrentPosition, watchPosition, stopWatch } = useLocation();
    const isWatching = ref(false);
    const geocoding = ref(false);
    const geocodeError = ref<Error | null>(null);
    const address = ref<AddressInfo | null>(null);

    async function reverseGeocode(lat: number, lng: number) {
        geocoding.value = true;
        geocodeError.value = null;
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=zh&zoom=18&addressdetails=1`;
            const res = await fetch(url, {
                headers: { 'User-Agent': 'RobotH5-Demo/1.0' },
            });
            if (!res.ok) throw new Error(`Geocode HTTP ${res.status}`);
            const data = await res.json();
            const a = data.address || {};
            address.value = {
                country: a.country,
                province: a.state || a.province,
                city: a.city || a.town || a.village,
                district: a.county || a.suburb || a.district,
                street: [a.road, a.house_number].filter(Boolean).join(' '),
                full: data.display_name,
            };
        } catch (err: any) {
            geocodeError.value = err;
        } finally {
            geocoding.value = false;
        }
    }

    async function locateAndGeocode() {
        const pos = await getCurrentPosition();
        if (pos) {
            await reverseGeocode(pos.latitude, pos.longitude);
        }
    }

    function startWatch() {
        watchPosition();
        isWatching.value = true;
    }

    function stopWatchAndMark() {
        stopWatch();
        isWatching.value = false;
    }
</script>
