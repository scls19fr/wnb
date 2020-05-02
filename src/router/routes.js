
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', name: 'Index', component: () => import('pages/Index.vue') },
      { path: 'weight-and-balance', name: 'WeightAndBalance', component: () => import('pages/WeightAndBalance.vue') }

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
