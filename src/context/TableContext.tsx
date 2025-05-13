
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Table, TableRequest, Waiter, getTablesByVenue, updateTableStatus, createTableRequest, updateRequestStatus, assignWaiterToTable, sampleTableRequests, waiters } from '@/data/tables';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

interface TableContextType {
  tables: Table[];
  requests: TableRequest[];
  waiters: Waiter[];
  loading: boolean;
  error: string | null;
  currentVenue: string | null;
  setCurrentVenue: (venueId: string) => void;
  getTableById: (tableId: string) => Table | undefined;
  getRequestsForTable: (tableId: string) => TableRequest[];
  updateTable: (tableId: string, status: Table['status'], additionalInfo?: Partial<Table>) => void;
  createRequest: (tableId: string, type: TableRequest['type'], notes?: string, priority?: TableRequest['priority']) => void;
  updateRequest: (requestId: string, status: TableRequest['status']) => void;
  assignWaiter: (waiterId: string, tableId: string) => void;
  selectedTable: Table | null;
  setSelectedTable: (table: Table | null) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [requests, setRequests] = useState<TableRequest[]>(sampleTableRequests);
  const [currentWaiters, setCurrentWaiters] = useState<Waiter[]>(waiters);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVenue, setCurrentVenue] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  
  const { toast: useToastHook } = useToast();

  useEffect(() => {
    if (currentVenue) {
      try {
        const venueTables = getTablesByVenue(currentVenue);
        setTables(venueTables);
        setError(null);
      } catch (err) {
        setError('Failed to load tables');
        console.error('Error loading tables:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [currentVenue]);

  const getTableById = (tableId: string): Table | undefined => {
    return tables.find(table => table.id === tableId);
  };

  const getRequestsForTable = (tableId: string): TableRequest[] => {
    return requests.filter(request => request.tableId === tableId);
  };

  const updateTable = (tableId: string, status: Table['status'], additionalInfo?: Partial<Table>) => {
    try {
      const updatedTable = updateTableStatus(tableId, status, additionalInfo);
      setTables(prevTables => 
        prevTables.map(table => table.id === tableId ? updatedTable : table)
      );
      
      toast(`Table ${updatedTable.number} updated`, {
        description: `Status changed to ${status.replace('_', ' ')}`,
      });

      // If table was selected, update selected table
      if (selectedTable?.id === tableId) {
        setSelectedTable(updatedTable);
      }
    } catch (err) {
      setError('Failed to update table');
      useToastHook({
        title: "Error",
        description: "Failed to update table status",
        variant: "destructive",
      });
    }
  };

  const createRequest = (
    tableId: string, 
    type: TableRequest['type'], 
    notes?: string, 
    priority: TableRequest['priority'] = 'medium'
  ) => {
    try {
      const newRequest = createTableRequest(tableId, type, notes, priority);
      setRequests(prevRequests => [...prevRequests, newRequest]);
      
      const table = getTableById(tableId);
      
      toast(`New ${type} request`, {
        description: `Table ${table?.number || tableId}: ${notes || type} request`,
      });

      // If it's a service request, update table status
      if (type === 'service') {
        updateTable(tableId, 'needs_service');
      }
    } catch (err) {
      setError('Failed to create request');
      useToastHook({
        title: "Error",
        description: "Failed to create table request",
        variant: "destructive",
      });
    }
  };

  const updateRequest = (requestId: string, status: TableRequest['status']) => {
    try {
      const updatedRequest = updateRequestStatus(requestId, status);
      if (updatedRequest) {
        setRequests(prevRequests => 
          prevRequests.map(request => request.id === requestId ? updatedRequest : request)
        );

        toast(`Request ${status}`, {
          description: `${updatedRequest.type} request has been ${status}`,
        });
        
        // If request is completed and table needs service, update table status
        if (status === 'completed' && updatedRequest.type === 'service') {
          const table = tables.find(t => t.id === updatedRequest.tableId);
          if (table && table.status === 'needs_service') {
            updateTable(table.id, 'occupied');
          }
        }
      }
    } catch (err) {
      setError('Failed to update request');
      useToastHook({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const assignWaiter = (waiterId: string, tableId: string) => {
    try {
      const result = assignWaiterToTable(waiterId, tableId);
      if (result) {
        setTables(prevTables => 
          prevTables.map(table => table.id === tableId ? result.table : table)
        );
        
        setCurrentWaiters(prevWaiters => 
          prevWaiters.map(waiter => waiter.id === waiterId ? result.waiter : waiter)
        );

        toast(`Waiter assigned`, {
          description: `${result.waiter.name} assigned to Table ${result.table.number}`,
        });
      }
    } catch (err) {
      setError('Failed to assign waiter');
      useToastHook({
        title: "Error",
        description: "Failed to assign waiter to table",
        variant: "destructive",
      });
    }
  };

  return (
    <TableContext.Provider
      value={{
        tables,
        requests,
        waiters: currentWaiters,
        loading,
        error,
        currentVenue,
        setCurrentVenue,
        getTableById,
        getRequestsForTable,
        updateTable,
        createRequest,
        updateRequest,
        assignWaiter,
        selectedTable,
        setSelectedTable
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
