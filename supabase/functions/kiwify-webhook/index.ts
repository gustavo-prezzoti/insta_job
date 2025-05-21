
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuração dos headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Lidar com requisições de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Configurar cliente Supabase
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Extrair corpo da requisição
    const body = await req.json();
    
    console.log("Webhook Kiwify recebido:", JSON.stringify(body, null, 2));
    
    // Validar assinatura (opcional)
    // Em um ambiente de produção, você deve validar a assinatura do webhook
    // const signature = req.headers.get('X-Kiwify-Signature');
    // if (!validateSignature(body, signature)) {
    //   throw new Error('Assinatura inválida');
    // }
    
    // Identificar o tipo de evento
    const eventType = body.event || "unknown";
    
    switch (eventType) {
      case 'purchase.approved':
        await handlePurchaseApproved(body, supabase);
        break;
        
      case 'purchase.refunded':
        await handlePurchaseRefunded(body, supabase);
        break;
        
      case 'purchase.pending':
        await handlePurchasePending(body, supabase);
        break;
        
      case 'subscription.renewed':
      case 'subscription.canceled':
      case 'subscription.expired':
        await handleSubscriptionEvent(body, supabase, eventType);
        break;
        
      default:
        console.log(`Tipo de evento não tratado: ${eventType}`);
    }
    
    // Retornar sucesso
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processado com sucesso' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error("Erro ao processar webhook do Kiwify:", error);
    
    // Retornar erro
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Tratar evento de compra aprovada
async function handlePurchaseApproved(data: any, supabase: any) {
  console.log("Processando compra aprovada");
  
  const transaction = {
    transaction_id: data.transaction.transaction_id,
    product_id: data.product.id,
    product_name: data.product.name,
    customer_email: data.customer.email,
    customer_name: data.customer.full_name,
    amount: data.transaction.amount,
    payment_method: data.transaction.payment_method,
    status: 'approved',
    created_at: new Date(data.transaction.created_at || Date.now()).toISOString(),
    event_data: data
  };
  
  // Inserir na tabela de transações
  const { error } = await supabase
    .from('kiwify_transactions')
    .upsert(transaction, { onConflict: 'transaction_id' });
    
  if (error) {
    console.error("Erro ao salvar transação:", error);
    throw new Error(`Erro ao salvar transação: ${error.message}`);
  }
  
  // Você pode adicionar lógica adicional aqui, como:
  // - Enviar email de confirmação
  // - Atualizar status do usuário
  // - Conceder acesso a recursos
}

// Tratar evento de reembolso
async function handlePurchaseRefunded(data: any, supabase: any) {
  console.log("Processando reembolso");
  
  // Atualizar status da transação
  const { error } = await supabase
    .from('kiwify_transactions')
    .update({ 
      status: 'refunded',
      refunded_at: new Date().toISOString(),
      event_data: data
    })
    .eq('transaction_id', data.transaction.transaction_id);
    
  if (error) {
    console.error("Erro ao atualizar status de reembolso:", error);
    throw new Error(`Erro ao atualizar reembolso: ${error.message}`);
  }
  
  // Você pode adicionar lógica adicional aqui, como:
  // - Revogar acesso a recursos
  // - Enviar notificação ao usuário
}

// Tratar evento de compra pendente
async function handlePurchasePending(data: any, supabase: any) {
  console.log("Processando compra pendente");
  
  const transaction = {
    transaction_id: data.transaction.transaction_id,
    product_id: data.product.id,
    product_name: data.product.name,
    customer_email: data.customer.email,
    customer_name: data.customer.full_name,
    amount: data.transaction.amount,
    payment_method: data.transaction.payment_method,
    status: 'pending',
    created_at: new Date(data.transaction.created_at || Date.now()).toISOString(),
    event_data: data
  };
  
  // Inserir na tabela de transações
  const { error } = await supabase
    .from('kiwify_transactions')
    .upsert(transaction, { onConflict: 'transaction_id' });
    
  if (error) {
    console.error("Erro ao salvar transação pendente:", error);
    throw new Error(`Erro ao salvar transação pendente: ${error.message}`);
  }
}

// Tratar eventos de assinatura
async function handleSubscriptionEvent(data: any, supabase: any, eventType: string) {
  console.log(`Processando evento de assinatura: ${eventType}`);
  
  let status;
  switch (eventType) {
    case 'subscription.renewed':
      status = 'active';
      break;
    case 'subscription.canceled':
      status = 'canceled';
      break;
    case 'subscription.expired':
      status = 'expired';
      break;
    default:
      status = 'unknown';
  }
  
  const subscription = {
    subscription_id: data.subscription.id,
    product_id: data.product.id,
    customer_email: data.customer.email,
    status: status,
    expires_at: data.subscription.expires_at,
    updated_at: new Date().toISOString(),
    event_data: data
  };
  
  // Atualizar na tabela de assinaturas
  const { error } = await supabase
    .from('kiwify_subscriptions')
    .upsert(subscription, { onConflict: 'subscription_id' });
    
  if (error) {
    console.error("Erro ao atualizar assinatura:", error);
    throw new Error(`Erro ao atualizar assinatura: ${error.message}`);
  }
}

// Função para validar assinatura do webhook (implemente conforme a documentação do Kiwify)
// function validateSignature(payload: any, signature: string | null): boolean {
//   // Implementar validação de assinatura
//   return true;
// }
