<script setup lang="ts">
const model = defineModel<string>({ default: "i-lucide-file" });

const search = ref("");
const isOpen = ref(false);

// Common Lucide icons for modules
const availableIcons = [
  // Documents & Content
  { name: "i-lucide-file", label: "File" },
  { name: "i-lucide-file-text", label: "File Text" },
  { name: "i-lucide-notebook", label: "Notebook" },
  { name: "i-lucide-book-open", label: "Book Open" },
  { name: "i-lucide-scroll-text", label: "Scroll Text" },
  { name: "i-lucide-newspaper", label: "Newspaper" },
  { name: "i-lucide-text", label: "Text" },
  // Media
  { name: "i-lucide-image", label: "Image" },
  { name: "i-lucide-images", label: "Images" },
  { name: "i-lucide-gallery-horizontal", label: "Gallery" },
  { name: "i-lucide-video", label: "Video" },
  { name: "i-lucide-camera", label: "Camera" },
  { name: "i-lucide-music", label: "Music" },
  // Business & Commerce
  { name: "i-lucide-dollar-sign", label: "Dollar Sign" },
  { name: "i-lucide-credit-card", label: "Credit Card" },
  { name: "i-lucide-receipt", label: "Receipt" },
  { name: "i-lucide-shopping-cart", label: "Shopping Cart" },
  { name: "i-lucide-store", label: "Store" },
  { name: "i-lucide-building", label: "Building" },
  { name: "i-lucide-briefcase", label: "Briefcase" },
  // Lists & Organization
  { name: "i-lucide-list", label: "List" },
  { name: "i-lucide-list-checks", label: "List Checks" },
  { name: "i-lucide-clipboard-list", label: "Clipboard List" },
  { name: "i-lucide-layout-grid", label: "Grid" },
  { name: "i-lucide-table", label: "Table" },
  // Communication
  { name: "i-lucide-message-circle", label: "Message" },
  { name: "i-lucide-mail", label: "Mail" },
  { name: "i-lucide-phone", label: "Phone" },
  { name: "i-lucide-at-sign", label: "At Sign" },
  // Help & Info
  { name: "i-lucide-circle-help", label: "Help" },
  { name: "i-lucide-info", label: "Info" },
  { name: "i-lucide-lightbulb", label: "Lightbulb" },
  { name: "i-lucide-message-square-question", label: "Question" },
  // Navigation & Location
  { name: "i-lucide-map", label: "Map" },
  { name: "i-lucide-map-pin", label: "Map Pin" },
  { name: "i-lucide-compass", label: "Compass" },
  { name: "i-lucide-navigation", label: "Navigation" },
  { name: "i-lucide-globe", label: "Globe" },
  // Technology & Features
  { name: "i-lucide-binoculars", label: "Binoculars" },
  { name: "i-lucide-scan", label: "Scan" },
  { name: "i-lucide-qr-code", label: "QR Code" },
  { name: "i-lucide-wifi", label: "WiFi" },
  { name: "i-lucide-tv", label: "TV" },
  // Amenities
  { name: "i-lucide-utensils", label: "Utensils" },
  { name: "i-lucide-coffee", label: "Coffee" },
  { name: "i-lucide-wine", label: "Wine" },
  { name: "i-lucide-bed", label: "Bed" },
  { name: "i-lucide-bath", label: "Bath" },
  { name: "i-lucide-car", label: "Car" },
  { name: "i-lucide-plane", label: "Plane" },
  { name: "i-lucide-train", label: "Train" },
  // People & Social
  { name: "i-lucide-users", label: "Users" },
  { name: "i-lucide-user", label: "User" },
  { name: "i-lucide-heart", label: "Heart" },
  { name: "i-lucide-star", label: "Star" },
  { name: "i-lucide-thumbs-up", label: "Thumbs Up" },
  // Time & Calendar
  { name: "i-lucide-calendar", label: "Calendar" },
  { name: "i-lucide-clock", label: "Clock" },
  { name: "i-lucide-timer", label: "Timer" },
  // Misc
  { name: "i-lucide-sparkles", label: "Sparkles" },
  { name: "i-lucide-zap", label: "Zap" },
  { name: "i-lucide-award", label: "Award" },
  { name: "i-lucide-gift", label: "Gift" },
  { name: "i-lucide-tag", label: "Tag" },
  { name: "i-lucide-bookmark", label: "Bookmark" },
  { name: "i-lucide-flag", label: "Flag" },
  { name: "i-lucide-home", label: "Home" },
  { name: "i-lucide-settings", label: "Settings" },
];

const filteredIcons = computed(() => {
  if (!search.value) return availableIcons;
  const query = search.value.toLowerCase();
  return availableIcons.filter(
    (icon) =>
      icon.label.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query)
  );
});

function selectIcon(iconName: string) {
  model.value = iconName;
  isOpen.value = false;
  search.value = "";
}

const selectedIconLabel = computed(() => {
  const found = availableIcons.find((i) => i.name === model.value);
  return found?.label || model.value.replace("i-lucide-", "");
});
</script>

<template>
  <UPopover v-model:open="isOpen" :content="{ align: 'start' }">
    <UButton
      variant="outline"
      color="neutral"
      block
      class="justify-between"
    >
      <span class="flex items-center gap-2">
        <UIcon :name="model" class="size-5" />
        <span class="text-sm">{{ selectedIconLabel }}</span>
      </span>
      <UIcon name="i-lucide-chevron-down" class="size-4 text-muted" />
    </UButton>

    <template #content>
      <div class="w-72 p-2">
        <UInput
          v-model="search"
          placeholder="Search icons..."
          icon="i-lucide-search"
          size="sm"
          autofocus
          class="mb-2"
        />
        <div class="max-h-64 overflow-y-auto">
          <div class="grid grid-cols-6 gap-1">
            <UTooltip
              v-for="icon in filteredIcons"
              :key="icon.name"
              :text="icon.label"
            >
              <button
                type="button"
                class="p-2 rounded-md hover:bg-elevated/50 transition-colors flex items-center justify-center"
                :class="{ 'bg-elevated ring-1 ring-primary': model === icon.name }"
                @click="selectIcon(icon.name)"
              >
                <UIcon :name="icon.name" class="size-5" />
              </button>
            </UTooltip>
          </div>
          <p
            v-if="filteredIcons.length === 0"
            class="text-center text-sm text-muted py-4"
          >
            No icons found
          </p>
        </div>
      </div>
    </template>
  </UPopover>
</template>
