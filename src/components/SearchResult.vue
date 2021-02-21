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
    users: { type: [] as PropType<UserInfoCard[]>, required: true },
  },
  setup(_, { emit }) {
    const clearUsers = () => {
      emit("update:users", []);
    };

    return { clearUsers };
  },
});
</script>
