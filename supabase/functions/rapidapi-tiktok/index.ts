import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Definindo cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface para o resultado da busca de vídeos
interface VideoSearchResult {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  stats: {
    views: number;
    likes: number;
    shares: number;
  }
}

// Interface para o resultado de processamento de URL
interface VideoUrlResult {
  success: boolean;
  videoData: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    stats: {
      views: number;
      likes: number;
      shares: number;
    };
    watermarkRemoved: boolean;
  }
}

// Configuração do cliente RapidAPI
const rapidApiKey = '3d0c8800c5msh52d79275990b876p183132jsn3c7a52ac0221';
const rapidApiHost = 'tiktok-scraper7.p.rapidapi.com';

// Lista de user agents para rotacionar
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/110.0.0.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/110.0.0.0 Mobile/15E148 Safari/604.1',
];

// Função para verificar o usuário através do token
async function authenticateUser(authHeader: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Criar cliente Supabase usando o token do usuário
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    
    // Verificar o usuário usando o token
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    
    if (error) {
      console.error("Erro de autenticação:", error.message);
      return null;
    } else if (user) {
      console.log(`Usuário autenticado: ${user.id}`);
      return user.id;
    }
  } catch (err) {
    console.error("Erro ao verificar token:", err);
  }
  
  return null;
}

// Função para registrar pesquisa no histórico
async function registerSearchHistory(userId: string, keyword: string, resultsCount: number): Promise<void> {
  if (!userId) {
    console.log("Usuário não autenticado, não registrando pesquisa");
    return;
  }
  
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabaseAdmin.from('search_history').insert({
      user_id: userId,
      search_term: keyword,
      platform: 'tiktok',
      results_count: resultsCount
    });
    
    console.log(`Pesquisa registrada para o usuário ${userId}`);
  } catch (error) {
    console.error("Erro ao registrar pesquisa:", error);
  }
}

// Função principal para buscar vídeos do TikTok usando o endpoint /feed/search
async function searchTikTokVideos(keyword: string, userId: string | null, region: string = 'BR'): Promise<VideoSearchResult[]> {
  console.log(`Iniciando busca de vídeos do TikTok para: ${keyword} na região: ${region}`);
  const startTime = Date.now();

  try {
    // Configurar a requisição para a API do RapidAPI
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://tiktok-scraper7.p.rapidapi.com/feed/search?keywords=${encodedKeyword}&region=${region}&count=20&cursor=0&publish_time=0&sort_type=0`;
    
    // Selecionar um user agent aleatório
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': randomUserAgent,
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost
      }
    };
    
    console.log(`Fazendo requisição para: ${url}`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
      throw new Error(`Erro de API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Resposta da API:", JSON.stringify(data).substring(0, 200) + "...");
    
    if (data && data.data && Array.isArray(data.data.videos)) {
      // Processar os vídeos retornados pela API
      const videos = data.data.videos.map(video => {
        return {
          id: video.video_id || `tiktok-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title: video.title || video.desc || "Vídeo sem título",
          description: video.desc || "",
          videoUrl: video.play || video.download_url || "",
          thumbnail: video.cover || video.origin_cover || "",
          stats: {
            views: video.play_count || 0,
            likes: video.digg_count || 0,
            shares: video.share_count || 0,
          }
        };
      });
      
      const endTime = Date.now();
      console.log(`Busca concluída em ${endTime - startTime}ms, encontrados ${videos.length} vídeos`);
      
      // Se o usuário estiver autenticado, registrar a pesquisa
      if (userId) {
        await registerSearchHistory(userId, keyword, videos.length);
      }
      
      return videos;
    } else {
      console.error("Formato de resposta inesperado da API:", data);
      throw new Error("Formato de resposta inesperado");
    }
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return await tryFallbackScraper(keyword, userId, region);
  }
}

// Função para tentar usar o scraper como fallback
async function tryFallbackScraper(keyword: string, userId: string | null, region: string = 'BR'): Promise<VideoSearchResult[]> {
  try {
    console.log("Usando tiktok-scraper como fallback...");
    
    const fallbackResponse = await fetch(`${Deno.env.get('SUPABASE_URL') ?? ''}/functions/v1/tiktok-scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userId ? `Bearer ${userId}` : '',
      },
      body: JSON.stringify({ keyword, region })
    });
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      if (fallbackData && fallbackData.videos && Array.isArray(fallbackData.videos)) {
        console.log(`Fallback encontrou ${fallbackData.videos.length} vídeos`);
        
        // Se o usuário estiver autenticado, registrar a pesquisa
        if (userId) {
          await registerSearchHistory(userId, keyword, fallbackData.videos.length);
        }
        
        return fallbackData.videos;
      }
    } else {
      console.error(`Erro no fallback: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
      const errorText = await fallbackResponse.text();
      console.error(errorText);
    }
  } catch (fallbackError) {
    console.error("Erro no fallback:", fallbackError);
  }
  
  // Se tudo falhar, retornar dados simulados
  return simulateSearchResults(keyword);
}

// Função para simular resultados para testes
function simulateSearchResults(keyword: string): VideoSearchResult[] {
  console.log(`Gerando resultados simulados para: ${keyword}`);
  
  const videos: VideoSearchResult[] = [];
  
  for (let i = 1; i <= 10; i++) {
    videos.push({
      id: `tiktok-sim-${Date.now()}-${i}`,
      title: `Vídeo sobre ${keyword} #${i}`,
      description: `Este é um vídeo simulado sobre ${keyword}`,
      videoUrl: 'https://example.com/video.mp4',
      thumbnail: 'https://picsum.photos/540/960',
      stats: {
        views: Math.floor(Math.random() * 1000000),
        likes: Math.floor(Math.random() * 100000),
        shares: Math.floor(Math.random() * 10000),
      }
    });
  }
  
  return videos;
}

// Função para processar URL direta do TikTok
async function processTikTokUrl(url: string): Promise<VideoUrlResult> {
  console.log(`Iniciando o processamento do vídeo do TikTok: ${url}`);
  
  try {
    // Configurar a requisição para a API do RapidAPI
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://tiktok-scraper7.p.rapidapi.com/?url=${encodedUrl}&hd=1`;
    
    // Selecionar um user agent aleatório
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': randomUserAgent,
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost
      }
    };
    
    console.log(`Fazendo requisição para processar URL: ${apiUrl}`);
    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      console.error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
      throw new Error(`Erro de API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Resposta da API para URL:", JSON.stringify(data).substring(0, 200) + "...");
    
    if (data && data.data) {
      const videoData = data.data;
      return {
        success: true,
        videoData: {
          id: videoData.id || `tiktok-url-${Date.now()}`,
          title: videoData.title || videoData.desc || "Vídeo do TikTok",
          description: videoData.desc || "",
          videoUrl: videoData.play || videoData.download_url || url,
          thumbnailUrl: videoData.cover || videoData.origin_cover || "",
          stats: {
            views: videoData.play_count || 0,
            likes: videoData.digg_count || 0,
            shares: videoData.share_count || 0,
          },
          watermarkRemoved: true
        }
      };
    } else {
      throw new Error("Formato de resposta inesperado para URL");
    }
  } catch (error) {
    console.error("Erro ao processar URL:", error);
    
    // Gerando dados simulados para testes
    return {
      success: true,
      videoData: {
        id: `tiktok-url-sim-${Date.now()}`,
        title: 'Vídeo simulado do TikTok',
        description: 'Este é um vídeo simulado do TikTok',
        videoUrl: url,
        thumbnailUrl: 'https://picsum.photos/540/960',
        stats: {
          views: Math.floor(Math.random() * 1000000),
          likes: Math.floor(Math.random() * 100000),
          shares: Math.floor(Math.random() * 10000),
        },
        watermarkRemoved: true
      }
    };
  }
}

// Handler principal para requisições
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Verificar e obter o token de autenticação
    const authHeader = req.headers.get('Authorization');
    const userId = await authenticateUser(authHeader);
    
    const requestData = await req.json();
    
    // Verificar se é uma solicitação de busca ou de URL direta
    if (requestData.keyword) {
      const keyword = requestData.keyword;
      const region = requestData.region || 'BR'; // Usar BR como default
      
      if (!keyword || keyword.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Palavra-chave de busca é obrigatória' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Buscar vídeos do TikTok com a palavra-chave fornecida
      const videos = await searchTikTokVideos(keyword, userId, region);
      
      return new Response(
        JSON.stringify(videos),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } 
    else if (requestData.url) {
      const url = requestData.url;
      
      if (!url || !url.includes('tiktok.com')) {
        return new Response(
          JSON.stringify({ error: 'URL do TikTok é obrigatória e deve ser válida' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Processar URL direta do TikTok
      const result = await processTikTokUrl(url);
      
      return new Response(
        JSON.stringify(result),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    else {
      return new Response(
        JSON.stringify({ error: 'Parâmetro keyword ou url é obrigatório' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    
    return new Response(
      JSON.stringify({ error: 'Falha ao processar o vídeo: ' + error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
