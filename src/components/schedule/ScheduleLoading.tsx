
import MainLayout from '@/layouts/MainLayout';
import { Calendar } from 'lucide-react';

const ScheduleLoading = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
      <div className="flex items-center mb-8">
        <Calendar className="text-viral-accent-purple mr-3 h-6 w-6" />
        <h1 className="text-2xl font-bold text-white">
          Agendamentos
        </h1>
      </div>
      
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-viral-accent-purple"></div>
      </div>
    </div>
  </MainLayout>
);

export default ScheduleLoading;
