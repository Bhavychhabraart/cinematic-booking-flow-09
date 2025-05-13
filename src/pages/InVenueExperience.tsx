import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Wifi, Bell, Star, Menu as MenuIcon, CreditCard, MessageSquare, QrCode } from 'lucide-react';
import { getVenueBySlug } from '@/data/venues';
import { provideFeedback, vibrationPatterns, sounds } from '@/utils/feedback';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import LoyaltyCard from '@/components/LoyaltyCard';

type FeatureOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
};

const InVenueExperience: React.FC = () => {
  const { venueName } = useParams();
  const navigate = useNavigate();
  const venue = getVenueBySlug(venueName || '');
  
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [wifiConnected, setWifiConnected] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  if (!venue) {
    navigate('/');
    return null;
  }

  const handleOptionClick = (option: FeatureOption) => {
    // Provide haptic feedback
    provideFeedback('buttonPress', sounds.tap);
    
    // Execute the action
    option.action();
  };

  const handleCloseDialog = () => {
    provideFeedback('subtle');
    setActiveDialog(null);
  };

  const handleWifiConnect = () => {
    provideFeedback('success', sounds.success);
    setWifiConnected(true);
    setTimeout(() => setActiveDialog(null), 2000);
  };

  const handleCallWaiter = () => {
    provideFeedback('confirm', sounds.notification);
    setWaiterCalled(true);
    setTimeout(() => {
      setWaiterCalled(false);
      setActiveDialog(null);
    }, 3000);
  };

  const handleSubmitFeedback = () => {
    provideFeedback('celebratory', sounds.victory);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setActiveDialog(null);
    }, 3000);
  };

  const featureOptions: FeatureOption[] = [
    {
      id: 'wifi',
      label: 'Connect to WiFi',
      icon: <Wifi size={36} />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setActiveDialog('wifi')
    },
    {
      id: 'waiter',
      label: 'Call Waiter',
      icon: <Bell size={36} />,
      color: 'bg-amber-500 hover:bg-amber-600',
      action: () => setActiveDialog('waiter')
    },
    {
      id: 'specials',
      label: 'View Specials',
      icon: <Star size={36} />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => setActiveDialog('specials')
    },
    {
      id: 'menu',
      label: 'Digital Menu',
      icon: <MenuIcon size={36} />,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      action: () => setActiveDialog('menu')
    },
    {
      id: 'loyalty',
      label: 'Loyalty Card',
      icon: <CreditCard size={36} />,
      color: 'bg-[#914110] hover:bg-[#a14d1d]',
      action: () => setActiveDialog('loyalty')
    },
    {
      id: 'feedback',
      label: 'Leave Feedback',
      icon: <MessageSquare size={36} />,
      color: 'bg-rose-500 hover:bg-rose-600',
      action: () => setActiveDialog('feedback')
    },
    {
      id: 'coupons',
      label: 'Drink Coupons',
      icon: <QrCode size={36} />,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => navigate(`/coupons/${venueName}`)
    }
  ];

  return (
    <div className="min-h-screen bg-black/90 pb-24 pt-6">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-white"
            asChild
          >
            <Link to={`/venues/${venueName}`} onClick={() => provideFeedback('subtle')}>
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Venue</span>
            </Link>
          </Button>
          
          <h1 className="text-2xl font-bold text-white">
            {venue.name} <span className="text-sm font-normal opacity-70">Experience</span>
          </h1>
        </div>
      </div>

      {/* Remote-like UI */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-6"
        >
          {featureOptions.map((option) => (
            <motion.div
              key={option.id}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleOptionClick(option)}
              className={`${option.color} rounded-2xl p-6 shadow-lg cursor-pointer h-40 flex flex-col items-center justify-center text-white`}
            >
              <div className="mb-3">
                {option.icon}
              </div>
              <span className="text-xl font-medium">{option.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dialogs */}
      <AnimatePresence>
        {/* WiFi Dialog */}
        <Dialog open={activeDialog === 'wifi'} onOpenChange={() => activeDialog === 'wifi' ? handleCloseDialog() : null}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Wifi className="h-5 w-5" /> Connect to WiFi</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {wifiConnected ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-100 text-green-800 rounded-md text-center"
                >
                  <p className="text-lg font-medium">Successfully Connected!</p>
                  <p className="text-sm">You're now connected to {venue.name} WiFi</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-100 rounded-md">
                    <p className="font-medium">Network Name:</p>
                    <p className="text-lg">{venue.name.toUpperCase()}-GUEST</p>
                  </div>
                  
                  <div className="p-4 bg-slate-100 rounded-md">
                    <p className="font-medium">Password:</p>
                    <p className="text-lg font-mono">welcome2{venue.name.toLowerCase()}</p>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleWifiConnect}
                  >
                    Connect
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Call Waiter Dialog */}
        <Dialog open={activeDialog === 'waiter'} onOpenChange={() => activeDialog === 'waiter' ? handleCloseDialog() : null}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Call Waiter</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {waiterCalled ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-100 text-green-800 rounded-md text-center"
                >
                  <p className="text-lg font-medium">Waiter Called!</p>
                  <p className="text-sm">A staff member will be with you shortly</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <p>Call a waiter to your table for assistance?</p>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="secondary"
                      onClick={handleCloseDialog}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCallWaiter}
                    >
                      Call Waiter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Specials Dialog */}
        <Dialog open={activeDialog === 'specials'} onOpenChange={() => activeDialog === 'specials' ? handleCloseDialog() : null}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Today's Specials</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">Chef's Special</h3>
                    <p className="text-muted-foreground mb-2">Pan-seared salmon with lemon butter sauce, served with asparagus and roasted potatoes.</p>
                    <p className="font-semibold">$28</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">Drink of the Day</h3>
                    <p className="text-muted-foreground mb-2">Blood Orange Sangria - with fresh citrus and cinnamon.</p>
                    <p className="font-semibold">$12</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">Dessert Special</h3>
                    <p className="text-muted-foreground mb-2">Dark chocolate mousse with raspberry coulis and fresh berries.</p>
                    <p className="font-semibold">$9</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Menu Dialog */}
        <Dialog open={activeDialog === 'menu'} onOpenChange={() => activeDialog === 'menu' ? handleCloseDialog() : null}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><MenuIcon className="h-5 w-5" /> Digital Menu</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <Tabs defaultValue="starters">
                <TabsList className="w-full justify-start mb-4">
                  <TabsTrigger value="starters">Starters</TabsTrigger>
                  <TabsTrigger value="mains">Main Courses</TabsTrigger>
                  <TabsTrigger value="desserts">Desserts</TabsTrigger>
                  <TabsTrigger value="drinks">Drinks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="starters" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">House Salad</h3>
                      <p className="text-sm text-muted-foreground mb-1">Mixed greens, cherry tomatoes, cucumber with house dressing</p>
                      <p className="font-medium">$12</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">Calamari</h3>
                      <p className="text-sm text-muted-foreground mb-1">Lightly fried with lemon aioli</p>
                      <p className="font-medium">$16</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="mains" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">Ribeye Steak</h3>
                      <p className="text-sm text-muted-foreground mb-1">12oz steak with garlic butter and seasonal vegetables</p>
                      <p className="font-medium">$38</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">Mushroom Risotto</h3>
                      <p className="text-sm text-muted-foreground mb-1">Creamy arborio rice with wild mushrooms and parmesan</p>
                      <p className="font-medium">$24</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="desserts" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">Tiramisu</h3>
                      <p className="text-sm text-muted-foreground mb-1">Classic Italian dessert with espresso-soaked ladyfingers</p>
                      <p className="font-medium">$11</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="drinks" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">House Red Wine</h3>
                      <p className="text-sm text-muted-foreground mb-1">Cabernet Sauvignon, 6oz</p>
                      <p className="font-medium">$9</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">Craft Cocktails</h3>
                      <p className="text-sm text-muted-foreground mb-1">Ask your server for our seasonal selection</p>
                      <p className="font-medium">$14</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        {/* Loyalty Dialog */}
        <Dialog open={activeDialog === 'loyalty'} onOpenChange={() => activeDialog === 'loyalty' ? handleCloseDialog() : null}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Loyalty Card</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-6">
                <LoyaltyCard />
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    provideFeedback('subtle');
                    navigate(`/loyalty/${venueName}`);
                  }}
                >
                  View Full Loyalty Dashboard
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={activeDialog === 'feedback'} onOpenChange={() => activeDialog === 'feedback' ? handleCloseDialog() : null}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Leave Feedback</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {feedbackSubmitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-100 text-green-800 rounded-md text-center"
                >
                  <p className="text-lg font-medium">Thank You!</p>
                  <p className="text-sm">Your feedback has been submitted</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center mb-2">How was your experience at {venue.name}?</p>
                  
                  <div className="flex justify-center gap-8 py-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={handleSubmitFeedback}
                    >
                      <div className="text-4xl mb-2">😞</div>
                      <span>Poor</span>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={handleSubmitFeedback}
                    >
                      <div className="text-4xl mb-2">😐</div>
                      <span>Okay</span>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={handleSubmitFeedback}
                    >
                      <div className="text-4xl mb-2">😊</div>
                      <span>Great</span>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </div>
  );
};

export default InVenueExperience;
