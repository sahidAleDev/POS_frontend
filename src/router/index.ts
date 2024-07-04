import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAME } from './names'
import HomeView from '@/views/HomeView.vue'
import PaymentView from '@/views/PaymentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAME.HOME_VIEW,
      component: HomeView
    },
    {
      path: '/payment',
      name: ROUTE_NAME.PAYMENT_VIEW,
      component: PaymentView
    }
  ]
})

export default router
