import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      // { path: '', name: 'Index', component: () => import('pages/Index.vue') },
      { path: '', name: 'WeightAndBalance', component: () => import('pages/weight-and-balance/WeightAndBalance.vue') },
      { path: 'weight-and-balance', name: 'WeightAndBalance', component: () => import('pages/weight-and-balance/WeightAndBalance.vue') }

    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
