
import React from 'react';
import { Table } from '@/data/tables';
import { useTable } from '@/context/TableContext';
import { motion } from 'framer-motion';

interface TableGridProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
  const { selectedTable } = useTable();

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 border-green-500/40 hover:bg-green-500/30';
      case 'occupied': return 'bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30';
      case 'reserved': return 'bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30';
      case 'maintenance': return 'bg-gray-500/20 border-gray-500/40 hover:bg-gray-500/30';
      case 'needs_service': return 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30 animate-pulse';
      default: return 'bg-gray-500/20 border-gray-500/40';
    }
  };

  const getTableSize = (capacity: number, shape: Table['shape']) => {
    // Base size on capacity
    const baseSize = 16 + (capacity * 6); // pixels
    
    if (shape === 'round') {
      return {
        width: baseSize,
        height: baseSize,
        borderRadius: '50%'
      };
    } else if (shape === 'rectangle') {
      return {
        width: baseSize * 1.5,
        height: baseSize * 0.8,
        borderRadius: '4px'
      };
    } else {
      // square
      return {
        width: baseSize,
        height: baseSize,
        borderRadius: '4px'
      };
    }
  };

  const tableAppearAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 100 }
  };

  return (
    <div className="relative w-full h-[600px] bg-black/20 border border-white/10 rounded-lg overflow-hidden">
      {tables.map((table) => {
        const { width, height, borderRadius } = getTableSize(table.capacity, table.shape);
        const isSelected = selectedTable?.id === table.id;
        
        return (
          <motion.div
            key={table.id}
            className={`absolute flex items-center justify-center cursor-pointer border ${getStatusColor(table.status)} ${
              isSelected ? 'ring-2 ring-gold' : ''
            }`}
            style={{
              left: `${table.positionX}px`,
              top: `${table.positionY}px`,
              width: `${width}px`,
              height: `${height}px`,
              borderRadius,
            }}
            onClick={() => onTableClick(table)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...tableAppearAnimation}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold">{table.number}</span>
              <span className="text-xs">{table.capacity}p</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
