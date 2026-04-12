'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('appointments')
        .select('created_at');

      const grouped: Record<string, number> = {};

      data?.forEach((d) => {
        const date = new Date(d.created_at).toLocaleDateString();
        grouped[date] = (grouped[date] || 0) + 1;
      });

      setData(
        Object.keys(grouped).map((k) => ({
          date: k,
          value: grouped[k],
        }))
      );
    };

    load();
  }, []);

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-semibold">
        📊 Analytics
      </h1>

      <div className="h-80 bg-white border rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}