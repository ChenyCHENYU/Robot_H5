<script setup lang="ts">
    import './index.scss';
    import { quotes, quickActions, features, statsItems, heroOrbCount } from './data';
    import { useScrollCache } from '@/hooks/useScrollCache';
    import { useUserStore } from '@/store/modules/user';

    defineOptions({ name: 'Dashboard' });

    const router = useRouter();
    const userStore = useUserStore();
    const cacheBox = ref(null);

    const greeting = computed(() => {
        const h = new Date().getHours();
        if (h < 6) return '夜深了';
        if (h < 12) return '早上好';
        if (h < 18) return '下午好';
        return '晚上好';
    });

    const currentQuote = computed(() => quotes[new Date().getDate() % quotes.length]);

    onMounted(() => {
        useScrollCache(cacheBox.value);
    });
</script>

<template>
    <div ref="cacheBox" class="dashboard">
        <!-- Mesh Gradient Hero -->
        <div class="dashboard__hero">
            <div v-for="n in heroOrbCount" :key="n" class="dashboard__hero-orb" :class="`dashboard__hero-orb--${n}`" />
            <div class="dashboard__hero-content">
                <p class="dashboard__greeting">{{ greeting }}</p>
                <h1 class="dashboard__name">{{ userStore.getUserInfo.nickname || '用户' }}</h1>
                <div class="dashboard__brand">
                    <i class="i-ph:sparkle-bold dashboard__brand-icon" />
                    <span>CHENY</span>
                </div>
            </div>

            <!-- Liquid Glass Stats Card -->
            <div class="dashboard__glass-card">
                <div class="dashboard__glass-card-shine" />
                <template v-for="(stat, si) in statsItems" :key="stat.label">
                    <div v-if="si > 0" class="dashboard__glass-divider" />
                    <div class="dashboard__glass-row">
                        <span class="dashboard__glass-label">{{ stat.label }}</span>
                        <span
                            class="dashboard__glass-value"
                            :class="{ 'dashboard__glass-value--up': stat.up }"
                        >
                            {{ stat.value }}
                        </span>
                    </div>
                </template>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="dashboard__actions">
            <div
                v-for="item in quickActions"
                :key="item.route"
                class="dashboard__action"
                @click="router.push(item.route)"
            >
                <div class="dashboard__action-icon" :style="{ background: item.color }">
                    <C_Icon :name="item.icon" :size="22" color="#fff" />
                </div>
                <span class="dashboard__action-label">{{ item.label }}</span>
            </div>
        </div>

        <!-- Quote Card (每日金句) -->
        <div class="dashboard__quote-wrap">
            <div class="dashboard__quote">
                <div class="dashboard__quote-shine" />
                <i class="i-ph:quotes-bold dashboard__quote-icon" />
                <p class="dashboard__quote-text">{{ currentQuote.text }}</p>
                <span class="dashboard__quote-author">— {{ currentQuote.author }}</span>
            </div>
        </div>

        <!-- Features -->
        <section class="dashboard__section">
            <h2 class="dashboard__section-title">核心能力</h2>
            <div class="dashboard__features">
                <div v-for="(f, i) in features" :key="f.title" class="dashboard__feature" :style="{ '--i': i }">
                    <div class="dashboard__feature-shine" />
                    <div class="dashboard__feature-icon" :style="{ background: f.color }">
                        <C_Icon :name="f.icon" :size="20" color="#fff" />
                    </div>
                    <div class="dashboard__feature-text">
                        <span class="dashboard__feature-title">{{ f.title }}</span>
                        <span class="dashboard__feature-desc">{{ f.desc }}</span>
                    </div>
                    <i class="i-ph:caret-right-bold dashboard__feature-arrow" />
                </div>
            </div>
        </section>
    </div>
</template>
