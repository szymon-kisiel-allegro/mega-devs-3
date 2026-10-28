<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { uniqueById, type Report } from '#lib/kb/causes';

  // One report from the export, by id, so a page never retypes what a reporter wrote.
  let { id }: { id: string } = $props();

  const r = $derived(uniqueById(reports as Report[]).find((x) => x.id === id));
</script>

{#if r}
  <blockquote>
    <p>{r.body}</p>
    <p class="who">{r.id} · {r.tenant} · {r.channel} · {r.receivedAt.slice(0, 10)}</p>
  </blockquote>
{:else}
  <p class="gone">no report {id} in the export</p>
{/if}

<style>
  blockquote { margin: 1rem 0; padding: 0.1rem 1rem; border-left: 3px solid var(--line); }
  blockquote p { margin: 0.4rem 0; }
  .who { font: 0.8rem var(--mono); color: var(--muted); }
  .gone { color: var(--warn); }
</style>
