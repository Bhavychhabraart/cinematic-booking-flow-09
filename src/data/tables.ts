
export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'needs_service';
  shape: 'round' | 'square' | 'rectangle';
  positionX: number;
  positionY: number;
  venueId: string;
  waiter?: string;
  currentOrderId?: string;
  occupiedSince?: string;
  reservedFor?: string;
  reservationTime?: string;
}

export interface TableRequest {
  id: string;
  tableId: string;
  type: 'service' | 'order' | 'bill' | 'cleanup';
  status: 'pending' | 'in_progress' | 'completed';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Waiter {
  id: string;
  name: string;
  assignedTables: string[];
  status: 'active' | 'break' | 'off_duty';
}

// Sample data for tables
export const sampleTables: Table[] = [
  {
    id: '1',
    number: 1,
    capacity: 4,
    status: 'available',
    shape: 'square',
    positionX: 100,
    positionY: 100,
    venueId: '3', // Solstice venue
  },
  {
    id: '2',
    number: 2,
    capacity: 2,
    status: 'occupied',
    shape: 'round',
    positionX: 250,
    positionY: 100,
    venueId: '3',
    occupiedSince: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    waiter: 'John D.',
  },
  {
    id: '3',
    number: 3,
    capacity: 6,
    status: 'reserved',
    shape: 'rectangle',
    positionX: 400,
    positionY: 100,
    venueId: '3',
    reservedFor: 'Smith Party',
    reservationTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
  },
  {
    id: '4',
    number: 4,
    capacity: 4,
    status: 'needs_service',
    shape: 'square',
    positionX: 100,
    positionY: 250,
    venueId: '3',
    occupiedSince: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    waiter: 'Jane S.',
  },
  {
    id: '5',
    number: 5,
    capacity: 8,
    status: 'available',
    shape: 'rectangle',
    positionX: 250,
    positionY: 250,
    venueId: '3',
  },
  {
    id: '6',
    number: 6,
    capacity: 2,
    status: 'maintenance',
    shape: 'round',
    positionX: 400,
    positionY: 250,
    venueId: '3',
  },
  {
    id: '7',
    number: 7,
    capacity: 4,
    status: 'available',
    shape: 'square',
    positionX: 100,
    positionY: 400,
    venueId: '3',
  },
  {
    id: '8',
    number: 8,
    capacity: 4,
    status: 'occupied',
    shape: 'square',
    positionX: 250,
    positionY: 400,
    venueId: '3',
    occupiedSince: new Date(Date.now() - 60 * 60000).toISOString(), // 60 minutes ago
    waiter: 'Mike R.',
  },
  {
    id: '9',
    number: 9,
    capacity: 6,
    status: 'reserved',
    shape: 'rectangle',
    positionX: 400,
    positionY: 400,
    venueId: '3',
    reservedFor: 'Birthday Party',
    reservationTime: new Date(Date.now() + 120 * 60000).toISOString(), // 2 hours from now
  },
];

// Sample table requests
export const sampleTableRequests: TableRequest[] = [
  {
    id: '1',
    tableId: '2',
    type: 'order',
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    priority: 'medium',
  },
  {
    id: '2',
    tableId: '4',
    type: 'service',
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    priority: 'high',
    notes: 'Need extra napkins',
  },
  {
    id: '3',
    tableId: '8',
    type: 'bill',
    status: 'in_progress',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(), // 8 minutes ago
    priority: 'medium',
  },
];

// Sample waiters
export const waiters: Waiter[] = [
  {
    id: '1',
    name: 'John D.',
    assignedTables: ['2'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane S.',
    assignedTables: ['4'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike R.',
    assignedTables: ['8'],
    status: 'active',
  },
  {
    id: '4',
    name: 'Lisa M.',
    assignedTables: [],
    status: 'break',
  },
];

// Table analytics data
export interface TableAnalytics {
  tableId: string;
  averageOccupancyTime: number; // in minutes
  turnoverRate: number; // tables per hour
  totalRevenue: number;
  popularItems: {
    itemId: string;
    name: string;
    count: number;
  }[];
}

export const tableAnalytics: Record<string, TableAnalytics> = {
  '1': {
    tableId: '1',
    averageOccupancyTime: 45,
    turnoverRate: 1.2,
    totalRevenue: 345.75,
    popularItems: [
      { itemId: '1', name: 'Truffle Infused Filet Mignon', count: 12 },
      { itemId: '6', name: 'Wagyu Beef Sliders', count: 8 },
    ],
  },
  '2': {
    tableId: '2',
    averageOccupancyTime: 38,
    turnoverRate: 1.5,
    totalRevenue: 285.50,
    popularItems: [
      { itemId: '10', name: 'Signature Cocktail', count: 14 },
      { itemId: '5', name: 'Chocolate Lava Cake', count: 10 },
    ],
  },
  // More analytics for other tables...
};

// Functions to interact with tables
export const getTablesByVenue = (venueId: string): Table[] => {
  return sampleTables.filter(table => table.venueId === venueId);
};

export const getTableById = (tableId: string): Table | undefined => {
  return sampleTables.find(table => table.id === tableId);
};

export const getRequestsForTable = (tableId: string): TableRequest[] => {
  return sampleTableRequests.filter(request => request.tableId === tableId);
};

export const getWaiterForTable = (tableId: string): Waiter | undefined => {
  const table = getTableById(tableId);
  if (!table || !table.waiter) return undefined;
  
  return waiters.find(waiter => 
    waiter.name === table.waiter || waiter.assignedTables.includes(tableId)
  );
};

export const getTableAnalytics = (tableId: string): TableAnalytics | undefined => {
  return tableAnalytics[tableId];
};

export const updateTableStatus = (
  tableId: string, 
  status: Table['status'],
  additionalInfo?: Partial<Table>
): Table => {
  const tableIndex = sampleTables.findIndex(t => t.id === tableId);
  if (tableIndex === -1) throw new Error(`Table with id ${tableId} not found`);
  
  const updatedTable = {
    ...sampleTables[tableIndex],
    status,
    ...additionalInfo,
  };
  
  sampleTables[tableIndex] = updatedTable;
  return updatedTable;
};

export const createTableRequest = (
  tableId: string,
  type: TableRequest['type'],
  notes?: string,
  priority: TableRequest['priority'] = 'medium'
): TableRequest => {
  const newRequest: TableRequest = {
    id: `${sampleTableRequests.length + 1}`,
    tableId,
    type,
    status: 'pending',
    timestamp: new Date().toISOString(),
    priority,
    notes,
  };
  
  sampleTableRequests.push(newRequest);
  return newRequest;
};

export const updateRequestStatus = (
  requestId: string,
  status: TableRequest['status']
): TableRequest | undefined => {
  const requestIndex = sampleTableRequests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return undefined;
  
  sampleTableRequests[requestIndex].status = status;
  return sampleTableRequests[requestIndex];
};

export const assignWaiterToTable = (
  waiterId: string,
  tableId: string
): { table: Table, waiter: Waiter } | undefined => {
  const waiterIndex = waiters.findIndex(w => w.id === waiterId);
  if (waiterIndex === -1) return undefined;
  
  const tableIndex = sampleTables.findIndex(t => t.id === tableId);
  if (tableIndex === -1) return undefined;
  
  // Update waiter's assigned tables
  if (!waiters[waiterIndex].assignedTables.includes(tableId)) {
    waiters[waiterIndex].assignedTables.push(tableId);
  }
  
  // Update table with waiter name
  sampleTables[tableIndex].waiter = waiters[waiterIndex].name;
  
  return {
    table: sampleTables[tableIndex],
    waiter: waiters[waiterIndex],
  };
};
