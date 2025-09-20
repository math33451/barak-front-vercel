import { UserCredentials } from '@/types';

const mockUsers = [
  { username: 'user@example.com', password: 'password' },
];

const login = async (credentials: UserCredentials): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = mockUsers.find(
    (u) => u.username === credentials.username && u.password === credentials.password
  );
  return !!user;
};

export const AuthService = {
  login,
};
