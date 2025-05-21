
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useNavigationControl = (hasVideos: boolean) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBack = () => {
    navigate("/search");
  };

  // Redireciona para a página de busca se não houver vídeos
  const redirectIfNoVideos = () => {
    // Se estiver na página inicial ou na página de configuração, não redireciona automaticamente
    if (window.location.pathname === "/" || window.location.pathname === "/post-config") {
      console.log("Na página inicial ou post-config, não redirecionando automaticamente");
      return;
    }
    
    if (!hasVideos) {
      // Verificar se há vídeos no localStorage antes de redirecionar
      const storedVideo = localStorage.getItem('currentSelectedVideo');
      const storedVideos = localStorage.getItem('selectedVideos');
      
      // Só redireciona se não tiver absolutamente nenhum vídeo disponível
      if (!storedVideo && (!storedVideos || storedVideos === '[]')) {
        console.log("Nenhum vídeo disponível, redirecionando para a busca...");
        toast({
          title: "Nenhum vídeo selecionado",
          description: "Por favor, selecione um vídeo na página de busca primeiro.",
          variant: "destructive",
        });
        
        navigate("/search");
      } else {
        console.log("Vídeos encontrados no localStorage, não redirecionando");
      }
    }
  };

  return { handleBack, redirectIfNoVideos };
};
