
import React from 'react';
import { useTable } from '@/context/TableContext';
import { Button } from '@/components/ui/button';
import { X, User, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TableDetails = () => {
  const { 
    selectedTable, 
    setSelectedTable, 
    getRequestsForTable, 
    updateTable,
    createRequest 
  } = useTable();
  
  if (!selectedTable) return null;
  
  const requests = getRequestsForTable(selectedTable.id);
  const pendingRequests = requests.filter(req => req.status === 'pending');

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatElapsedTime = (isoString?: string) => {
    if (!isoString) return '';
    const startTime = new Date(isoString).getTime();
    const currentTime = new Date().getTime();
    const elapsedMinutes = Math.floor((currentTime - startTime) / (1000 * 60));
    
    return `${elapsedMinutes} min`;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-500';
      case 'occupied': return 'bg-blue-500/20 text-blue-500';
      case 'reserved': return 'bg-purple-500/20 text-purple-500';
      case 'maintenance': return 'bg-gray-500/20 text-gray-500';
      case 'needs_service': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center">
            Table {selectedTable.number}
            <Badge className={`ml-2 ${getStatusBadgeColor(selectedTable.status)}`}>
              {selectedTable.status.replace('_', ' ')}
            </Badge>
          </h3>
          <p className="text-white/70">Capacity: {selectedTable.capacity} people</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedTable(null)}>
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-4">
        {selectedTable.status === 'occupied' && (
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center">
              <Clock size={18} className="mr-2 text-white/70" />
              <span>Occupied for: {formatElapsedTime(selectedTable.occupiedSince)}</span>
            </div>
            <div>
              {selectedTable.waiter && (
                <div className="flex items-center">
                  <User size={18} className="mr-2 text-white/70" />
                  <span>Waiter: {selectedTable.waiter}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {selectedTable.status === 'reserved' && (
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <p>Reserved for: {selectedTable.reservedFor}</p>
              <p className="text-sm text-white/70">Time: {formatTime(selectedTable.reservationTime)}</p>
            </div>
          </div>
        )}

        {pendingRequests.length > 0 && (
          <div className="border-b border-white/10 pb-2">
            <h4 className="font-medium mb-2 flex items-center">
              <AlertCircle size={16} className="mr-2 text-amber-500" /> 
              Pending Requests
            </h4>
            <ul className="space-y-2">
              {pendingRequests.map(request => (
                <li 
                  key={request.id} 
                  className={`
                    flex justify-between items-center p-2 rounded-md
                    ${request.priority === 'high' ? 'bg-red-500/10 border-l-2 border-red-500' : 
                      request.priority === 'medium' ? 'bg-amber-500/10 border-l-2 border-amber-500' : 
                      'bg-white/5 border-l-2 border-white/30'}
                  `}
                >
                  <span className="capitalize">{request.type} Request</span>
                  <span className="text-xs text-white/70">{formatTime(request.timestamp)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <h4 className="font-medium">Table Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {selectedTable.status === 'available' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => updateTable(selectedTable.id, 'occupied', { occupiedSince: new Date().toISOString() })}
                >
                  Seat Guests
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => updateTable(selectedTable.id, 'reserved')}
                >
                  Mark Reserved
                </Button>
              </>
            )}
            
            {selectedTable.status === 'occupied' && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => createRequest(selectedTable.id, 'service', 'Customer needs assistance', 'high')}
                >
                  Request Service
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => createRequest(selectedTable.id, 'bill')}
                >
                  Request Bill
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => updateTable(selectedTable.id, 'available')}
                >
                  Clear Table
                </Button>
              </>
            )}
            
            {selectedTable.status === 'reserved' && (
              <Button 
                variant="outline"
                onClick={() => updateTable(selectedTable.id, 'available')}
                className="col-span-2"
              >
                Cancel Reservation
              </Button>
            )}
            
            {selectedTable.status === 'needs_service' && (
              <Button 
                variant="outline"
                onClick={() => updateTable(selectedTable.id, 'occupied')}
                className="col-span-2"
              >
                Mark Serviced
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className={`${['available', 'reserved'].includes(selectedTable.status) ? 'col-span-2' : ''}`}
              onClick={() => updateTable(selectedTable.id, 'maintenance')}
            >
              Set Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
