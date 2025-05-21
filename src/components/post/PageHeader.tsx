
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  onBack: () => void;
}

const PageHeader = ({ onBack }: PageHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="text-white hover:text-viral-accent-purple transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="mx-4 text-white/30">|</div>
        <div className="text-white">
          Configuração para Instagram
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-white">
        Configure sua postagem para o Instagram
      </h1>
    </div>
  );
};

export default PageHeader;
