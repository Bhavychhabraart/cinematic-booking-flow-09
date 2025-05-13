
import React from 'react';
import { useTable } from '@/context/TableContext';
import { tableAnalytics } from '@/data/tables';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const TableAnalytics = () => {
  const { tables } = useTable();
  
  // Prepare data for charts
  const occupancyData = tables.map(table => {
    const analytics = tableAnalytics[table.id];
    return {
      name: `Table ${table.number}`,
      occupancy: analytics ? analytics.averageOccupancyTime : 0,
      turnover: analytics ? analytics.turnoverRate * 60 : 0, // Convert to minutes for chart scale
      revenue: analytics ? analytics.totalRevenue / 10 : 0, // Scale down for chart
    };
  });
  
  // Overall statistics
  const totalTables = tables.length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  const needsServiceTables = tables.filter(t => t.status === 'needs_service').length;
  
  const occupancyRate = totalTables ? Math.round((occupiedTables / totalTables) * 100) : 0;
  
  // Revenue calculation
  const totalRevenue = Object.values(tableAnalytics).reduce((sum, table) => sum + table.totalRevenue, 0);
  const averageRevenuePerTable = totalTables ? Math.round(totalRevenue / totalTables) : 0;
  
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">Real-time Analytics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-md p-3">
          <p className="text-sm text-white/60">Occupancy Rate</p>
          <p className="text-2xl font-light">{occupancyRate}%</p>
        </div>
        <div className="bg-white/5 rounded-md p-3">
          <p className="text-sm text-white/60">Available Tables</p>
          <p className="text-2xl font-light">{availableTables}</p>
        </div>
        <div className="bg-white/5 rounded-md p-3">
          <p className="text-sm text-white/60">Needs Service</p>
          <p className="text-2xl font-light">{needsServiceTables}</p>
        </div>
        <div className="bg-white/5 rounded-md p-3">
          <p className="text-sm text-white/60">Avg Revenue</p>
          <p className="text-2xl font-light">${averageRevenuePerTable}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-2">Table Performance</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={occupancyData}>
            <XAxis dataKey="name" tick={{ fill: '#ffffff80', fontSize: 12 }} />
            <YAxis tick={{ fill: '#ffffff80', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} 
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="occupancy" name="Avg. Time (min)" fill="#3b82f6" />
            <Bar dataKey="turnover" name="Turnover (min)" fill="#10b981" />
            <Bar dataKey="revenue" name="Revenue ($10s)" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Time Distribution</h4>
        <div className="bg-white/5 rounded-md p-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Avg. Seating Time</p>
            <p className="text-xl">42 min</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Peak Hours</p>
            <p className="text-xl">19:00 - 21:00</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Avg. Wait Time</p>
            <p className="text-xl">8 min</p>
          </div>
        </div>
      </div>
    </div>
  );
};
