
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./animations";
import PricingPlanCard from "./PricingPlanCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

// Planos simples
export const SimpleMonthlyPlan = {
  title: "Plano Mensal",
  description: "Acesso completo a todas as ferramentas",
  price: "R$97,00",
  period: "por mês",
  features: ["Acesso completo", "Suporte prioritário"]
};

export const SimpleAnnualPlan = {
  title: "Plano Anual",
  description: "Economize com nosso plano anual",
  price: "R$997,00",
  period: "por ano",
  features: ["Acesso completo", "Suporte prioritário", "2 meses grátis"],
  isPopular: true,
  savingsInfo: "Economia de R$167,00"
};

// Planos detalhados
export const DetailedMonthlyPlan = {
  title: "Plano Mensal",
  description: "Acesso a todas as funcionalidades",
  price: "R$97,00",
  period: "por mês",
  features: ["Acesso a todas as ferramentas", "Suporte prioritário", "Atualizações gratuitas"]
};

export const DetailedAnnualPlan = {
  title: "Plano Anual",
  description: "Economia de 2 meses grátis",
  price: "R$997,00",
  period: "por ano",
  features: ["Acesso a todas as ferramentas", "Suporte prioritário", "Atualizações gratuitas", "2 meses grátis incluídos"],
  isPopular: true
};

// Componente para a primeira seção de planos (mais simples)
export const SimplePricingSection = () => {
  return (
    <motion.div 
      className="mt-20 bg-white p-8 rounded-xl shadow-md border-2 border-slate-100 relative overflow-hidden"
      variants={itemVariants}
    >
      <motion.h2 
        className="text-3xl font-bold text-slate-800 mb-10"
        variants={itemVariants}
      >
        Escolha seu <span className="bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink bg-clip-text text-transparent">plano ideal</span>
      </motion.h2>
      
      <motion.div 
        className="grid md:grid-cols-2 gap-8"
        variants={containerVariants}
      >
        <PricingPlanCard {...SimpleMonthlyPlan} />
        <PricingPlanCard {...SimpleAnnualPlan} />
      </motion.div>
    </motion.div>
  );
};

// Componente para a segunda seção de planos (mais detalhada)
export const DetailedPricingSection = () => {
  return (
    <>
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-slate-800 mt-16 mb-8"
        variants={itemVariants}
      >
        Escolha seu plano
      </motion.h2>

      <motion.div 
        className="grid md:grid-cols-2 gap-8 mt-8"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card className="border-2 border-slate-200 shadow-lg h-full">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">{DetailedMonthlyPlan.title}</CardTitle>
              <CardDescription className="text-slate-600">{DetailedMonthlyPlan.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink bg-clip-text text-transparent">
                {DetailedMonthlyPlan.price}
              </p>
              <p className="text-slate-500 mt-2">{DetailedMonthlyPlan.period}</p>
              <ul className="mt-6 space-y-3 text-left">
                {DetailedMonthlyPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-viral-accent-pink mr-2" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4 flex justify-center">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white font-semibold rounded-full transition-all shadow-md shadow-viral-accent-purple/20"
              >
                ASSINAR AGORA
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card className="border-2 border-viral-accent-purple/50 shadow-xl relative h-full">
            <div className="absolute top-0 right-0 bg-viral-accent-purple text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
              MAIS POPULAR
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">{DetailedAnnualPlan.title}</CardTitle>
              <CardDescription className="text-slate-600">{DetailedAnnualPlan.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink bg-clip-text text-transparent">
                {DetailedAnnualPlan.price}
              </p>
              <p className="text-slate-500 mt-2">{DetailedAnnualPlan.period}</p>
              <div className="mt-2 mb-4">
                <span className="bg-viral-accent-purple/10 text-viral-accent-purple px-2 py-1 rounded-full text-sm font-medium">
                  Economize R$167,00
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-left">
                {DetailedAnnualPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-viral-accent-pink mr-2" />
                    <span className={`text-slate-700 ${index === DetailedAnnualPlan.features.length - 1 ? 'font-medium' : ''}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4 flex justify-center">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white font-semibold rounded-full transition-all shadow-md shadow-viral-accent-purple/20"
              >
                ASSINAR AGORA
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};
