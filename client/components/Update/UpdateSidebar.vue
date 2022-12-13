<template>
  <aside class="sidebar">
    <div class="section-container">
      <div v-for="section in sections" class="section">
        <h4
          class="tab"
        >{{ section.name }}</h4>
        <p
          v-for="subsection in section.children"
          class="tab link"
          :class="{active: subsection.active}"
          @click="subsection.onClick()"
        >
          {{ subsection.name }}
        </p>
      </div>
    </div>
  </aside>
</template>
<script>
export default {
  name: 'UpdateSidebar',
  props: {
    project: {
      type: Object,
      required: true,
    }
  },
  computed: {
    sections() {
      const userViewName = 'UpdatesPerUser';
      const tagViewName = 'UpdatesPerTag';
      const params = {id: this.$route.params.id};
      const tabs = [
        {
          name: '',
          children: [{
            name: 'Overview',
            onClick: () => {
              this.$router.push({
                params,
                name: 'Updates',
              }).catch(()=>{});
            },
            active: this.$route.name === 'Updates',
          }],
        },
        {
          name: 'Users',
          children: [
            {
              name: 'All users',
              onClick: () => {
                this.$router.push({
                  params,
                  name: userViewName,
                }).catch(()=>{});
                this.$store.commit('setUserFilter', null);
              },
              active: this.$route.name === userViewName
                  && !this.$store.state.userFilter,
            },
            ...this.project.participants.map(email => ({
              name: email,
              onClick: () => {
                this.$router.push({
                  params,
                  name: userViewName,
                }).catch(()=>{});
                this.$store.commit('setUserFilter', email);
              },
              active: this.$route.name === userViewName
                && this.$store.state.userFilter === email,
              children: [],
            })),    
          ],
        },
      ];
      if (this.project.tags.length) {
        tabs.push({
          name: 'Tags',
          children: this.project.tags.map(tag => ({
            name: `# ${tag}`,
            onClick: () => {
              this.$router.push({
                params,
                name: tagViewName,
              }).catch(()=>{});
              this.$store.commit('setTagFilter', tag);
            },
            active: this.$route.name === tagViewName
              && this.$store.state.tagFilter === tag,
            children: [],
          })),
        });
      }
      return tabs;
    }
  }
}
</script>

<style scoped>
aside {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 16px;
}
aside,
.section-container:after {
  height: 80vh;
  top: 10vh;
  left: 0;
  width: 17%;
}

.section-container {
  overflow-y: scroll;
  padding: 12vh 0;
}

.section-container:after {
  content: "";
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  pointer-events: none;
  background-image: linear-gradient(
        to bottom,
        white 10%,
        transparent 16%,
        transparent 84%,
        white 90%,
        white 100%);
  width: 17%;
  height: 80vh;
}
div.section + div.section {
  margin-top: 12px;
}
.tab {
  border-radius: 0 100px 100px 0;
  margin: 4px 0;
  padding: 8px 4px 8px 16px;
  transition: all 0.2ms ease-in-out;
  background-color: transparent;
  color: #313131;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tab.active {
  background: #ebebeb;
  color: #000;
}
.tab.link {
  cursor: pointer;
}
.tab.link:hover {
  background: #f4f4f4;
}
</style>