
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";

export interface PricingPlanProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  savingsInfo?: string;
}

const PricingPlanCard = ({
  title,
  description,
  price,
  period,
  features,
  isPopular = false,
  savingsInfo
}: PricingPlanProps) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`border-2 ${isPopular ? 'border-viral-accent-purple/30 shadow-lg' : 'border-slate-200 shadow-sm'} rounded-xl p-6 relative`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-viral-accent-purple text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
          MAIS POPULAR
        </div>
      )}
      <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      <div className="text-4xl font-bold bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink bg-clip-text text-transparent mb-2">
        {price}
      </div>
      <p className="text-slate-500 mb-2">{period}</p>
      
      {savingsInfo && (
        <div className="mb-6 inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          {savingsInfo}
        </div>
      )}
      
      <Button 
        className="w-full bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white font-semibold py-3 rounded-full shadow-md"
      >
        ASSINAR AGORA
      </Button>
      
      <div className="mt-4 flex flex-col gap-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-viral-accent-pink" />
            <span className={`text-slate-700 text-sm ${index === features.length - 1 && isPopular ? 'font-medium' : ''}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PricingPlanCard;
