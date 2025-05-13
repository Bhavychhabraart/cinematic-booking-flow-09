
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyalty } from '@/context/LoyaltyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/components/ui/sonner";
import { Progress } from '@/components/ui/progress';
import LoyaltyCard from './LoyaltyCard';
import { provideFeedback } from '@/utils/feedback';
import { Trophy, Star, Medal, Badge, Gift } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const LoyaltyDashboard: React.FC = () => {
  const { 
    loyalty, 
    currentTier, 
    nextTier, 
    pointsToNextTier, 
    progressToNextTier,
    redeemReward
  } = useLoyalty();
  
  const [activeTab, setActiveTab] = useState('overview');

  const handleRedeemReward = (rewardId: string, pointsCost: number, title: string) => {
    if (loyalty.currentPoints >= pointsCost) {
      redeemReward(rewardId);
      toast.success(`You've redeemed: ${title}`);
      provideFeedback('confirm');
    } else {
      toast.error(`Not enough points. You need ${pointsCost - loyalty.currentPoints} more points.`);
      provideFeedback('error');
    }
  };

  // Get the appropriate icon for an achievement
  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="h-5 w-5" />;
      case 'star':
        return <Star className="h-5 w-5" />;
      case 'medal':
        return <Medal className="h-5 w-5" />;
      case 'badge':
        return <Badge className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  return (
    <div className="container-center">
      <h2 className="text-center text-xl font-medium mb-6">Your Loyalty Journey</h2>
      
      {/* Loyalty Card */}
      <div className="mb-8">
        <LoyaltyCard />
      </div>
      
      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Status</CardTitle>
              <CardDescription>
                Your current tier and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Current tier: <span className="font-medium">{currentTier.name}</span></span>
                  {nextTier && (
                    <span>Next tier: <span className="font-medium">{nextTier.name}</span></span>
                  )}
                </div>
                
                <Progress value={progressToNextTier} className="h-2" />
                
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{loyalty.currentPoints} points</span>
                  {nextTier && (
                    <span>{nextTier.minPoints} points needed</span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Total visits</p>
                  <p className="font-medium text-lg">
                    {loyalty.venueStats.reduce((acc, venue) => acc + venue.visits, 0)}
                  </p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Consecutive</p>
                  <p className="font-medium text-lg">
                    {loyalty.consecutiveBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Venues Stats */}
          {loyalty.venueStats.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Venue Activity</CardTitle>
                <CardDescription>
                  Your activity across our venues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loyalty.venueStats.map((venue, index) => (
                  <div key={venue.venueId} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{venue.venueName}</p>
                      <div className="flex text-sm text-muted-foreground gap-x-4">
                        <span>{venue.visits} {venue.visits === 1 ? 'visit' : 'visits'}</span>
                        <span>{formatCurrency(venue.totalSpent)} spent</span>
                      </div>
                    </div>
                    {venue.lastVisit && (
                      <span className="text-xs text-muted-foreground">
                        Last: {venue.lastVisit.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Available Rewards</CardTitle>
              <CardDescription>
                Redeem your points for these rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loyalty.availableRewards.length > 0 ? (
                loyalty.availableRewards.map(reward => (
                  <div 
                    key={reward.id} 
                    className="flex justify-between items-center border border-border rounded-lg p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-[#914110]/10 p-2 rounded-full">
                        <Gift className="h-5 w-5 text-[#914110]" />
                      </div>
                      <div>
                        <p className="font-medium">{reward.title}</p>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                        {reward.expiryDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Available until {reward.expiryDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={loyalty.currentPoints >= reward.pointsCost ? "default" : "outline"}
                      onClick={() => handleRedeemReward(reward.id, reward.pointsCost, reward.title)}
                      disabled={loyalty.currentPoints < reward.pointsCost}
                    >
                      {reward.pointsCost} pts
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No rewards available at the moment
                </p>
              )}
            </CardContent>
          </Card>
          
          {loyalty.redeemedRewards.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Redeemed Rewards</CardTitle>
                <CardDescription>
                  These are ready to use
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loyalty.redeemedRewards.map(reward => (
                  <div 
                    key={reward.id} 
                    className="bg-accent/30 border border-border rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{reward.title}</p>
                        <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
                      </div>
                      <div className="text-xs font-medium bg-[#914110]/10 text-[#914110] px-2 py-0.5 rounded-full">
                        Redeemed
                      </div>
                    </div>
                    
                    {reward.code && (
                      <div className="mt-1 bg-background p-2 rounded flex items-center justify-center font-mono text-sm">
                        {reward.code}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Collect achievements to earn bonus points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loyalty.achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    achievement.achieved ? 'bg-accent/30 border-accent' : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    achievement.achieved ? 'bg-[#914110]/20 text-[#914110]' : 'bg-muted text-muted-foreground'
                  }`}>
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{achievement.title}</p>
                      <span className="text-xs font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        +{achievement.points} pts
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.achieved && achievement.date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Achieved on {achievement.date.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyDashboard;
