
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center container-center"
      >
        <h1 className="text-6xl font-bold mb-4 text-gold">404</h1>
        <p className="text-xl text-white/80 mb-8 font-light tracking-wide">
          This page doesn't exist
        </p>
        <Button 
          onClick={() => navigate('/')} 
          className="booking-button"
        >
          Return Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
