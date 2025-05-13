
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CreditCard, Badge, Calendar, CheckCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  const premiumPlans = [
    {
      id: 'basic',
      name: 'Basic Premium',
      price: '$99/month',
      features: [
        '100 guest list entries per month',
        'Basic analytics',
        'Email notifications',
        'Standard customer support'
      ],
      recommended: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$199/month',
      features: [
        'Unlimited guest list entries',
        'Advanced analytics and reports',
        'SMS notifications',
        'Priority customer support',
        'VIP guest tagging'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$399/month',
      features: [
        'All Professional features',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Multiple venue management'
      ],
      recommended: false
    }
  ];

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} premium plan purchased successfully!`, {
        description: "Your premium guest list features are now active."
      });
    }, 1500);
  };

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
            <button 
              onClick={() => setActiveTab('premium')} 
              className={`py-3 px-6 text-sm tracking-wider flex items-center gap-2 ${
                activeTab === 'premium' ? 'border-b-2 border-gold text-gold' : 'text-white/60'
              }`}
            >
              <Badge size={16} />
              Premium Guest List
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

          {activeTab === 'premium' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 border border-white/10 p-6 rounded-md">
                <div className="flex items-center mb-4">
                  <Badge className="text-gold mr-2" size={20} />
                  <h2 className="text-xl font-medium">Premium Guest List Access</h2>
                </div>
                
                <p className="text-white/70 mb-6">
                  Upgrade your guest list management with premium features. Enhance your venue's guest experience, 
                  track VIPs, and gain valuable insights with advanced analytics.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                    {premiumPlans.map((plan) => (
                      <div 
                        key={plan.id}
                        className={`relative border ${selectedPlan === plan.id ? 'border-gold' : 'border-white/10'} 
                        rounded-md p-4 hover:bg-white/5 transition-colors cursor-pointer ${plan.recommended ? 'bg-white/5' : ''}`}
                      >
                        {plan.recommended && (
                          <span className="absolute -top-3 right-4 bg-gold text-black text-xs px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                        <div className="flex items-start">
                          <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                          <div className="ml-3">
                            <Label htmlFor={plan.id} className="font-medium text-lg block mb-1">
                              {plan.name}
                            </Label>
                            <p className="text-gold text-xl mb-3">{plan.price}</p>
                            <ul className="space-y-2">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-white/80">
                                  <CheckCircle size={16} className="text-green-400 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    size="lg"
                    className="bg-gold text-black hover:bg-gold/90 px-8 py-6 text-lg flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Purchase Premium Plan
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-white/50 text-sm mt-4">
                  All plans include a 14-day money-back guarantee
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-md">
                <h3 className="text-lg font-medium mb-4">Premium Guest List Benefits</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="bg-gold/20 p-2 rounded-md mr-3">
                      <Users size={20} className="text-gold" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">VIP Management</h4>
                      <p className="text-white/70 text-sm">
                        Tag and track your VIP guests, provide special accommodations, and ensure they receive premium service.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gold/20 p-2 rounded-md mr-3">
                      <Calendar size={20} className="text-gold" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Advanced Booking Features</h4>
                      <p className="text-white/70 text-sm">
                        Allow guests to pre-register for events, set capacity limits, and send automated reminders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
