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
    async refreshProjects(state) {
      /**
       * Request the server for the currently available freets.
       */
      // TODO(AL): When backend is ready call the API instead
      // Hardcoded dates so that we can test IN-PROGRESS, OVERDUE, COMPLETED
      const dates = [
        '11/12/2022',
        '11/15/2022',
        '12/15/2022',
        '12/30/2022',
        '12/1/2022',
      ]
      const teammates = [
        'teammate1@gmail.com',
        'teammate2@gmail.com',
        'teammate3@gmail.com',
        'teammate4@gmail.com',
        'teammate5@gmail.com',
        'teammate6@gmail.com',
        'teammate7@gmail.com',
      ];
      const projects = [...Array(5).keys()].map(id => {
        return {
          id,
          name: `Project Name #${id}`,
          teammates: id % 2 ? teammates : teammates.slice(0, 3),
          deadline: dates[id],
          active: id % 2 == 0,
          pendingRequests: [],
        }
      });
      state.projects = projects;
    },
    async refreshInvites(state) {
      const invites = [...Array(3).keys()].map(id => {
        return {
          id,
          name: `Project Name #${id}`,
          teammates: [
            'teammate1@gmail.com',
            'teammate2@gmail.com',
          ],
          deadline: '12/31/2022',
          active: true,
          pendingRequests: [
            'teammate3@gmail.com',
            'teammate4@gmail.com',
          ],
        }
      });
      state.invites = invites;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
