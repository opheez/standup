import Vue from 'vue';
import VueRouter from 'vue-router';
import AccountPage from './components/Account/AccountPage.vue';
import HomePage from './components/Home/HomePage.vue';
import ProjectDashboard from './components/Project/ProjectDashboard.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: HomePage},
  {path: '/projects', name: 'Projects', component: ProjectDashboard},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

const AUTH_REQUIRED_ROUTES = [
  'Projects', 'Account',
];

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    // Go to home page if user navigates to projects/account and is not signed in
    if (!router.app.$store.state.email && AUTH_REQUIRED_ROUTES.includes(to.name)) {
      next({name: 'Home'});
      return;
    }
  }

  next();
});

export default router;
