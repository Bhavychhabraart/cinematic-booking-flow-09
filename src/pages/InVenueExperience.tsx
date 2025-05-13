import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      icon: <Wifi size={24} />,
      color: 'border-blue-500',
      action: () => setActiveDialog('wifi')
    },
    {
      id: 'waiter',
      label: 'Call Waiter',
      icon: <Bell size={24} />,
      color: 'border-amber-500',
      action: () => setActiveDialog('waiter')
    },
    {
      id: 'specials',
      label: 'View Specials',
      icon: <Star size={24} />,
      color: 'border-purple-500',
      action: () => setActiveDialog('specials')
    },
    {
      id: 'menu',
      label: 'Digital Menu',
      icon: <MenuIcon size={24} />,
      color: 'border-emerald-500',
      action: () => setActiveDialog('menu')
    },
    {
      id: 'loyalty',
      label: 'Loyalty Card',
      icon: <CreditCard size={24} />,
      color: 'border-[#914110]',
      action: () => setActiveDialog('loyalty')
    },
    {
      id: 'feedback',
      label: 'Leave Feedback',
      icon: <MessageSquare size={24} />,
      color: 'border-rose-500',
      action: () => setActiveDialog('feedback')
    },
    {
      id: 'coupons',
      label: 'Drink Coupons',
      icon: <QrCode size={24} />,
      color: 'border-indigo-500',
      action: () => navigate(`/coupons/${venueName}`)
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section with venue image and overlay */}
      <div className="h-[40vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src={venue.imageUrl} 
          alt={venue.name} 
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-16">
          <Button
            variant="ghost"
            size="sm"
            className="text-white self-start p-0"
            asChild
          >
            <Link to={`/venues/${venueName}`} onClick={() => provideFeedback('subtle')}>
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-2 font-light">Back</span>
            </Link>
          </Button>
          
          <div>
            <Badge className="bg-black/50 text-white border-none font-light tracking-wider mb-2">
              Digital Experience
            </Badge>
            <h1 className="text-3xl md:text-4xl font-light text-white">{venue.name}</h1>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-black p-8 md:p-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-light tracking-wider mb-8">Available Features</h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {featureOptions.map((option) => (
              <motion.div
                key={option.id}
                whileTap={{ scale: 0.97 }}
                whileHover={{ borderColor: option.color.replace('border-', 'rgb(') + ')' }}
                onClick={() => handleOptionClick(option)}
                className={`border ${option.color} border-opacity-40 p-8 flex flex-col items-center justify-center text-white cursor-pointer bg-black/40 backdrop-blur-sm h-[160px] transition-all duration-300 hover:bg-black/60`}
              >
                <div className="mb-4 opacity-80">
                  {option.icon}
                </div>
                <span className="text-sm font-light tracking-wide text-center">{option.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dialogs */}
      <AnimatePresence>
        {/* WiFi Dialog */}
        <Dialog open={activeDialog === 'wifi'} onOpenChange={() => activeDialog === 'wifi' ? handleCloseDialog() : null}>
          <DialogContent className="max-w-md bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-light"><Wifi className="h-5 w-5" /> Connect to WiFi</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {wifiConnected ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 border border-green-500/30 text-white/90 text-center"
                >
                  <p className="text-lg font-light mb-1">Successfully Connected</p>
                  <p className="text-sm font-light opacity-70">You're now connected to {venue.name} WiFi</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 border border-white/10">
                    <p className="font-light text-white/50 mb-1">Network Name</p>
                    <p className="text-lg">{venue.name.toUpperCase()}-GUEST</p>
                  </div>
                  
                  <div className="p-6 border border-white/10">
                    <p className="font-light text-white/50 mb-1">Password</p>
                    <p className="text-lg font-mono">welcome2{venue.name.toLowerCase()}</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-white/10 text-white hover:bg-white/20 border-0"
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
          <DialogContent className="max-w-md bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-light"><Bell className="h-5 w-5" /> Call Waiter</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {waiterCalled ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 border border-green-500/30 text-white/90 text-center"
                >
                  <p className="text-lg font-light mb-1">Waiter Called</p>
                  <p className="text-sm font-light opacity-70">A staff member will be with you shortly</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <p className="text-center font-light">Call a waiter to your table for assistance?</p>
                  <div className="flex justify-end gap-4">
                    <Button 
                      variant="outline"
                      className="border-white/10 hover:bg-white/5"
                      onClick={handleCloseDialog}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-white/10 hover:bg-white/20 border-0"
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
          <DialogContent className="max-w-xl bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-light"><Star className="h-5 w-5" /> Today's Specials</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="grid gap-4">
                <Card className="bg-black/40 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="font-light text-lg mb-2">Chef's Special</h3>
                    <p className="text-white/60 mb-3">Pan-seared salmon with lemon butter sauce, served with asparagus and roasted potatoes.</p>
                    <p className="font-medium">$28</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="font-light text-lg mb-2">Drink of the Day</h3>
                    <p className="text-white/60 mb-3">Blood Orange Sangria - with fresh citrus and cinnamon.</p>
                    <p className="font-medium">$12</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="font-light text-lg mb-2">Dessert Special</h3>
                    <p className="text-white/60 mb-3">Dark chocolate mousse with raspberry coulis and fresh berries.</p>
                    <p className="font-medium">$9</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Menu Dialog */}
        <Dialog open={activeDialog === 'menu'} onOpenChange={() => activeDialog === 'menu' ? handleCloseDialog() : null}>
          <DialogContent className="max-w-2xl bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-light"><MenuIcon className="h-5 w-5" /> Digital Menu</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <Tabs defaultValue="starters">
                <TabsList className="w-full justify-start mb-6 border-b border-white/10">
                  <TabsTrigger value="starters" className="font-light data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-burntOrange transition-all duration-200">Starters</TabsTrigger>
                  <TabsTrigger value="mains" className="font-light data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-burntOrange transition-all duration-200">Main Courses</TabsTrigger>
                  <TabsTrigger value="desserts" className="font-light data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-burntOrange transition-all duration-200">Desserts</TabsTrigger>
                  <TabsTrigger value="drinks" className="font-light data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-burntOrange transition-all duration-200">Drinks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="starters" className="space-y-4">
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-6">
                      <h3 className="font-light">House Salad</h3>
                      <p className="text-sm text-white/60 mb-2">Mixed greens, cherry tomatoes, cucumber with house dressing</p>
                      <p className="font-medium">$12</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-6">
                      <h3 className="font-light">Calamari</h3>
                      <p className="text-sm text-white/60 mb-2">Lightly fried with lemon aioli</p>
                      <p className="font-medium">$16</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="mains" className="space-y-4">
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-6">
                      <h3 className="font-light">Ribeye Steak</h3>
                      <p className="text-sm text-white/60 mb-2">12oz steak with garlic butter and seasonal vegetables</p>
                      <p className="font-medium">$38</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-6">
                      <h3 className="font-light">Mushroom Risotto</h3>
                      <p className="text-sm text-white/60 mb-2">Creamy arborio rice with wild mushrooms and parmesan</p>
                      <p className="font-medium">$24</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="desserts" className="space-y-4">
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-6">
                      <h3 className="font-light">Tiramisu</h3>
                      <p className="text-sm text-white/60 mb-2">Classic Italian dessert with espresso-soaked ladyfingers</p>
                      <p className="font-medium">$11</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="drinks" className="space-y-4">
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-6">
                      <h3 className="font-light">House Red Wine</h3>
                      <p className="text-sm text-white/60 mb-2">Cabernet Sauvignon, 6oz</p>
                      <p className="font-medium">$9</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-6">
                      <h3 className="font-light">Craft Cocktails</h3>
                      <p className="text-sm text-white/60 mb-2">Ask your server for our seasonal selection</p>
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
          <DialogContent className="max-w-md bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-light"><CreditCard className="h-5 w-5" /> Loyalty Card</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-6">
                <LoyaltyCard />
                
                <Button 
                  className="w-full bg-white/10 text-white hover:bg-white/20 border-0"
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
          <DialogContent className="max-w-md bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-light"><MessageSquare className="h-5 w-5" /> Leave Feedback</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {feedbackSubmitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 border border-green-500/30 text-white/90 text-center"
                >
                  <p className="text-lg font-light mb-1">Thank You!</p>
                  <p className="text-sm font-light opacity-70">Your feedback has been submitted</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <p className="text-center font-light">How was your experience at {venue.name}?</p>
                  
                  <div className="flex justify-center gap-8 py-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={handleSubmitFeedback}
                    >
                      <div className="text-5xl mb-2">😞</div>
                      <span className="text-sm font-light">Poor</span>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={handleSubmitFeedback}
                    >
                      <div className="text-5xl mb-2">😐</div>
                      <span className="text-sm font-light">Okay</span>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={handleSubmitFeedback}
                    >
                      <div className="text-5xl mb-2">😊</div>
                      <span className="text-sm font-light">Great</span>
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
