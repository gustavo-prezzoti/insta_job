
import { Bot, CheckCircle, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center text-slate-800 p-4 relative overflow-hidden">      
      <motion.div 
        className="text-center max-w-3xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-4 bg-white/80 backdrop-blur-xl rounded-full w-28 h-28 flex items-center justify-center shadow-lg border border-white/30 ai-glow">
            <img 
              src="/lovable-uploads/149f4f76-7773-4258-a497-5aba7e415f97.png" 
              alt="VIRALYX.AI" 
              className="h-16 w-16 object-cover rounded-full animate-pulse-light" 
            />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-2 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="text-viral-accent-red">VIRALYX<span className="text-viral-accent-pink">.AI</span></span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-viral-accent-purple mb-6 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          INTELIGÊNCIA ARTIFICIAL VIRAL
        </motion.p>
        
        <motion.p 
          className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Crie vídeos encantadores em segundos e aumente seu alcance nas redes sociais com nossa tecnologia exclusiva de inteligência artificial.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            size="lg" 
            className="relative bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white font-bold py-6 px-8 rounded-full transition-all shadow-lg shadow-viral-accent-purple/20 text-lg flex items-center gap-2 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-viral-accent-purple/80 via-viral-accent-pink/80 to-viral-accent-purple/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              COMPRAR AGORA - R$97,00
            </span>
            <motion.div 
              className="absolute -right-1 -top-1 w-4 h-4"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-white/80" />
            </motion.div>
          </Button>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-6 text-slate-700 text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-viral-accent-pink" />
            <span>7 dias de garantia</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-viral-accent-pink" />
            <span>Suporte exclusivo</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-viral-accent-pink" />
            <span>Pagamento seguro</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-viral-accent-purple/10 to-viral-accent-pink/10 p-3 rounded-lg backdrop-blur-md border border-white/20 text-slate-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-lg font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-viral-accent-pink animate-pulse-light" />
            Promoção por tempo limitado: 50% OFF
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
