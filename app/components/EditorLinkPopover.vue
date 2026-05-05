<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
  autoOpen?: boolean
}>()

const open = ref(false)
const url = ref('')

watch(() => props.editor?.isActive('link'), (active) => {
  if (active) {
    url.value = props.editor.getAttributes('link').href ?? ''
    if (props.autoOpen) open.value = true
  } else {
    if (props.autoOpen) open.value = false
  }
})

function apply() {
  if (url.value) {
    props.editor.chain().focus().setLink({ href: url.value }).run()
  } else {
    props.editor.chain().focus().unsetLink().run()
  }
  open.value = false
}

function remove() {
  props.editor.chain().focus().unsetLink().run()
  url.value = ''
  open.value = false
}
</script>

<template>
  <UPopover v-model:open="open">
    <UButton
      icon="i-lucide-link"
      size="sm"
      variant="ghost"
      :color="editor.isActive('link') ? 'primary' : 'neutral'"
      @click="open = !open"
    />
    <template #content>
      <div class="flex items-center gap-2 p-2">
        <UInput
          v-model="url"
          placeholder="https://example.com"
          size="sm"
          class="w-56"
          @keyup.enter="apply"
        />
        <UButton size="sm" icon="i-lucide-check" @click="apply" />
        <UButton
          v-if="editor.isActive('link')"
          size="sm"
          color="error"
          variant="ghost"
          icon="i-lucide-unlink"
          @click="remove"
        />
      </div>
    </template>
  </UPopover>
</template>
