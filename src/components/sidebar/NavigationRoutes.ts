export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'nt',
      displayName: 'menu.nt',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'dd',
      displayName: 'menu.dd',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'fed',
      displayName: 'menu.fed',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'funds',
      displayName: 'menu.funds',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'cryptos',
      displayName: 'menu.cryptos',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'premium-bonds',
      displayName: 'menu.premium-bonds',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 't212-x',
      displayName: 'menu.t212x',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'gk',
      displayName: 'menu.gk',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'octopus',
      displayName: 'menu.octopus',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    /*{
      name: 'testing',
      displayName: 'menu.testing',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },*/
    /*    {
      name: 'users',
      displayName: 'menu.users',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'projects',
      displayName: 'menu.projects',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'payments',
      displayName: 'menu.payments',
      meta: {
        icon: 'credit_card',
      },
      children: [
        {
          name: 'payment-methods',
          displayName: 'menu.payment-methods',
        },
        {
          name: 'pricing-plans',
          displayName: 'menu.pricing-plans',
        },
        {
          name: 'billing',
          displayName: 'menu.billing',
        },
      ],
    },*/

    /*{
      name: 'auth',
      displayName: 'menu.auth',
      meta: {
        icon: 'login',
      },
      children: [
        {
          name: 'login',
          displayName: 'menu.login',
        },
        {
          name: 'signup',
          displayName: 'menu.signup',
        },
        {
          name: 'recover-password',
          displayName: 'menu.recover-password',
        },
      ],
    },*/
    /*{
      name: 'faq',
      displayName: 'menu.faq',
      meta: {
        icon: 'quiz',
      },
    },
    {
      name: '404',
      displayName: 'menu.404',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
    {
      name: 'preferences',
      displayName: 'menu.preferences',
      meta: {
        icon: 'manage_accounts',
      },
    },
    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },*/
  ] as INavigationRoute[],
}
