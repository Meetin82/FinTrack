import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/HomeComponent.vue';
import Expenses from '@/components/ExpensesComponent.vue';
import Analytics from '@/components/AnalyticsComponent.vue';
import Debts from '@/components/DebtsComponent.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/expenses', component: Expenses },
    { path: '/analytics', component: Analytics },
    { path: '/debts', component: Debts },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app');
// createApp(App).mount('#app');