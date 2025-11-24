import './scss/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'

import stores from './stores'
import router from './router'

import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const app = createApp(App)

// --- Global components ---
app.component('EasyDataTable', Vue3EasyDataTable)

app.use(stores)
app.use(router)
app.use(i18n)

app.use(
  createVuestic({
    config: vuesticGlobalConfig,
  })
)

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
