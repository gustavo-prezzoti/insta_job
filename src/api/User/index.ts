import { API } from '@/api/index';

const getMe = (token: string) => API.get('/user', { headers: { 'jwt-token': token } });

const updatePasswordFirstTime = (token: string, current_password: string, new_password: string) =>
  API.post('/user/force-change-password', { current_password, new_password }, { headers: { 'jwt-token': token } });

const updateUserProfile = (name?: string, current_password?: string, new_password?: string) =>
  API.post('/user/update', { name, current_password, new_password });

const UserAPI = {
  getMe,
  updatePasswordFirstTime,
  updateUserProfile,
};

export default UserAPI;
