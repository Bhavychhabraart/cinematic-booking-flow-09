
import React from 'react';
import { TableProvider } from '@/context/TableContext';
import { TableManagement } from '@/components/table/TableManagement';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TableManagementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin-dashboard')}
            className="mr-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Table Management System</h1>
        </div>
        
        <TableProvider>
          <TableManagement />
        </TableProvider>
      </div>
    </div>
  );
};

export default TableManagementPage;
