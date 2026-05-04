<script setup lang="ts">
type Variant = "switch" | "checkbox" | "slider";

const props = withDefaults(
    defineProps<{
        title: string;
        description?: string;
        variant?: Variant;
        min?: number;
        max?: number;
        step?: number;
    }>(),
    {
        variant: "switch",
        min: 0,
        max: 100,
        step: 1,
    },
);

const modelValue = defineModel<boolean | number>();

// Typed computed accessors so the template doesn't need type assertions
const boolModel = computed({
    get: () => Boolean(modelValue.value),
    set: (val: boolean) => {
        modelValue.value = val;
    },
});

const numModel = computed({
    get: () => Number(modelValue.value),
    set: (val: number) => {
        modelValue.value = val;
    },
});
</script>

<template>
    <div
        class="flex flex-row justify-between items-center pt-4 mb-4 border-t border-default"
    >
        <div class="flex-1 max-w-1/2">
            <h4 class="text-lg capitalize font-headline mb-1.5">
                {{ title }}
            </h4>
            <p v-if="description" class="text-sm text-muted">
                {{ description }}
            </p>
        </div>

        <UFormItem class="cursor-pointer">
            <USwitch
                v-if="variant === 'switch'"
                v-model="boolModel"
                :aria-label="title"
            />
            <UCheckbox
                v-else-if="variant === 'checkbox'"
                v-model="boolModel"
                :aria-label="title"
            />
            <USlider
                v-else-if="variant === 'slider'"
                v-model="numModel"
                :min="min"
                :max="max"
                :step="step"
                :aria-label="title"
                tooltip
                class="w-40"
            />
        </UFormItem>
    </div>
</template>
