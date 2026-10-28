// The problems inside a ticket that merged reports with different causes, counted the desk's way,
// as its own view (CauseTable) counts: every report under its cause, from its tenant and way in
// (causes.ts). The reports the desk reads differently (desk-notes.json) stay counted where they are
// filed, and their reading gets a row of its own. Never by intake tag.
import { groupByCause, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'one-day';

export type ProblemRow = {
  problem: Problem;
  reports: Report[];
  // Way in → count.
  channels: Record<string, number>;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // For a reading the desk footnotes: the causes its reports are also counted under.
  alsoUnder: CauseGroup['cause'][];
};

function row(problem: Problem, rs: Report[], alsoUnder: CauseGroup['cause'][] = []): ProblemRow {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports: rs,
    channels: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {}),
    tenants: new Set(rs.map((r) => r.tenant)).size,
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
    alsoUnder,
  };
}

export function problemRows(
  merged: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemRow[] {
  const groups = groupByCause(merged, tenantOf);
  const rows = groups.map((g) => row(g.cause, g.reports));
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  if (moved.length) {
    const under = groups.filter((g) => g.reports.some((r) => oneDayMove.includes(r.id))).map((g) => g.cause);
    rows.push(row('one-day', moved, under));
  }
  return rows;
}
