import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          path: '/other/building',
          component: () => import('@/views/other/BuildingPage.vue')
        }
      ]
    }
  ]
})

export default router
