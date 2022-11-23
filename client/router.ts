import Vue from 'vue';
import VueRouter from 'vue-router';
import AccountPage from './components/Account/AccountPage.vue';
import FeedPage from './components/Feed/FeedPage.vue';
import HomePage from './components/Login/HomePage.vue';
import ProjectDashboard from './components/Project/ProjectDashboard.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: HomePage},
  {path: '/feed', name: 'Feed', component: FeedPage},
  {path: '/projects', name: 'Projects', component: ProjectDashboard},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

const AUTH_REQUIRED_ROUTES = [
  'Feed', 'Projects', 'Account',
];

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    // Go to feed if user navigates to home page and is signed in
    if (to.name === 'Home' && router.app.$store.state.email) {
      next({name: 'Feed'});
      return;
    }

    // Go to home page if user navigates to feed/account and is not signed in
    if (!router.app.$store.state.email && AUTH_REQUIRED_ROUTES.includes(to.name)) {
      next({name: 'Home'});
      return;
    }
  }

  next();
});

export default router;
