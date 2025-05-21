
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, PlusCircle, MinusCircle } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  const faqs = [
    {
      question: "Preciso aparecer nos vídeos?",
      answer: "Não! Todo o conteúdo é gerado automaticamente sem necessidade de mostrar seu rosto ou gravar sua voz."
    },
    {
      question: "Como funciona a monetização?",
      answer: "O sistema conecta você com anunciantes e programas de afiliados, gerando receita através de views, cliques e conversões."
    },
    {
      question: "Quanto posso ganhar por mês?",
      answer: "Nossos usuários ganham em média R$3.000 a R$5.000 por mês, mas alguns ultrapassam R$10.000 mensais com múltiplos canais."
    },
    {
      question: "Preciso de experiência técnica?",
      answer: "Não! Nossa interface é super intuitiva e tudo é automatizado. Se você sabe usar um smartphone, consegue usar o Robô Viral."
    }
  ];

  return (
    <div className="py-20 px-4 relative overflow-hidden bg-indigo-50">
      {/* Gradient background effect */}
      <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-viral-accent-purple/20 via-viral-accent-pink/20 to-viral-accent-purple/20"></div>
      <div className="absolute bottom-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-viral-accent-purple/20 via-viral-accent-pink/20 to-viral-accent-purple/20"></div>
      
      <motion.div 
        className="max-w-3xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="relative w-16 h-16 ai-glow rounded-full flex items-center justify-center">
            <div className="absolute inset-0 bg-viral-accent-purple/20 rounded-full animate-pulse-light"></div>
            <Bot className="h-8 w-8 text-viral-accent-purple relative z-10" />
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4"
          variants={itemVariants}
        >
          Perguntas Frequentes
        </motion.h2>
        
        <motion.p 
          className="text-xl text-slate-700 text-center mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Tudo o que você precisa saber sobre o Robô Viral
        </motion.p>
        
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`} className="border border-slate-200 rounded-lg mb-3 overflow-hidden">
                  <AccordionTrigger className="bg-white px-6 py-4 text-slate-800 hover:no-underline hover:bg-slate-50 transition-all text-left">
                    <span className="text-lg font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-slate-700 bg-white border-t border-slate-100">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FaqSection;
