
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import CallToActionCard from "./CallToActionCard";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const CtaSection = () => {
  return (
    <div className="py-14 px-4 relative overflow-hidden bg-indigo-50">
      {/* Background effect */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-viral-accent-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 left-0 w-72 h-72 bg-viral-accent-pink/10 rounded-full blur-3xl"></div>
      
      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <CallToActionCard />
        
        {/* Rodapé simples com logo igual a do cabeçalho */}
        <div className="mt-16 py-8 border-t border-slate-200">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <Link to="/" className="flex items-center group mb-4">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative h-8 w-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/10 group-hover:border-white/20 transition-all duration-300 overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  {/* Elemento gráfico no lugar da imagem de logo */}
                  <div className="h-5 w-5 relative z-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-70"></div>
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold text-lg tracking-tight text-center">VIRALYX<span className="text-indigo-400">.AI</span></span>
                  <motion.span 
                    className="text-slate-600 text-[9px] font-medium tracking-wide text-center"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    INTELIGÊNCIA ARTIFICIAL VIRAL
                  </motion.span>
                </div>
              </motion.div>
            </Link>
            
            <div className="text-sm text-slate-600">
              &copy; {new Date().getFullYear()} VIRALYX.AI. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CtaSection;
