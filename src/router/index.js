import { createRouter, createWebHashHistory } from 'vue-router'
// createWebHashHistory
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/logs/view',
      children: [
        {
          path: '/logs/view',
          component: () => import('@/views/logs/LogView.vue')
        },
        {
          path: '/queue/category',
          component: () => import('@/views/queue/CategorySetting.vue')
        },
        {
          path: '/queue/button',
          component: () => import('@/views/queue/ButtonSetting.vue')
        },
        {
          path: '/queue/ticket',
          component: () => import('@/views/queue/TicketSetting.vue')
        },
        {
          path: '/queue/priority',
          component: () => import('@/views/queue/PrioritySetting.vue')
        },
        {
          path: '/queue/page',
          component: () => import('@/views/queue/PageSetting.vue')
        },
        {
          path: '/other/building',
          component: () => import('@/views/other/BuildingPage.vue')
        }
      ]
    }
  ]
})

export default router
