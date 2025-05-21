
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar autenticação Supabase:", error);
          setAuthError(`Erro de autenticação: ${error.message}`);
          setIsAuthenticated(false);
          return;
        }
        
        if (!data.session) {
          console.error("Sessão do Supabase não encontrada");
          setAuthError("Sessão expirada. Por favor, faça login novamente na plataforma.");
          setIsAuthenticated(false);
          
          try {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError || !refreshData.session) {
              console.error("Falha ao recuperar sessão:", refreshError);
            } else {
              console.log("Sessão recuperada com sucesso");
              setAuthError(null);
              setIsAuthenticated(true);
            }
          } catch (refreshErr) {
            console.error("Erro ao tentar recuperar sessão:", refreshErr);
          }
        } else {
          setAuthError(null);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err);
        setAuthError("Erro ao verificar autenticação");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setAuthError(null);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setAuthError("Você não está autenticado. Faça login para continuar.");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { 
    authError, 
    setAuthError, 
    isAuthenticated, 
    isLoading 
  };
};
