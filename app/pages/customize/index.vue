<script setup lang="ts">
// Mock analytics data - in a real app, this would come from your backend
const analyticsData = ref({
    pageViews: 1234,
    pageViewsChange: 12,
    ctaClicks: 456,
    ctaClicksChange: 8,
    conversionRate: 37.1,
    conversionRateChange: 2.3,
    averageSessionDuration: 4.5,
    sessionDurationChange: -0.3,
});

// Mock chart data for page views over time
const pageViewsChart = ref({
    series: [
        {
            name: "Page Views",
            data: [120, 145, 167, 189, 203, 218, 245],
        },
    ],
    options: {
        chart: {
            type: "line",
            toolbar: { show: false },
        },
        stroke: {
            curve: "smooth",
        },
        xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
    },
});

// Mock chart data for CTA clicks
const ctaClicksChart = ref({
    series: [65, 35],
    labels: ["Primary CTA", "Secondary CTA"],
    options: {
        chart: {
            type: "donut",
        },
    },
});

definePageMeta({
    layout: "settings",
});

const { setPageHeader } = usePageHeader();
setPageHeader(
    "Analytics Dashboard",
    "Track your booklet performance and user engagement",
);

useSeoMeta({
    title: "Analytics Dashboard",
    description: "Track your booklet performance and user engagement",
});

const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
};

const getChangeIcon = (change: number) => {
    return change >= 0 ? "i-lucide-trending-up" : "i-lucide-trending-down";
};
</script>

<template>
    <div class="w-full flex flex-col gap-4">
        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <!-- Page Views Stat -->
            <UCard :ui="{ header: 'bg-elevated/50' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-muted"
                            >Page Views</span
                        >
                        <UIcon
                            name="i-lucide-eye"
                            class="size-4 text-primary"
                        />
                    </div>
                </template>
                <div class="flex flex-col gap-2">
                    <p class="text-3xl font-headline">
                        {{ analyticsData.pageViews.toLocaleString() }}
                    </p>
                    <div
                        :class="[
                            'flex items-center gap-1 text-sm',
                            getChangeColor(analyticsData.pageViewsChange),
                        ]"
                    >
                        <UIcon
                            :name="getChangeIcon(analyticsData.pageViewsChange)"
                            class="size-4"
                        />
                        <span
                            >{{ Math.abs(analyticsData.pageViewsChange) }}% vs
                            last period</span
                        >
                    </div>
                </div>
            </UCard>

            <!-- CTA Clicks Stat -->
            <UCard :ui="{ header: 'bg-elevated/50' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-muted"
                            >CTA Clicks</span
                        >
                        <UIcon
                            name="i-lucide-mouse-pointer-click"
                            class="size-4 text-blue-600"
                        />
                    </div>
                </template>
                <div class="flex flex-col gap-2">
                    <p class="text-3xl font-headline">
                        {{ analyticsData.ctaClicks.toLocaleString() }}
                    </p>
                    <div
                        :class="[
                            'flex items-center gap-1 text-sm',
                            getChangeColor(analyticsData.ctaClicksChange),
                        ]"
                    >
                        <UIcon
                            :name="getChangeIcon(analyticsData.ctaClicksChange)"
                            class="size-4"
                        />
                        <span
                            >{{ Math.abs(analyticsData.ctaClicksChange) }}% vs
                            last period</span
                        >
                    </div>
                </div>
            </UCard>

            <!-- Conversion Rate Stat -->
            <UCard :ui="{ header: 'bg-elevated/50' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-muted"
                            >Conversion Rate</span
                        >
                        <UIcon
                            name="i-lucide-target"
                            class="size-4 text-green-600"
                        />
                    </div>
                </template>
                <div class="flex flex-col gap-2">
                    <p class="text-3xl font-headline">
                        {{ analyticsData.conversionRate }}%
                    </p>
                    <div
                        :class="[
                            'flex items-center gap-1 text-sm',
                            getChangeColor(analyticsData.conversionRateChange),
                        ]"
                    >
                        <UIcon
                            :name="
                                getChangeIcon(
                                    analyticsData.conversionRateChange,
                                )
                            "
                            class="size-4"
                        />
                        <span
                            >{{ Math.abs(analyticsData.conversionRateChange) }}%
                            vs last period</span
                        >
                    </div>
                </div>
            </UCard>

            <!-- Average Session Duration Stat -->
            <UCard :ui="{ header: 'bg-elevated/50' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-muted"
                            >Avg. Session Duration</span
                        >
                        <UIcon
                            name="i-lucide-clock"
                            class="size-4 text-purple-600"
                        />
                    </div>
                </template>
                <div class="flex flex-col gap-2">
                    <p class="text-3xl font-headline">
                        {{ analyticsData.averageSessionDuration }}m
                    </p>
                    <div
                        :class="[
                            'flex items-center gap-1 text-sm',
                            getChangeColor(analyticsData.sessionDurationChange),
                        ]"
                    >
                        <UIcon
                            :name="
                                getChangeIcon(
                                    analyticsData.sessionDurationChange,
                                )
                            "
                            class="size-4"
                        />
                        <span
                            >{{
                                Math.abs(analyticsData.sessionDurationChange)
                            }}% vs last period</span
                        >
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
            <!-- Page Views Chart -->
            <div class="lg:col-span-2">
                <UCard :ui="{ header: 'bg-elevated/50' }">
                    <template #header>
                        <h3 class="text-lg font-headline">Page Views Trend</h3>
                    </template>
                    <div
                        class="h-72 flex items-center justify-center text-muted"
                    >
                        <p>
                            Chart visualization would go here (requires chart
                            library)
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- CTA Distribution -->
            <div>
                <UCard :ui="{ header: 'bg-elevated/50' }">
                    <template #header>
                        <h3 class="text-lg font-headline">CTA Distribution</h3>
                    </template>
                    <div
                        class="h-72 flex items-center justify-center text-muted"
                    >
                        <p>
                            Donut chart would go here (requires chart library)
                        </p>
                    </div>
                </UCard>
            </div>
        </div>

        <!-- Additional Metrics Table -->
        <div class="mt-4">
            <UCard :ui="{ header: 'bg-elevated/50' }">
                <template #header>
                    <h3 class="text-lg font-headline">Top Performing Pages</h3>
                </template>
                <UTable
                    :rows="[
                        {
                            page: 'Home',
                            views: 450,
                            clicks: 120,
                            rate: '26.7%',
                        },
                        {
                            page: 'Services',
                            views: 380,
                            clicks: 95,
                            rate: '25.0%',
                        },
                        {
                            page: 'Gallery',
                            views: 290,
                            clicks: 150,
                            rate: '51.7%',
                        },
                        {
                            page: 'Contact',
                            views: 114,
                            clicks: 91,
                            rate: '79.8%',
                        },
                    ]"
                    :columns="[
                        { key: 'page', label: 'Page', id: 'page' },
                        { key: 'views', label: 'Views', id: 'views' },
                        { key: 'clicks', label: 'Clicks', id: 'clicks' },
                        { key: 'rate', label: 'Conversion Rate', id: 'rate' },
                    ]"
                />
            </UCard>
        </div>
    </div>
</template>
