import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring, useMotionValue } from 'motion/react';
import { 
  Briefcase, 
  Globe, 
  Shield, 
  Users, 
  Zap, 
  ChevronRight, 
  Menu, 
  X, 
  ArrowRight,
  ArrowUp,
  Award,
  BarChart3,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import { useState, useEffect, useRef, ReactNode, FormEvent, ChangeEvent } from 'react';
import { cn } from './lib/utils';

// --- Components ---

const Reveal = ({ children, width = "w-full", delay = 0.2, y = 30, x = 0, scale = 1, rotate = 0, duration = 0.6 }: { children: ReactNode, width?: string, delay?: number, y?: number, x?: number, scale?: number, rotate?: number, duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={cn("relative", width)}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y, x, scale, rotate },
          visible: { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gold z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const Tooltip = ({ children, text }: { children: ReactNode, text: string, key?: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -35, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute z-[60] px-3 py-1 bg-deep-blue text-gold text-[10px] font-bold uppercase tracking-widest rounded-md shadow-xl whitespace-nowrap border border-gold/20"
          >
            {text}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-deep-blue rotate-45 border-r border-b border-gold/20" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Marquee = () => {
  const items = [
    "Strategic Growth", "Authority Building", "Digital Influence", 
    "Political Consulting", "Business Strategy", "Personal Branding",
    "Market Analysis", "Public Relations", "Voter Analytics"
  ];

  return (
    <div className="py-12 bg-deep-blue overflow-hidden border-y border-white/5 relative">
      <div className="absolute inset-0 bg-gold/5 pointer-events-none"></div>
      <div className="flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
          className="flex gap-24 items-center"
        >
          {[...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="text-white/20 text-4xl font-serif italic tracking-widest uppercase">{item}</span>
              <div className="w-1.5 h-1.5 bg-gold/30 rounded-full"></div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const buttons = [
    { 
      id: 'whatsapp',
      text: "WhatsApp", 
      icon: <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6 md:w-8 md:h-8" referrerPolicy="no-referrer" />, 
      href: "https://wa.me/918855992447", 
      color: "bg-[#25D366] text-white",
      shadow: "shadow-[#25D366]/40"
    },
    { 
      id: 'top',
      text: "Back to Top", 
      icon: <ArrowUp className="w-4 h-4 md:w-6 md:h-6" />, 
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      color: "bg-deep-blue text-gold",
      shadow: "shadow-deep-blue/30"
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 50 }}
          className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-50 flex flex-col gap-3 md:gap-4 items-end"
        >
          {buttons.map((btn) => (
            <div key={btn.id} className="relative flex items-center gap-3">
              <AnimatePresence>
                {activeLabel === btn.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-deep-blue text-gold text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-gold/20 shadow-2xl whitespace-nowrap"
                  >
                    {btn.text}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.a
                href={btn.href}
                target={btn.href ? "_blank" : undefined}
                rel={btn.href ? "noopener noreferrer" : undefined}
                onMouseEnter={() => setActiveLabel(btn.id)}
                onMouseLeave={() => setActiveLabel(null)}
                onClick={(e) => {
                  if (btn.onClick) {
                    e.preventDefault();
                    btn.onClick();
                  }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-[20px] flex items-center justify-center cursor-pointer transition-all duration-500 shadow-2xl border border-white/5",
                  btn.color,
                  btn.shadow
                )}
              >
                {btn.icon}
              </motion.a>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-0 py-6",
      isScrolled ? "bg-white/90 backdrop-blur-xl border-b border-deep-blue/5 py-4" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 md:gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 aspect-square bg-deep-blue rounded-full flex items-center justify-center text-gold font-serif text-xl md:text-2xl font-bold transition-transform duration-500 group-hover:rotate-[360deg]">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-serif font-bold tracking-tight text-deep-blue leading-none">
              URJA <span className="font-light italic">CONSULTANCY</span>
            </span>
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-gold font-bold mt-1">Strategic Authority</span>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.3em] text-deep-blue/60">
          {['services', 'about', 'impact'].map((item, i) => (
            <motion.a 
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              href={`#${item}`} 
              className="hover:text-gold transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gold transition-all duration-500 group-hover:w-full"></span>
            </motion.a>
          ))}
          <motion.a 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            href="#contact" 
            className="bg-deep-blue text-white px-8 py-3 rounded-full hover:bg-gold hover:text-deep-blue transition-all duration-500 shadow-xl hover:shadow-gold/30 text-[10px]"
          >
            Consult Now
          </motion.a>
        </div>

        <button 
          className="md:hidden text-deep-blue"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white mt-4 rounded-2xl shadow-xl"
          >
            <div className="flex flex-col gap-4 p-6 text-sm font-medium uppercase tracking-widest">
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a href="#impact" onClick={() => setIsMobileMenuOpen(false)}>Impact</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gold">Get Started</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const smoothScroll = useSpring(scrollY, { damping: 20, stiffness: 100 });
  
  // Desktop: Parallax down + Rotate + Scale
  // Mobile: Subtle Float up + Scale (No Rotate)
  const y1 = useTransform(smoothScroll, [0, 500], [0, isMobile ? -30 : 150]);
  const rotate = useTransform(smoothScroll, [0, 500], [0, isMobile ? 0 : 8]);
  const scale = useTransform(smoothScroll, [0, 500], [1, isMobile ? 1.05 : 1.1]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 md:pt-32 lg:pt-0 overflow-hidden bg-paper">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-deep-blue/5 skew-x-[-15deg] translate-x-20"></div>
        <div className="absolute left-10 top-1/2 -translate-y-1/2 vertical-text text-[15vh] font-serif font-black opacity-[0.03] select-none uppercase tracking-[0.5em]">
          Authority Strategy
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center justify-center relative z-10 w-full">
        <div className="space-y-10 md:space-y-12 text-center">
          <div className="space-y-4">
            <Reveal delay={0.2} y={20}>
              <div className="flex items-center justify-center gap-4">
                <div className="hidden sm:block h-[1px] w-12 md:w-24 bg-gold/30"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold bg-gold/10 px-4 py-1 rounded-full">
                  Elite Consulting
                </span>
                <div className="hidden sm:block h-[1px] w-12 md:w-24 bg-gold/30"></div>
              </div>
            </Reveal>
            
            <Reveal 
              delay={0.4} 
              y={isMobile ? 20 : 50} 
              duration={isMobile ? 0.6 : 0.8}
            >
              <h1 className="text-6xl sm:text-7xl md:text-5xl lg:text-7xl xl:text-[clamp(3rem,8vw,7rem)] font-serif leading-[1] md:leading-[1.1] text-deep-blue tracking-tighter">
                Strategic <br className="lg:hidden" />
                <span className="italic font-light text-accent">Authority</span> <br className="lg:hidden" />
                <span className="relative">
                  Building
                  <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.0, duration: 0.8, ease: "circOut" }}
                    className="absolute -bottom-1 md:-bottom-2 left-0 h-1 md:h-2 bg-gold/30 -z-10"
                  ></motion.span>
                </span>
              </h1>
            </Reveal>
          </div>

          <Reveal delay={0.6} y={30}>
            <p className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed font-light">
              We don't just consult; we engineer <span className="text-deep-blue font-medium italic">influence</span>. 
              Partner with Mayur Salunke to dominate your market and lead with unshakeable authority.
            </p>
          </Reveal>

          <Reveal delay={0.8} y={20}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-6 md:gap-8 items-center justify-center">
              <motion.a 
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-4 bg-deep-blue text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] md:text-[11px] transition-all hover:bg-gold hover:text-deep-blue shadow-2xl shadow-deep-blue/30 w-full sm:w-auto justify-center"
              >
                Claim Your Session
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
              </motion.a>
              
              <div className="flex -space-x-3 md:-space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-paper overflow-hidden bg-gold/20">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-paper bg-gold flex items-center justify-center text-[8px] md:text-[10px] font-bold text-deep-blue">
                  +500
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const services = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Business Strategy",
      desc: "Comprehensive growth roadmaps designed to scale your operations and market presence.",
      tags: ["Market Analysis", "Growth Hacking", "Revenue Optimization"],
      color: "bg-blue-50"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Political Consulting",
      desc: "Data-driven campaign management and strategic positioning for political leaders.",
      tags: ["Voter Analytics", "Campaign Strategy", "Public Relations"],
      color: "bg-gold/5"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Authority Building",
      desc: "Establishing you as a thought leader in your industry through strategic content and media.",
      tags: ["Personal Branding", "Thought Leadership", "Media Presence"],
      color: "bg-paper"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Digital Influence",
      desc: "Leveraging digital platforms to build a massive, engaged audience and influence.",
      tags: ["Social Media Strategy", "Content Marketing", "Influencer Growth"],
      color: "bg-deep-blue/5"
    }
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-paper/50 -skew-x-12 translate-x-20 hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-24 gap-8 md:gap-12">
          <Reveal>
            <div className="space-y-4 text-center lg:text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold block">Our Expertise</span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-deep-blue leading-tight">
                Strategic Services <br /> 
                <span className="italic font-light text-accent">for Modern Leaders</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="text-ink/50 max-w-sm text-sm leading-relaxed uppercase tracking-widest font-medium text-center lg:text-left mx-auto lg:mx-0">
              We provide the architectural framework for your digital and physical dominance.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                backgroundColor: "rgba(10,25,47,1)"
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ 
                delay: i * 0.1,
                backgroundColor: { 
                  duration: 1, 
                  delay: i * 0.15 + 0.3 
                }
              }}
              style={{ willChange: "transform, opacity, background-color" }}
              className={cn(
                "p-8 md:p-12 min-h-[400px] md:min-h-[500px] flex flex-col justify-between group relative overflow-hidden rounded-[40px] border border-deep-blue/5 cursor-pointer shadow-2xl shadow-deep-blue/5",
                s.color
              )}
            >
              {/* Animated Background Overlay */}
              <div className="absolute inset-0 bg-deep-blue translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
              
              {/* Content Container */}
              <motion.div 
                whileInView={{
                  color: "rgba(255,255,255,1)"
                }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ 
                  duration: 1, 
                  delay: i * 0.15 + 0.3 
                }}
                style={{ willChange: "color, transform" }}
                className="relative z-10 pointer-events-none group-hover:-translate-y-2 group-active:-translate-y-2 transition-transform duration-500"
              >
                <motion.div 
                  whileInView={{ backgroundColor: "rgba(212,175,55,1)", color: "rgba(10,25,47,1)" }}
                  transition={{ delay: i * 0.15 + 0.6, duration: 0.4 }}
                  className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-deep-blue mb-12 group-hover:bg-gold group-active:bg-gold transition-all duration-500 shadow-xl shadow-deep-blue/5"
                >
                  {s.icon}
                </motion.div>
                <h3 className="text-3xl font-serif mb-6 text-current group-hover:text-white group-active:text-white transition-colors duration-500">
                  {s.title}
                </h3>
                <p className="text-current opacity-60 text-sm leading-relaxed mb-8 group-hover:text-white/80 group-active:text-white/80 transition-colors duration-500">
                  {s.desc}
                </p>
              </motion.div>

              <div className="relative z-10 space-y-8 pointer-events-none">
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag, j) => (
                    <motion.span 
                      key={j} 
                      whileInView={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.1)" }}
                      transition={{ delay: i * 0.15 + 0.8, duration: 0.4 }}
                      className="text-[9px] uppercase tracking-widest font-bold text-ink/40 bg-white/50 px-3 py-1 rounded-full border border-deep-blue/5 group-hover:bg-white/10 group-hover:text-white/70 group-hover:border-white/10 group-active:bg-white/10 group-active:text-white/70 group-active:border-white/10 transition-all duration-500"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                <motion.div 
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 + 1.0, duration: 0.4 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500"
                >
                  Learn More <ArrowRight size={14} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-paper overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative z-10 rounded-[40px] md:rounded-[60px] overflow-hidden aspect-[4/5] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] md:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]">
            <img 
              src="https://picsum.photos/seed/vision/1200/1500" 
              alt="Vision" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-deep-blue/40 to-transparent"></div>
          </div>
          
          <div className="absolute -top-10 md:-top-20 -left-10 md:-left-20 w-40 md:w-80 h-40 md:h-80 bg-gold/10 rounded-full blur-[50px] md:blur-[100px]"></div>
          
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            className="absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 bg-white p-6 md:p-12 rounded-[30px] md:rounded-[40px] shadow-2xl z-20 border border-gold/10"
          >
            <div className="text-4xl md:text-7xl font-serif text-deep-blue mb-2 leading-none">10<span className="text-gold">+</span></div>
            <div className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-ink/40 font-black">Years of Excellence</div>
          </motion.div>

          <div className="absolute top-1/2 -left-8 md:-left-12 -translate-y-1/2 vertical-text text-[8px] md:text-[10px] uppercase tracking-[1em] text-gold font-bold opacity-40 hidden sm:block">
            Architect of Dynasties
          </div>
        </motion.div>

        <div className="space-y-8 md:space-y-12 order-1 lg:order-2 text-center lg:text-left">
          <div className="space-y-6">
            <Reveal>
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold block">The Visionary</span>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-deep-blue leading-[1] md:leading-[0.9] tracking-tighter">
                Empowering <br />
                <span className="italic font-light text-accent">Leaders to Shape</span> <br />
                the Future.
              </h2>
            </Reveal>
          </div>
          
          <Reveal delay={0.3}>
            <div className="space-y-6 md:space-y-8 text-base md:text-lg text-ink/60 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              <p>
                Mayur Salunke is a renowned Business and Political Consultant with a mission to bridge the gap between vision and reality. Through Urja Consultancy, he has helped hundreds of entrepreneurs and political aspirants build lasting legacies.
              </p>
              <p className="italic border-l-2 border-gold/30 pl-6 md:pl-8 py-2 text-left">
                "True authority isn't taken; it's engineered through strategic consistency and unshakeable vision."
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-8 md:gap-12 pt-4 md:pt-8">
            {[
              { icon: <Award size={24} />, title: "Expertise", desc: "Strategic Planning", tooltip: "Industry Recognition" },
              { icon: <BarChart3 size={24} />, title: "Impact", desc: "Data-Driven Growth", tooltip: "Performance Analytics" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="group cursor-default flex flex-col items-center lg:items-start"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gold/10 rounded-2xl text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <h4 className="font-black text-deep-blue text-[9px] md:text-[10px] uppercase tracking-[0.3em]">{item.title}</h4>
                </div>
                <p className="text-xs md:text-sm text-ink/40 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Impact = () => {
  const stats = [
    { label: "Political Campaigns", value: "50+" },
    { label: "Business Clients", value: "100+" },
    { label: "Digital Reach", value: "10M+" },
    { label: "Success Rate", value: "98%" }
  ];

  return (
    <section id="impact" className="py-24 md:py-40 luxury-gradient text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <Reveal>
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold mb-4 block">Our Impact</span>
              <h2 className="text-5xl md:text-7xl font-serif leading-tight">Numbers that <br /> <span className="italic font-light opacity-50">Define Our Legacy</span></h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-white/40 max-w-md mx-auto lg:mx-0 text-base md:text-lg font-light leading-relaxed">
                Our success is measured by the magnitude of change we bring to our clients' trajectories.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ willChange: "transform, opacity" }}
                className="bg-white/5 backdrop-blur-sm p-10 md:p-16 flex flex-col items-center justify-center border border-white/5 group hover:bg-white/10 transition-all duration-700 rounded-[30px] shadow-2xl shadow-black/20"
              >
                <div className="text-5xl md:text-7xl font-serif text-gold mb-4 group-hover:scale-110 transition-transform duration-700">{s.value}</div>
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black opacity-40 text-center">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', service: '' });
  const [errors, setErrors] = useState({ name: '', email: '', service: '' });
  const [touched, setTouched] = useState({ name: false, email: false, service: false });

  const validate = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (value.length < 2) error = 'Name must be at least 2 characters';
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = 'Please enter a valid email address';
    } else if (name === 'service') {
      if (!value) error = 'Please select a service';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) validate(name, value);
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(name, formData[name as keyof typeof formData]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isNameValid = validate('name', formData.name);
    const isEmailValid = validate('email', formData.email);
    const isServiceValid = validate('service', formData.service);
    setTouched({ name: true, email: true, service: true });
    
    if (!isNameValid || !isEmailValid || !isServiceValid) return;

    setStatus('loading');
    try {
      const response = await fetch(`${window.location.origin}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'Consultation' }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', service: '' });
        setTouched({ name: false, email: false, service: false });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const inputVariants = {
    error: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } },
    idle: { x: 0 }
  };

  return (
    <section id="contact" className="py-16 md:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[30px] md:rounded-[60px] p-5 sm:p-8 md:p-16 lg:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-deep-blue/5">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gold/5 rounded-full -mr-32 md:-mr-48 -mt-32 md:-mt-48 blur-3xl"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 relative z-10">
            <div className="space-y-8 md:space-y-12 text-center lg:text-left">
              <div className="space-y-4 md:space-y-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold block">Get in Touch</span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif text-deep-blue leading-[1] md:leading-[0.9] tracking-tighter">
                  Let's Build Your <br />
                  <span className="italic font-light text-accent">Legacy Together.</span>
                </h2>
              </div>

              <div className="space-y-6 md:space-y-10 max-w-md mx-auto lg:mx-0">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-4 md:gap-6 group">
                    <a 
                      href="tel:8855992447" 
                      className="bg-gold/10 hover:bg-gold text-gold hover:text-deep-blue px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0 shadow-lg shadow-gold/5"
                    >
                      <Phone size={10} className="md:w-5 md:h-5" />
                    </a>
                    <div className="text-left">
                      <div className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black opacity-30 mb-0.5 md:mb-1">Direct Line 1</div>
                      <a href="tel:8855992447" className="text-base md:text-xl font-serif text-deep-blue hover:text-gold transition-colors">8855992447</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 group">
                    <a 
                      href="tel:8983451280" 
                      className="bg-gold/10 hover:bg-gold text-gold hover:text-deep-blue px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0 shadow-lg shadow-gold/5"
                    >
                      <Phone size={10} className="md:w-5 md:h-5" />
                    </a>
                    <div className="text-left">
                      <div className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black opacity-30 mb-0.5 md:mb-1">Direct Line 2</div>
                      <a href="tel:8983451280" className="text-base md:text-xl font-serif text-deep-blue hover:text-gold transition-colors">8983451280</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6 group">
                  <a 
                    href="mailto:urjabusinessconsult@gmail.com" 
                    className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-3xl flex items-center justify-center text-gold shadow-xl shadow-deep-blue/5 group-hover:bg-deep-blue group-hover:text-white transition-all duration-500 shrink-0"
                  >
                    <Mail size={20} className="md:w-6 md:h-6" />
                  </a>
                  <div className="text-left">
                    <div className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black opacity-30 mb-0.5 md:mb-1">Email Inquiry</div>
                    <a href="mailto:urjabusinessconsult@gmail.com" className="text-sm md:text-xl font-serif text-deep-blue hover:text-gold transition-colors break-all">urjabusinessconsult@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-start gap-4 md:gap-6 pt-4 md:pt-8">
                {[
                  { icon: <Instagram size={20} />, text: "Instagram" },
                  { icon: <Twitter size={20} />, text: "Twitter" },
                  { icon: <Linkedin size={20} />, text: "LinkedIn" }
                ].map((social, i) => (
                  <Tooltip key={i} text={social.text}>
                    <motion.a 
                      whileHover={{ y: -5, scale: 1.1 }}
                      href="#" 
                      className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-deep-blue/40 hover:text-gold shadow-lg shadow-deep-blue/5 transition-all"
                    >
                      {social.icon}
                    </motion.a>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="bg-paper/50 p-5 sm:p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-xl border border-deep-blue/5">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12 md:py-20 space-y-8"
                  >
                    <motion.div 
                      initial={{ scale: 0, rotate: 45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="w-16 md:w-20 h-16 md:h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto"
                    >
                      <Zap size={40} />
                    </motion.div>
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-serif text-deep-blue">Message Sent!</h3>
                      <p className="text-ink/40 font-light text-sm">We'll respond to your inquiry within 24 hours.</p>
                    </div>
                    <button onClick={() => setStatus('idle')} className="text-gold underline uppercase tracking-[0.3em] text-[10px] font-black hover:text-deep-blue transition-colors">Send another message</button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 md:space-y-8"
                  >
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-ink/40 ml-4">Your Name</label>
                      <motion.input 
                        required
                        name="name"
                        type="text" 
                        placeholder="e.g. Julianne Moore" 
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        animate={touched.name && errors.name ? "error" : "idle"}
                        variants={inputVariants}
                        className={cn(
                          "w-full bg-paper border px-5 md:px-8 py-3.5 md:py-5 rounded-xl md:rounded-3xl focus:outline-none transition-all text-deep-blue placeholder:text-ink/20 text-sm font-light shadow-inner shadow-black/5",
                          touched.name && errors.name ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-deep-blue/10 focus:border-gold focus:ring-1 focus:ring-gold/20"
                        )} 
                      />
                      <AnimatePresence>
                        {touched.name && errors.name && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-red-400 uppercase tracking-widest ml-4"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-ink/40 ml-4">Email Address</label>
                      <motion.input 
                        required
                        name="email"
                        type="email" 
                        placeholder="e.g. julianne@prestige.com" 
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        animate={touched.email && errors.email ? "error" : "idle"}
                        variants={inputVariants}
                        className={cn(
                          "w-full bg-paper border px-5 md:px-8 py-3.5 md:py-5 rounded-xl md:rounded-3xl focus:outline-none transition-all text-deep-blue placeholder:text-ink/20 text-sm font-light shadow-inner shadow-black/5",
                          touched.email && errors.email ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-deep-blue/10 focus:border-gold focus:ring-1 focus:ring-gold/20"
                        )} 
                      />
                      <AnimatePresence>
                        {touched.email && errors.email && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-red-400 uppercase tracking-widest ml-4"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-ink/40 ml-4">Service Interest</label>
                      <motion.div
                        animate={touched.service && errors.service ? "error" : "idle"}
                        variants={inputVariants}
                        className="relative"
                      >
                        <select 
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          onBlur={() => handleBlur('service')}
                          className={cn(
                            "w-full bg-paper border px-5 md:px-8 py-3.5 md:py-5 rounded-xl md:rounded-3xl focus:outline-none transition-all text-deep-blue text-sm font-light appearance-none shadow-inner shadow-black/5",
                            touched.service && errors.service ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-deep-blue/10 focus:border-gold focus:ring-1 focus:ring-gold/20"
                          )}
                        >
                          <option value="" disabled>Select a service</option>
                          <option>Business Strategy</option>
                          <option>Political Consulting</option>
                          <option>Authority Building</option>
                          <option>Digital Influence</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-deep-blue/20">
                          <ChevronRight size={16} className="rotate-90" />
                        </div>
                      </motion.div>
                      <AnimatePresence>
                        {touched.service && errors.service && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-red-400 uppercase tracking-widest ml-4"
                          >
                            {errors.service}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={status === 'loading'}
                      className="w-full bg-deep-blue text-white py-4 md:py-6 rounded-xl md:rounded-3xl font-black uppercase tracking-[0.3em] text-[9px] md:text-[11px] hover:bg-gold hover:text-deep-blue transition-all duration-500 shadow-2xl shadow-deep-blue/20 disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
                    </motion.button>
                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="text-red-400 text-[10px] text-center uppercase tracking-widest"
                        >
                          Something went wrong. Please try again.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-deep-blue text-white py-16 md:py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gold/5 -skew-y-6 translate-y-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24 mb-16 md:mb-24">
          <div className="space-y-6 md:space-y-8 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 aspect-square bg-white rounded-full flex items-center justify-center text-deep-blue font-serif text-xl md:text-2xl font-bold">
                U
              </div>
              <span className="text-xl md:text-2xl font-serif font-bold tracking-tight">
                URJA <span className="font-light italic">CONSULTANCY</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed font-light">
              Architecting authority and engineering strategic growth for the world's most ambitious leaders and organizations.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold mb-6 md:mb-10">Navigation</h4>
            <ul className="space-y-3 md:space-y-4 text-sm font-light text-white/60">
              {['Services', 'About', 'Impact', 'Contact'].map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold mb-6 md:mb-10">Expertise</h4>
            <ul className="space-y-3 md:space-y-4 text-sm font-light text-white/60">
              {['Business Strategy', 'Political Consulting', 'Authority Building', 'Digital Influence'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-white/20 text-center md:text-left">
            © 2026 Urja Consultancy. All Rights Reserved.
          </p>
          <div className="flex gap-6 md:gap-12 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-white/20">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const cursorY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  const dotX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const dotY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative custom-scrollbar overflow-x-hidden">
      {/* Custom Cursor */}
      <motion.div 
        className="fixed w-8 h-8 border border-gold/30 rounded-full pointer-events-none z-[9999] hidden lg:block"
        style={{ x: cursorX, translateX: -16, y: cursorY, translateY: -16, willChange: "transform" }}
      />
      <motion.div 
        className="fixed w-1 h-1 bg-gold rounded-full pointer-events-none z-[9999] hidden lg:block"
        style={{ x: dotX, translateX: -2, y: dotY, translateY: -2, willChange: "transform" }}
      />

      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <About />
      <Impact />
      <Contact />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
