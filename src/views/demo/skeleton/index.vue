<script setup lang="ts">
import './index.scss';

// ---- 基础骨架屏 ----
const basicLoading = ref(true);

// ---- 商品卡片骨架 ----
const cardLoading = ref(true);
const cardData = ref<{ title: string; price: string; img: string }[]>([]);

const loadCards = () => {
  cardLoading.value = true;
  cardData.value = [];
  setTimeout(() => {
    cardData.value = [
      {
        title: 'AirPods Pro 2',
        price: '¥1,799',
        img: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
      },
      {
        title: 'MacBook Air M3',
        price: '¥8,999',
        img: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
      },
      {
        title: 'iPhone 15 Pro',
        price: '¥7,999',
        img: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg',
      },
      {
        title: 'Apple Watch S9',
        price: '¥2,999',
        img: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg',
      },
    ];
    cardLoading.value = false;
  }, 2000);
};

// ---- 列表骨架 ----
const listLoading = ref(true);
const listData = ref<
  { id: number; name: string; avatar: string; desc: string }[]
>([]);

const loadList = () => {
  listLoading.value = true;
  listData.value = [];
  setTimeout(() => {
    listData.value = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `用户 ${String.fromCharCode(65 + i)}`,
      avatar: `https://i.pravatar.cc/80?img=${i + 10}`,
      desc: '这是一段简介文字，描述用户的基本信息。',
    }));
    listLoading.value = false;
  }, 1800);
};

onMounted(() => {
  loadCards();
  loadList();
});
</script>

<template>
  <div class="skel-page">
    <CNavBar />
    <div class="skel-page__body">
      <!-- 基础骨架屏 -->
      <div class="skel-page__section">
        <div class="skel-page__section-header">
          <div class="skel-page__section-icon" style="background: #8e8e93">
            <i class="i-ph:layout-bold" />
          </div>
          <div>
            <h3 class="skel-page__section-title">基础骨架屏</h3>
            <p class="skel-page__section-desc">文本段落 + 标题 + 头像</p>
          </div>
          <VanButton
            class="skel-page__toggle"
            size="mini"
            round
            @click="basicLoading = !basicLoading"
          >
            {{ basicLoading ? "显示内容" : "显示骨架" }}
          </VanButton>
        </div>
        <div class="skel-page__card">
          <div class="skel-page__card-shine" />
          <VanSkeleton title avatar :row="3" :loading="basicLoading" round>
            <div class="skel-page__basic-content">
              <VanImage
                round
                width="48"
                height="48"
                src="https://i.pravatar.cc/80?img=1"
              />
              <div>
                <h4 class="skel-page__basic-title">John Appleseed</h4>
                <p class="skel-page__basic-desc">
                  高级前端工程师，擅长 Vue / React /
                  TypeScript，热爱开源社区。目前就职于 Robot H5 团队。
                </p>
              </div>
            </div>
          </VanSkeleton>
        </div>
      </div>

      <!-- 商品卡片骨架 -->
      <div class="skel-page__section">
        <div class="skel-page__section-header">
          <div class="skel-page__section-icon" style="background: #ff9500">
            <i class="i-ph:storefront-bold" />
          </div>
          <div>
            <h3 class="skel-page__section-title">商品卡片</h3>
            <p class="skel-page__section-desc">自定义骨架形状</p>
          </div>
          <VanButton
            class="skel-page__toggle"
            size="mini"
            round
            @click="loadCards"
            >重新加载</VanButton
          >
        </div>
        <div class="skel-page__card-grid">
          <template v-if="cardLoading">
            <div v-for="n in 4" :key="n" class="skel-page__product-card">
              <VanSkeletonImage class="skel-page__product-img" />
              <div style="padding: 10px">
                <VanSkeleton :row="1" row-width="60%" round />
                <VanSkeleton
                  :row="1"
                  row-width="40%"
                  round
                  style="margin-top: 6px"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in cardData"
              :key="item.title"
              class="skel-page__product-card"
            >
              <VanImage
                class="skel-page__product-img"
                fit="cover"
                :src="item.img"
              />
              <div style="padding: 10px">
                <p class="skel-page__product-title">{{ item.title }}</p>
                <p class="skel-page__product-price">{{ item.price }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 列表骨架 -->
      <div class="skel-page__section">
        <div class="skel-page__section-header">
          <div class="skel-page__section-icon" style="background: #007aff">
            <i class="i-ph:users-bold" />
          </div>
          <div>
            <h3 class="skel-page__section-title">联系人列表</h3>
            <p class="skel-page__section-desc">模拟接口 1.8s 延迟</p>
          </div>
          <VanButton
            class="skel-page__toggle"
            size="mini"
            round
            @click="loadList"
            >重新加载</VanButton
          >
        </div>
        <div class="skel-page__list-card">
          <div class="skel-page__list-card-shine" />
          <template v-if="listLoading">
            <div v-for="n in 5" :key="n" class="skel-page__list-row">
              <VanSkeleton
                avatar
                avatar-size="40"
                :row="2"
                row-width="['50%','80%']"
                round
              />
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in listData"
              :key="item.id"
              class="skel-page__list-row"
            >
              <VanImage round width="40" height="40" :src="item.avatar" />
              <div class="skel-page__list-info">
                <span class="skel-page__list-name">{{ item.name }}</span>
                <span class="skel-page__list-desc">{{ item.desc }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
