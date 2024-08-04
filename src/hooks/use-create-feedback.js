import { axiosInstance } from '@/libs/http/axios-instance';
import useSWRMutation from 'swr/mutation';

export const useCreateFeedback = () => {
    return useSWRMutation('/feedback', (url, { arg }) => {
        return axiosInstance().post(url, arg);
    });
};
