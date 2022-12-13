<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav :class="{thin: $store.state.currentUpdate}">
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Standup
      </h1>
    </div>
    <div class="right" v-if="$store.state.email">
      <router-link to="/">
        Home
      </router-link>
      <router-link to="/account">
        Account
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
  margin-left: 8px;
  color: rgb(48, 48, 48);
  text-decoration: none;
}

.right a.router-link-exact-active {
  color: rgb(73, 40, 183);
  text-decoration: underline;
}

.alerts {
    width: 25%;
}

nav.thin {
  margin-right: 33%;
}
</style>
