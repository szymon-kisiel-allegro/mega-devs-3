<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitByProblem, type Problem } from '#lib/kb/problems';

  type Ticket = { problem: Problem; title: string; ref: string; href: string };
  let { ticket, tickets }: { ticket: number; tickets: Ticket[] } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(splitByProblem(merged, tenantOf, notes.oneDayMove));
  const counted = $derived(groups.reduce((n, g) => n + g.reports.length, 0));
  const ticketFor = (p: Problem) => tickets.find((t) => t.problem === p);
  const ways = (c: Record<string, number>) =>
    Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .map(([way, n]) => `${way} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>ways in</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      {@const t = ticketFor(g.problem)}
      <tr class:missing={!t}>
        <td>{t?.title ?? g.problem}</td>
        <td>{g.reports.length}</td>
        <td class="ways">{ways(g.channels)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if t}<a href={t.href}>{t.ref}</a>{:else}no ticket yet{/if}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr class:missing={counted !== merged.length}>
      <td>each report once</td>
      <td>{counted}</td>
      <td colspan="4">
        {counted === merged.length ? `all ${merged.length} reports in #${ticket}` : `${merged.length - counted} reports in #${ticket} not counted`}
      </td>
    </tr>
  </tfoot>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .ways { color: var(--muted); font-size: 0.85em; }
  td:last-child { white-space: nowrap; }
  tfoot td { color: var(--muted); font-size: 0.85em; }
  .missing td { background: var(--warn-bg); color: var(--warn); font-weight: 600; }
</style>
