import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css';
import { createNotivue } from 'notivue'
import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue';

import 'notivue/notification.css' // Only needed if using built-in notifications
import 'notivue/animations.css' // Only needed if using built-in animations

const notivue = createNotivue({
    position: 'top-right',
    enqueue: true,
    limit: 3
})
import App from './App.vue'

const app = createApp(App)

app.use(
    createAuth0({
        domain: "dev-ailt0b3moy0j5vu8.us.auth0.com",
        clientId: "E8o1KZZcVXKFnQCvh2fjYEYFR9RHCyKw",
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    })
);

app.use(notivue)
app.mount('#app')
