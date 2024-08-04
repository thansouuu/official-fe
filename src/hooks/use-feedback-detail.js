import { axiosInstance } from '@/libs/http/axios-instance';
import useSWR from 'swr';

export const useFeedbackDetail = (id) => {
    return useSWR(id ? `/feedback/${id}` : null, (url) => {
        return axiosInstance().get(url);
    });
};
