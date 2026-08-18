export interface KocLiveSession {
  creatorId: string;
  kocName: string;
  username: string;
  brand: string;
  startTime: string; // ISO or YYYY-MM-DD
  date: string; // YYYY-MM-DD for grouping
  durationHours: number;
  gmv: number;
  addedProducts: number;
  distinctProductsSold: number;
  skuOrdersCreated: number;
  liveSkuOrders: number;
  itemsSold: number;
  uniqueCustomers: number;
  avgPrice: number;
  orderCvr: number; // as float, e.g., 0.0485
  liveGmv: number;
  viewers: number;
  views: number;
  avgWatchTime: string;
  comments: number;
  shares: number;
  likes: number;
  newFollowers: number;
  impressions: number;
  clicks: number;
  ctr: number; // as float, e.g., 0.0573
  fileName?: string;
}

export interface FileMetadata {
  name: string;
  brand: string;
  count: number;
  dateRange: { start: string; end: string };
  uploadDate: string;
}

export interface KocAnomaly {
  kocId: string;
  kocName: string;
  username: string;
  type: 'gmv_drop' | 'gmv_surge' | 'hours_drop' | 'missing_live' | 'effort_drop';
  severity: 'high' | 'medium' | 'info';
  message: string;
  changeValue: number; // e.g., -0.5 for 50% drop
  currentValue: number;
  previousValue: number;
}

export function parseTiktokDuration(str: string): number {
  if (!str) return 0;
  let hours = 0;
  let mins = 0;

  const hMatch = str.match(/(\d+)h/);
  const mMatch = str.match(/(\d+)min/);

  if (hMatch) hours = parseInt(hMatch[1]);
  if (mMatch) mins = parseInt(mMatch[1]);

  return hours + (mins / 60);
}

export function parseTiktokPrice(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // Handle strings like "₫1.245.000" or "1,245,000"
  let clean = val.toString().replace(/₫/g, '').replace(/\./g, '').replace(/,/g, '').trim();
  return parseFloat(clean) || 0;
}

export function parsePercentage(val: string): number {
  if (!val) return 0;
  let clean = val.replace(/%/g, '').trim();
  return (parseFloat(clean) / 100) || 0;
}

export function normalizeDate(val: any): { full: string, dateOnly: string } {
  if (!val) return { full: "", dateOnly: "" };
  
  let str = val.toString().trim();
  
  // Handle Excel serial date (e.g., 45398.6458)
  if (!isNaN(Number(str)) && Number(str) > 30000 && Number(str) < 70000) {
    // Excel epoch 1900, 25569 is Jan 1 1970
    const unix = Math.round((Number(str) - 25569) * 86400 * 1000);
    const d = new Date(unix);
    const dateOnly = d.toISOString().split('T')[0];
    const full = d.toISOString().replace('T', ' ').split('.')[0];
    return { full, dateOnly };
  }

  // Handle String dates: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
  const parts = str.split(' ');
  const datePart = parts[0];
  const timePart = parts[1] || "00:00:00";
  
  let yyyy = "", mm = "", dd = "";
  
  if (datePart.includes('/')) {
    const dParts = datePart.split('/');
    if (dParts[2]?.length === 4) { 
      // Assume DD/MM/YYYY as it's common for TikTok VN
      yyyy = dParts[2];
      mm = dParts[1].padStart(2, '0');
      dd = dParts[0].padStart(2, '0');
    } else if (dParts[0]?.length === 4) { // YYYY/MM/DD
      yyyy = dParts[0];
      mm = dParts[1].padStart(2, '0');
      dd = dParts[2].padStart(2, '0');
    }
  } else if (datePart.includes('-')) {
    const dParts = datePart.split('-');
    if (dParts[0]?.length === 4) { // YYYY-MM-DD
      yyyy = dParts[0];
      mm = dParts[1].padStart(2, '0');
      dd = dParts[2].padStart(2, '0');
    } else if (dParts[2]?.length === 4) { // DD-MM-YYYY
      yyyy = dParts[2];
      mm = dParts[1].padStart(2, '0');
      dd = dParts[0].padStart(2, '0');
    }
  }

  if (!yyyy || !mm || !dd) {
     return { full: str, dateOnly: datePart }; // fallback
  }

  const normalizedDate = `${yyyy}-${mm}-${dd}`;
  return {
    full: `${normalizedDate} ${timePart}`,
    dateOnly: normalizedDate
  };
}

export function parseRows(sheetData: any[][], brand: string): KocLiveSession[] {
  // TikTok Shop format: 
  // Row 0: Date range
  // Row 1: Empty
  // Row 2: Headers
  // Row 3+: Data
  const dataRows = sheetData.slice(3);

  return dataRows.map(row => {
    const gmv = parseTiktokPrice(row[5]);
    const orders = parseInt(row[8]) || 0;
    const clicks = parseInt(row[23]) || 0;
    const duration = parseTiktokDuration(row[4]?.toString() || "");
    const dateData = normalizeDate(row[3]);

    return {
      creatorId: row[0]?.toString() || "",
      kocName: row[1]?.toString() || "",
      username: row[2]?.toString() || "",
      brand: brand,
      startTime: dateData.full,
      date: dateData.dateOnly,
      durationHours: Math.max(0, duration) || 0,
      gmv: gmv,
      addedProducts: parseInt(row[6]) || 0,
      distinctProductsSold: parseInt(row[7]) || 0,
      skuOrdersCreated: orders,
      liveSkuOrders: parseInt(row[9]) || 0,
      itemsSold: parseInt(row[10]) || 0,
      uniqueCustomers: parseInt(row[11]) || 0,
      avgPrice: parseTiktokPrice(row[12]),
      orderCvr: parsePercentage(row[13]?.toString() || ""),
      liveGmv: parseTiktokPrice(row[14]),
      viewers: parseInt(row[15]) || 0,
      views: parseInt(row[16]) || 0,
      avgWatchTime: row[17]?.toString() || "",
      comments: parseInt(row[18]) || 0,
      shares: parseInt(row[19]) || 0,
      likes: parseInt(row[20]) || 0,
      newFollowers: parseInt(row[21]) || 0,
      impressions: parseInt(row[22]) || 0,
      clicks: clicks,
      ctr: parsePercentage(row[24]?.toString() || ""),
      // Derived
      cvr: clicks > 0 ? (orders / clicks) : 0,
      revPerHour: duration > 0 ? (gmv / duration) : 0,
      aov: orders > 0 ? (gmv / orders) : 0,
    };
  }).filter(s => s.creatorId && s.creatorId !== "" && s.kocName);
}

export function computeKpis(rows: KocLiveSession[]) {
  const totalGmv = rows.reduce((sum, r) => sum + r.gmv, 0);
  const totalOrders = rows.reduce((sum, r) => sum + r.skuOrdersCreated, 0);
  const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);
  const totalHours = rows.reduce((sum, r) => sum + r.durationHours, 0);
  const totalImpressions = rows.reduce((sum, r) => sum + r.impressions, 0);
  const sessionCount = rows.length;
  
  const uniqueCreators = new Set(rows.map(r => r.creatorId));

  return {
    totalGmv,
    totalOrders,
    totalClicks,
    totalImpressions,
    avgCvr: totalClicks > 0 ? (totalOrders / totalClicks) : 0,
    revPerHour: totalHours > 0 ? (totalGmv / totalHours) : 0,
    aov: totalOrders > 0 ? (totalGmv / totalOrders) : 0,
    blendedCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) : 0,
    totalDuration: totalHours,
    sessionCount,
    orderedSessions: rows.filter(r => r.skuOrdersCreated > 0).length,
    uniqueKocs: uniqueCreators.size,
    avgDurationPerSession: sessionCount > 0 ? (totalHours / sessionCount) : 0,
  };
}

export function aggregateByKoc(rows: KocLiveSession[]) {
  const cocMap: Record<string, any> = {};

  rows.forEach(r => {
    if (!cocMap[r.creatorId]) {
      cocMap[r.creatorId] = {
        id: r.creatorId,
        name: r.kocName,
        username: r.username,
        gmv: 0,
        orders: 0,
        sessions: 0,
        duration: 0,
        impressions: 0,
        clicks: 0,
      };
    }
    cocMap[r.creatorId].gmv += r.gmv;
    cocMap[r.creatorId].orders += r.skuOrdersCreated;
    cocMap[r.creatorId].sessions += 1;
    cocMap[r.creatorId].duration += r.durationHours;
    cocMap[r.creatorId].impressions += r.impressions;
    cocMap[r.creatorId].clicks += r.clicks;
  });

  return Object.values(cocMap).map((k: any) => ({
    ...k,
    ctr: k.impressions > 0 ? (k.clicks / k.impressions) : 0,
    cvr: k.clicks > 0 ? (k.orders / k.clicks) : 0,
    revPerHour: k.duration > 0 ? (k.gmv / k.duration) : 0
  })).sort((a, b) => b.gmv - a.gmv);
}

export function aggregateByDate(rows: KocLiveSession[]) {
  const dateMap: Record<string, any> = {};

  rows.forEach(r => {
    if (!dateMap[r.date]) {
      dateMap[r.date] = { date: r.date, gmv: 0, orders: 0, sessions: 0 };
    }
    dateMap[r.date].gmv += r.gmv;
    dateMap[r.date].orders += r.skuOrdersCreated;
    dateMap[r.date].sessions += 1;
  });

  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
}

export function aggregateByHour(rows: KocLiveSession[]) {
  const hourMap: Record<number, any> = {};
  for (let i = 0; i < 24; i++) {
    hourMap[i] = { hour: `${i.toString().padStart(2, '0')}h`, sessions: 0, withRevenue: 0, withoutRevenue: 0 };
  }
  rows.forEach(r => {
    const hourPart = r.startTime.split(' ')[1]?.split(':')[0];
    if (hourPart) {
      const h = parseInt(hourPart);
      if (hourMap[h]) {
        hourMap[h].sessions += 1;
        if (r.skuOrdersCreated > 0) hourMap[h].withRevenue += 1;
        else hourMap[h].withoutRevenue += 1;
      }
    }
  });
  return Object.values(hourMap);
}

export function getScatterData(rows: KocLiveSession[]) {
  const kocs = aggregateByKoc(rows);
  const medianX = kocs.length > 0 ? [...kocs].sort((a, b) => a.duration - b.duration)[Math.floor(kocs.length / 2)].duration : 0;
  const medianY = kocs.length > 0 ? [...kocs].sort((a, b) => a.gmv - b.gmv)[Math.floor(kocs.length / 2)].gmv : 0;

  return {
    data: kocs.map(k => ({
      name: k.name,
      x: k.duration,
      y: k.gmv,
      z: k.orders,
    })),
    medianX,
    medianY
  };
}

export function filterSessions(sessions: KocLiveSession[], creatorId: string | null, dateRange: { from: string; to: string } | null, brand: string | null = null) {
  return sessions.filter(s => {
    const matchCreator = !creatorId || creatorId === 'all' || s.kocName === creatorId;
    const matchDate = !dateRange || (s.date >= dateRange.from && s.date <= dateRange.to);
    const matchBrand = !brand || brand === 'Tất cả các Brand' || s.brand === brand;
    return matchCreator && matchDate && matchBrand;
  });
}

export function aggregateByPeriod(sessions: KocLiveSession[], period: 'day' | 'week' | 'month' | 'year') {
  const periodMap: Record<string, any> = {};
  sessions.forEach(s => {
    let key = s.date;
    if (period === 'month') key = s.date.substring(0, 7);
    if (period === 'year') key = s.date.substring(0, 4);
    if (period === 'week') {
      const d = new Date(s.date);
      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const week = Math.ceil((((d.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
      key = `${d.getFullYear()}-W${week.toString().padStart(2, '0')}`;
    }

    if (!periodMap[key]) {
      periodMap[key] = { label: key, gmv: 0, orders: 0, sessions: 0 };
    }
    periodMap[key].gmv += s.gmv;
    periodMap[key].orders += s.skuOrdersCreated;
    periodMap[key].sessions += 1;
  });
  return Object.values(periodMap).sort((a, b) => a.label.localeCompare(b.label));
}

export function getTopContributors(sessions: KocLiveSession[], topN: number = 5) {
  const kocs = aggregateByKoc(sessions).slice(0, topN);
  const topNames = new Set(kocs.map(k => k.name));
  const dateMap: Record<string, any> = {};
  sessions.forEach(s => {
    if (!dateMap[s.date]) dateMap[s.date] = { date: s.date, others: 0 };
    if (topNames.has(s.kocName)) {
      dateMap[s.date][s.kocName] = (dateMap[s.date][s.kocName] || 0) + s.gmv;
    } else {
      dateMap[s.date].others += s.gmv;
    }
  });
  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Detects anomalies by comparing active filtered sessions with 
 * a window of the same length immediately preceding it.
 */
export function detectKocAnomalies(sessions: KocLiveSession[], filteredSessions: KocLiveSession[]): KocAnomaly[] {
  if (sessions.length === 0 || filteredSessions.length === 0) return [];

  // 1. Identify current window range
  const currentDates = filteredSessions.map(s => s.date).sort();
  const start = new Date(currentDates[0]);
  const end = new Date(currentDates[currentDates.length - 1]);
  const durationMs = end.getTime() - start.getTime() + 86400000;

  // 2. Identify previous window range
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(start.getTime() - durationMs);
  const prevStartStr = prevStart.toISOString().split('T')[0];
  const prevEndStr = prevEnd.toISOString().split('T')[0];

  // 3. Aggregate data for both periods
  const currentKocData = aggregateByKoc(filteredSessions);
  const previousSessions = sessions.filter(s => s.date >= prevStartStr && s.date <= prevEndStr);
  const previousKocData = aggregateByKoc(previousSessions);

  const prevMap = new Map(previousKocData.map(k => [k.id, k]));
  const alerts: KocAnomaly[] = [];

  // Iterate over KOCs to find changes
  const allIds = new Set([...currentKocData.map(k => k.id), ...previousKocData.map(k => k.id)]);

  allIds.forEach(id => {
    const cur = currentKocData.find(k => k.id === id);
    const prev = prevMap.get(id);

    if (prev && !cur) {
      if (prev.duration > 0) {
        alerts.push({
          kocId: id,
          kocName: prev.name,
          username: prev.username,
          type: 'missing_live',
          severity: 'high',
          message: 'Dừng livestream đột ngột (Tuần trước vẫn hoạt động)',
          changeValue: -1,
          currentValue: 0,
          previousValue: prev.duration
        });
      }
      return;
    }

    if (cur && prev) {
      // GMV detection
      const gmvChange = prev.gmv > 0 ? (cur.gmv - prev.gmv) / prev.gmv : (cur.gmv > 0 ? 1 : 0);
      if (gmvChange < -0.4) {
        alerts.push({
          kocId: id,
          kocName: cur.name,
          username: cur.username,
          type: 'gmv_drop',
          severity: 'high',
          message: `Doanh thu sụt giảm nghiêm trọng (${(gmvChange * 100).toFixed(0)}%)`,
          changeValue: gmvChange,
          currentValue: cur.gmv,
          previousValue: prev.gmv
        });
      } else if (gmvChange > 1.0) {
        alerts.push({
          kocId: id,
          kocName: cur.name,
          username: cur.username,
          type: 'gmv_surge',
          severity: 'info',
          message: `Tăng trưởng doanh thu đột biến (+${(gmvChange * 100).toFixed(0)}%)`,
          changeValue: gmvChange,
          currentValue: cur.gmv,
          previousValue: prev.gmv
        });
      }

      // Duration detection
      const hoursChange = prev.duration > 0 ? (cur.duration - prev.duration) / prev.duration : (cur.duration > 0 ? 1 : 0);
      if (hoursChange < -0.3) {
        alerts.push({
          kocId: id,
          kocName: cur.name,
          username: cur.username,
          type: 'hours_drop',
          severity: 'medium',
          message: `Thời lượng live giảm mạnh (${(hoursChange * 100).toFixed(0)}%)`,
          changeValue: hoursChange,
          currentValue: cur.duration,
          previousValue: prev.duration
        });
      }
    }
  });

  return alerts.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
export function calculateComparison(allSessions: KocLiveSession[], currentSessions: KocLiveSession[], dateRange: { from: string; to: string } | null | undefined, brand: string | null) {
  // Safe return if range is missing
  if (!dateRange || !dateRange.from || !dateRange.to) {
    return { gmv: 0, sessions: 0, orderedSessions: 0, orders: 0, aov: 0, revPerHour: 0, activeKocs: 0, avgDuration: 0, impressions: 0, clicks: 0, ctr: 0, cvr: 0 };
  }

  // 1. Identify current window duration
  const start = new Date(dateRange.from);
  const end = new Date(dateRange.to);
  
  // Check validity
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { gmv: 0, sessions: 0, orderedSessions: 0, orders: 0, aov: 0, revPerHour: 0, activeKocs: 0, avgDuration: 0, impressions: 0, clicks: 0, ctr: 0, cvr: 0 };
  }

  const durationMs = Math.max(0, end.getTime() - start.getTime() + (24 * 60 * 60 * 1000)); // include end day

  // 2. Identify previous window range
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(start.getTime() - durationMs);
  
  // Format dates safely
  const prevStartStr = prevStart.toISOString().split('T')[0];
  const prevEndStr = prevEnd.toISOString().split('T')[0];

  // 3. Filter previous period sessions
  const previousSessions = filterSessions(allSessions, 'all', { from: prevStartStr, to: prevEndStr }, brand);

  // 4. Compute KPIs for both
  const currentKpis = computeKpis(currentSessions);
  const previousKpis = computeKpis(previousSessions);

  // 5. Calculate percentage changes
  const calcChange = (cur: number, prev: number) => {
    if (prev === 0) return cur > 0 ? 100 : 0;
    return ((cur - prev) / prev) * 100;
  };

  return {
    gmv: calcChange(currentKpis.totalGmv, previousKpis.totalGmv),
    sessions: calcChange(currentKpis.sessionCount, previousKpis.sessionCount),
    orderedSessions: calcChange(currentKpis.orderedSessions, previousKpis.orderedSessions),
    orders: calcChange(currentKpis.totalOrders, previousKpis.totalOrders),
    aov: calcChange(currentKpis.aov, previousKpis.aov),
    revPerHour: calcChange(currentKpis.revPerHour, previousKpis.revPerHour),
    activeKocs: calcChange(currentKpis.uniqueKocs, previousKpis.uniqueKocs),
    avgDuration: calcChange(currentKpis.avgDurationPerSession, previousKpis.avgDurationPerSession),
    impressions: calcChange(currentKpis.totalImpressions, previousKpis.totalImpressions),
    clicks: calcChange(currentKpis.totalClicks, previousKpis.totalClicks),
    ctr: calcChange(currentKpis.blendedCtr * 100, previousKpis.blendedCtr * 100),
    cvr: calcChange(currentKpis.avgCvr * 100, previousKpis.avgCvr * 100),
  };
}
