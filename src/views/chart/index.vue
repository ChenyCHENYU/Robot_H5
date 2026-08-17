<template>
    <div class="chart-page">
        <LineChart />
        <BarChart />
        <PieChart />
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import LineChart from './components/LineChart.vue';
    import BarChart from './components/BarChart.vue';
    import PieChart from './components/PieChart.vue';
</script>
