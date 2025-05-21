import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Cloud,
  Search,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <MainLayout showNavigation={false}>
      <title>VIRALYX.AI - IA para Redes Sociais</title>

      {/* Hero Section com design mais moderno e minimalista */}
      <section className="min-h-screen relative flex items-center justify-center px-4 py-12 md:py-0 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/patterns/neural-network.svg')] opacity-[0.03]"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left column: Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 md:order-1"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight">
                <span className="relative z-10">
                  Transforme suas redes sociais com
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                      {' '}
                      inteligência artificial
                    </span>
                    <motion.span
                      className="absolute -z-10 bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-sm"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </span>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 font-light leading-relaxed">
                O VIRALYX.AI analisa as tendências, personaliza conteúdo e automatiza postagens para você economizar
                tempo e aumentar seu engajamento.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-medium py-6 px-8 rounded-full shadow-lg w-full sm:w-auto"
                  >
                    Começar agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 text-white/60 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-purple-400" />
                  <span>7 dias grátis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-purple-400" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-purple-400" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </motion.div>

            {/* Right column: Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-1 md:order-2 relative"
            >
              <div className="relative p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <motion.div
                  className="absolute inset-0 opacity-30 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                  animate={{ opacity: [0.2, 0.3, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Elemento visual no lugar da imagem */}
                <div className="w-full h-64 md:h-96 flex items-center justify-center bg-black/30 rounded-lg overflow-hidden">
                  <div className="relative w-full h-full">
                    {/* Grade de fundo */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                    {/* Elementos de UI */}
                    <div className="absolute top-6 left-6 right-6 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center px-4">
                      <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                      <div className="flex-1 h-4 bg-white/10 rounded-full"></div>
                      <div className="w-20 h-6 bg-indigo-500/30 rounded-md ml-4 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white/60 mr-1"></div>
                        <div className="w-10 h-2 bg-white/30 rounded-full"></div>
                      </div>
                    </div>

                    {/* Card central */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-white/10 overflow-hidden p-4">
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/40 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white/80" />
                        </div>
                        <div className="ml-3">
                          <div className="w-32 h-3 bg-white/40 rounded-full mb-2"></div>
                          <div className="w-20 h-2 bg-white/20 rounded-full"></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="w-full h-2 bg-white/10 rounded-full">
                          <div className="h-full w-3/4 bg-indigo-500/60 rounded-full"></div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full">
                          <div className="h-full w-1/2 bg-purple-500/60 rounded-full"></div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full">
                          <div className="h-full w-2/3 bg-indigo-400/60 rounded-full"></div>
                        </div>
                      </div>

                      <div className="absolute bottom-3 right-3 flex space-x-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                          <Star className="w-3 h-3 text-yellow-400" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                        </div>
                      </div>
                    </div>

                    {/* Cards adicionais */}
                    <div className="absolute top-28 right-8 w-32 h-24 bg-white/5 rounded-lg border border-white/10 rotate-6 p-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                        <Cloud className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full mb-2"></div>
                      <div className="w-4/5 h-2 bg-white/20 rounded-full"></div>
                    </div>

                    <div className="absolute bottom-24 left-8 w-32 h-24 bg-white/5 rounded-lg border border-white/10 -rotate-3 p-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full mb-2"></div>
                      <div className="w-3/5 h-2 bg-white/20 rounded-full"></div>
                    </div>

                    {/* Elementos animados */}
                    <motion.div
                      className="absolute top-1/4 left-1/4 w-3 h-3 bg-indigo-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.8, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.8, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute top-1/3 right-1/4 w-2 h-2 bg-indigo-300 rounded-full"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.7, 0.2] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-lg opacity-80 animate-pulse-light"></div>
              </div>

              {/* Floating elements - Ajustados para não sobrepor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-20 -left-5 md:-left-10 max-w-44 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-medium text-white/80">Análise de tendências</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  </div>
                  <span className="ml-2 text-xs font-medium text-white/80">80%</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -top-14 -right-5 md:-right-10 max-w-44 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-medium text-white/80">Engajamento</span>
                </div>
                <p className="text-xs text-white/60">Crescimento de 50% em 30 dias</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider com design único */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1640]/50"></div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1/3 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
      </div>

      {/* Recursos principais com design moderno */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Recursos que impulsionam sua presença digital
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              Tecnologia avançada que simplifica sua estratégia de conteúdo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl border border-white/10 backdrop-blur-sm"></div>
              <div className="relative">
                <div className="w-12 h-12 mb-5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Pesquisa Inteligente</h3>
                <p className="text-white/60">
                  Descubra conteúdos virais no TikTok e Instagram que ressoam com seu nicho e público-alvo.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl border border-white/10 backdrop-blur-sm"></div>
              <div className="relative">
                <div className="w-12 h-12 mb-5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5 9L15.6716 9.17157C17.0049 10.5049 17.6716 11.1716 17.6716 12C17.6716 12.8284 17.0049 13.4951 15.6716 14.8284L15.5 15M13 17.5L12 21L11 17.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Personalização com IA</h3>
                <p className="text-white/60">
                  Transforme conteúdos populares para se alinharem perfeitamente com sua identidade e estilo.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl border border-white/10 backdrop-blur-sm"></div>
              <div className="relative">
                <div className="w-12 h-12 mb-5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12L15 15M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Automação Completa</h3>
                <p className="text-white/60">
                  Agende suas publicações para os melhores horários e mantenha sua presença constante.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Como funciona - com timeline vertical moderna */}
      <section className="py-16 px-4" id="como-funciona">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Como o VIRALYX.AI funciona
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              Um processo simples em três etapas para revolucionar sua presença digital
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/30 via-purple-500/30 to-transparent"></div>

            <div className="space-y-16 md:space-y-24 relative">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="md:text-right order-2 md:order-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-lg mb-4 md:mb-0 md:hidden">
                    1
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">Descubra conteúdo viral</h3>
                  <p className="text-white/70">
                    Use nossa ferramenta de pesquisa inteligente para encontrar os vídeos e posts que estão gerando mais
                    engajamento no seu nicho.
                  </p>
                </div>
                <div className="order-1 md:order-2 flex justify-center md:justify-start relative">
                  <div className="hidden md:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-lg z-10">
                    1
                  </div>
                  <div className="w-full max-w-sm p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <div className="aspect-video w-full h-auto bg-black/20 rounded-lg flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
                        <Search className="h-10 w-10 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="flex justify-center md:justify-end relative">
                  <div className="hidden md:flex absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-lg z-10">
                    2
                  </div>
                  <div className="w-full max-w-sm p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <div className="aspect-video w-full h-auto bg-black/20 rounded-lg flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-lg mb-4 md:hidden">
                    2
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">Personalize para sua marca</h3>
                  <p className="text-white/70">
                    Nossa IA adapta o conteúdo para se alinhar com seu estilo, voz e objetivos de marca, mantendo a
                    essência do que o torna viral.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="md:text-right order-2 md:order-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-lg mb-4 md:mb-0 md:hidden">
                    3
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">Agende e automatize</h3>
                  <p className="text-white/70">
                    Programe suas publicações para os momentos ideais quando seu público está mais ativo, maximizando o
                    engajamento.
                  </p>
                </div>
                <div className="order-1 md:order-2 flex justify-center md:justify-start relative">
                  <div className="hidden md:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-lg z-10">
                    3
                  </div>
                  <div className="w-full max-w-sm p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <div className="aspect-video w-full h-auto bg-black/20 rounded-lg flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
                        <Calendar className="h-10 w-10 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final com design moderno e minimalista */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#13102C] via-indigo-900/20 to-[#13102C]"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Pronto para transformar sua presença digital?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de criadores que estão economizando tempo e aumentando seu alcance com VIRALYX.AI
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-medium py-6 px-10 rounded-full shadow-lg w-full sm:w-auto"
                >
                  Começar gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex justify-center gap-x-8 gap-y-4 flex-wrap text-white/60 text-sm mt-8">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-purple-400" />
                <span>Plataforma intuitiva</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-purple-400" />
                <span>Suporte dedicado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-purple-400" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rodapé simples */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-8 w-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/10 group-hover:border-white/20 transition-all duration-300 overflow-hidden mr-2">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* Elemento gráfico igual ao do cabeçalho */}
              <div className="h-5 w-5 relative z-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-70"></div>
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg md:text-xl tracking-tight text-center">
                VIRALYX<span className="text-indigo-400">.AI</span>
              </span>
              <motion.span
                className="text-white/70 text-[10px] font-medium tracking-wide text-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                INTELIGÊNCIA ARTIFICIAL VIRAL
              </motion.span>
            </div>
          </div>

          <div className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} VIRALYX.AI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </MainLayout>
  );
};

export default Index;
