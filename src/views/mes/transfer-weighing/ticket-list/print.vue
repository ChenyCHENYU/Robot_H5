<template>
    <div class="ticket-print-page">
        <C_NavBar title="磅单预览" class="no-print" />

        <div v-if="loading" class="ticket-print-page__loading-wrap no-print">
            <VanLoading size="24" vertical>加载中</VanLoading>
        </div>

        <div v-else-if="!detail" class="ticket-print-page__empty-hint no-print">
            <VanEmpty description="暂无磅单数据" />
        </div>

        <div v-else class="ticket-print-page__body">
            <!-- 可打印区域：行业常见表格式过磅单 -->
            <div id="weigh-ticket-print" class="ticket-print-page__sheet">
                <div class="ticket-print-page__header">
                    <h1 class="ticket-print-page__company">华新丽华股份有限公司</h1>
                </div>

                <div class="ticket-print-page__meta">
                    <span>磅单号</span>
                    <strong>{{ detail.weighbillNo || '—' }}</strong>
                </div>

                <table class="ticket-print-page__table" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <th class="ticket-print-page__w25">业务日期</th>
                            <td colspan="3">{{ detail.busDate || '—' }}</td>
                        </tr>
                        <tr>
                            <th>车号</th>
                            <td>{{ detail.carNo || '—' }}</td>
                            <th>司机</th>
                            <td>{{ detail.driverName || '—' }}</td>
                        </tr>
                        <tr>
                            <th>发送组织</th>
                            <td>{{ detail.sendOrg || '—' }}</td>
                            <th>收货组织</th>
                            <td>{{ detail.receiveOrg || '—' }}</td>
                        </tr>
                        <tr>
                            <th>发料仓库</th>
                            <td>{{ detail.sendWh || '—' }}</td>
                            <th>收料仓库</th>
                            <td>{{ detail.receiveWh || '—' }}</td>
                        </tr>
                        <tr>
                            <th>物料编码</th>
                            <td>{{ detail.matCode || '—' }}</td>
                            <th>物料名称</th>
                            <td>{{ detail.matName || '—' }}</td>
                        </tr>
                        <tr>
                            <th>规格</th>
                            <td colspan="3">{{ matSpec }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="ticket-print-page__block-title">计量数据</div>
                <table class="ticket-print-page__table ticket-print-page__table--weight" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <th class="ticket-print-page__w20">项目</th>
                            <th class="ticket-print-page__w20">重量（t）</th>
                            <th class="ticket-print-page__w30">过磅时间</th>
                            <th class="ticket-print-page__w30">地磅/站点</th>
                        </tr>
                        <tr>
                            <td>毛重</td>
                            <td class="ticket-print-page__num">{{ w.gross != null ? formatWeightNum(w.gross) : '—' }}</td>
                            <td>{{ detail.grossDateTime || '—' }}</td>
                            <td>{{ detail.grossWeighSiteName || detail.grossWeighSiteNo || '—' }}</td>
                        </tr>
                        <tr>
                            <td>皮重</td>
                            <td class="ticket-print-page__num">{{ w.tare != null ? formatWeightNum(w.tare) : '—' }}</td>
                            <td>{{ detail.tareDateTime || '—' }}</td>
                            <td>{{ detail.tareWeighSiteName || detail.tareWeighSiteNo || '—' }}</td>
                        </tr>
                        <tr class="ticket-print-page__row-net">
                            <td>净重</td>
                            <td class="ticket-print-page__num ticket-print-page__num--strong">
                                {{ w.net != null ? formatWeightNum(w.net) : '—' }}
                            </td>
                            <td>{{ detail.netDateTime || '—' }}</td>
                            <td>{{ detail.netWeighSiteName || detail.netWeighSiteNo || '—' }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="ticket-print-page__block-title">扣杂（kg）</div>
                <table class="ticket-print-page__table" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <th class="ticket-print-page__w33">水份扣重</th>
                            <th class="ticket-print-page__w33">包装扣重</th>
                            <th class="ticket-print-page__w33">杂质扣重</th>
                        </tr>
                        <tr>
                            <td class="ticket-print-page__num">{{ formatDeductNum(detail.moistureDeductWgt) }}</td>
                            <td class="ticket-print-page__num">{{ formatDeductNum(detail.packageDeductWgt) }}</td>
                            <td class="ticket-print-page__num">{{ formatDeductNum(detail.impurityDeductWgt) }}</td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="detail.remark" class="ticket-print-page__remark">
                    <span class="ticket-print-page__remark-label">备注</span>
                    <p class="ticket-print-page__remark-txt">{{ detail.remark }}</p>
                </div>

                <div class="ticket-print-page__footer">
                    <p>本单由系统生成，与纸质单据具有同等效力，请妥善保管。</p>
                    <p class="ticket-print-page__print-time">打印时间：{{ printTime }}</p>
                </div>
            </div>
        </div>

        <div v-if="detail" class="ticket-print-page__actions no-print">
            <VanButton type="primary" block round size="normal" class="ticket-print-page__print-btn" icon="printer" @click="handlePrint">
                打印
            </VanButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './print.scss';
    import { onMounted, nextTick } from 'vue';
    import { useRoute } from 'vue-router';
    import { showFailToast } from 'vant';
    import { getWeighTicketDetail } from '@/api/trans-weight-ticket';
    import { buildDisplayWeight, formatWeightNum, formatDeductNum, matSpecFromDetail } from './weighDisplay';

    defineOptions({ name: 'transTicketPrint' });

    const route = useRoute();

    const detail = ref<any>(null);
    const loading = ref(true);
    const printTime = ref('');

    const w = computed(() => buildDisplayWeight(detail.value));
    const matSpec = computed(() => matSpecFromDetail(detail.value));

    function handlePrint() {
        updatePrintTime();
        nextTick(() => window.print());
    }

    async function fetchDetail() {
        const {id} = route.query;
        if (!id) {
            showFailToast('缺少磅单ID');
            loading.value = false;
            return;
        }
        loading.value = true;
        try {
            const res: any = await getWeighTicketDetail(String(id));
            detail.value = res.data || null;
            if (!detail.value) {
                showFailToast('未找到磅单信息');
            }
        } catch {
            showFailToast('加载失败');
        } finally {
            loading.value = false;
        }
    }

    function updatePrintTime() {
        const d = new Date();
        const p = (n: number) => String(n).padStart(2, '0');
        printTime.value = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    }

    onMounted(() => {
        updatePrintTime();
        fetchDetail();
    });
</script>
