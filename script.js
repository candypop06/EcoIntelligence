/**
 * EcoIntelligence Dashboard — script.js
 * ─────────────────────────────────────
 * Responsibilities:
 *  1. Define multi-dimensional dataset keyed by region + department
 *  2. Render and update KPI cards
 *  3. Render and update three Chart.js charts:
 *       • Climate Trends (line)
 *       • Waste Distribution (doughnut)
 *       • Carbon Emission per Department (horizontal bar)
 *  4. Wire interactive Region / Department filters
 *  5. Mobile sidebar toggle
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. DATASET
   ══════════════════════════════════════════════════════════
   Each record represents one region+department combination.
   KPI fields:
     co2        : tCO₂e (total for the period)
     renewable  : % of energy from renewables
     water      : thousand litres consumed
     recycling  : % waste recycled
   Monthly trend arrays (Jan–Dec) for the line chart.
   Waste breakdown object for the doughnut chart.
   ══════════════════════════════════════════════════════════ */
const DATA = [
  // ── North America ──────────────────────────────────────
  {
    region: 'north', dept: 'ops',
    co2: 4820, renewable: 62, water: 1340, recycling: 71,
    co2Delta: -3.2, renewableDelta: +5.1, waterDelta: +1.8, recyclingDelta: +4.3,
    monthlyTrend: {
      co2:       [420, 400, 390, 370, 350, 340, 330, 310, 305, 295, 285, 275],
      renewable: [55, 57, 58, 60, 62, 63, 64, 65, 66, 67, 68, 70],
    },
    waste: { Landfill: 18, Recycled: 42, Composted: 20, Incinerated: 12, Reused: 8 },
  },
  {
    region: 'north', dept: 'it',
    co2: 1250, renewable: 78, water: 420, recycling: 85,
    co2Delta: -5.0, renewableDelta: +8.2, waterDelta: -2.1, recyclingDelta: +3.0,
    monthlyTrend: {
      co2:       [120, 115, 110, 105, 103, 100, 98, 95, 94, 92, 90, 88],
      renewable: [70, 72, 73, 75, 76, 78, 79, 80, 81, 82, 83, 85],
    },
    waste: { Landfill: 8, Recycled: 55, Composted: 15, Incinerated: 10, Reused: 12 },
  },
  {
    region: 'north', dept: 'logistics',
    co2: 6100, renewable: 41, water: 980, recycling: 60,
    co2Delta: -1.5, renewableDelta: +2.3, waterDelta: +3.4, recyclingDelta: +2.1,
    monthlyTrend: {
      co2:       [530, 515, 505, 500, 495, 490, 510, 505, 500, 498, 492, 485],
      renewable: [36, 37, 38, 39, 40, 41, 41, 42, 42, 43, 43, 44],
    },
    waste: { Landfill: 30, Recycled: 35, Composted: 10, Incinerated: 15, Reused: 10 },
  },
  {
    region: 'north', dept: 'manufacturing',
    co2: 9800, renewable: 33, water: 3100, recycling: 52,
    co2Delta: +0.8, renewableDelta: +1.5, waterDelta: +5.2, recyclingDelta: +1.0,
    monthlyTrend: {
      co2:       [820, 810, 815, 800, 790, 800, 810, 820, 815, 810, 805, 800],
      renewable: [28, 29, 30, 31, 32, 33, 33, 34, 34, 35, 35, 36],
    },
    waste: { Landfill: 38, Recycled: 28, Composted: 8, Incinerated: 20, Reused: 6 },
  },
  {
    region: 'north', dept: 'facilities',
    co2: 2200, renewable: 55, water: 760, recycling: 68,
    co2Delta: -2.0, renewableDelta: +3.8, waterDelta: -1.5, recyclingDelta: +2.5,
    monthlyTrend: {
      co2:       [200, 195, 190, 185, 180, 178, 176, 175, 172, 170, 168, 165],
      renewable: [49, 51, 52, 53, 54, 55, 56, 56, 57, 58, 59, 60],
    },
    waste: { Landfill: 22, Recycled: 45, Composted: 18, Incinerated: 8, Reused: 7 },
  },

  // ── Europe ─────────────────────────────────────────────
  {
    region: 'europe', dept: 'ops',
    co2: 3600, renewable: 72, water: 1100, recycling: 79,
    co2Delta: -6.1, renewableDelta: +7.4, waterDelta: -3.0, recyclingDelta: +5.2,
    monthlyTrend: {
      co2:       [330, 315, 305, 295, 290, 285, 278, 272, 268, 264, 260, 256],
      renewable: [64, 66, 67, 69, 70, 72, 73, 74, 75, 76, 77, 78],
    },
    waste: { Landfill: 12, Recycled: 55, Composted: 18, Incinerated: 8, Reused: 7 },
  },
  {
    region: 'europe', dept: 'it',
    co2: 980, renewable: 88, water: 310, recycling: 90,
    co2Delta: -8.0, renewableDelta: +4.0, waterDelta: -4.0, recyclingDelta: +2.0,
    monthlyTrend: {
      co2:       [95, 90, 87, 84, 82, 80, 78, 76, 75, 74, 73, 72],
      renewable: [80, 82, 83, 84, 85, 86, 87, 88, 89, 89, 90, 91],
    },
    waste: { Landfill: 5, Recycled: 65, Composted: 14, Incinerated: 6, Reused: 10 },
  },
  {
    region: 'europe', dept: 'logistics',
    co2: 5200, renewable: 50, water: 870, recycling: 65,
    co2Delta: -4.0, renewableDelta: +5.0, waterDelta: -2.0, recyclingDelta: +3.5,
    monthlyTrend: {
      co2:       [460, 445, 435, 430, 428, 422, 420, 418, 415, 412, 408, 405],
      renewable: [44, 46, 47, 48, 49, 50, 51, 51, 52, 53, 54, 55],
    },
    waste: { Landfill: 25, Recycled: 42, Composted: 14, Incinerated: 12, Reused: 7 },
  },
  {
    region: 'europe', dept: 'manufacturing',
    co2: 8100, renewable: 44, water: 2700, recycling: 58,
    co2Delta: -2.5, renewableDelta: +3.0, waterDelta: -1.0, recyclingDelta: +2.0,
    monthlyTrend: {
      co2:       [710, 695, 685, 675, 670, 665, 660, 658, 655, 652, 648, 645],
      renewable: [38, 40, 41, 42, 43, 44, 44, 45, 46, 47, 47, 48],
    },
    waste: { Landfill: 30, Recycled: 36, Composted: 10, Incinerated: 16, Reused: 8 },
  },
  {
    region: 'europe', dept: 'facilities',
    co2: 1800, renewable: 68, water: 640, recycling: 75,
    co2Delta: -5.0, renewableDelta: +6.0, waterDelta: -3.5, recyclingDelta: +4.0,
    monthlyTrend: {
      co2:       [165, 158, 152, 148, 144, 140, 138, 136, 134, 132, 130, 128],
      renewable: [60, 62, 63, 65, 66, 68, 69, 70, 70, 71, 72, 73],
    },
    waste: { Landfill: 16, Recycled: 52, Composted: 16, Incinerated: 8, Reused: 8 },
  },

  // ── Asia Pacific ───────────────────────────────────────
  {
    region: 'asia', dept: 'ops',
    co2: 7200, renewable: 38, water: 2200, recycling: 55,
    co2Delta: +1.2, renewableDelta: +3.5, waterDelta: +6.8, recyclingDelta: +1.5,
    monthlyTrend: {
      co2:       [610, 600, 598, 592, 590, 595, 598, 602, 598, 595, 592, 588],
      renewable: [32, 33, 34, 35, 36, 38, 38, 39, 40, 41, 42, 43],
    },
    waste: { Landfill: 40, Recycled: 25, Composted: 12, Incinerated: 16, Reused: 7 },
  },
  {
    region: 'asia', dept: 'it',
    co2: 1600, renewable: 65, water: 530, recycling: 78,
    co2Delta: -3.0, renewableDelta: +5.5, waterDelta: +1.0, recyclingDelta: +3.0,
    monthlyTrend: {
      co2:       [145, 140, 138, 135, 133, 131, 130, 128, 126, 124, 122, 120],
      renewable: [58, 60, 61, 62, 63, 65, 66, 67, 67, 68, 69, 70],
    },
    waste: { Landfill: 15, Recycled: 50, Composted: 14, Incinerated: 12, Reused: 9 },
  },
  {
    region: 'asia', dept: 'logistics',
    co2: 8500, renewable: 28, water: 1650, recycling: 47,
    co2Delta: +2.0, renewableDelta: +1.5, waterDelta: +8.0, recyclingDelta: +0.5,
    monthlyTrend: {
      co2:       [720, 710, 705, 700, 698, 706, 712, 718, 715, 712, 708, 705],
      renewable: [24, 25, 26, 26, 27, 28, 29, 29, 30, 30, 31, 32],
    },
    waste: { Landfill: 44, Recycled: 28, Composted: 8, Incinerated: 14, Reused: 6 },
  },
  {
    region: 'asia', dept: 'manufacturing',
    co2: 14200, renewable: 22, water: 4800, recycling: 41,
    co2Delta: +3.5, renewableDelta: +1.0, waterDelta: +10.0, recyclingDelta: +0.3,
    monthlyTrend: {
      co2:       [1210, 1195, 1188, 1180, 1178, 1182, 1190, 1200, 1198, 1192, 1185, 1178],
      renewable: [18, 19, 20, 21, 21, 22, 23, 23, 24, 24, 25, 26],
    },
    waste: { Landfill: 50, Recycled: 22, Composted: 8, Incinerated: 14, Reused: 6 },
  },
  {
    region: 'asia', dept: 'facilities',
    co2: 3100, renewable: 45, water: 1050, recycling: 60,
    co2Delta: -1.0, renewableDelta: +2.0, waterDelta: +3.0, recyclingDelta: +1.8,
    monthlyTrend: {
      co2:       [265, 260, 258, 254, 252, 256, 260, 265, 262, 258, 255, 252],
      renewable: [40, 41, 42, 43, 44, 45, 45, 46, 47, 47, 48, 49],
    },
    waste: { Landfill: 30, Recycled: 36, Composted: 14, Incinerated: 12, Reused: 8 },
  },

  // ── Latin America ──────────────────────────────────────
  {
    region: 'latam', dept: 'ops',
    co2: 5500, renewable: 55, water: 1600, recycling: 63,
    co2Delta: -2.0, renewableDelta: +4.0, waterDelta: +2.5, recyclingDelta: +3.0,
    monthlyTrend: {
      co2:       [470, 460, 455, 448, 445, 442, 438, 435, 430, 428, 424, 420],
      renewable: [48, 50, 51, 52, 53, 55, 56, 57, 58, 58, 59, 60],
    },
    waste: { Landfill: 28, Recycled: 38, Composted: 16, Incinerated: 10, Reused: 8 },
  },
  {
    region: 'latam', dept: 'it',
    co2: 1100, renewable: 71, water: 370, recycling: 80,
    co2Delta: -4.0, renewableDelta: +6.5, waterDelta: -1.5, recyclingDelta: +3.5,
    monthlyTrend: {
      co2:       [100, 97, 95, 93, 92, 91, 90, 89, 88, 87, 86, 85],
      renewable: [63, 65, 66, 68, 69, 71, 72, 73, 74, 75, 76, 78],
    },
    waste: { Landfill: 12, Recycled: 55, Composted: 16, Incinerated: 9, Reused: 8 },
  },
  {
    region: 'latam', dept: 'logistics',
    co2: 6400, renewable: 36, water: 1200, recycling: 54,
    co2Delta: -0.5, renewableDelta: +2.0, waterDelta: +4.0, recyclingDelta: +1.5,
    monthlyTrend: {
      co2:       [548, 540, 535, 530, 528, 532, 535, 538, 534, 530, 526, 522],
      renewable: [31, 32, 33, 34, 35, 36, 37, 37, 38, 38, 39, 40],
    },
    waste: { Landfill: 36, Recycled: 32, Composted: 12, Incinerated: 12, Reused: 8 },
  },
  {
    region: 'latam', dept: 'manufacturing',
    co2: 10500, renewable: 30, water: 3600, recycling: 48,
    co2Delta: +1.0, renewableDelta: +1.8, waterDelta: +6.0, recyclingDelta: +0.8,
    monthlyTrend: {
      co2:       [890, 880, 876, 870, 868, 875, 880, 886, 882, 878, 875, 870],
      renewable: [25, 26, 27, 28, 29, 30, 30, 31, 32, 32, 33, 34],
    },
    waste: { Landfill: 42, Recycled: 26, Composted: 10, Incinerated: 15, Reused: 7 },
  },
  {
    region: 'latam', dept: 'facilities',
    co2: 2500, renewable: 60, water: 900, recycling: 70,
    co2Delta: -3.0, renewableDelta: +5.0, waterDelta: -2.0, recyclingDelta: +3.0,
    monthlyTrend: {
      co2:       [218, 212, 208, 204, 200, 198, 196, 194, 191, 189, 187, 185],
      renewable: [53, 55, 56, 57, 58, 60, 61, 62, 62, 63, 64, 65],
    },
    waste: { Landfill: 20, Recycled: 48, Composted: 15, Incinerated: 9, Reused: 8 },
  },
];

/* ══════════════════════════════════════════════════════════
   2. HELPER — filter dataset
   ══════════════════════════════════════════════════════════ */
/**
 * Returns a filtered subset of DATA matching the given region and dept.
 * 'all' acts as a wildcard for either axis.
 */
function getFilteredData(region, dept) {
  return DATA.filter(
    (d) =>
      (region === 'all' || d.region === region) &&
      (dept === 'all' || d.dept === dept)
  );
}

/**
 * Aggregates an array of records into a single summary object.
 * Numeric fields are summed; percentage fields are averaged.
 */
function aggregate(records) {
  if (!records.length) return null;

  const n = records.length;

  // Sum monthly trends element-wise
  const monthlyTrend = {
    co2:       Array(12).fill(0),
    renewable: Array(12).fill(0),
  };
  records.forEach((r) => {
    r.monthlyTrend.co2.forEach((v, i)       => (monthlyTrend.co2[i]       += v));
    r.monthlyTrend.renewable.forEach((v, i) => (monthlyTrend.renewable[i] += v));
  });
  // renewable is an average (%), co2 is a total
  monthlyTrend.renewable = monthlyTrend.renewable.map((v) => +(v / n).toFixed(1));

  // Sum waste categories
  const wasteKeys = ['Landfill', 'Recycled', 'Composted', 'Incinerated', 'Reused'];
  const waste = {};
  wasteKeys.forEach((k) => { waste[k] = 0; });
  records.forEach((r) => {
    wasteKeys.forEach((k) => { waste[k] += r.waste[k] || 0; });
  });

  return {
    co2:            records.reduce((s, r) => s + r.co2, 0),
    renewable:      +(records.reduce((s, r) => s + r.renewable, 0) / n).toFixed(1),
    water:          records.reduce((s, r) => s + r.water, 0),
    recycling:      +(records.reduce((s, r) => s + r.recycling, 0) / n).toFixed(1),
    co2Delta:       +(records.reduce((s, r) => s + r.co2Delta, 0) / n).toFixed(1),
    renewableDelta: +(records.reduce((s, r) => s + r.renewableDelta, 0) / n).toFixed(1),
    waterDelta:     +(records.reduce((s, r) => s + r.waterDelta, 0) / n).toFixed(1),
    recyclingDelta: +(records.reduce((s, r) => s + r.recyclingDelta, 0) / n).toFixed(1),
    monthlyTrend,
    waste,
    // Per-department CO2 totals (used in the bar chart)
    deptCO2: buildDeptTotals(records),
  };
}

/** Compute total CO2 per department for the current filter set. */
function buildDeptTotals(records) {
  const map = {};
  records.forEach((r) => {
    map[r.dept] = (map[r.dept] || 0) + r.co2;
  });
  return map;
}

/* ══════════════════════════════════════════════════════════
   3. KPI CARDS
   ══════════════════════════════════════════════════════════ */
const DEPT_LABELS = {
  ops: 'Operations', it: 'IT', logistics: 'Logistics',
  manufacturing: 'Manufacturing', facilities: 'Facilities',
};

function renderKPIs(agg) {
  // CO2
  document.getElementById('kpi-co2').textContent       = `${agg.co2.toLocaleString()} tCO₂e`;
  renderDelta('kpi-co2-delta', agg.co2Delta, true);   // true = lower is better

  // Renewable
  document.getElementById('kpi-renewable').textContent  = `${agg.renewable}%`;
  renderDelta('kpi-renewable-delta', agg.renewableDelta, false);

  // Water
  document.getElementById('kpi-water').textContent      = `${agg.water.toLocaleString()} kL`;
  renderDelta('kpi-water-delta', agg.waterDelta, true);

  // Recycling
  document.getElementById('kpi-recycling').textContent  = `${agg.recycling}%`;
  renderDelta('kpi-recycling-delta', agg.recyclingDelta, false);
}

/**
 * Sets the delta text and color for a KPI card.
 * @param {string} id         - element ID
 * @param {number} delta      - change value (positive = up)
 * @param {boolean} invertGood - true when "down" is good (CO2, Water)
 */
function renderDelta(id, delta, invertGood) {
  const el = document.getElementById(id);
  const isPositive = delta > 0;
  const isGood     = invertGood ? !isPositive : isPositive;
  const arrow      = isPositive ? '↑' : '↓';
  const sign       = isPositive ? '+' : '';

  el.textContent = `${arrow} ${sign}${Math.abs(delta)}% vs last period`;
  el.className   = `kpi-delta ${isGood ? 'positive' : 'negative'}`;
}

/* ══════════════════════════════════════════════════════════
   4. CHART.JS SETUP — shared defaults
   ══════════════════════════════════════════════════════════ */
Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, sans-serif';
Chart.defaults.font.size   = 12;
Chart.defaults.color       = '#57606a';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Brand palette constants
const COLOR_CO2       = { border: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
const COLOR_RENEWABLE = { border: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
const COLOR_DEPT = [
  '#22c55e', '#14b8a6', '#3b82f6', '#f59e0b', '#8b5cf6',
];
const COLOR_WASTE = ['#ef4444', '#22c55e', '#14b8a6', '#f59e0b', '#8b5cf6'];

/* ── Climate Trends Chart (line) ─────────────────────── */
const trendsCtx = document.getElementById('chartTrends').getContext('2d');
const chartTrends = new Chart(trendsCtx, {
  type: 'line',
  data: {
    labels: MONTHS,
    datasets: [
      {
        label: 'CO₂ Emissions (tCO₂e)',
        data: [],
        borderColor: COLOR_CO2.border,
        backgroundColor: COLOR_CO2.bg,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'yCO2',
      },
      {
        label: 'Renewable Energy (%)',
        data: [],
        borderColor: COLOR_RENEWABLE.border,
        backgroundColor: COLOR_RENEWABLE.bg,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'yRenew',
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', align: 'end', labels: { boxWidth: 12, padding: 16 } },
      tooltip: {
        backgroundColor: '#1f2328',
        titleColor: '#e5e7eb',
        bodyColor: '#9ca3af',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af' } },
      yCO2: {
        position: 'left',
        title: { display: true, text: 'tCO₂e', color: '#9ca3af' },
        grid: { color: '#f3f4f6' },
        ticks: { color: '#9ca3af' },
      },
      yRenew: {
        position: 'right',
        title: { display: true, text: '%', color: '#9ca3af' },
        min: 0, max: 100,
        grid: { drawOnChartArea: false },
        ticks: { color: '#9ca3af', callback: (v) => `${v}%` },
      },
    },
  },
});

/* ── Waste Distribution Chart (doughnut) ─────────────── */
const wasteCtx = document.getElementById('chartWaste').getContext('2d');
const chartWaste = new Chart(wasteCtx, {
  type: 'doughnut',
  data: {
    labels: ['Landfill', 'Recycled', 'Composted', 'Incinerated', 'Reused'],
    datasets: [{
      data: [],
      backgroundColor: COLOR_WASTE,
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 8,
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 14, boxWidth: 12 } },
      tooltip: {
        backgroundColor: '#1f2328',
        titleColor: '#e5e7eb',
        bodyColor: '#9ca3af',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct   = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ${ctx.label}: ${ctx.raw} units (${pct}%)`;
          },
        },
      },
    },
  },
});

/* ── Department Emissions Chart (horizontal bar) ─────── */
const deptCtx = document.getElementById('chartDeptEmissions').getContext('2d');
const chartDept = new Chart(deptCtx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'CO₂ Emissions (tCO₂e)',
      data: [],
      backgroundColor: COLOR_DEPT,
      borderRadius: 6,
      borderSkipped: false,
    }],
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2328',
        titleColor: '#e5e7eb',
        bodyColor: '#9ca3af',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.raw.toLocaleString()} tCO₂e`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#9ca3af', callback: (v) => `${(v / 1000).toFixed(0)}k` },
        title: { display: true, text: 'tCO₂e', color: '#9ca3af' },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#374151', font: { weight: '500' } },
      },
    },
  },
});

/* ══════════════════════════════════════════════════════════
   5. UPDATE ALL CHARTS + KPIs
   ══════════════════════════════════════════════════════════ */
function updateDashboard(region, dept) {
  const filtered = getFilteredData(region, dept);
  if (!filtered.length) return;

  const agg = aggregate(filtered);

  // — KPI cards —
  renderKPIs(agg);

  // — Climate Trends line chart —
  chartTrends.data.datasets[0].data = agg.monthlyTrend.co2;
  chartTrends.data.datasets[1].data = agg.monthlyTrend.renewable;
  chartTrends.update('active');

  // — Waste Doughnut —
  const wasteVals = Object.values(agg.waste);
  chartWaste.data.datasets[0].data = wasteVals;
  chartWaste.update('active');

  // — Department Bar Chart —
  const deptMap   = agg.deptCO2;
  const deptNames = Object.keys(deptMap).map((k) => DEPT_LABELS[k] || k);
  const deptVals  = Object.values(deptMap);
  chartDept.data.labels                = deptNames;
  chartDept.data.datasets[0].data      = deptVals;
  chartDept.data.datasets[0].backgroundColor = COLOR_DEPT.slice(0, deptVals.length);
  chartDept.update('active');
}

/* ══════════════════════════════════════════════════════════
   6. FILTER LISTENERS
   ══════════════════════════════════════════════════════════ */
const regionFilter = document.getElementById('regionFilter');
const deptFilter   = document.getElementById('deptFilter');

function onFilterChange() {
  updateDashboard(regionFilter.value, deptFilter.value);
}

regionFilter.addEventListener('change', onFilterChange);
deptFilter.addEventListener('change',   onFilterChange);

/* ══════════════════════════════════════════════════════════
   7. MOBILE SIDEBAR TOGGLE
   ══════════════════════════════════════════════════════════ */
const sidebarToggle  = document.getElementById('sidebarToggle');
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function closeSidebar() {
  sidebar.classList.add('-translate-x-full');
  sidebarOverlay.classList.add('hidden');
}
function openSidebar() {
  sidebar.classList.remove('-translate-x-full');
  sidebarOverlay.classList.remove('hidden');
}
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.contains('-translate-x-full') ? openSidebar() : closeSidebar();
});
sidebarOverlay.addEventListener('click', closeSidebar);

/* ══════════════════════════════════════════════════════════
   8. SIDEBAR NAVIGATION — smooth scroll + active state
   ══════════════════════════════════════════════════════════ */
document.querySelectorAll('.nav-item[data-nav]').forEach((item) => {
  item.addEventListener('click', (e) => {
    const href = item.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelectorAll('.nav-item[data-nav]').forEach((el) => {
        el.classList.remove('active');
        el.removeAttribute('aria-current');
      });
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeSidebar();
    }
  });
});

/* ══════════════════════════════════════════════════════════
   9. TOAST HELPER
   ══════════════════════════════════════════════════════════ */
let toastTimer = null;

/**
 * Show a brief toast notification.
 * @param {string} msg  - message to display
 * @param {'success'|'error'} type - icon style
 */
function showToast(msg, type = 'success') {
  const toast   = document.getElementById('toast');
  const toastMsg  = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');

  toastMsg.textContent = msg;
  // Success = green check, error = red X
  if (type === 'error') {
    toastIcon.setAttribute('class', 'w-4 h-4 flex-shrink-0 text-red-400');
    toastIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>';
  } else {
    toastIcon.setAttribute('class', 'w-4 h-4 flex-shrink-0 text-brand-400');
    toastIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>';
  }

  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

/* ══════════════════════════════════════════════════════════
   10. MODAL SYSTEM
   ══════════════════════════════════════════════════════════ */
const modalBackdrop = document.getElementById('modalBackdrop');

/**
 * Open a specific modal panel by its ID.
 * Hides all other panels first so only one is visible.
 */
function openModal(panelId) {
  // Hide all panels
  modalBackdrop.querySelectorAll('.modal-panel').forEach((p) => p.classList.add('hidden'));
  // Show the target panel
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.remove('hidden');
  // Show backdrop
  modalBackdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/** Close every modal and restore scroll. */
function closeModal() {
  modalBackdrop.classList.add('hidden');
  modalBackdrop.querySelectorAll('.modal-panel').forEach((p) => p.classList.add('hidden'));
  document.body.style.overflow = '';
}

// Close modal when backdrop itself is clicked (not the panel)
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

// Wire every [data-close-modal] button inside any modal panel
document.querySelectorAll('[data-close-modal]').forEach((btn) => {
  btn.addEventListener('click', closeModal);
});

// Escape key closes any open modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) {
    closeModal();
  }
});

/* ══════════════════════════════════════════════════════════
   11. PROFILE DROPDOWN
   ══════════════════════════════════════════════════════════ */
const profileBtn      = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
const profileChevron  = document.getElementById('profileChevron');

function closeProfileDropdown() {
  profileDropdown.classList.add('hidden');
  profileBtn.setAttribute('aria-expanded', 'false');
  profileChevron.classList.remove('rotated');
}
function openProfileDropdown() {
  profileDropdown.classList.remove('hidden');
  profileBtn.setAttribute('aria-expanded', 'true');
  profileChevron.classList.add('rotated');
}

profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdown.classList.contains('hidden') ? openProfileDropdown() : closeProfileDropdown();
});

// My Profile
document.getElementById('ddMyProfile').addEventListener('click', () => {
  closeProfileDropdown();
  openModal('modalProfile');
});

// My Reports
document.getElementById('ddMyReports').addEventListener('click', () => {
  closeProfileDropdown();
  openModal('modalReports');
});

// Sign Out → redirect to login.html
document.getElementById('ddSignOut').addEventListener('click', () => {
  closeProfileDropdown();
  window.location.href = 'login.html';
});

// Close profile dropdown on outside click
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('profileDropdownWrap');
  if (wrap && !wrap.contains(e.target)) closeProfileDropdown();
});

/* ══════════════════════════════════════════════════════════
   12. PROFILE MODAL — localStorage + real-time name sync + avatar
   ══════════════════════════════════════════════════════════ */

/**
 * Derive initials from a full name string.
 * "Akfina N" → "AN", "Eco Admin" → "EA"
 */
function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Propagate a display name to every place it appears in the UI:
 *  - Navbar profile button text
 *  - Modal avatar section name text
 *  - Modal avatar circle initials (if no photo)
 *  - Navbar avatar circle initials
 */
function syncDisplayName(name) {
  const initials = getInitials(name) || 'EI';

  // Navbar: text label
  const navNameEl = document.querySelector('#profileBtn p.font-semibold');
  if (navNameEl) navNameEl.textContent = name;

  // Modal: name text below avatar
  const modalNameEl = document.getElementById('modalAvatarName');
  if (modalNameEl) modalNameEl.textContent = name;

  // Modal avatar circle (only update initials if no image is set)
  const modalAv = document.getElementById('modalAvatar');
  if (modalAv && !modalAv.querySelector('img')) modalAv.textContent = initials;

  // Navbar avatar circle
  const navAv = document.querySelector('#profileBtn .rounded-full');
  if (navAv && !navAv.querySelector('img')) navAv.textContent = initials;
}

// Live preview: as the user types in first/last name fields, update the modal avatar name
['profileFirstName', 'profileLastName'].forEach((id) => {
  document.getElementById(id).addEventListener('input', () => {
    const first = document.getElementById('profileFirstName').value.trim();
    const last  = document.getElementById('profileLastName').value.trim();
    const name  = [first, last].filter(Boolean).join(' ') || 'Eco Admin';
    const modalNameEl = document.getElementById('modalAvatarName');
    if (modalNameEl) modalNameEl.textContent = name;
    // Live initials in modal avatar
    const modalAv = document.getElementById('modalAvatar');
    if (modalAv && !modalAv.querySelector('img')) modalAv.textContent = getInitials(name) || 'EI';
  });
});

// Save Changes — commit, sync everywhere, and persist to localStorage
document.getElementById('saveProfileBtn').addEventListener('click', () => {
  const first = document.getElementById('profileFirstName').value.trim();
  const last  = document.getElementById('profileLastName').value.trim();
  const name  = [first, last].filter(Boolean).join(' ') || 'Eco Admin';

  // Retrieve current avatar src (if a photo was uploaded)
  const modalAv = document.getElementById('modalAvatar');
  const imgEl   = modalAv ? modalAv.querySelector('img') : null;
  const avatarSrc = imgEl ? imgEl.src : null;

  // Persist to localStorage
  localStorage.setItem('eco_profile_name', name);
  if (avatarSrc) {
    localStorage.setItem('eco_profile_avatar', avatarSrc);
  } else {
    localStorage.removeItem('eco_profile_avatar');
  }

  syncDisplayName(name);
  closeModal();
  showToast('Profile saved successfully');
});

/* ── Change Avatar ── */
const changeAvatarBtn = document.getElementById('changeAvatarBtn');
const avatarFileInput = document.getElementById('avatarFileInput');

changeAvatarBtn.addEventListener('click', () => avatarFileInput.click());

avatarFileInput.addEventListener('change', () => {
  const file = avatarFileInput.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    const imgTag = `<img src="${src}" class="w-full h-full object-cover" alt="Avatar" />`;

    // Update modal avatar
    const modalAv = document.getElementById('modalAvatar');
    if (modalAv) modalAv.innerHTML = imgTag;

    // Update navbar avatar
    const navAv = document.querySelector('#profileBtn .rounded-full');
    if (navAv) {
      navAv.innerHTML = imgTag;
      navAv.style.padding = '0';
    }

    showToast('Avatar updated');
  };
  reader.readAsDataURL(file);
  avatarFileInput.value = ''; // reset so same file can be picked again
});

/* ══════════════════════════════════════════════════════════
   13. SIDEBAR SHORTCUT BUTTON (Reports)
   ══════════════════════════════════════════════════════════ */
document.getElementById('sidebarReportsBtn').addEventListener('click', () => {
  openModal('modalReports');
  closeSidebar();
});

/* ══════════════════════════════════════════════════════════
   14. SIMULATE DOWNLOAD (Reports modal)
   ══════════════════════════════════════════════════════════ */
/**
 * Simulates a file download by creating a tiny blank Blob.
 * In production this would be a real server URL.
 */
function simulateDownload(filename) {
  const blob = new Blob(
    [`EcoIntelligence simulated export: ${filename}\nGenerated: ${new Date().toISOString()}`],
    { type: 'text/plain' }
  );
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`Downloading ${filename}…`);
}

/* ══════════════════════════════════════════════════════════
   16. LOAD PERSISTED PROFILE FROM localStorage ON PAGE INIT
   ══════════════════════════════════════════════════════════ */

/**
 * Restores name and avatar from localStorage so that changes
 * made before sign-out survive the sign-in round-trip.
 */
function loadPersistedProfile() {
  const savedName   = localStorage.getItem('eco_profile_name');
  const savedAvatar = localStorage.getItem('eco_profile_avatar');

  if (savedName) {
    // Populate the form fields (split on first space)
    const parts = savedName.split(/\s+/);
    const first = parts[0] || '';
    const last  = parts.slice(1).join(' ') || '';
    const fnEl  = document.getElementById('profileFirstName');
    const lnEl  = document.getElementById('profileLastName');
    if (fnEl) fnEl.value = first;
    if (lnEl) lnEl.value = last;

    // Sync all display name occurrences
    syncDisplayName(savedName);

    // Update profile dropdown header name text
    const ddName = document.querySelector('#profileDropdown .font-semibold');
    if (ddName) ddName.textContent = savedName;
  }

  if (savedAvatar) {
    const imgTag = `<img src="${savedAvatar}" class="w-full h-full object-cover" alt="Avatar" />`;

    const modalAv = document.getElementById('modalAvatar');
    if (modalAv) modalAv.innerHTML = imgTag;

    const navAv = document.querySelector('#profileBtn .rounded-full');
    if (navAv) {
      navAv.innerHTML = imgTag;
      navAv.style.padding = '0';
    }
  }
}

loadPersistedProfile();

/* ══════════════════════════════════════════════════════════
   17. INITIAL RENDER
   ══════════════════════════════════════════════════════════ */
updateDashboard('all', 'all');
