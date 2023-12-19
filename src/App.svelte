<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';

  import Search from 'lib/Search.svelte';
  import Note from 'lib/Note.svelte';
  import Calendar from 'views/Calendar.svelte';
  import Home from 'views/Home.svelte';

  const basepath = '/destiny-heatmap/';
</script>

<main class="pl-2 pt-2">
  <Router {basepath}>
    <h1 class="text-4xl mb-4"><Link to="/">Destiny 2 Heatmap</Link></h1>

    <Search />

    <Route path="/">
      <Home />
    </Route>
    <Route path=":membershipType/:membershipId" let:params>
      <Calendar membershipType={params.membershipType} membershipId={params.membershipId} />
    </Route>
  </Router>
</main>

<Note />
