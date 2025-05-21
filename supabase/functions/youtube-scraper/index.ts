
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { parse } from "https://deno.land/x/cheerio@1.0.7/mod.ts";

// Função para escapar caracteres HTML
function unescape(html: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  
  return html.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x60;|&#x3D;/g, (match) => {
    return entities[match] || match;
  });
}

// Definindo cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Chave de API do YouTube
const YOUTUBE_API_KEY = "AIzaSyB2ge0uACXS4AqZjHJ2E5T68fEUMAKtAls";

// Função para buscar vídeos usando a API oficial do YouTube
async function searchYouTubeAPI(keyword: string) {
  console.log(`Buscando shorts do YouTube via API oficial para: ${keyword}`);
  
  try {    
    // Parâmetros de pesquisa para shorts do YouTube
    const params = new URLSearchParams({
      part: 'snippet',
      q: keyword + ' shorts',
      maxResults: '20',
      videoDuration: 'short',
      type: 'video',
      key: YOUTUBE_API_KEY
    });
    
    // Fazendo a requisição à API do YouTube
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`API do YouTube respondeu com status ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API do YouTube retornou dados com sucesso`);
    
    // Processar os resultados
    const videos = [];
    
    for (const item of data.items) {
      if (item.id && item.id.videoId) {
        // Para cada vídeo, fazemos uma segunda chamada para obter estatísticas
        const videoId = item.id.videoId;
        const statsParams = new URLSearchParams({
          part: 'statistics,contentDetails',
          id: videoId,
          key: YOUTUBE_API_KEY
        });
        
        const statsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?${statsParams}`);
        const statsData = await statsResponse.json();
        
        const videoStats = statsData.items && statsData.items[0] ? statsData.items[0].statistics : null;
        const contentDetails = statsData.items && statsData.items[0] ? statsData.items[0].contentDetails : null;
        
        // Verificar se é um short (duração menor que 60 segundos)
        let duration = 0;
        if (contentDetails && contentDetails.duration) {
          // Converter duração ISO 8601 para segundos
          const match = contentDetails.duration.match(/PT(\d+)M?(\d+)?S/);
          if (match) {
            const minutes = parseInt(match[1]) || 0;
            const seconds = parseInt(match[2]) || 0;
            duration = minutes * 60 + seconds;
          }
        }
        
        // Apenas adicionar se for um short (menos de 60 segundos)
        if (duration < 60) {
          videos.push({
            id: `youtube-${videoId}`,
            title: item.snippet.title || "Short do YouTube",
            description: item.snippet.description || item.snippet.title || "Short do YouTube",
            videoUrl: `https://www.youtube.com/shorts/${videoId}`,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            stats: {
              views: videoStats ? parseInt(videoStats.viewCount) || 0 : 0,
              likes: videoStats ? parseInt(videoStats.likeCount) || 0 : 0,
              shares: 0 // A API do YouTube não fornece contagem de compartilhamentos
            },
            additionalInfo: {
              channelName: item.snippet.channelTitle,
              published: item.snippet.publishedAt,
              duration: duration
            }
          });
        }
      }
      
      if (videos.length >= 20) break;
    }
    
    console.log(`API do YouTube encontrou ${videos.length} vídeos`);
    return videos;
  } catch (error) {
    console.error("Erro ao usar a API do YouTube:", error);
    // Fallback para o método Invidious
    return await searchYouTubeShortsInvidious(keyword);
  }
}

// Helper para fazer requisições HTTP com retry e rotação de user agents
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  // Lista de user agents para rotacionar e evitar bloqueios
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  ];
  
  // Seleciona um user agent aleatório
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  
  // Configura os headers com o user agent selecionado
  const headers = {
    'User-Agent': randomUserAgent,
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Referer': 'https://www.google.com/',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    ...options.headers
  };
  
  try {
    console.log(`Tentativa de fetch para: ${url} com User-Agent: ${randomUserAgent}`);
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      console.warn(`Status de resposta: ${response.status} para URL: ${url}`);
      throw new Error(`Status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Erro ao fazer fetch: ${error.message}`);
    
    if (retries <= 1) throw error;
    
    console.log(`Tentando novamente em ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 1.5);
  }
}

// Alternativa para buscar vídeos do YouTube usando a API Invidious
async function searchYouTubeShortsInvidious(keyword) {
  console.log(`Buscando shorts do YouTube via Invidious para: ${keyword}`);
  
  try {
    // Instâncias públicas do Invidious (https://api.invidious.io/)
    // Rodízio de instâncias para evitar bloqueios
    const invidiousInstances = [
      'https://invidious.snopyta.org',
      'https://yewtu.be',
      'https://invidious.kavin.rocks',
      'https://vid.puffyan.us',
      'https://invidious.namazso.eu',
      'https://yt.artemislena.eu',
      'https://invidious.flokinet.to',
      'https://invidious.projectsegfau.lt',
      'https://y.com.sb',
      'https://invidious.nerdvpn.de'
    ];
    
    // Escolher uma instância aleatória
    const instance = invidiousInstances[Math.floor(Math.random() * invidiousInstances.length)];
    
    // Fazer a solicitação para a API do Invidious
    const searchUrl = `${instance}/api/v1/search?q=${encodeURIComponent(keyword + " shorts")}&type=video&sort_by=relevance`;
    
    const response = await fetchWithRetry(searchUrl);
    const results = await response.json();
    
    console.log(`Recebidos ${results.length} resultados da API Invidious`);
    
    // Formatar os resultados
    const videos = results
      .filter(video => video.lengthSeconds < 90) // Filtrar apenas shorts (menos de 90 segundos)
      .slice(0, 20) // Limitar a 20 resultados
      .map(video => ({
        id: `youtube-${video.videoId}`,
        title: video.title,
        description: video.description || video.title,
        videoUrl: `https://www.youtube.com/shorts/${video.videoId}`,
        thumbnail: video.videoThumbnails?.[3]?.url || video.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
        stats: {
          views: video.viewCount || 0,
          likes: Math.floor((video.viewCount || 0) * 0.05), // Estimativa
          shares: Math.floor((video.viewCount || 0) * 0.01), // Estimativa
        },
        additionalInfo: {
          published: new Date(video.published * 1000).toISOString(),
          duration: video.lengthSeconds,
          channelName: video.author
        }
      }));
    
    console.log(`Processados ${videos.length} shorts do YouTube via Invidious`);
    return videos;
  } catch (error) {
    console.error("Erro ao buscar via Invidious:", error);
    // Fallback para o método tradicional se a API Invidious falhar
    return searchYouTubeShorts(keyword);
  }
}

// Função principal para buscar shorts do YouTube
async function searchYouTubeShorts(keyword) {
  console.log(`Buscando shorts do YouTube para: ${keyword}`);
  
  // Primeiro tentar com a API oficial do YouTube
  try {
    const apiResults = await searchYouTubeAPI(keyword);
    if (apiResults && apiResults.length > 0) {
      return apiResults;
    }
  } catch (error) {
    console.log("Falha na API oficial do YouTube, recorrendo ao método alternativo:", error);
  }
  
  // Se falhar, tentar com a API Invidious
  try {
    const invidiousResults = await searchYouTubeShortsInvidious(keyword);
    if (invidiousResults && invidiousResults.length > 0) {
      return invidiousResults;
    }
  } catch (error) {
    console.log("Falha na API Invidious, recorrendo ao scraping direto:", error);
  }
  
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword + " shorts")}&sp=EgIQAQ%253D%253D`;
  
  try {
    const response = await fetchWithRetry(searchUrl);
    const html = await response.text();
    const $ = parse(html);
    
    console.log("HTML baixado com sucesso, analisando dados...");
    
    // Extrair dados dos scripts do YouTube
    let ytInitialData = null;
    $('script').each((i, element) => {
      const content = $(element).text() || '';
      if (content.includes('ytInitialData')) {
        const match = content.match(/var ytInitialData = (.+?);/);
        if (match && match[1]) {
          try {
            ytInitialData = JSON.parse(match[1]);
          } catch (e) {
            console.error("Erro ao parsear ytInitialData:", e);
          }
        }
      }
    });
    
    if (!ytInitialData) {
      console.error("Não foi possível encontrar ytInitialData");
      
      // Abordagem alternativa usando regex direto no HTML
      const altMatch = html.match(/var ytInitialData = (.+?);<\/script>/s);
      if (altMatch && altMatch[1]) {
        try {
          ytInitialData = JSON.parse(altMatch[1]);
        } catch (e) {
          console.error("Erro no método alternativo de parsing:", e);
          return [];
        }
      } else {
        return [];
      }
    }
    
    // Extrair dados dos vídeos
    const videos = [];
    const contents = ytInitialData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
    
    console.log(`Processando ${contents.length} seções de conteúdo...`);
    
    for (const section of contents) {
      const itemSectionContents = section?.itemSectionRenderer?.contents || [];
      
      for (const item of itemSectionContents) {
        if (item.videoRenderer) {
          const video = item.videoRenderer;
          
          // Obter informações do vídeo
          const videoId = video.videoId;
          const title = unescape(video.title?.runs?.[0]?.text || 'Sem título');
          let thumbnail = video.thumbnail?.thumbnails?.[(video.thumbnail?.thumbnails?.length || 1) - 1]?.url || '';
          const views = video.viewCountText?.simpleText || video.viewCountText?.runs?.[0]?.text || '0 visualizações';
          const published = video.publishedTimeText?.simpleText || '';
          const duration = video.lengthText?.simpleText || '';
          const channelName = video.ownerText?.runs?.[0]?.text || '';
          
          // Melhorar URL da thumbnail se necessário
          if (thumbnail.startsWith('//')) {
            thumbnail = `https:${thumbnail}`;
          }
          
          // Extrair thumbnail de alta qualidade
          if (videoId) {
            thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
          }
          
          // Formatar estatísticas
          const viewsNum = parseInt(views.replace(/[^\d]/g, '')) || 0;
          
          videos.push({
            id: `youtube-${videoId}`,
            title,
            description: title, // Usando título como descrição padrão
            videoUrl: `https://www.youtube.com/shorts/${videoId}`,
            thumbnail,
            stats: {
              views: viewsNum,
              likes: Math.floor(viewsNum * 0.05), // Estimativa de likes
              shares: Math.floor(viewsNum * 0.01), // Estimativa de compartilhamentos
            },
            additionalInfo: {
              published,
              duration,
              channelName
            }
          });
          
          // Limitar a 20 vídeos
          if (videos.length >= 20) break;
        }
      }
      
      if (videos.length >= 20) break;
    }
    
    console.log(`Encontrados ${videos.length} shorts do YouTube`);
    return videos;
  } catch (error) {
    console.error("Erro ao buscar shorts do YouTube:", error);
    throw error;
  }
}

// Função para processar URL direta do shorts
async function processYouTubeShortUrl(url) {
  console.log(`Processando URL do YouTube Shorts: ${url}`);
  
  try {
    // Extrair ID do vídeo da URL
    let videoId = '';
    
    if (url.includes('shorts/')) {
      videoId = url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else {
      throw new Error("Formato de URL do YouTube não reconhecido");
    }
    
    if (!videoId) {
      throw new Error("Não foi possível extrair o ID do vídeo");
    }
    
    // Buscar detalhes do vídeo via API oficial
    const params = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      id: videoId,
      key: YOUTUBE_API_KEY
    });
    
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
    
    if (!response.ok) {
      throw new Error(`API do YouTube respondeu com status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error("Vídeo não encontrado");
    }
    
    const videoInfo = data.items[0];
    const snippet = videoInfo.snippet || {};
    const statistics = videoInfo.statistics || {};
    const contentDetails = videoInfo.contentDetails || {};
    
    // Calcular duração em segundos
    let duration = 0;
    if (contentDetails && contentDetails.duration) {
      const match = contentDetails.duration.match(/PT(\d+)M?(\d+)?S/);
      if (match) {
        const minutes = parseInt(match[1]) || 0;
        const seconds = parseInt(match[2]) || 0;
        duration = minutes * 60 + seconds;
      }
    }
    
    return {
      id: `youtube-${videoId}`,
      title: snippet.title || "Short do YouTube",
      description: snippet.description || snippet.title || "Short do YouTube",
      videoUrl: `https://www.youtube.com/shorts/${videoId}`,
      thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      stats: {
        views: parseInt(statistics.viewCount) || 0,
        likes: parseInt(statistics.likeCount) || 0,
        shares: 0 // API não fornece compartilhamentos
      },
      additionalInfo: {
        channelName: snippet.channelTitle,
        published: snippet.publishedAt,
        duration: duration
      }
    };
  } catch (error) {
    console.error("Erro ao processar URL do YouTube:", error);
    throw error;
  }
}

// Handler para requisições
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
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
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
        } else if (user) {
          userId = user.id;
          console.log(`Usuário autenticado: ${userId}`);
        }
      } catch (err) {
        console.error("Erro ao verificar token:", err);
      }
    }

    const requestData = await req.json();
    console.log("Dados recebidos:", JSON.stringify(requestData));
    
    // Verificar se é uma solicitação de busca ou de URL direta
    if (requestData.keyword) {
      const keyword = requestData.keyword;
      
      if (!keyword || keyword.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Palavra-chave de busca é obrigatória' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      console.log(`Iniciando busca de shorts do YouTube para: ${keyword}`);
      const startTime = Date.now();
      
      // Usar preferencialmente a API oficial do YouTube
      const videos = await searchYouTubeAPI(keyword);
      
      const endTime = Date.now();
      console.log(`Busca concluída em ${endTime - startTime}ms, encontrados ${videos.length} vídeos`);
      console.log("Dados de resposta:", JSON.stringify(videos));
      
      // Se o usuário estiver autenticado, registrar a pesquisa
      if (userId) {
        try {
          const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
          );
          
          await supabaseAdmin.from('search_history').insert({
            user_id: userId,
            search_term: keyword,
            platform: 'youtube',
            results_count: videos.length
          });
          
          console.log(`Pesquisa registrada para o usuário ${userId}`);
        } catch (error) {
          console.error("Erro ao registrar pesquisa:", error);
        }
      }
      
      return new Response(
        JSON.stringify(videos),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (requestData.url) {
      // Processar URL direta de um short
      const url = requestData.url;
      
      if (!url || !url.includes('youtube.com')) {
        return new Response(
          JSON.stringify({ error: 'URL do YouTube inválida' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      const videoInfo = await processYouTubeShortUrl(url);
      
      return new Response(
        JSON.stringify(videoInfo),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Solicitação inválida. Forneça keyword ou url.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error(`Erro no processamento da requisição:`, error);
    
    return new Response(
      JSON.stringify({ error: `Erro no servidor: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
