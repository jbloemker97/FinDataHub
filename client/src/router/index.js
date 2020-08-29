import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home';
import Entries from '../views/Entries'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/trade-entries',
            name: 'Entries',
            component: Entries
        }
    ],
    mode: 'history'
});