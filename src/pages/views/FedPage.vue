<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="value" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab" :name="tab">
          {{ tab }}
        </VaTab>
      </template>
    </VaTabs>

    <!-- Tab Content -->
    <VaCard v-if="value === 'One'" class="tab-content" outlined>
      <VaCardTitle>Tab One Content</VaCardTitle>
      <VaCardContent>
        <p>This is example content for Tab One.</p>
      </VaCardContent>
    </VaCard>

    <VaCard v-else-if="value === 'Two'" class="tab-content" outlined>
      <VaCardTitle>Tab Two Content</VaCardTitle>
      <VaCardContent>
        <p>This content belongs to Tab Two.</p>
      </VaCardContent>
    </VaCard>

    <VaCard v-else-if="value === 'Three'" class="tab-content" outlined>
      <VaCardTitle>Tab Three Content</VaCardTitle>
      <VaCardContent>
        <p>And this is the content for Tab Three!</p>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tabs = ['One', 'Two', 'Three']
const value = ref('One')
</script>

<style scoped>
:deep(.tabs-left) .va-tabs__content {
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 12px;
}

.tab-content {
  margin-top: 1rem;
}
</style>
