
import { forwardRef } from 'react';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ searchTerm, setSearchTerm, isSearching, onSearch }, ref) => {
    const clearSearch = () => {
      setSearchTerm('');
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={onSearch} className="relative">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
              <Search className="h-5 w-5" />
            </div>
            <Input
              ref={ref}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Procure por conteúdos virais ou temas populares..."
              className="pl-12 pr-24 py-7 h-16 bg-white/10 border-white/10 text-white rounded-full placeholder:text-white/60 focus:border-viral-accent-purple focus:ring-1 focus:ring-viral-accent-purple/30 text-lg"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={18} />
              </button>
            )}
            <Button 
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-14 h-14 p-0 bg-viral-accent-purple hover:bg-viral-accent-purple/90 shadow-lg shadow-viral-accent-purple/20"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
          
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-white/60">
            <span className="px-2 py-1 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
              #trending
            </span>
            <span className="px-2 py-1 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
              #dance
            </span>
            <span className="px-2 py-1 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
              #viral
            </span>
            <span className="px-2 py-1 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
              #memes
            </span>
            <span className="px-2 py-1 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
              #challenge
            </span>
          </div>
        </form>
      </motion.div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
