import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, useAnimationFrame } from 'motion/react';
import { Camera, Heart, Gift, Users, Star, Phone, Mail, MapPin, Menu, X, Sparkles, Award } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Enhanced animation variants
const textReveal = {
  hidden: { opacity: 0, y: 100, rotateX: 90 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.215, 0.610, 0.355, 1.000] 
    }
  }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -100, scale: 0.8 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.215, 0.610, 0.355, 1.000] 
    }
  }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 100, scale: 0.8 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.215, 0.610, 0.355, 1.000] 
    }
  }
};

const floatingAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const scaleOnHover = {
  scale: 1.05,
  transition: { duration: 0.3 }
};

const magneticHover = {
  scale: 1.1,
  rotateZ: 5,
  transition: { duration: 0.3 }
};

// Particle component for background effects
const Particle = ({ delay = 0 }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-pink-400 rounded-full opacity-30"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -100],
        x: [0, Math.random() * 100 - 50]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeOut"
      }}
    />
  );
};

// Counter animation component
const CounterAnimation = ({ target, label, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const increment = target / (duration * 60);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return (
    <div ref={ref} className="text-center">
      <motion.div 
        className="text-3xl font-bold text-primary mb-2"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {count}+
      </motion.div>
      <motion.div 
        className="text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {label}
      </motion.div>
    </div>
  );
};

// Enhanced magnetic button component
const MagneticButton = ({ children, className, onClick, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.2);
      y.set((e.clientY - centerY) * 0.2);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const heroImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop"
  ];

  const services = [
    {
      icon: Heart,
      title: "Wedding Photography",
      description: "Capture your special day with romantic, timeless photography that tells your unique love story.",
      price: "Starting at $2,500"
    },
    {
      icon: Gift,
      title: "Birthday Celebrations",
      description: "Make every birthday memorable with vibrant, joyful photography that captures all the fun moments.",
      price: "Starting at $800"
    },
    {
      icon: Users,
      title: "Corporate Events",
      description: "Professional event photography for conferences, parties, and corporate celebrations.",
      price: "Starting at $1,200"
    }
  ];

  const portfolioImages = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1546587348-d12660c30c50?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop"
  ];

  const testimonials = [
    {
      name: "Sarah & Michael",
      event: "Wedding",
      text: "Absolutely stunning photos! Every moment was captured perfectly. We couldn't be happier with our wedding album.",
      rating: 5
    },
    {
      name: "Jennifer Martinez",
      event: "Birthday Party",
      text: "The birthday photos exceeded our expectations. Professional, creative, and so much fun to work with!",
      rating: 5
    },
    {
      name: "Corporate Solutions Inc.",
      event: "Company Event",
      text: "Outstanding service for our annual conference. High-quality photos delivered promptly and professionally.",
      rating: 5
    }
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(loadingTimer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // Loading screen
  if (isLoading) {
    return (
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-700 flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="text-white font-bold text-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            LensCapture
          </motion.div>
          <motion.div
            className="text-white/80 text-sm mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading beautiful moments...
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Particle key={i} delay={i * 0.2} />
        ))}
      </div>

      {/* Custom cursor */}
      <motion.div
        className="fixed w-4 h-4 bg-pink-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-border"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Camera className="h-8 w-8 text-primary mr-2" />
              </motion.div>
              <span className="font-bold text-xl">LensCapture</span>
            </motion.div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['home', 'services', 'portfolio', 'about', 'contact'].map((item, index) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="hover:text-primary transition-colors relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="md:hidden">
              <MagneticButton>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </MagneticButton>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-background border-b border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home', 'services', 'portfolio', 'about', 'contact'].map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block px-3 py-2 hover:text-primary transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        <motion.div style={{ y: parallaxY, scale: scaleProgress }}>
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <ImageWithFallback
                src={image}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              variants={textReveal}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl mb-6 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                {['Capturing', 'Life\'s'].map((word, index) => (
                  <motion.span
                    key={word}
                    className="inline-block mr-4"
                    initial={{ opacity: 0, y: 100, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 1.5 + index * 0.3,
                      ease: [0.215, 0.610, 0.355, 1.000]
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 2.1 }}
                >
                  Beautiful Moments
                </motion.span>
              </motion.h1>
            </motion.div>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-200"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5 }}
            >
              Professional photography for weddings, birthdays, and special events
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8 }}
            >
              <MagneticButton
                className="inline-block"
                onClick={() => scrollToSection('contact')}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">Book Your Session</span>
                </Button>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-4"
              whileInView={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-8 w-8 text-pink-500 mr-2" />
              <h2 className="text-4xl">Our Services</h2>
              <Sparkles className="h-8 w-8 text-pink-500 ml-2" />
            </motion.div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We specialize in capturing the essence of your most important moments
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotateY: 45 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.8 }}
                    >
                      <service.icon className="h-16 w-16 text-primary mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-2xl mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <motion.p 
                      className="text-primary font-semibold"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.price}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl mb-4"
              whileInView={{ 
                backgroundImage: [
                  'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  'linear-gradient(45deg, #f59e0b, #ef4444)',
                  'linear-gradient(45deg, #10b981, #3b82f6)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Our Portfolio
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A glimpse into our recent work and the memories we've helped create
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden rounded-lg cursor-pointer group"
                initial={{ opacity: 0, scale: 0.8, rotateZ: index % 2 === 0 ? -10 : 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }}
                viewport={{ once: true }}
                onClick={() => setSelectedImage(image)}
                whileHover={{ 
                  scale: 1.05, 
                  rotateZ: index % 2 === 0 ? 2 : -2,
                  transition: { duration: 0.3 }
                }}
              >
                <ImageWithFallback
                  src={image}
                  alt={`Portfolio image ${index + 1}`}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8"
                  whileHover={{ backdropFilter: 'blur(2px)' }}
                >
                  <motion.div
                    className="text-white font-semibold"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    View Full Size
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="absolute top-4 right-4 bg-pink-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0, rotate: -180 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Camera className="h-4 w-4" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Lightbox */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative max-w-4xl max-h-full"
            initial={{ scale: 0.3, rotateY: 90 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.3, rotateY: -90 }}
            transition={{ duration: 0.5, ease: [0.215, 0.610, 0.355, 1.000] }}
          >
            <ImageWithFallback
              src={selectedImage}
              alt="Portfolio image"
              className="w-full h-full object-contain rounded-lg"
            />
            <MagneticButton
              className="absolute top-4 right-4"
              onClick={() => setSelectedImage(null)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <X className="h-6 w-6" />
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-4"
              whileInView={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Award className="h-8 w-8 text-yellow-500 mr-2" />
              <h2 className="text-4xl">What Our Clients Say</h2>
              <Award className="h-8 w-8 text-yellow-500 ml-2" />
            </motion.div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from our happy clients
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotateX: 45 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <CardContent className="p-8 relative z-10">
                    <motion.div 
                      className="flex mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <motion.p 
                      className="text-muted-foreground mb-6 italic"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      "{testimonial.text}"
                    </motion.p>
                    <div>
                      <motion.p 
                        className="font-semibold"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        {testimonial.name}
                      </motion.p>
                      <motion.p 
                        className="text-sm text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        {testimonial.event}
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={slideInFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl mb-6"
                whileInView={{ 
                  color: ['#000', '#e11d48', '#7c3aed', '#000']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                About LensCapture
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                With over 8 years of experience in professional photography, we specialize in capturing 
                the authentic emotions and beautiful moments that make your events truly special.
              </motion.p>
              <motion.p 
                className="text-lg text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Our approach combines artistic vision with technical expertise to deliver stunning 
                photographs that you'll treasure for a lifetime. We believe every moment tells a story, 
                and we're here to help you tell yours.
              </motion.p>
              <div className="grid grid-cols-2 gap-8">
                <CounterAnimation target={500} label="Events Captured" />
                <CounterAnimation target={8} label="Years Experience" />
              </div>
            </motion.div>
            
            <motion.div
              variants={slideInFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                animate={floatingAnimation}
                className="relative"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1554048612-b6a482b22128?w=600&h=800&fit=crop"
                  alt="Photographer at work"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-2xl"
                />
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Camera className="h-8 w-8 mb-2" />
                  </motion.div>
                  <div className="font-semibold">Professional</div>
                  <div className="text-sm opacity-90">Equipment</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl mb-4"
              whileInView={{ 
                textShadow: [
                  '0 0 10px rgba(236, 72, 153, 0.5)',
                  '0 0 20px rgba(139, 92, 246, 0.5)',
                  '0 0 10px rgba(236, 72, 153, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Get In Touch
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to capture your special moments? Let's discuss your photography needs
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              variants={slideInFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <label className="block mb-2">First Name</label>
                        <Input 
                          placeholder="John" 
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <label className="block mb-2">Last Name</label>
                        <Input 
                          placeholder="Doe" 
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </motion.div>
                    </div>
                    
                    {[
                      { label: 'Email', placeholder: 'john@example.com', type: 'email' },
                      { label: 'Event Type', placeholder: 'Wedding, Birthday, Corporate, etc.' }
                    ].map((field, index) => (
                      <motion.div
                        key={field.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      >
                        <label className="block mb-2">{field.label}</label>
                        <Input 
                          type={field.type}
                          placeholder={field.placeholder}
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </motion.div>
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <label className="block mb-2">Message</label>
                      <Textarea 
                        placeholder="Tell us about your event and photography needs..."
                        rows={4}
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <MagneticButton className="w-full">
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 relative overflow-hidden"
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="relative z-10">Send Message</span>
                        </Button>
                      </MagneticButton>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={slideInFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {[
                { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567' },
                { icon: Mail, title: 'Email', value: 'hello@lenscapture.com' },
                { icon: MapPin, title: 'Location', value: 'New York, NY & surrounding areas' }
              ].map((contact, index) => (
                <motion.div
                  key={contact.title}
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <motion.div 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <contact.icon className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">{contact.title}</h3>
                    <p className="text-muted-foreground">{contact.value}</p>
                  </div>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-none hover:shadow-xl transition-all duration-500">
                  <CardContent className="p-6">
                    <motion.h3 
                      className="font-semibold mb-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      Quick Response Guarantee
                    </motion.h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond to all inquiries within 24 hours. For urgent requests, 
                      please call us directly.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Camera className="h-8 w-8 mr-2" />
                </motion.div>
                <span className="font-bold text-xl">LensCapture</span>
              </div>
              <p className="text-white/80 mb-4">
                Professional photography services for life's most important moments. 
                Creating beautiful memories that last a lifetime.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/80">
                {['Wedding Photography', 'Birthday Celebrations', 'Corporate Events', 'Portrait Sessions'].map((service, index) => (
                  <motion.li
                    key={service}
                    whileHover={{ x: 5, color: '#ec4899' }}
                    transition={{ duration: 0.3 }}
                  >
                    {service}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/80">
                {[
                  { label: 'Portfolio', section: 'portfolio' },
                  { label: 'About Us', section: 'about' },
                  { label: 'Contact', section: 'contact' },
                  { label: 'Pricing', href: '#pricing' }
                ].map((link, index) => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 5, color: '#ec4899' }}
                    transition={{ duration: 0.3 }}
                  >
                    {link.section ? (
                      <button onClick={() => scrollToSection(link.section)}>
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            className="border-t border-white/20 mt-8 pt-8 text-center text-white/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p>&copy; 2025 LensCapture Photography. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  );
}