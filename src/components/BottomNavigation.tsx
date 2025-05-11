
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Star, Users, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, useNavigate } from 'react-router-dom';

type NavItem = {
  label: string;
  icon: React.ReactNode;
  id: string;
};

const BottomNavigation = ({ activeSection, setActiveSection }: { 
  activeSection: string;
  setActiveSection: (section: string) => void;
}) => {
  const { venueName } = useParams();
  const navigate = useNavigate();
  
  const navItems: NavItem[] = [
    {
      label: 'MENUS',
      icon: <Menu size={20} />,
      id: 'menus'
    },
    {
      label: 'EXPERIENCES',
      icon: <Star size={20} />,
      id: 'experiences'
    },
    {
      label: 'COLLABS',
      icon: <Users size={20} />,
      id: 'collabs'
    },
    {
      label: 'BOOKINGS',
      icon: <Book size={20} />,
      id: 'bookings'
    }
  ];

  const handleNav = (id: string) => {
    if (id === 'bookings') {
      navigate(`/book/${venueName}`);
    } else {
      setActiveSection(id);
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 z-50"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
              activeSection === item.id
                ? "text-gold"
                : "text-white/70 hover:text-white"
            )}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
