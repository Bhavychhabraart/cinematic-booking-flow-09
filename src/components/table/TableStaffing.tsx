
import React from 'react';
import { useTable } from '@/context/TableContext';
import { Table } from '@/data/tables';
import { Button } from '@/components/ui/button';
import { User, Clock } from 'lucide-react';

export const TableStaffing = () => {
  const { waiters, tables, assignWaiter, selectedTable } = useTable();
  
  const getTablesByWaiter = (waiterId: string) => {
    const waiter = waiters.find(w => w.id === waiterId);
    if (!waiter) return [];
    
    return tables.filter(table => waiter.assignedTables.includes(table.id));
  };
  
  const getAvailableTables = () => {
    return tables.filter(table => 
      !table.waiter && 
      (table.status === 'available' || table.status === 'reserved')
    );
  };
  
  const getWaiterStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500';
      case 'break': return 'bg-amber-500/20 text-amber-500';
      case 'off_duty': return 'bg-gray-500/20 text-gray-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">Staff Management</h3>
      
      <div className="space-y-4">
        {waiters.map(waiter => {
          const assignedTables = getTablesByWaiter(waiter.id);
          
          return (
            <div key={waiter.id} className="border border-white/10 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-2">
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium">{waiter.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${getWaiterStatusColor(waiter.status)}`}>
                      {waiter.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="text-white/60">Tables:</span> {assignedTables.length}
                  </p>
                  <p className="text-xs text-white/60">
                    <Clock size={12} className="inline mr-1" />
                    Since 18:00
                  </p>
                </div>
              </div>
              
              {assignedTables.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-white/70 mb-1">Assigned tables:</p>
                  <div className="flex flex-wrap gap-2">
                    {assignedTables.map(table => (
                      <span 
                        key={table.id} 
                        className={`
                          inline-block px-2 py-1 text-xs rounded 
                          ${table.status === 'needs_service' ? 'bg-red-500/20 text-red-500' : 
                            table.status === 'occupied' ? 'bg-blue-500/20 text-blue-500' : 
                            'bg-white/10 text-white/80'}
                        `}
                      >
                        Table {table.number}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedTable && !selectedTable.waiter && waiter.status === 'active' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => assignWaiter(waiter.id, selectedTable.id)}
                >
                  Assign to Table {selectedTable.number}
                </Button>
              )}
              
              {!selectedTable && waiter.status === 'active' && (
                <div className="mt-2">
                  <p className="text-xs text-white/60 mb-1">Select a table to assign this waiter</p>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="border border-white/10 rounded-md p-3">
          <h4 className="font-medium mb-2">Available Tables</h4>
          <div className="flex flex-wrap gap-2">
            {getAvailableTables().length > 0 ? (
              getAvailableTables().map(table => (
                <span key={table.id} className="inline-block px-2 py-1 text-xs rounded bg-white/10">
                  Table {table.number}
                </span>
              ))
            ) : (
              <p className="text-sm text-white/60">No tables awaiting assignment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
