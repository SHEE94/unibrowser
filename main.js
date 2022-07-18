import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.userEvent = function(e){}
const app = new Vue({
    ...App
})
app.$mount()
