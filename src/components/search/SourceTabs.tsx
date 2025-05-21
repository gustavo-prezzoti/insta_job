import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Ícone personalizado do TikTok
const TiktokIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM9.5 3.5C9.5 3.22386 9.27614 3 9 3C8.72386 3 8.5 3.22386 8.5 3.5V11.5C8.5 11.7761 8.72386 12 9 12C9.27614 12 9.5 11.7761 9.5 11.5V3.5ZM7 4C7.27614 4 7.5 4.22386 7.5 4.5V12.5C7.5 12.7761 7.27614 13 7 13C6.72386 13 6.5 12.7761 6.5 12.5V4.5C6.5 4.22386 6.72386 4 7 4ZM4.5 6.5C4.5 6.22386 4.72386 6 5 6C5.27614 6 5.5 6.22386 5.5 6.5V11.5C5.5 11.7761 5.27614 12 5 12C4.72386 12 4.5 11.7761 4.5 11.5V6.5ZM11 5C10.7239 5 10.5 5.22386 10.5 5.5V10.5C10.5 10.7761 10.7239 11 11 11C11.2761 11 11.5 10.7761 11.5 10.5V5.5C11.5 5.22386 11.2761 5 11 5Z" fill="currentColor" />
  </svg>;
const SourceTabs = () => {
  // Como agora temos apenas o TikTok, não precisamos mais da prop activeSource nem do handler onSourceChange
  return <div className="flex justify-center mb-8">
      <div className="bg-white/10 backdrop-blur-md rounded-full p-1.5 shadow-lg border border-white/20">
        <div className="flex items-center relative">
          <div className="relative px-6 py-2.5 rounded-full text-sm font-medium transition-all z-10 flex items-center gap-2">
            <motion.div layoutId="source-tab-pill" transition={{
            type: "spring",
            duration: 0.5
          }} className="absolute inset-0 rounded-full shadow-md bg-zinc-600" />
            <span className="relative z-10"><TiktokIcon /></span>
            <span className="relative z-10">TikTok</span>
          </div>
        </div>
      </div>
    </div>;
};
export default SourceTabs;