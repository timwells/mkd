<template>
  <VaCard class="rounded-xl">
    <VaCardTitle>Gemini AI Page</VaCardTitle>
    <VaCardContent>
      <VaTextarea v-model="gkStore.prompt" placeholder="Enter your prompt..." class="w-full mb-4" />
      <VaButton @click="makeRequest">Req.</VaButton>
    </VaCardContent>
  </VaCard>

  <VaDivider />
  <VaCard class="rounded-xl">
    <VaCardTitle>Response...</VaCardTitle>
    <VaCardContent style="height: 500px">
      <div class="markdown-body">
        <VueMarkdown :source="gkStore.content" />
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script setup>
import VueMarkdown from 'vue-markdown-render'
import { useGkStore } from '@/stores/gk'

const gkStore = useGkStore()
const makeRequest = async () => {
  await gkStore.postRequest()
}
</script>
