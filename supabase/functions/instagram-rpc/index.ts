
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Inicializar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );
    
    // Criar procedimentos armazenados (RPC) para gerenciar credenciais do Instagram
    
    // 1. Função para buscar credenciais do Instagram
    const { data: getCredentialsResult, error: getCredentialsError } = await supabaseClient
      .rpc('create_get_instagram_credentials_function');
    
    if (getCredentialsError) {
      console.error("Erro ao criar função para buscar credenciais:", getCredentialsError);
    } else {
      console.log("Função para buscar credenciais criada com sucesso");
    }
    
    // 2. Função para atualizar credenciais do Instagram
    const { data: updateCredentialsResult, error: updateCredentialsError } = await supabaseClient
      .rpc('create_update_instagram_credentials_function');
    
    if (updateCredentialsError) {
      console.error("Erro ao criar função para atualizar credenciais:", updateCredentialsError);
    } else {
      console.log("Função para atualizar credenciais criada com sucesso");
    }
    
    // 3. Função para inserir credenciais do Instagram
    const { data: insertCredentialsResult, error: insertCredentialsError } = await supabaseClient
      .rpc('create_insert_instagram_credentials_function');
    
    if (insertCredentialsError) {
      console.error("Erro ao criar função para inserir credenciais:", insertCredentialsError);
    } else {
      console.log("Função para inserir credenciais criada com sucesso");
    }
    
    // 4. Função para desativar credenciais do Instagram
    const { data: deactivateCredentialsResult, error: deactivateCredentialsError } = await supabaseClient
      .rpc('create_deactivate_instagram_credentials_function');
    
    if (deactivateCredentialsError) {
      console.error("Erro ao criar função para desativar credenciais:", deactivateCredentialsError);
    } else {
      console.log("Função para desativar credenciais criada com sucesso");
    }
    
    return new Response(JSON.stringify({ 
      message: "Funções RPC para credenciais do Instagram criadas com sucesso" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Erro na função instagram-rpc:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
