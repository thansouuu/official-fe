import { axiosInstance } from '@/libs/http/axios-instance';
import useSWR from 'swr';

export const useAuth = () => {
    const result = useSWR('/me', (url) => axiosInstance().get(url));

    return {
        ...result,
        isLoggedIn: !result.isLoading && !result.isValidating && result.data && !result.error,
    };
};
