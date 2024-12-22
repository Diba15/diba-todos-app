import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css';
import { createNotivue } from 'notivue'
import { createApp } from 'vue'

import 'notivue/notification.css' // Only needed if using built-in notifications
import 'notivue/animations.css' // Only needed if using built-in animations

const notivue = createNotivue({
    position: 'top-right',
    enqueue: true,
    limit: 3
})
import App from './App.vue'

const app = createApp(App)

app.use(notivue)
app.mount('#app')
