import { API } from '@/api/index';

interface LoginProps {
  email: string;
  password: string;
}

const login = async (body: LoginProps) => API.post('/auth/login', body);

const AuthAPI = {
  login,
};

export default AuthAPI;
