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
      // TODO(AL): When backend is ready call the API instead
      const dates = [
        '11/12/2022',
        '11/15/2022',
        '11/30/2022',
        '11/1/2022',
      ];
      const teammates = [
        'teammate1@gmail.com',
        'teammate2@gmail.com',
        'teammate3@gmail.com',
        'teammate4@gmail.com',
        'teammate5@gmail.com',
        'teammate6@gmail.com',
        'teammate7@gmail.com',
      ];
      const statuses = ['Blocked', 'In-Progress', 'Completed'];
      const updates = [...Array(20).keys()].map(id => {
        return {
          id: `update${id}project${projectId}`,
          summary: `Update summary #${id}`,
          author: teammates[id % teammates.length],
          dateCreated: dates[id % dates.length],
          dateModified: dates[id % dates.length],
          status: statuses[id % statuses.length],
          details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
          todos: [
            'todo task',
            'todo task',
            'todo task',
            'todo task',
          ],
          blockers: [
            'blocker',
            'blocker',
            'blocker',
            'blocker',
          ],
          project: projectId,
        };
      });
      Vue.set(state.updates, projectId, updates);
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
