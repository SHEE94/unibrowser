import Vue from 'vue'
import App from './App'

plus.navigator.closeSplashscreen();
import messages from './locale/index'
import './utils/webEvent.js'
let i18nConfig = {
	locale: uni.getLocale(),
	messages,
	silentTranslationWarn: true

}
import VueI18n from 'vue-i18n' // v8.x
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.userEvent = function(e) {}
const app = new Vue({
	i18n,
	...App
})
app.$mount()