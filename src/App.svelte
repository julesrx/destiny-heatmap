<script lang="ts">
  import api from './api';
  import type { ServerResponse } from 'bungie-api-ts/core';
  import type { UserSearchResponse, UserSearchResponseDetail } from 'bungie-api-ts/user';

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

<main>
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
</main>
