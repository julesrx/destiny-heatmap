<script lang="ts">
  import api from './api';

  let gamertag: string;

  let promise: Promise<any[]>;
  const searchUser = async (): Promise<any[]> => {
    const res = await api.get(`User/Search/Prefix/${encodeURIComponent(gamertag.trim())}/0/ `);

    return res.data as any[];
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
        <p>players :</p>
        <pre>{JSON.stringify(players)}</pre>
      {/await}
    </div>
  {/if}
</main>
