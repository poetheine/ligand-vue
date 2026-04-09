import { createApp } from 'vue'
import { activeAdapter } from './adapters'
import App from './App.vue'

import './assets/tokens.css'

// ── PrimeVue v4 themes (`primevue-themes` package) ──────────
// Install: npm install primevue-themes
// Theme options:
//   '@primevue/themes/lara-light-blue'
//   '@primevue/themes/lara-light-indigo'
//   '@primevue/themes/lara-light-purple'
//   '@primevue/themes/lara-dark-blue' (dark mode)
//   '@primevue/themes/bootstrap'
//   '@primevue/themes/material-design'
//   ...and more
// import '@primevue/themes/lara-light-blue'
// import '@primevue/themes/lara-dark-blue'

// import 'primeicons/primeicons.css'

const app = createApp(App)

activeAdapter.install(app)

app.mount('#app')
