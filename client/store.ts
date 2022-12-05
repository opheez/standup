import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    email: null, // email of the logged in user
    lastname: null, //last name of the logged in user
    firstname: null, //first name of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    projects: [], // All projects the signed in user is a part of
    invites: [], // All projects the signed in user is invited to
    updates: {}, // mapping from project IDs to a list of updates
    allthanks: [], // All thanks in the app
    eyeswanted: [], // mapping from user to a list of eyes wanted updates
    alleyeswanted: [], // All eyes wanted in the app
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setEmail(state, email) {
      /**
       * Update the stored email to the specified one.
       * @param email - new email to set
       */
      state.email = email;
    },
    setLastname(state, lastname) {
      /**
       * Update the stored email to the specified one.
       * @param lastname - new email to set
       */
      state.lastname = lastname;
    },
    setFirstname(state, firstname) {
      /**
       * Update the stored email to the specified one.
       * @param firstname - new email to set
       */
      state.firstname = firstname;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateProjects(state, projects) {
      /**
       * Update the stored projects to the provided projects.
       * @param projects - Projects to store
       */
      state.projects = projects;
    },
    updateThanks(state, thanks){
      /**
       * Update the stored thanks to the provided thanks.
       * @param thanks - Thanks to store
       */
      state.allthanks = thanks;
    },
    updateEyesWanted(state, eyeswanted){
      /**
       * Update the stored thanks to the provided thanks.
       * @param eyeswanted - Thanks to store
       */
      state.eyeswanted = eyeswanted;
    },
    updateAllEyesWanted(state, alleyeswanted){
      /**
       * Update the stored thanks to the provided thanks.
       * @param alleyeswanted - Thanks to store
       */
      state.alleyeswanted = alleyeswanted;
    },
    async refreshProjects(state) {
      /**
       * Request the server for the currently available freets.
       */
      try {
        const res = await fetch('/api/projects');
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        state.projects = resJson;
      } catch (e) {
        console.log(e);
      }
    },
    async refreshInvites(state) {
      try {
        const res = await fetch('/api/projects?invited=true');
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        state.invites = resJson;
      } catch (e) {
        console.log(e);
      }
    },
    async refreshUpdates(state, projectId) {
      try {
        const res = await fetch(`/api/updates?projectId=${projectId}`);
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        Vue.set(state.updates, projectId, resJson);
      } catch (e) {
        console.log(e);
      }
    },
    async refreshEyesWanted(state) {
      try {
        const res = await fetch(`/api/eyeswanted`);
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        state.eyeswanted = resJson;
      } catch (e) {
        console.log(e);
      }
    },
    async refreshAllThanks(state){
      /**
       * Request the server for all the alerts (risks) the user posted.
       */
       const url = '/api/thanks/';
       const res = await fetch(url).then(async r => r.json());
       console.log(res);
       state.allthanks = res;
     },
     async refreshAllEyesWanted(state){
      /**
       * Request the server for all the alerts (risks) the user posted.
       */
       const url = '/api/eyeswanted/all';
       const res = await fetch(url).then(async r => r.json());
       console.log(res);
       state.allthanks = res;
     },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
