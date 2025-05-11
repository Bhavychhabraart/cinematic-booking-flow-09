
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { venues } from '@/data/venues';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-black/40 backdrop-blur-xl w-64 transform transition-transform duration-300 ease-in-out z-30 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-widest text-gold mb-1">VenueFusion</h2>
            <p className="text-white/50 text-sm">Admin Dashboard</p>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <a href="#" className="block py-2 px-4 text-white border-l-2 border-gold">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50 transition-all">
                  Venues
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50 transition-all">
                  Users
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50 transition-all">
                  Analytics
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50 transition-all">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-white/10">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10"
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-black/20 backdrop-blur-md sticky top-0 z-20 px-6 py-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="mr-4"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <h1 className="text-xl font-medium">Dashboard Overview</h1>
        </header>
        
        <main className="p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <div className="bg-white/5 p-6 border border-white/10">
              <h3 className="text-sm text-white/60 mb-1 tracking-wider">Total Venues</h3>
              <p className="text-4xl font-light">{venues.length}</p>
            </div>
            <div className="bg-white/5 p-6 border border-white/10">
              <h3 className="text-sm text-white/60 mb-1 tracking-wider">Total Bookings</h3>
              <p className="text-4xl font-light">274</p>
            </div>
            <div className="bg-white/5 p-6 border border-white/10">
              <h3 className="text-sm text-white/60 mb-1 tracking-wider">Total Revenue</h3>
              <p className="text-4xl font-light">$28,450</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-xl font-medium mb-6 tracking-wide">Venues Overview</h2>
            <div className="bg-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-white/10">
                      <th className="py-4 px-6 font-medium text-sm tracking-wider text-white/60">Venue</th>
                      <th className="py-4 px-6 font-medium text-sm tracking-wider text-white/60">Type</th>
                      <th className="py-4 px-6 font-medium text-sm tracking-wider text-white/60">Location</th>
                      <th className="py-4 px-6 font-medium text-sm tracking-wider text-white/60">Status</th>
                      <th className="py-4 px-6 font-medium text-sm tracking-wider text-white/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venues.map((venue) => (
                      <tr key={venue.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-6 flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-black/40 flex items-center justify-center">
                            <img 
                              src={venue.logoUrl} 
                              alt={venue.name} 
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                          {venue.name}
                        </td>
                        <td className="py-4 px-6 capitalize">{venue.type}</td>
                        <td className="py-4 px-6">{venue.location}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block rounded-full px-2 py-1 text-xs bg-green-900/30 text-green-400">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button 
                            onClick={() => navigate(`/venues/${venue.slug}`)}
                            className="text-gold text-sm hover:underline mr-4"
                          >
                            View
                          </button>
                          <button className="text-white/60 text-sm hover:underline">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div>
              <h2 className="text-xl font-medium mb-6 tracking-wide">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center bg-white/5 p-4 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mr-4">
                      <span className="text-gold">
                        {Math.floor(Math.random() * 24)}h
                      </span>
                    </div>
                    <div>
                      <p>New booking at <span className="text-gold">{venues[Math.floor(Math.random() * venues.length)].name}</span></p>
                      <p className="text-sm text-white/50">May {10 + item}, 2025</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-medium mb-6 tracking-wide">Venue Occupancy</h2>
              <div className="bg-white/5 p-6 border border-white/10 h-64 flex flex-col justify-between">
                <div className="flex items-end h-full pb-6">
                  {venues.map((venue, idx) => (
                    <div key={venue.id} className="flex-1 mx-1 flex flex-col items-center">
                      <div className="w-full bg-white/10 rounded-sm" style={{ height: `${30 + Math.random() * 50}%` }}>
                        <div className="w-full bg-gold/80 h-full rounded-sm origin-bottom transform scale-y-0 animate-[grow_1s_ease-out_forwards]" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                          <style jsx>{`
                            @keyframes grow {
                              from { transform: scaleY(0); }
                              to { transform: scaleY(1); }
                            }
                          `}</style>
                        </div>
                      </div>
                      <span className="text-xs text-white/60 mt-2">{venue.name.slice(0, 3)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-white/60">Average occupancy: <span className="text-white">78%</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
