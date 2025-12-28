import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'
import { useAuthStore } from '../stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'fed',
        path: 'fed',
        component: () => import('../pages/views/FedPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'funds',
        path: 'funds',
        component: () => import('../pages/views/FundsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'testing',
        path: 'testing',
        component: () => import('../pages/views/MetalsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'cryptos',
        path: 'cryptos',
        component: () => import('../pages/views/CryptosPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'premium-bonds',
        path: 'premium-bonds',
        component: () => import('../pages/views/PremiumBondsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'nt',
        path: 'nt',
        component: () => import('../pages/views/NtPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'dd',
        path: 'dd',
        component: () => import('../pages/views/DividendPage.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/ProjectsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'payments',
        path: '/payments',
        component: RouteViewComponent,
        children: [
          {
            name: 'payment-methods',
            path: 'payment-methods',
            component: () => import('../pages/payments/PaymentsPage.vue'),
            meta: { requiresAuth: true },
          },
          {
            name: 'billing',
            path: 'billing',
            component: () => import('../pages/billing/BillingPage.vue'),
            meta: { requiresAuth: true },
          },
          {
            name: 'pricing-plans',
            path: 'pricing-plans',
            component: () => import('../pages/pricing-plans/PricingPlans.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        name: 'faq',
        path: '/faq',
        component: () => import('../pages/faq/FaqPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        name: 'logout',
        path: 'logout',
        component: () => import('../pages/auth/Logout.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthenticated = authStore.isAuthenticated

  console.log('Navigation guard: requiresAuth=', requiresAuth, ' isAuthenticated=', isAuthenticated, ' to=', to.name)

  if (to.name === 'login' && isAuthenticated) {
    console.log('Already authenticated, redirecting to dashboard')
    next({ name: 'dashboard' })
    return
  }

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
