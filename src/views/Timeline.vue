<template>
  <div class="timeline">
    <NoData v-if="!state.flatDates || !state.flatDates.length" />
    <template v-else>
      <Day v-for="d in state.flatDates" :key="d" :day="d" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { useRoute } from "vue-router";
import { BungieMembershipType } from "bungie-api-ts/common";

import Day from "../components/Day.vue";
import NoData from "../components/NoData.vue";
import activities from "../activities";

export default defineComponent({
  components: { Day, NoData },
  setup() {
    const route = useRoute();
    watch(
      () => route.params,
      async (params) => {
        const membershipType = (params["membershipType"] as unknown) as BungieMembershipType;
        const membershipId = params["membershipId"] as string;

        if (membershipType && membershipId) {
          if (activities.state.profile) activities.cancel();
          activities.startSearch(membershipType, membershipId);
        }
      },
      { immediate: true }
    );

    return { state: activities.state };
  },
});
</script>

<style scoped>
.timeline {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 0.5em;
}
</style>
