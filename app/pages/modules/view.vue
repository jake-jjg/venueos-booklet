<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui";

definePageMeta({
    layout: {
        name: "settings",
        props: {
            title: "All Modules",
        },
    },
});

const { module_loading, booklet_modules } = useVenue();

type ModuleRow = (typeof booklet_modules.value)[number];

const columns: TableColumn<ModuleRow>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "content_type",
        header: "Module Type",
    },
    {
        accessorKey: "created_at",
        header: "Date Created",
    },
    {
        id: "actions",
        header: "",
        meta: {
            class: {
                th: "text-right",
                td: "text-right",
            },
        },
    },
];

const addNewItems: DropdownMenuItem[] = [
    {
        label: "Select a Type",
        type: "label",
    },
    {
        label: "Content",
        icon: "i-lucide-text-initial",
    },
    {
        label: "Pricing",
        icon: "i-lucide-dollar-sign",
    },
    {
        label: "Ameneties",
        icon: "i-lucide-list",
    },
    {
        label: "Gallery",
        icon: "i-lucide-images",
    },
    {
        label: "FAQ",
        icon: "i-lucide-circle-question-mark",
    },
    {
        label: "Virtual Tours",
        icon: "i-lucide-binoculars",
    },
];
</script>

<template>
    <div class="w-full flex flex-col p-8">
        <UFieldGroup class="mb-4 justify-self-end self-end">
            <UButton
                :to="`/modules/add-new`"
                icon="i-lucide-square-plus"
                size="lg"
            >
                Add New Module
            </UButton>
            <UDropdownMenu
                :items="addNewItems"
                size="lg"
                :content="{
                    align: 'end',
                    side: 'bottom',
                    sideOffset: 8,
                }"
                class="justify-self-end self-end"
            >
                <UButton icon="i-lucide-chevron-down" size="lg" />
            </UDropdownMenu>
        </UFieldGroup>

        <UTable
            :data="booklet_modules"
            :columns="columns"
            :loading="module_loading"
            class="border-default border rounded"
            draggable
        >
            <template #created_at-cell="{ row }">
                {{ new Date(row.original.created_at).toLocaleDateString() }}
            </template>

            <template #actions-cell="{ row }">
                <UButton
                    :to="`/modules/${row.original.title.toLowerCase()}/`"
                    variant="subtle"
                    size="md"
                >
                    Edit Module
                </UButton>
            </template>
        </UTable>
    </div>
</template>
