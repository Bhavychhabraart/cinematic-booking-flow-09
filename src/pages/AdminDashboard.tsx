
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { venues } from '@/data/venues';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Users, BookOpen, Music, Calendar, Plus, MessageSquare, Bell } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  
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
                <button 
                  onClick={() => setActiveTab("dashboard")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "dashboard" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("venues")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "venues" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Venues
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("bookings")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "bookings" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Bookings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("influencers")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "influencers" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Influencer Requests
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("events")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "events" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("djs")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "djs" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Book DJs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("guestlists")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "guestlists" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Guest Lists
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("messaging")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "messaging" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Messaging
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("addons")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "addons" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Edit Add-ons
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("analytics")} 
                  className={`block w-full text-left py-2 px-4 transition-all ${activeTab === "analytics" ? "text-white border-l-2 border-gold" : "text-white/60 hover:text-white hover:border-l-2 hover:border-gold/50"}`}
                >
                  Analytics
                </button>
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
          <h1 className="text-xl font-medium">{getTitleFromTab(activeTab)}</h1>
        </header>
        
        <main className="p-6 sm:p-10">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "venues" && <VenuesContent />}
          {activeTab === "bookings" && <BookingsContent />}
          {activeTab === "influencers" && <InfluencerRequestsContent />}
          {activeTab === "events" && <EventsContent />}
          {activeTab === "djs" && <DJBookingContent />}
          {activeTab === "guestlists" && <GuestListContent />}
          {activeTab === "messaging" && <MessagingContent />}
          {activeTab === "addons" && <AddonsContent />}
          {activeTab === "analytics" && <AnalyticsContent />}
        </main>
      </div>
    </div>
  );
};

// Helper function to get title from active tab
const getTitleFromTab = (tab) => {
  const titles = {
    dashboard: "Dashboard Overview",
    venues: "Venues Management",
    bookings: "Venue Bookings",
    influencers: "Influencer Collaboration Requests",
    events: "Event Management",
    djs: "DJ Booking",
    guestlists: "Guest Lists",
    messaging: "Messaging Center",
    addons: "Add-ons Management",
    analytics: "Analytics & KPIs"
  };
  return titles[tab] || "Dashboard";
};

// Dashboard content
const DashboardContent = () => (
  <>
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
                      onClick={() => {}}
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
                    <style>{`
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
  </>
);

// Venues content (reusing existing implementation)
const VenuesContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mb-10"
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium tracking-wide">Venues Management</h2>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={18} /> Add Venue
      </Button>
    </div>
    <div className="bg-white/5 overflow-hidden rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-white/60">Venue</TableHead>
            <TableHead className="text-white/60">Type</TableHead>
            <TableHead className="text-white/60">Location</TableHead>
            <TableHead className="text-white/60">Status</TableHead>
            <TableHead className="text-white/60">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue.id} className="border-white/5 hover:bg-white/10">
              <TableCell className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-black/40 flex items-center justify-center">
                  <img 
                    src={venue.logoUrl} 
                    alt={venue.name} 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                {venue.name}
              </TableCell>
              <TableCell className="capitalize">{venue.type}</TableCell>
              <TableCell>{venue.location}</TableCell>
              <TableCell>
                <span className="inline-block rounded-full px-2 py-1 text-xs bg-green-900/30 text-green-400">
                  Active
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-gold">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </motion.div>
);

// Bookings content
const BookingsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium tracking-wide">All Bookings</h2>
      <div className="flex gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          Export List
        </Button>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> New Booking
        </Button>
      </div>
    </div>
    
    <div className="bg-white/5 p-6 border border-white/10 rounded-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border border-white/10 rounded-md bg-white/5">
          <p className="text-sm text-white/50 mb-1">Today's Bookings</p>
          <p className="text-3xl font-light">24</p>
        </div>
        <div className="p-4 border border-white/10 rounded-md bg-white/5">
          <p className="text-sm text-white/50 mb-1">Pending Approval</p>
          <p className="text-3xl font-light">12</p>
        </div>
        <div className="p-4 border border-white/10 rounded-md bg-white/5">
          <p className="text-sm text-white/50 mb-1">This Week</p>
          <p className="text-3xl font-light">87</p>
        </div>
        <div className="p-4 border border-white/10 rounded-md bg-white/5">
          <p className="text-sm text-white/50 mb-1">Revenue (Month)</p>
          <p className="text-3xl font-light">$14,320</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white/5 overflow-hidden rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-white/60">ID</TableHead>
            <TableHead className="text-white/60">Guest</TableHead>
            <TableHead className="text-white/60">Venue</TableHead>
            <TableHead className="text-white/60">Date & Time</TableHead>
            <TableHead className="text-white/60">Status</TableHead>
            <TableHead className="text-white/60">Amount</TableHead>
            <TableHead className="text-white/60">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item} className="border-white/5 hover:bg-white/10">
              <TableCell>BK-{1000 + item}</TableCell>
              <TableCell>Guest Name {item}</TableCell>
              <TableCell>{venues[item % venues.length].name}</TableCell>
              <TableCell>May {10 + item}, 2025 • 8:00 PM</TableCell>
              <TableCell>
                <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                  item % 3 === 0 ? "bg-amber-900/30 text-amber-400" : 
                  item % 3 === 1 ? "bg-green-900/30 text-green-400" : 
                  "bg-purple-900/30 text-purple-400"
                }`}>
                  {item % 3 === 0 ? "Pending" : item % 3 === 1 ? "Confirmed" : "Completed"}
                </span>
              </TableCell>
              <TableCell>${120 + (item * 25)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-gold">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </motion.div>
);

// Influencer Requests Content
const InfluencerRequestsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium tracking-wide">Influencer Collaboration Requests</h2>
    </div>
    
    <div className="bg-white/5 p-6 border border-white/10 rounded-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-white/10 rounded-md bg-white/5">
          <p className="text-sm text-white/50 mb-1">New Requests</p>
          <p className="text-3xl font-light">14</p>
        </div>
        <div className="p-4 border border-white/10 rounded-md bg-white/5">
          <p className="text-sm text-white/50 mb-1">Active Collaborations</p>
          <p className="text-3xl font-light">8</p>
        </div>
        <div className="p-4 border border-white/10 rounded-md bg-white/5">
          <p className="text-sm text-white/50 mb-1">Reach (This Month)</p>
          <p className="text-3xl font-light">250K+</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white/5 overflow-hidden rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-white/60">Influencer</TableHead>
            <TableHead className="text-white/60">Platform</TableHead>
            <TableHead className="text-white/60">Followers</TableHead>
            <TableHead className="text-white/60">Venue Interest</TableHead>
            <TableHead className="text-white/60">Request Date</TableHead>
            <TableHead className="text-white/60">Status</TableHead>
            <TableHead className="text-white/60">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item} className="border-white/5 hover:bg-white/10">
              <TableCell className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs">{`ID${item}`}</span>
                </div>
                Influencer Name {item}
              </TableCell>
              <TableCell>{item % 3 === 0 ? "Instagram" : item % 3 === 1 ? "TikTok" : "YouTube"}</TableCell>
              <TableCell>{(item * 25 + 10)}K</TableCell>
              <TableCell>{venues[item % venues.length].name}</TableCell>
              <TableCell>May {5 + item}, 2025</TableCell>
              <TableCell>
                <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                  item % 3 === 0 ? "bg-amber-900/30 text-amber-400" : 
                  item % 3 === 1 ? "bg-green-900/30 text-green-400" : 
                  "bg-red-900/30 text-red-400"
                }`}>
                  {item % 3 === 0 ? "Pending" : item % 3 === 1 ? "Approved" : "Rejected"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-gold">View Profile</Button>
                  <Button variant="ghost" size="sm">Respond</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </motion.div>
);

// Events Management Content
const EventsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium tracking-wide">Events Management</h2>
      <Button className="flex items-center gap-2">
        <Plus size={18} /> Create New Event
      </Button>
    </div>
    
    <div className="mb-8">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6 bg-white/5">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="drafts">Event Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <div className="h-40 bg-black/20 flex items-center justify-center">
                  <Calendar size={40} className="text-white/30" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">Weekend Party Night {item}</h3>
                  <p className="text-sm text-white/60 mb-3">
                    {venues[item % venues.length].name} • May {15 + item}, 2025
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">150 RSVPs</span>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="past" className="mt-0">
          <p className="text-white/60">Past events will be shown here.</p>
        </TabsContent>
        <TabsContent value="drafts" className="mt-0">
          <p className="text-white/60">Event drafts will be shown here.</p>
        </TabsContent>
      </Tabs>
    </div>
  </motion.div>
);

// DJ Booking Content
const DJBookingContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium tracking-wide">Book DJs</h2>
      <Button className="flex items-center gap-2">
        <Plus size={18} /> New DJ Booking
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Upcoming DJ Bookings</p>
        <p className="text-3xl font-light">8</p>
      </div>
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Available DJs</p>
        <p className="text-3xl font-light">24</p>
      </div>
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Most Popular Genre</p>
        <p className="text-3xl font-light">House</p>
      </div>
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Average Booking Cost</p>
        <p className="text-3xl font-light">$1,200</p>
      </div>
    </div>
    
    <div className="bg-white/5 overflow-hidden rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-white/60">DJ Name</TableHead>
            <TableHead className="text-white/60">Genre</TableHead>
            <TableHead className="text-white/60">Rating</TableHead>
            <TableHead className="text-white/60">Fee Range</TableHead>
            <TableHead className="text-white/60">Availability</TableHead>
            <TableHead className="text-white/60">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item} className="border-white/5 hover:bg-white/10">
              <TableCell className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-black/40 flex items-center justify-center">
                  <Music size={16} />
                </div>
                DJ Name {item}
              </TableCell>
              <TableCell>
                {item % 4 === 0 ? "House" : item % 4 === 1 ? "Techno" : item % 4 === 2 ? "Hip Hop" : "EDM"}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="font-medium mr-1">{4 + (item % 2)}.{item % 10}</span>
                  <span className="text-gold text-xs">★★★★★</span>
                </div>
              </TableCell>
              <TableCell>${800 + (item * 100)} - ${1000 + (item * 200)}</TableCell>
              <TableCell>
                <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                  item % 3 === 0 ? "bg-green-900/30 text-green-400" : 
                  "bg-amber-900/30 text-amber-400"
                }`}>
                  {item % 3 === 0 ? "Available" : "Limited"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-gold">View Profile</Button>
                  <Button variant="ghost" size="sm">Book Now</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </motion.div>
);

// Guest List Content
const GuestListContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium tracking-wide">Guest Lists</h2>
      <Button className="flex items-center gap-2">
        <Plus size={18} /> New Guest List
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Active Guest Lists</p>
        <p className="text-3xl font-light">6</p>
      </div>
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Tonight's Sign-ups</p>
        <p className="text-3xl font-light">48</p>
      </div>
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">VIP Guests</p>
        <p className="text-3xl font-light">12</p>
      </div>
    </div>
    
    <div className="bg-white/5 overflow-hidden rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-white/60">Event</TableHead>
            <TableHead className="text-white/60">Venue</TableHead>
            <TableHead className="text-white/60">Date</TableHead>
            <TableHead className="text-white/60">Sign-ups</TableHead>
            <TableHead className="text-white/60">Status</TableHead>
            <TableHead className="text-white/60">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item} className="border-white/5 hover:bg-white/10">
              <TableCell>Weekend Party {item}</TableCell>
              <TableCell>{venues[item % venues.length].name}</TableCell>
              <TableCell>May {20 + item}, 2025</TableCell>
              <TableCell>{30 + (item * 12)}</TableCell>
              <TableCell>
                <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                  item % 3 === 0 ? "bg-green-900/30 text-green-400" : 
                  item % 3 === 1 ? "bg-amber-900/30 text-amber-400" :
                  "bg-blue-900/30 text-blue-400"
                }`}>
                  {item % 3 === 0 ? "Open" : item % 3 === 1 ? "Filling Fast" : "VIP Only"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-gold">View List</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </motion.div>
);

// Messaging Content
const MessagingContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium tracking-wide">Messaging Center</h2>
    </div>
    
    <div className="bg-white/5 p-6 border border-white/10 rounded-md mb-8">
      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="mb-6 bg-black/20">
          <TabsTrigger value="whatsapp">WhatsApp Broadcast</TabsTrigger>
          <TabsTrigger value="stories">Story Push</TabsTrigger>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
        </TabsList>
        <TabsContent value="whatsapp" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 border border-white/10 rounded-md bg-white/5">
              <p className="text-sm text-white/50 mb-1">Subscribers</p>
              <p className="text-3xl font-light">1,245</p>
            </div>
            <div className="p-4 border border-white/10 rounded-md bg-white/5">
              <p className="text-sm text-white/50 mb-1">Campaigns Sent</p>
              <p className="text-3xl font-light">18</p>
            </div>
            <div className="p-4 border border-white/10 rounded-md bg-white/5">
              <p className="text-sm text-white/50 mb-1">Average Open Rate</p>
              <p className="text-3xl font-light">76%</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Recent Broadcasts</h3>
              <Button>New Broadcast</Button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white/5 border border-white/10 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{item % 2 === 0 ? 'Weekend Special Promotion' : 'New Event Announcement'} #{item}</h4>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">
                      {item % 2 === 0 ? '2 days ago' : '1 week ago'}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    {item % 2 === 0 
                      ? 'Special weekend promotion for VIP guests.'
                      : 'Announcing our exciting new event next weekend!'}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Recipients: {800 + (item * 50)}</span>
                    <span>Opened: {70 + (item % 10)}%</span>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="stories" className="mt-0">
          <div className="space-y-4">
            <Button className="flex items-center gap-2">
              <Plus size={18} /> Create New Story Push
            </Button>
            <p className="text-white/60">Configure and schedule social media stories to promote your events.</p>
          </div>
        </TabsContent>
        <TabsContent value="email" className="mt-0">
          <div className="space-y-4">
            <Button className="flex items-center gap-2">
              <Plus size={18} /> Create Email Campaign
            </Button>
            <p className="text-white/60">Create and schedule email campaigns to your subscribers.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </motion.div>
);

// Add-ons Content
const AddonsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium tracking-wide">Add-ons Management</h2>
      <Button className="flex items-center gap-2">
        <Plus size={18} /> Create Add-on
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Sheet>
        <SheetTrigger asChild>
          <div className="p-6 border border-white/10 rounded-md bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <h3 className="font-bold mb-3">VIP Bottle Service</h3>
            <p className="text-sm text-white/60 mb-3">Premium bottle service with dedicated table and server.</p>
            <div className="flex justify-between items-center">
              <span className="text-gold font-medium">$350+</span>
              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent className="bg-black/90 text-white border-white/10">
          <h3 className="text-xl font-bold mb-4">Edit Add-on</h3>
          <p className="text-white/60">Edit form would appear here</p>
        </SheetContent>
      </Sheet>
      
      <Sheet>
        <SheetTrigger asChild>
          <div className="p-6 border border-white/10 rounded-md bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <h3 className="font-bold mb-3">Birthday Package</h3>
            <p className="text-sm text-white/60 mb-3">Special celebration package with cake and champagne.</p>
            <div className="flex justify-between items-center">
              <span className="text-gold font-medium">$200</span>
              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent className="bg-black/90 text-white border-white/10">
          <h3 className="text-xl font-bold mb-4">Edit Add-on</h3>
          <p className="text-white/60">Edit form would appear here</p>
        </SheetContent>
      </Sheet>
      
      <Sheet>
        <SheetTrigger asChild>
          <div className="p-6 border border-white/10 rounded-md bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <h3 className="font-bold mb-3">Private Area Reservation</h3>
            <p className="text-sm text-white/60 mb-3">Reserved private section for groups.</p>
            <div className="flex justify-between items-center">
              <span className="text-gold font-medium">$150+</span>
              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent className="bg-black/90 text-white border-white/10">
          <h3 className="text-xl font-bold mb-4">Edit Add-on</h3>
          <p className="text-white/60">Edit form would appear here</p>
        </SheetContent>
      </Sheet>
    </div>
  </motion.div>
);

// Analytics Content
const AnalyticsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="mb-6">
      <h2 className="text-xl font-medium tracking-wide">Analytics & KPIs</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Total Revenue</p>
        <p className="text-3xl font-light">$28,450</p>
        <p className="text-xs text-green-400 mt-2">↑ 12% from last month</p>
      </div>
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Bookings</p>
        <p className="text-3xl font-light">274</p>
        <p className="text-xs text-green-400 mt-2">↑ 8% from last month</p>
      </div>
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Avg. Spending</p>
        <p className="text-3xl font-light">$104</p>
        <p className="text-xs text-green-400 mt-2">↑ 5% from last month</p>
      </div>
      <div className="p-4 border border-white/10 rounded-md bg-white/5">
        <p className="text-sm text-white/50 mb-1">Total Customers</p>
        <p className="text-3xl font-light">1,872</p>
        <p className="text-xs text-green-400 mt-2">↑ 15% from last month</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white/5 p-6 border border-white/10 rounded-md">
        <h3 className="font-medium mb-4">Revenue by Venue</h3>
        <div className="h-64 flex items-end space-x-2">
          {venues.map((venue, idx) => (
            <div key={venue.id} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-white/10" style={{ height: `${30 + Math.random() * 60}%` }}>
                <div 
                  className="w-full bg-gold/70 h-full origin-bottom transform scale-y-0 animate-[grow_1s_ease-out_forwards]" 
                  style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                />
              </div>
              <span className="text-xs text-white/60 mt-2">{venue.name.slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white/5 p-6 border border-white/10 rounded-md">
        <h3 className="font-medium mb-4">Popular Booking Times</h3>
        <div className="h-64 flex items-end space-x-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
            <div key={day} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-white/10" 
                style={{ height: `${day === "Fri" || day === "Sat" ? 80 + Math.random() * 15 : 20 + Math.random() * 40}%` }}
              >
                <div 
                  className="w-full bg-gold/70 h-full origin-bottom transform scale-y-0 animate-[grow_1s_ease-out_forwards]" 
                  style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                />
              </div>
              <span className="text-xs text-white/60 mt-2">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default AdminDashboard;
