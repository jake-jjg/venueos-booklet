<script setup lang="ts">
const route = useRoute();
const moduleType = route.query.module_type;
definePageMeta({
  layout: {
    name: "settings",
    props: {
      title: "Add New Modules",
      description: "Customize your booklet's modules",
    },
  },
});

useSeoMeta({
  title: "Add New Modules",
  description: "Customize your booklet's modules",
});
</script>

<template>
  <div class="w-full">Add a new {{ moduleType }} module.</div>
</template>
