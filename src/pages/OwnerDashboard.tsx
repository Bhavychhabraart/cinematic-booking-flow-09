
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Mock data
  const recentBookings = [
    { id: 1, name: 'John Doe', guests: 4, date: 'May 12, 2025', time: '19:30', status: 'confirmed' },
    { id: 2, name: 'Sarah Johnson', guests: 2, date: 'May 12, 2025', time: '20:00', status: 'pending' },
    { id: 3, name: 'Michael Brown', guests: 6, date: 'May 13, 2025', time: '18:30', status: 'confirmed' },
    { id: 4, name: 'Emma Wilson', guests: 3, date: 'May 14, 2025', time: '19:00', status: 'confirmed' },
  ];
  
  const inventoryItems = [
    { id: 1, name: 'VIP Tables', available: true },
    { id: 2, name: 'Outdoor Seating', available: true },
    { id: 3, name: 'Private Dining Room', available: false },
    { id: 4, name: 'Bar Seating', available: true },
  ];
  
  const stats = [
    { label: 'Total Bookings', value: '143' },
    { label: 'Occupancy Rate', value: '78%' },
    { label: 'Avg. Party Size', value: '3.5' },
    { label: 'Revenue', value: '$12,450' }
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-3xl font-medium tracking-wider">Venue Dashboard</h1>
          </div>
          <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-dark">
            Settings
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-6 border border-white/10 bg-white/5"
            >
              <p className="text-white/60 text-sm tracking-wider mb-2">{stat.label}</p>
              <h3 className="text-3xl font-light">{stat.value}</h3>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mb-8">
          <div className="flex border-b border-white/10 mb-6">
            <button 
              onClick={() => setActiveTab('bookings')} 
              className={`py-3 px-6 text-sm tracking-wider ${
                activeTab === 'bookings' ? 'border-b-2 border-gold text-gold' : 'text-white/60'
              }`}
            >
              Bookings
            </button>
            <button 
              onClick={() => setActiveTab('inventory')} 
              className={`py-3 px-6 text-sm tracking-wider ${
                activeTab === 'inventory' ? 'border-b-2 border-gold text-gold' : 'text-white/60'
              }`}
            >
              Inventory
            </button>
          </div>
          
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto"
            >
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="py-4 px-4 font-medium text-sm tracking-wider text-white/60">Name</th>
                    <th className="py-4 px-4 font-medium text-sm tracking-wider text-white/60">Guests</th>
                    <th className="py-4 px-4 font-medium text-sm tracking-wider text-white/60">Date</th>
                    <th className="py-4 px-4 font-medium text-sm tracking-wider text-white/60">Time</th>
                    <th className="py-4 px-4 font-medium text-sm tracking-wider text-white/60">Status</th>
                    <th className="py-4 px-4 font-medium text-sm tracking-wider text-white/60">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">{booking.name}</td>
                      <td className="py-4 px-4">{booking.guests}</td>
                      <td className="py-4 px-4">{booking.date}</td>
                      <td className="py-4 px-4">{booking.time}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-amber-900/30 text-amber-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-gold text-sm hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
          
          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {inventoryItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-4 border-b border-white/10"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-3 text-white/60">
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                    <Switch
                      checked={item.available}
                      className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/10 text-white/50 text-sm">
          <span>Last updated: May 11, 2025 at 12:45 PM</span>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
