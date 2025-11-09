<template>
  <EasyDataTable
    :headers="headers"
    :items="store.data.allTrades"
    alternating
    :loading="store.loading"
  >
    <template #expand="item">
      <div style="padding: 15px">
        Expanded content for {{ item.stock }}
      </div>
    </template>

  </EasyDataTable>
</template>

<script setup lang="ts">
import type { Header } from "vue3-easy-data-table";
import { useNtStore } from '../../stores/nt'

const headers: Header[] = [
  { text: "Stock", value: "stock" },
  { text: "Epic", value: "epic"},
  { text: "Qty", value: "qty"},
  { text: "Price", value: "price"},
  { text: "Target", value: "target"},
  { text: "Stop", value: "stop"},
  { text: "Buy Date", value: "buydate"},
  { text: "Sell", value: "sell"},
  { text: "Sell Date", value: "selldate"},
  { text: "P/L", value: "pl"},
  { text: "TC", value: "tc"},
  { text: "PD", value: "pd"},
  { text: "CP", value: "cp"},
  { text: "XP", value: "xp"},
  { text: "XPD", value: "xpd"},
  { text: "DOPN", value: "dopn"},
];

const store = useNtStore();
store.getTrades();

</script>
