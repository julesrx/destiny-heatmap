<template>
  <div>
    <input type="text" v-model="gamertag" autofocus placeholder="Gamertag..." />

    <SearchResult v-model:users="users" :loading="loading" :noresult="noresult" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { ServerResponse } from "bungie-api-ts/common";
import { UserInfoCard } from "bungie-api-ts/user";
import { debounce } from "lodash";

import SearchResult from "./SearchResult.vue";
import { http } from "../api";

export default defineComponent({
  components: { SearchResult },
  setup() {
    const users = ref([] as UserInfoCard[]);

    const noresult = ref(false);
    const loading = ref(false);

    const gamertag = ref("");
    const debouncedOnSearch = debounce(async () => {
      users.value = [];
      noresult.value = false;
      if (!gamertag.value) return;

      if (gamertag.value) {
        try {
          loading.value = true;
          const { data } = await http.get(
            `Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(gamertag.value.trim())}/`
          );

          const res: ServerResponse<UserInfoCard[]> = data;
          if (res.Response.length) {
            users.value = res.Response.filter(
              (user, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.membershipType === user.membershipType && t.membershipId === user.membershipId
                )
            );
          } else noresult.value = true;
        } catch (ex) {
          users.value = [];
        } finally {
          loading.value = false;
        }
      }
    }, 250);
    watch(gamertag, debouncedOnSearch);

    return {
      gamertag,

      users,
      loading,
      noresult,
    };
  },
});
</script>

<style scoped>
input {
  background-color: transparent;
  color: inherit;
  border: none;
  text-align: center;
  font-family: inherit;
  font-size: 1.1em;
  width: var(--searchWidth);
}
</style>
