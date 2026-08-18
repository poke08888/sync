"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ForecastData {
  date: string;
  stock: number;
  safetyStock: number;
  isArrival: boolean;
}

export default function StockForecastChart({ skuCode, warehouseCode }: { skuCode: string; warehouseCode?: string }) {
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const url = `/api/sku/${skuCode}/forecast${warehouseCode ? `?warehouse=${warehouseCode}` : ''}`;
        const res = await fetch(url);
        const json = await res.json();
        setData(json.forecast || []);
      } catch (error) {
        console.error('Failed to fetch forecast', error);
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, [skuCode, warehouseCode]);

  if (loading) return (
    <div className="h-[300px] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" />
    </div>
  );

  if (data.length === 0) return (
    <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm font-bold">
      KHÔNG CÓ DỮ LIỆU DỰ BÁO
    </div>
  );

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(str) => format(new Date(str), 'dd/MM')} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4B5563', fontSize: 10 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4B5563', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1E29', border: '1px solid #ffffff10', borderRadius: '12px' }}
            labelStyle={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '10px' }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
          />
          <ReferenceLine y={data[0]?.safetyStock} stroke="#F59E0B" strokeDasharray="3 3" label={{ position: 'right', value: 'Safety Stock', fill: '#F59E0B', fontSize: 8 }} />
          
          <Line 
            type="monotone" 
            dataKey="stock" 
            stroke="#6366F1" 
            strokeWidth={3} 
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (payload.isArrival) {
                return (
                  <circle cx={cx} cy={cy} r={4} fill="#10B981" stroke="none" />
                );
              }
              return <></>;
            }}
            activeDot={{ r: 6, strokeWidth: 0 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
