
import React, { useState } from 'react';
import { useTable } from '@/context/TableContext';
import { TableRequest } from '@/data/tables';
import { Button } from '@/components/ui/button';
import { Clock, Bell, MessageSquare } from 'lucide-react';

export const RequestList = () => {
  const { requests, tables, updateRequest } = useTable();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress'>('pending');
  
  // Filter and sort requests
  const filteredRequests = requests
    .filter(request => {
      if (filter === 'all') return true;
      return request.status === filter;
    })
    .sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Then by time (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatElapsedTime = (isoString: string) => {
    const startTime = new Date(isoString).getTime();
    const currentTime = new Date().getTime();
    const elapsedMinutes = Math.floor((currentTime - startTime) / (1000 * 60));
    
    return `${elapsedMinutes} min`;
  };
  
  const getTableNumber = (tableId: string) => {
    const table = tables.find(table => table.id === tableId);
    return table ? table.number : tableId;
  };
  
  const getRequestTypeIcon = (type: TableRequest['type']) => {
    switch (type) {
      case 'service': return <Bell size={16} className="text-amber-500" />;
      case 'order': return <MessageSquare size={16} className="text-blue-500" />;
      case 'bill': return <Clock size={16} className="text-green-500" />;
      case 'cleanup': return <Clock size={16} className="text-purple-500" />;
      default: return <Bell size={16} />;
    }
  };
  
  const getRequestTypeBadgeStyle = (type: TableRequest['type']) => {
    switch (type) {
      case 'service': return 'bg-amber-500/20 text-amber-500';
      case 'order': return 'bg-blue-500/20 text-blue-500';
      case 'bill': return 'bg-green-500/20 text-green-500';
      case 'cleanup': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const getPriorityStyle = (priority: TableRequest['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-500';
      case 'medium': return 'bg-amber-500/20 text-amber-500';
      case 'low': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Service Requests</h3>
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'in_progress' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </Button>
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
        </div>
      </div>
      
      {filteredRequests.length > 0 ? (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredRequests.map(request => (
            <div 
              key={request.id} 
              className={`p-3 rounded-md border-l-4 ${
                request.priority === 'high' ? 'border-red-500 bg-red-900/10' : 
                request.priority === 'medium' ? 'border-amber-500 bg-amber-900/10' : 
                'border-blue-500 bg-blue-900/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Table {getTableNumber(request.tableId)}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${getRequestTypeBadgeStyle(request.type)}`}>
                    {getRequestTypeIcon(request.type)}
                    <span className="ml-1 capitalize">{request.type}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${getPriorityStyle(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
                <span className="text-sm text-white/60 flex items-center">
                  <Clock size={14} className="mr-1" />
                  {formatElapsedTime(request.timestamp)} ago
                </span>
              </div>
              
              {request.notes && (
                <p className="text-sm text-white/80 mb-2">{request.notes}</p>
              )}
              
              <div className="flex justify-end space-x-2 mt-2">
                {request.status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateRequest(request.id, 'in_progress')}
                  >
                    Start
                  </Button>
                )}
                
                {request.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateRequest(request.id, 'completed')}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white/60">No {filter} requests at the moment</p>
        </div>
      )}
    </div>
  );
};
