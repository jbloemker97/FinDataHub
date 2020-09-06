import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home';
import Entries from '../views/Entries'
import MomoStats from '../views/MomoStats'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/momo-stats',
            name: 'MomoStats',
            component: MomoStats
        },
        {
            path: '/trade-entries',
            name: 'Entries',
            component: Entries
        }
    ],
    mode: 'history'
});