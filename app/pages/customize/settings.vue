<script setup lang="ts">
const notificationsEnabled = ref(false);
const showPricing = ref(false);
const columns = ref(3);

definePageMeta({
    layout: {
        name: "settings",
        props: {
            title: "General Settings",
        },
    },
});
</script>

<template>
    <div class="w-full]">
        <h3 class="text-2xl font-headline mb-4">Section Heading</h3>
        <SettingItem
            title="Enable notifications"
            description="Send email alerts for new bookings"
            v-model="notificationsEnabled"
        />
        <SettingItem
            title="Show pricing"
            description="Display pricing on booking pages"
            variant="checkbox"
            v-model="showPricing"
        />
        <SettingItem
            title="Gallery columns"
            description="Number of columns in the gallery"
            variant="slider"
            :min="1"
            :max="6"
            :step="1"
            v-model="columns"
        />
    </div>
</template>
