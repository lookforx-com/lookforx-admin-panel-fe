import api from '@/utils/api';
import { User } from './auth';

export interface UpdateRoleData {
    userId: number;
    role: string;
}

export const userService = {
    async getAllUsers(): Promise<User[]> {
        const response = await api.get<User[]>('/admin/users');
        return response.data;
    },

    async updateUserRole(data: UpdateRoleData): Promise<User> {
        const response = await api.put<User>(`/admin/users/${data.userId}/role`, { role: data.role });
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/users/me');
        return response.data;
    }
};

export default userService;