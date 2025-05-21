
import { useState } from 'react';
import { VideoResult } from '@/types/video';
import { Button } from '@/components/ui/button';
import SearchVideoCard from './SearchVideoCard';
import VideoPreviewModal from './VideoPreviewModal';
import SearchResultsLoading from './SearchResultsLoading';

interface SearchResultsProps {
  searchResults: VideoResult[];
  selectedVideos: VideoResult[];
  toggleVideoSelection: (id: string) => void;
  onContinue: () => void;
  isLoading?: boolean;
}

const SearchResults = ({ 
  searchResults, 
  selectedVideos, 
  toggleVideoSelection, 
  onContinue, 
  isLoading = false 
}: SearchResultsProps) => {
  const [previewVideo, setPreviewVideo] = useState<VideoResult | null>(null);

  // Se não houver resultados e não estiver carregando, não exibir nada
  if (searchResults.length === 0 && !isLoading) {
    return null;
  }

  // Filtra os vídeos selecionados para apenas incluir aqueles que estão nos resultados de pesquisa atual
  const currentSelectedVideos = selectedVideos.filter(selectedVideo => 
    searchResults.some(searchResult => searchResult.id === selectedVideo.id)
  );

  const handlePreview = (e: React.MouseEvent, video: VideoResult) => {
    e.stopPropagation();
    setPreviewVideo(video);
  };

  const closePreview = () => {
    setPreviewVideo(null);
  };

  return (
    <div className="mt-10">
      {searchResults.length > 0 || isLoading ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isLoading 
                ? "Buscando vídeos..." 
                : `Resultados (${searchResults.length})`}
            </h2>
            
            {!isLoading && searchResults.length > 0 && (
              <Button 
                onClick={onContinue}
                disabled={currentSelectedVideos.length === 0}
                className="bg-viral-accent-purple hover:bg-viral-accent-purple/90 text-white"
              >
                Continuar com {currentSelectedVideos.length} {currentSelectedVideos.length === 1 ? 'vídeo' : 'vídeos'}
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <SearchResultsLoading />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((video) => {
                const isSelected = selectedVideos.some(v => v.id === video.id);
                
                return (
                  <SearchVideoCard
                    key={video.id}
                    video={video}
                    isSelected={isSelected}
                    toggleVideoSelection={toggleVideoSelection}
                    onPreview={handlePreview}
                  />
                );
              })}
            </div>
          )}
          
          {/* Modal de visualização do vídeo */}
          <VideoPreviewModal 
            video={previewVideo} 
            onClose={closePreview} 
          />
        </>
      ) : null}
    </div>
  );
};

export default SearchResults;
