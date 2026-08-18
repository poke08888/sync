import * as XLSX from 'xlsx';

// 1h 30min -> 1.5
export const parseDuration = (timeStr) => {
  if (!timeStr) return 0;
  let hours = 0;
  let mins = 0;
  
  const hMatch = timeStr.match(/(\d+)h/);
  if (hMatch) hours = parseInt(hMatch[1], 10);
  
  const mMatch = timeStr.match(/(\d+)min/);
  if (mMatch) mins = parseInt(mMatch[1], 10);
  
  return hours + (mins / 60);
};

// "2026/04/06/ 22:55" -> "2026-04-06"
export const parseDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length >= 3) {
    return `${parts[0]}-${parts[1]}-${parts[2]}`;
  }
  return dateStr;
};

// "5.73%" -> 5.73
export const parsePercent = (pctStr) => {
  if (!pctStr) return 0;
  if (typeof pctStr === 'number') return pctStr;
  return parseFloat(pctStr.toString().replace('%', '')) || 0;
};

// ==========================================
// 1. RAW DATA PARSING
// ==========================================

export const parseRows = (sheetData) => {
  // Skip rows 0, 1 (header info + blank), Row 2 is column headers. Data starts at index 3
  if (sheetData.length < 4) return [];
  
  const dataRows = sheetData.slice(3).filter(row => row && row[0]); // filter empty ID
  
  return dataRows.map((row) => {
    const startTime = row[3] || '';
    const durationStr = row[4] || '';
    const hours = parseDuration(durationStr);
    const gmv = parseFloat(row[5]) || 0;
    const orders = parseInt(row[9], 10) || 0;
    const clicks = parseInt(row[23], 10) || 0;
    const impressions = parseInt(row[22], 10) || 0;
    
    return {
      creatorId: row[0],
      name: row[1] || 'Unknown',
      username: row[2] || 'unknown',
      startTime: startTime,
      date: parseDate(startTime),
      durationStr: durationStr,
      durationHours: hours,
      gmv: gmv,
      orders: orders,
      itemsSold: parseInt(row[10], 10) || 0,
      viewers: parseInt(row[15], 10) || 0,
      views: parseInt(row[16], 10) || 0,
      likes: parseInt(row[20], 10) || 0,
      comments: parseInt(row[18], 10) || 0,
      shares: parseInt(row[19], 10) || 0,
      newFollowers: parseInt(row[21], 10) || 0,
      impressions: impressions,
      clicks: clicks,
      ctrRaw: parsePercent(row[24]),
      cvrRaw: parsePercent(row[13]),
      cvr: clicks > 0 ? (orders / clicks) * 100 : 0,
      aov: orders > 0 ? (gmv / orders) : 0,
      revPerHour: hours > 0 ? (gmv / hours) : 0,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    };
  });
};

// ==========================================
// 2. AGGREGATION UTILS
// ==========================================

export const computeKpis = (rows) => {
  const totalGMV = rows.reduce((acc, r) => acc + r.gmv, 0);
  const totalOrders = rows.reduce((acc, r) => acc + r.orders, 0);
  const totalViews = rows.reduce((acc, r) => acc + r.views, 0);
  const totalDurationHours = rows.reduce((acc, r) => acc + r.durationHours, 0);
  const totalClicks = rows.reduce((acc, r) => acc + (r.clicks || 0), 0);
  const totalImpressions = rows.reduce((acc, r) => acc + (r.impressions || 0), 0);
  const sessionsWithOrders = rows.filter(r => r.orders > 0).length;
  
  const uniqueKocs = new Set();
  rows.forEach(r => uniqueKocs.add(r.creatorId || r.username));

  return {
    totalGMV,
    totalOrders,
    totalViews,
    totalSessions: rows.length,
    sessionsWithOrders,
    totalDurationHours,
    totalClicks,
    totalImpressions,
    kocCount: uniqueKocs.size,
    aov: totalOrders > 0 ? totalGMV / totalOrders : 0,
    revPerHour: totalDurationHours > 0 ? totalGMV / totalDurationHours : 0,
    blendedCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    blendedCvr: totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0,
  };
};

export const aggregateByKoc = (rows) => {
  const kocMap = {};
  rows.forEach(row => {
    const id = row.creatorId || row.username;
    if (!kocMap[id]) {
      kocMap[id] = {
        creatorId: row.creatorId,
        name: row.name,
        username: row.username,
        totalSessions: 0,
        sessionsWithOrders: 0,
        totalDurationHours: 0,
        totalGMV: 0,
        totalOrders: 0,
        totalViews: 0,
        totalClicks: 0,
        totalImpressions: 0,
        lives: []
      };
    }
    const koc = kocMap[id];
    koc.totalSessions += 1;
    if (row.orders > 0) koc.sessionsWithOrders += 1;
    koc.totalDurationHours += row.durationHours;
    koc.totalGMV += row.gmv;
    koc.totalOrders += row.orders;
    koc.totalViews += row.views || row.viewers; 
    koc.totalClicks += row.clicks;
    koc.totalImpressions += row.impressions;
    koc.lives.push(row);
  });

  return Object.values(kocMap).map(koc => {
    koc.avgDuration = koc.totalSessions > 0 ? (koc.totalDurationHours / koc.totalSessions) : 0;
    koc.cvr = koc.totalClicks > 0 ? (koc.totalOrders / koc.totalClicks) * 100 : 0;
    koc.ctr = koc.totalImpressions > 0 ? (koc.totalClicks / koc.totalImpressions) * 100 : 0;
    koc.aov = koc.totalOrders > 0 ? (koc.totalGMV / koc.totalOrders) : 0;
    koc.revPerHour = koc.totalDurationHours > 0 ? (koc.totalGMV / koc.totalDurationHours) : 0;
    return koc;
  });
};

export const aggregateByDate = (rows) => {
  const dateMap = {};
  rows.forEach(r => {
    const d = r.date || 'Unknown';
    if (!dateMap[d]) dateMap[d] = [];
    dateMap[d].push(r);
  });
  
  return Object.keys(dateMap).sort().map(date => {
    return {
      date,
      ...computeKpis(dateMap[date]),
      rows: dateMap[date]
    };
  });
};

// Helper: Get ISO Week string YYYY-Www
const getIsoWeek = (dateString) => {
  if (!dateString || dateString === 'Unknown') return 'Unknown';
  const d = new Date(dateString);
  if (isNaN(d)) return 'Unknown';
  
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

export const aggregateByWeek = (rows) => {
  const weekMap = {};
  rows.forEach(r => {
    const w = getIsoWeek(r.date);
    if (!weekMap[w]) weekMap[w] = [];
    weekMap[w].push(r);
  });
  
  return Object.keys(weekMap).sort().map(week => {
    return {
      week,
      ...computeKpis(weekMap[week]),
      rows: weekMap[week]
    };
  });
};

export const aggregateByMonth = (rows) => {
  const monthMap = {};
  rows.forEach(r => {
    let m = 'Unknown';
    if (r.date && r.date !== 'Unknown') {
      m = r.date.substring(0, 7); // YYYY-MM
    }
    if (!monthMap[m]) monthMap[m] = [];
    monthMap[m].push(r);
  });
  
  return Object.keys(monthMap).sort().map(month => {
    return {
      month,
      ...computeKpis(monthMap[month]),
      rows: monthMap[month]
    };
  });
};

export const filterByKoc = (rows, kocId) => {
  return rows.filter(r => r.creatorId === kocId || r.username === kocId);
};
