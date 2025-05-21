
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const plans = [
    {
      name: "Básico",
      price: "97",
      period: "mensal",
      description: "Ideal para iniciantes que querem gerar conteúdo viral",
      features: [
        { text: "10 vídeos por dia", included: true },
        { text: "Acesso a conteúdos de 1 nicho", included: true },
        { text: "Repostagens automáticas", included: true },
        { text: "Suporte por email", included: true },
        { text: "Análise básica de desempenho", included: true },
        { text: "Integração com 1 rede social", included: true },
        { text: "Agendamento de posts", included: false },
        { text: "Edição avançada de conteúdo", included: false },
      ],
      color: "from-indigo-500 to-indigo-600",
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      name: "Premium",
      price: "197",
      period: "mensal",
      description: "A escolha perfeita para criadores de conteúdo sérios",
      features: [
        { text: "30 vídeos por dia", included: true },
        { text: "Acesso a conteúdos de 3 nichos", included: true },
        { text: "Repostagens automáticas", included: true },
        { text: "Suporte prioritário", included: true },
        { text: "Análise avançada de desempenho", included: true },
        { text: "Integração com 3 redes sociais", included: true },
        { text: "Agendamento de posts", included: true },
        { text: "Edição avançada de conteúdo", included: true },
      ],
      popular: true,
      color: "from-viral-accent-purple to-purple-600",
      icon: <Crown className="h-5 w-5" />
    },
    {
      name: "Enterprise",
      price: "997",
      period: "mensal",
      description: "Para profissionais e agências que precisam de volume",
      features: [
        { text: "Vídeos ilimitados", included: true },
        { text: "Acesso a todos os nichos", included: true },
        { text: "Repostagens automáticas", included: true },
        { text: "Suporte VIP 24/7", included: true },
        { text: "Análise profissional de desempenho", included: true },
        { text: "Integração com todas redes sociais", included: true },
        { text: "Agendamento ilimitado de posts", included: true },
        { text: "Edição profissional de conteúdo", included: true },
      ],
      color: "from-viral-accent-pink to-pink-600",
      icon: <Shield className="h-5 w-5" />
    }
  ];

  return (
    <div className="py-24 px-4 relative overflow-hidden bg-gray-50" id="precos">
      {/* Background elements */}
      <div className="absolute inset-0 ai-pattern opacity-5"></div>
      <div className="absolute -left-32 top-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -right-32 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800"
          variants={itemVariants}
        >
          Escolha o plano <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ideal para você</span>
        </motion.h2>
        
        <motion.p 
          className="text-lg text-slate-700 text-center max-w-3xl mx-auto mb-16"
          variants={itemVariants}
        >
          Invista no seu sucesso online com nossos planos acessíveis. Comece hoje e transforme sua presença digital.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              className={`relative rounded-xl overflow-hidden bg-white shadow-md border border-slate-100 hover:border-indigo-100 transition-all duration-300 flex flex-col h-full ${plan.popular ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' : ''}`}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-viral-accent-purple to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    MAIS POPULAR
                  </div>
                </div>
              )}
              
              <div className="p-8 bg-white border-b border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                </div>
                
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-slate-800">R${plan.price}</span>
                  <span className="text-slate-500 mb-1">/{plan.period}</span>
                </div>
                
                <p className="text-slate-600 text-sm mb-6">{plan.description}</p>
                
                <Button 
                  className={`w-full py-6 font-bold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 shadow-md`}
                >
                  COMEÇAR AGORA
                </Button>
              </div>
              
              <div className="p-8 flex-1 bg-gray-50/50">
                <h4 className="font-medium text-slate-800 mb-6">O que está incluído:</h4>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className={`mt-1 p-1 rounded-full bg-gradient-to-r ${plan.color} flex-shrink-0 text-white`}>
                          <Check size={12} />
                        </div>
                      ) : (
                        <div className="mt-1 p-1 rounded-full bg-slate-200 flex-shrink-0">
                          <X size={12} className="text-slate-400" />
                        </div>
                      )}
                      <span className={feature.included ? "text-slate-700" : "text-slate-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <p className="text-slate-600 mb-4">Não tem certeza de qual plano escolher?</p>
          <Button variant="outline" className="bg-white/80 border-slate-200 text-slate-700 hover:bg-white">
            Fale com um consultor
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PricingSection;
