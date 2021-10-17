<script lang="ts">
  import api from './api';
  import type { ServerResponse } from 'bungie-api-ts/core';
  import type { UserSearchResponse, UserSearchResponseDetail } from 'bungie-api-ts/user';

  import Calendar from './lib/Calendar.svelte';

  let gamertag: string;

  let promise: Promise<UserSearchResponseDetail[]>;
  const searchUser = async () => {
    const res = await api.get<ServerResponse<UserSearchResponse>>(
      `User/Search/Prefix/${encodeURIComponent(gamertag.trim())}/0/ `
    );

    return res.data.Response.searchResults;
  };

  $: if (gamertag && gamertag.length) {
    promise = searchUser();
  }
</script>

<main class="pl-2">
  <!-- What font h1 Pop OS -->
  <h1>Destiny 2 Heatmap</h1>

  <form class="mb-6">
    <input type="text" name="Gamertag" placeholder="Gamertag..." bind:value={gamertag} />

    {#if promise}
      <div>
        {#await promise}
          <p>...searching</p>
        {:then players}
          <pre>{JSON.stringify(players)}</pre>
          <ul>
            {#each players as player}
              <li>
                <img
                  src={`https://bungie.net${player.destinyMemberships[0].iconPath}`}
                  class="h-8 w-8"
                  alt={player.bungieGlobalDisplayName}
                />
                <span>{player.bungieGlobalDisplayName}</span>
              </li>
            {/each}
          </ul>
        {/await}
      </div>
    {/if}
  </form>

  <Calendar />
</main>
