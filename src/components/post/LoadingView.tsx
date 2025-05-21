
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LoadingView = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-viral-accent-purple" />
        <h2 className="text-xl font-semibold text-white mb-4">
          Carregando configurações de postagem...
        </h2>
        <Button onClick={() => navigate("/search")}>Voltar para a busca</Button>
      </div>
    </div>
  );
};

export default LoadingView;
