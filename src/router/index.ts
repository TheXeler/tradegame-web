import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import GameView from '../views/GameView.vue'
import {authService} from "../services/auth.ts"

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/game',
        name: 'game',
        component: GameView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'login') {
        const isAuthenticated = (authService.getCurrentToken() != null)
        if (!isAuthenticated) {
            next({name: 'login'})
        } else {
            next()
        }
    } else {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (token != null) {
            next({name: 'game'})
        } else {
            next()
        }
    }
})

export default router