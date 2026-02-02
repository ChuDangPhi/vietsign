/**
 * User Hooks
 * 
 * React Query hooks để fetch và quản lý dữ liệu người dùng.
 * Sử dụng react-query để caching và state management.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserModel from '@/domain/entities/User';
import * as userService from '@/services/userService';

// Query Keys
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: any) => [...userKeys.lists(), filters] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
    profile: () => [...userKeys.all, 'profile'] as const,
    pending: () => [...userKeys.all, 'pending'] as const,
    approvalStats: () => [...userKeys.all, 'approval-stats'] as const,
};

/**
 * Hook để lấy danh sách tất cả users
 */
export function useUsers(filters?: any) {
    return useQuery({
        queryKey: userKeys.list(filters),
        queryFn: () => userService.fetchAllUsers(filters),
    });
}

/**
 * Hook để lấy user theo ID
 */
export function useUser(id: number) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => userService.fetchUserById(id),
        enabled: !!id,
    });
}

/**
 * Hook để lấy profile của user hiện tại
 */
export function useUserProfile() {
    return useQuery({
        queryKey: userKeys.profile(),
        queryFn: async () => {
            const response = await UserModel.getProfile();
            return response.user;
        },
    });
}

/**
 * Hook để lấy pending users
 */
export function usePendingUsers() {
    return useQuery({
        queryKey: userKeys.pending(),
        queryFn: () => userService.fetchPendingUsers(),
    });
}

/**
 * Hook để lấy approval stats
 */
export function useApprovalStats() {
    return useQuery({
        queryKey: userKeys.approvalStats(),
        queryFn: () => userService.fetchApprovalStats(),
    });
}

/**
 * Hook để update profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => UserModel.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
        },
    });
}

/**
 * Hook để đổi mật khẩu
 */
export function useChangePassword() {
    return useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) => 
            UserModel.changePassword(data),
    });
}

/**
 * Hook để tạo user mới (Admin)
 */
export function useCreateUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => UserModel.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook để update user (Admin)
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => 
            UserModel.updateUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook để xóa user (Admin)
 */
export function useDeleteUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => UserModel.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook để phê duyệt user (Admin)
 */
export function useApproveUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => UserModel.approveUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.pending() });
            queryClient.invalidateQueries({ queryKey: userKeys.approvalStats() });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook để từ chối user (Admin)
 */
export function useRejectUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason?: string }) => 
            UserModel.rejectUser(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.pending() });
            queryClient.invalidateQueries({ queryKey: userKeys.approvalStats() });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook để đổi role user (Admin)
 */
export function useChangeUserRole() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, roleCode }: { id: number; roleCode: string }) => 
            UserModel.changeUserRole(id, roleCode),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}
