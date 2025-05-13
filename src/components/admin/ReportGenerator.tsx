
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, FileDown, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 5300 },
  { name: 'Mar', value: 6800 },
  { name: 'Apr', value: 7200 },
  { name: 'May', value: 8900 },
  { name: 'Jun', value: 7400 },
];

const ATTENDANCE_DATA = [
  { name: 'Jan', value: 340 },
  { name: 'Feb', value: 380 },
  { name: 'Mar', value: 450 },
  { name: 'Apr', value: 520 },
  { name: 'May', value: 610 },
  { name: 'Jun', value: 580 },
];

const ReportGenerator = () => {
  const [reportType, setReportType] = useState('revenue');
  const [timeframe, setTimeframe] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const chartConfig = {
    revenue: { label: "Revenue", color: "#F59E0B" },
    attendance: { label: "Attendance", color: "#3B82F6" }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <div className="bg-white/5 p-6 border border-white/10 rounded-md flex-1">
          <h3 className="text-xl font-medium mb-6">Generate Custom Reports</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-white/60 mb-2">Report Type</label>
              <Select defaultValue={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 border-white/10">
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="attendance">Attendance Report</SelectItem>
                  <SelectItem value="bookings">Bookings Analysis</SelectItem>
                  <SelectItem value="popular">Most Popular Venues</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Time Frame</label>
              <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 border-white/10">
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
              <FileText size={18} />
            </Button>
            <Button variant="outline" disabled={isGenerating} className="flex items-center gap-2">
              Export PDF
              <FileDown size={18} />
            </Button>
          </div>
        </div>
        
        <div className="bg-white/5 p-6 border border-white/10 rounded-md flex-1">
          <h3 className="text-xl font-medium mb-4">Quick Insights</h3>
          
          <Tabs defaultValue="revenue">
            <TabsList className="bg-black/20">
              <TabsTrigger value="revenue" className="data-[state=active]:bg-gold/20">Revenue</TabsTrigger>
              <TabsTrigger value="attendance" className="data-[state=active]:bg-gold/20">Attendance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="pt-4">
              <ChartContainer 
                config={chartConfig}
                className="h-60"
              >
                <RechartsBarChart data={REVENUE_DATA}>
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-revenue)" />
                </RechartsBarChart>
              </ChartContainer>
              <p className="text-sm text-white/60 mt-4">
                Revenue has increased by 18% compared to previous period.
              </p>
            </TabsContent>
            
            <TabsContent value="attendance" className="pt-4">
              <ChartContainer 
                config={chartConfig}
                className="h-60"
              >
                <RechartsBarChart data={ATTENDANCE_DATA}>
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-attendance)" />
                </RechartsBarChart>
              </ChartContainer>
              <p className="text-sm text-white/60 mt-4">
                Attendance has grown by 15% over the last 6 months.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="bg-white/5 p-6 border border-white/10 rounded-md">
        <h3 className="text-xl font-medium mb-6">Generated Reports</h3>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item} 
              className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/10 rounded-md flex items-center justify-center">
                  <BarChart size={20} />
                </div>
                <div>
                  <h4 className="font-medium">
                    {item === 1 ? "Monthly Revenue Report" : 
                     item === 2 ? "Weekly Attendance Analysis" : 
                     "Quarterly Booking Trends"}
                  </h4>
                  <p className="text-sm text-white/60">
                    Generated on May {10 + item}, 2025
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gold">View</Button>
                <Button variant="ghost" size="sm">Download</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
