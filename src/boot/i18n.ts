import { boot } from 'quasar/wrappers';
import messages from 'src/i18n'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'fr-fr',
  fallbackLocale: 'fr-fr',
  messages
})


export default boot(({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
})
