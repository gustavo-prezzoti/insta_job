
import { ShoppingCart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

const CallToActionCard = () => {
  return (
    <motion.div 
      className="bg-white p-8 rounded-xl shadow-md border-2 border-slate-100 relative overflow-hidden"
      variants={itemVariants}
    >
      {/* Animated glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-viral-accent-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-viral-accent-pink/10 rounded-full blur-3xl"></div>
      
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
        variants={itemVariants}
      >
        Comece com <span className="bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink bg-clip-text text-transparent">VIRALYX.AI</span>
      </motion.h2>
      
      <motion.p 
        className="text-lg text-slate-700 mb-6 max-w-2xl mx-auto"
        variants={itemVariants}
      >
        Invista no crescimento do seu perfil nas redes sociais:
      </motion.p>
      
      <motion.div 
        className="text-4xl font-bold bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink bg-clip-text text-transparent mb-4"
        variants={itemVariants}
      >
        R$197,00
      </motion.div>
      
      <motion.p 
        className="text-slate-600 mb-6"
        variants={itemVariants}
      >
        Acesso completo às ferramentas
      </motion.p>
      
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button 
          size="lg" 
          className="relative bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white font-bold py-4 px-6 rounded-full transition-all shadow-md shadow-viral-accent-purple/20 text-lg flex items-center gap-2 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-viral-accent-purple/80 via-viral-accent-pink/80 to-viral-accent-purple/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            ADQUIRIR AGORA
          </span>
        </Button>
      </motion.div>
      
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mt-4"
        variants={itemVariants}
      >
        <img src="/lovable-uploads/pix.png" alt="Pix" className="h-7" />
        <img src="/lovable-uploads/credit-cards.png" alt="Cartões" className="h-7" />
      </motion.div>
      
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mt-4 text-slate-700 text-sm"
        variants={itemVariants}
      >
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-viral-accent-pink" />
          <span>Compra segura</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-viral-accent-pink" />
          <span>Suporte durante 7 dias</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CallToActionCard;
