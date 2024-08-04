import { axiosInstance } from '@/libs/http/axios-instance';
import useSWR from 'swr';

export const useFeedback = () => {
    return useSWR('/get-feedback', () => {
        return axiosInstance().get('/feedback');
    });
};
