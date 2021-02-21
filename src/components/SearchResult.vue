<template>
  <ul>
    <li v-if="loading">Searching...</li>
    <li v-if="!loading && noresult && !users.length">No player found...</li>

    <template v-if="users && users.length && !loading && !noresult">
      <li v-for="user in users" :key="`${user.membershipType}-${user.membershipId}`">
        <router-link
          :to="{
            name: 'Timeline',
            params: { membershipType: user.membershipType, membershipId: user.membershipId },
          }"
          @click.passive="clearUsers"
        >
          {{ user.displayName }}
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { UserInfoCard } from "bungie-api-ts/user";

export default defineComponent({
  props: {
    loading: Boolean,
    noresult: Boolean,
    users: { type: Array as PropType<UserInfoCard[]>, required: true },
  },
  setup(_, { emit }) {
    const clearUsers = () => {
      emit("update:users", []);
    };

    return { clearUsers };
  },
});
</script>

<style scoped>
ul {
  position: absolute;
  list-style: none;
  justify-content: center;
  padding: 0;
  display: flex;
  width: var(--searchWidth);
}

a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
