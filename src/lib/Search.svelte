<script lang="ts">
  import { Link } from 'svelte-routing';
  import type { UserSearchResponseDetail } from 'bungie-api-ts/user';

  import { searchProfile } from '../api';

  import { profile } from '../stores';

  let gamertag: string;

  let promise: Promise<UserSearchResponseDetail[]> | null = null;
  const searchUser = async () => await searchProfile(gamertag);

  $: if (gamertag && gamertag.length) {
    promise = searchUser();
  }

  const onClick = (player: UserSearchResponseDetail) => {
    profile.set(player);
    promise = null;
  };
</script>

<form class="mb-6 space-y-4">
  <!-- svelte-ignore a11y-autofocus -->
  <input
    type="text"
    name="Gamertag"
    placeholder="Gamertag..."
    bind:value={gamertag}
    class="bg-transparent border-b focus:outline-none"
    autofocus
  />

  {#if promise}
    <div>
      {#await promise}
        <p>...searching</p>
      {:then players}
        <div class="space-x-2">
          {#each players as player}
            <Link
              to={`${player.destinyMemberships[0].membershipType}/${player.destinyMemberships[0].membershipId}`}
              on:click={onClick}
              class="flex space-x-2 items-center"
            >
              <img
                src={`https://bungie.net${player.destinyMemberships[0].iconPath}`}
                class="h-8 w-8"
                alt={player.bungieGlobalDisplayName}
              />
              <span>{player.bungieGlobalDisplayName}</span>
            </Link>
          {/each}
        </div>
      {/await}
    </div>
  {/if}
</form>
