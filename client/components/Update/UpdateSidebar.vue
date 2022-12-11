<template>
  <aside class="sidebar">
    <div v-for="section in sections" class="section">
      <h4
        class="tab"
        :class="{active: section.active}"
        @click="section.onClick()"
      >{{ section.name }}</h4>
      <p
        v-for="subsection in section.children"
        class="tab"
        :class="{active: subsection.active}"
        @click="subsection.onClick()"
      >
        {{ subsection.name }}
      </p>
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
      return [
        {
          name: 'Overview',
          onClick: () => {
            this.$router.push({
              params,
              name: 'Updates',
            })
          },
          active: this.$route.name === 'Updates',
          children: [],
        },
        {
          name: 'Users',
          onClick: () => {
            this.$router.push({
              params,
              name: userViewName,
            });
            this.$store.commit('setUserFilter', null);
          },
          active: this.$route.name === userViewName
              && !this.$store.state.userFilter,
          children: this.project.participants.map(email => ({
            name: email,
            onClick: () => {
              this.$router.push({
                params,
                name: userViewName,
              });
              this.$store.commit('setUserFilter', email);
            },
            active: this.$route.name === userViewName
              && this.$store.state.userFilter === email,
            children: [],
          })),
        },
        {
          name: 'Tags',
          onClick: () => {
            // this.$router.push({
            //   params,
            //   name: tagViewName,
            // });
            // this.$store.commit('setTagFilter', null);
          },
          active: this.$route.name === tagViewName
              && !this.$store.state.tagFilter,
          children: this.project.tags.map(tag => ({
            name: tag,
            onClick: () => {
              this.$router.push({
                params,
                name: tagViewName,
              });
              this.$store.commit('setTagFilter', tag);
            },
            active: this.$route.name === tagViewName
              && this.$store.state.tagFilter === tag,
            children: [],
          })),
        }
      ];
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
  width: 17%;
  top: 0;
  left: 0;
  height: 100%;
  padding-right: 24px;
}
div.section + div.section {
  margin-top: 12px;
}
.tab {
  border-radius: 0 100px 100px 0;
  margin: 4px 0;
  padding: 8px 0 8px 16px;
  cursor: pointer;
  transition: all 0.2ms ease-in-out;
  background-color: transparent;
  color: #313131;
}

.tab.active {
  background: #ebebeb;
  color: #000;
}
.tab:hover {
  background: #f4f4f4;
}
</style>