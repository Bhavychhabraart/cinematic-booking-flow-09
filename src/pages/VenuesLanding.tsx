
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  LayoutDashboard, 
  Star, 
  Calendar, 
  Users, 
  Table as TableIcon,
  Layers,
  ChevronRight,
  MousePointerClick
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Feature animation variants
const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Pricing table component
const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  recommended = false, 
  buttonText = "Get Started" 
}) => {
  return (
    <Card className={`relative overflow-hidden ${recommended ? 'border-gold ring-2 ring-gold/20' : ''}`}>
      {recommended && (
        <div className="absolute top-0 right-0 bg-gold text-white px-3 py-1 text-xs uppercase tracking-wider font-bold">
          Recommended
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-sm text-muted-foreground ml-1">/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={18} className="text-gold shrink-0 mr-2 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={recommended ? "default" : "outline"}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.3 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.div
      ref={ref}
      variants={featureVariants}
      initial="hidden"
      animate={controls}
      transition={{ delay }}
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 h-full"
    >
      <div className="rounded-full bg-gold/10 w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="text-gold" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </motion.div>
  );
};

// Testimonial component
const Testimonial = ({ quote, author, role, company }) => (
  <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-lg h-full flex flex-col">
    <div className="mb-4">
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={16} className="text-gold fill-gold" />
        ))}
      </div>
      <p className="italic text-white/80 mb-6">"{quote}"</p>
    </div>
    <div className="mt-auto">
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-white/60">{role}, {company}</p>
    </div>
  </div>
);

const VenuesLanding = () => {
  // Heading animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  return (
    <div className="bg-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-black to-transparent opacity-90"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-gold/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={headingVariants}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Run Your Venue Like <span className="text-gold">an Orchestra</span>
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                All-in-one venue management platform that harmonizes operations, 
                elevates customer experience, and increases your revenue.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  Get Onboarded <ArrowRight className="ml-2" size={18} />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Book a Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-12 w-full"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-gold/10 rounded-xl blur-sm"></div>
                <div className="relative bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
                  <img 
                    src="https://via.placeholder.com/1200x600/111111/333333" 
                    alt="VenueFusion Dashboard" 
                    className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="outline" className="bg-black/40 backdrop-blur-sm border-white/20">
                      <MousePointerClick className="mr-2" size={18} />
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Venue Management</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Every feature designed to work together in perfect harmony, 
                just like a world-class orchestra.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={TableIcon}
              title="Table Management"
              description="Real-time table status, interactive floor plan, and order tracking to maximize seating efficiency and minimize wait times."
              delay={0.1}
            />
            <FeatureCard 
              icon={Calendar}
              title="Booking System"
              description="Streamlined reservations with automatic confirmation, customizable booking rules, and capacity management."
              delay={0.2}
            />
            <FeatureCard 
              icon={Star}
              title="Loyalty Program"
              description="Incentivize return visits with customizable rewards, points system, and personalized customer experiences."
              delay={0.3}
            />
            <FeatureCard 
              icon={LayoutDashboard}
              title="Analytics Dashboard"
              description="Comprehensive data visualization for sales, customer behavior, and operational efficiency to make informed business decisions."
              delay={0.4}
            />
            <FeatureCard 
              icon={Users}
              title="Staff Management"
              description="Schedule staff efficiently, track performance, and optimize service with our intuitive staff management tools."
              delay={0.5}
            />
            <FeatureCard 
              icon={Layers}
              title="Inventory Control"
              description="Track stock levels, receive automatic alerts, and analyze usage patterns to reduce waste and control costs."
              delay={0.6}
            />
          </div>
        </div>
      </section>
      
      {/* Orchestra Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-40 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Like an Orchestra,<br />Every Part in Perfect Harmony</h2>
              <p className="text-white/70 mb-6">
                Just as a conductor leads an orchestra to create beautiful music, 
                VenueFusion brings all aspects of your venue together to create 
                an exceptional customer experience while maximizing efficiency and profits.
              </p>
              <ul className="space-y-4">
                {[
                  "Seamless communication between front of house and kitchen",
                  "Integrated booking, ordering, and loyalty systems",
                  "Real-time data flow for informed decision making",
                  "Automated processes that reduce staff workload",
                  "Synchronized operations across all venue functions"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <ChevronRight size={18} className="text-gold mr-2 mt-1 shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-gold/5 rounded-xl blur-sm"></div>
                <div className="relative bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden p-1">
                  <img 
                    src="https://via.placeholder.com/600x500/111111/333333" 
                    alt="VenueFusion Orchestration" 
                    className="w-full h-auto rounded"
                  />
                </div>
                
                <div className="absolute -right-4 -bottom-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded p-4 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">12 Tables Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gold"></div>
                    <span className="text-sm font-medium">96% On-time Service</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Join hundreds of venue owners who have transformed their operations with VenueFusion.
              </p>
            </motion.div>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem className="md:basis-1/2">
                <Testimonial 
                  quote="VenueFusion transformed how we manage our restaurant. We've increased table turnover by 24% and our customers love the seamless booking experience."
                  author="Sarah Johnson"
                  role="Owner"
                  company="Bistro Moderne"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2">
                <Testimonial 
                  quote="The analytics alone paid for the software in the first month. We discovered key insights about our peak times and adjusted staffing accordingly."
                  author="Michael Chen"
                  role="General Manager"
                  company="Fusion Lounge"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2">
                <Testimonial 
                  quote="Our staff onboarding time decreased by 65% with VenueFusion's intuitive interface. Even our least tech-savvy employees picked it up quickly."
                  author="Alex Rodriguez"
                  role="Operations Director"
                  company="The Grand Hall"
                />
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="static translate-y-0 mr-2" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Choose the plan that fits your venue's needs. All plans include access to our core features.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <PricingCard 
                title="Starter"
                price="99"
                description="Perfect for small venues just getting started"
                features={[
                  "Up to 15 tables",
                  "Table management",
                  "Basic booking system",
                  "Standard analytics",
                  "Email support",
                  "1 admin user"
                ]}
                buttonText="Get Started"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <PricingCard 
                title="Professional"
                price="249"
                description="Ideal for established venues looking to grow"
                features={[
                  "Up to 50 tables",
                  "Advanced table management",
                  "Full booking system with customization",
                  "Detailed analytics and reporting",
                  "Loyalty program",
                  "Priority support",
                  "5 admin users"
                ]}
                recommended={true}
                buttonText="Most Popular"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <PricingCard 
                title="Enterprise"
                price="499"
                description="For large venues with complex needs"
                features={[
                  "Unlimited tables",
                  "Premium table management",
                  "Advanced booking with API access",
                  "Custom analytics and AI insights",
                  "Advanced loyalty and marketing tools",
                  "24/7 dedicated support",
                  "Unlimited users",
                  "Custom integrations"
                ]}
                buttonText="Contact Sales"
              />
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-white/60 mb-6">
              Need something more customized? We offer bespoke solutions for multi-location venues.
            </p>
            <Button variant="outline" size="lg">
              Contact Our Sales Team
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black to-black/80">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Venue Operations?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join hundreds of successful venues already using VenueFusion to streamline operations, 
              increase revenue, and deliver exceptional customer experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 animate-pulse-gold">
                Get Onboarded Now <ArrowRight className="ml-2" size={18} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Schedule a Demo
              </Button>
            </div>
            <p className="mt-6 text-white/50 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VenuesLanding;
