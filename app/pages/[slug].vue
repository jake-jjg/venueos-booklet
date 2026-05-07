<script setup lang="ts">
import { marked, type MarkedOptions } from "marked";

const { booklet_modules } = useVenue();
const route = useRoute();
const { setPageHeader } = usePageHeader();

// Helper to slugify title for comparison
function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
}

const currentModule = computed(() => {
    const slug = route.params.slug as string;
    return booklet_modules.value.find(
        (item) =>
            slugify(item.title) === slug || item.title.toLowerCase() === slug,
    );
});


const content = computed(() => currentModule.value?.content ?? null);

// Rendered HTML content
const renderedContent = ref("");

// Parse markdown to HTML helper
function parseMarkdown(text: string): string {
    if (!text) return "";
    // Use marked.parse with sync option
    const options: MarkedOptions = { async: false };
    const result = marked.parse(text, options);
    return typeof result === "string" ? result : "";
}

// Watch content and parse markdown
watch(
    content,
    (newContent) => {
        if (!newContent) {
            renderedContent.value = "";
            return;
        }

        let markdownText = "";

        // If content is a string (Markdown), use it directly
        if (typeof newContent === "string") {
            markdownText = newContent;
        }
        // Handle legacy array format
        else if (Array.isArray(newContent)) {
            markdownText = newContent
                .map(
                    (block: { textContent?: string; text?: string }) =>
                        block.textContent || block.text || "",
                )
                .filter(Boolean)
                .join("\n\n");
        }
        // Handle TipTap JSON format (legacy)
        else if (typeof newContent === "object" && newContent !== null) {
            const typedContent = newContent as {
                type?: string;
                content?: unknown[];
            };
            if (
                typedContent.type === "doc" &&
                Array.isArray(typedContent.content)
            ) {
                markdownText = extractTextFromNodes(typedContent.content);
            }
        }

        renderedContent.value = parseMarkdown(markdownText);
    },
    { immediate: true },
);

// Helper to extract text from TipTap JSON nodes
function extractTextFromNodes(nodes: unknown[]): string {
    const lines: string[] = [];

    for (const node of nodes) {
        if (typeof node !== "object" || node === null) continue;

        const typedNode = node as {
            type?: string;
            content?: unknown[];
            text?: string;
            attrs?: { level?: number };
        };

        if (typedNode.type === "paragraph" && typedNode.content) {
            const text = typedNode.content
                .map((child) =>
                    typeof child === "object" &&
                    child !== null &&
                    "text" in child
                        ? (child as { text: string }).text
                        : "",
                )
                .join("");
            lines.push(text);
        } else if (typedNode.type === "heading" && typedNode.content) {
            const level = typedNode.attrs?.level || 1;
            const text = typedNode.content
                .map((child) =>
                    typeof child === "object" &&
                    child !== null &&
                    "text" in child
                        ? (child as { text: string }).text
                        : "",
                )
                .join("");
            lines.push("#".repeat(level) + " " + text);
        } else if (typedNode.type === "text" && typedNode.text) {
            lines.push(typedNode.text);
        }
    }

    return lines.join("\n\n");
}

// Computed title and description for the layout
const pageTitle = computed(() => currentModule.value?.title ?? "Not Found");
const pageDescription = computed(() => currentModule.value?.description ?? "");

// Pass title and description to layout via composable
setPageHeader(pageTitle, pageDescription);

// Layout
definePageMeta({
    layout: "default",
});

// SEO meta
useSeoMeta({
    title: () => currentModule.value?.title ?? "",
    description: () => currentModule.value?.description ?? "",
});
</script>

<template>
    <div class="w-full">
        <!-- Module not found -->
        <template v-if="!currentModule">
            <div class="text-center py-12">
                <UIcon
                    name="i-lucide-file-question"
                    class="w-12 h-12 text-muted mx-auto mb-4"
                />
                <h2 class="text-xl font-semibold mb-2">Module Not Found</h2>
                <p class="text-muted mb-4">
                    The page you're looking for doesn't exist.
                </p>
                <UButton to="/" variant="outline" icon="i-lucide-home">
                    Go Home
                </UButton>
            </div>
        </template>

        <!-- Module content -->
        <template v-else>
            <div
                class="prose prose-lg dark:prose-invert max-w-full w-4xl mx-auto pt-4 pb-12"
            ><!-- Rendered content -->
            <template v-if="currentModule.cover_image_url">
                <img :src="currentModule.cover_image_url" :alt="currentModule.title" class="w-full rounded-md"></img>
            </template>
                <!-- Rendered content -->
                <template v-if="renderedContent">
                    <div v-html="renderedContent" />
                </template>

                <!-- No content yet -->
                <template v-else>
                    <div class="text-center py-12 text-muted">
                        <UIcon
                            name="i-lucide-file-text"
                            class="w-10 h-10 mx-auto mb-3 opacity-50"
                        />
                        <p>No content has been added to this module yet.</p>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
