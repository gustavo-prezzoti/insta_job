
import { supabase } from "@/integrations/supabase/client";

// Função para salvar termo de pesquisa no histórico
export const saveSearchTerm = async (searchTerm: string, platform: 'tiktok' | 'instagram' | 'youtube'): Promise<void> => {
  try {
    // Verificando se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("Usuário não autenticado, não salvando histórico");
      return;
    }
    
    await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        search_term: searchTerm,
        platform
      });
      
    console.log("Termo de pesquisa salvo no histórico");
  } catch (error) {
    console.error("Erro ao salvar termo de pesquisa:", error);
  }
};

// Função para obter o histórico de pesquisa
export const getSearchHistory = async (): Promise<string[]> => {
  try {
    // Verificando se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("Usuário não autenticado");
      return [];
    }
    
    const { data, error } = await supabase
      .from('search_history')
      .select('search_term')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error("Erro ao buscar histórico de pesquisa:", error);
      return [];
    }
    
    // Removendo duplicatas
    const terms = data.map(item => item.search_term);
    return [...new Set(terms)];
  } catch (error) {
    console.error("Erro ao buscar histórico de pesquisa:", error);
    return [];
  }
};
