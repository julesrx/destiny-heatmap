<script lang="ts">
  import { Link } from 'svelte-routing';
  import type { ServerResponse } from 'bungie-api-ts/core';
  import type { UserSearchResponse, UserSearchResponseDetail } from 'bungie-api-ts/user';

  import api from '../api';

  import { profile } from '../stores';

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

<form class="mb-6">
  <input type="text" name="Gamertag" placeholder="Gamertag..." bind:value={gamertag} />

  {#if promise}
    <div>
      {#await promise}
        <p>...searching</p>
      {:then players}
        <ul>
          {#each players as player}
            <li
              class="flex space-x-2 items-center cursor-pointer"
              on:click={() => profile.set(player)}
            >
              <Link
                to={`${player.destinyMemberships[0].membershipType}/${player.destinyMemberships[0].membershipId}`}
              >
                <img
                  src={`https://bungie.net${player.destinyMemberships[0].iconPath}`}
                  class="h-8 w-8"
                  alt={player.bungieGlobalDisplayName}
                />
                <span>{player.bungieGlobalDisplayName}</span>
              </Link>
            </li>
          {/each}
        </ul>
      {/await}
    </div>
  {/if}
</form>
