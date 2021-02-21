<template>
  <main>
    <router-view></router-view>
  </main>
  <Search />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Search from "./components/Search.vue";

export default defineComponent({
  components: { Search },
});
</script>

<style scoped>
main {
  height: 400px;
}

main > * {
  height: 100%;
}
</style>
