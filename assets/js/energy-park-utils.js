// Energy Park Utils - mock API and helpers
(function(global){
  const Utils = {
    // Mock fetch function with delay
    fetchData: (endpoint, params={}) => new Promise(res => {
      console.log('[MockAPI] GET', endpoint, params);
      setTimeout(() => {
        res({ ok: true, endpoint, params, timestamp: Date.now() });
      }, 300);
    }),

    postData: (endpoint, body={}) => new Promise(res => {
      console.log('[MockAPI] POST', endpoint, body);
      setTimeout(() => {
        res({ ok: true, endpoint, body, timestamp: Date.now(), id: Math.floor(Math.random()*100000) });
      }, 300);
    }),

    exportCSV: (filename, rows) => {
      const processRow = row => row.map(v => '"' + String(v ?? '').replace(/"/g,'""') + '"').join(',');
      const csv = rows.map(processRow).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    },

    fmtNumber: n => (n||0).toLocaleString('zh-CN'),
    fmtPercent: n => `${Number(n||0).toFixed(1)}%`,

    // Simple toast using alert fallback
    toast: (msg) => {
      try {
        // Could integrate better UI later
        alert(msg);
      } catch(_) { console.log('[Toast]', msg); }
    },

    // Placeholder for KPI computations
    kpi: {
      targetCompletion: (target, actual) => {
        if (!target) return 0;
        return Math.min(100, Math.round((actual/target)*100));
      }
    }
  };

  global.EnergyUtils = Utils;
})(window);

