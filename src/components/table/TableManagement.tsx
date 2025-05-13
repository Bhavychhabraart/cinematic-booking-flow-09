
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TableGrid } from './TableGrid';
import { TableDetails } from './TableDetails';
import { RequestList } from './RequestList';
import { TableAnalytics } from './TableAnalytics';
import { TableStaffing } from './TableStaffing';
import { useTable } from '@/context/TableContext';
import { Table } from '@/data/tables';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Table as TableIcon, Clock, User } from 'lucide-react';

export const TableManagement: React.FC = () => {
  const { tables, loading, error, setCurrentVenue, currentVenue, setSelectedTable } = useTable();

  // Set the current venue to the "Solstice" venue (id: 3)
  useEffect(() => {
    if (!currentVenue) {
      setCurrentVenue('3'); // Solstice venue ID
    }
  }, [currentVenue, setCurrentVenue]);

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white/70">Loading table management...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <h3 className="text-lg font-bold mb-4">Table Layout</h3>
          <TableGrid tables={tables} onTableClick={handleTableClick} />
        </div>
        
        <div className="w-full lg:w-1/3">
          <TableDetails />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RequestList />
        
        <Tabs defaultValue="analytics">
          <TabsList className="mb-4">
            <TabsTrigger value="analytics" className="flex items-center">
              <FileText size={16} className="mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="staffing" className="flex items-center">
              <User size={16} className="mr-2" />
              Staffing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <TableAnalytics />
          </TabsContent>
          
          <TabsContent value="staffing">
            <TableStaffing />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};
