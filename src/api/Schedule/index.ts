import { API } from '@/api/index';

const getSchedule = () => API.get('/schedule');

const updateSchedule = (
  token: string,
  body: {
    id: string;
    type: 'feed' | 'reel' | 'story';
    schedule_date?: string;
    caption: string;
    hashtags?: string;
  },
) => API.post('/schedule/update', body, { headers: { 'jwt-token': token } });

const deleteSchedule = (id: string) => API.post('/schedule/delete', { id });

const ScheduleAPI = {
  getSchedule,
  updateSchedule,
  deleteSchedule,
};

export default ScheduleAPI;
