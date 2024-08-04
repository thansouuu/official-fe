import useSWRMutation from 'swr/mutation';
import { axiosInstance } from '@/libs/http/axios-instance';
import { toast } from 'react-toastify';
import { useAuth } from './use-auth';

export const useUpdate = () => {
    const { data } = useAuth();
    const id = data?.data?._id;
    return useSWRMutation(
        `/auth/update/${id}`,
        (url, { arg }) => {
            return axiosInstance().put(url, arg);
        },
        {
            onSuccess: () => {
                toast.success('Cập nhật thành công!');
            },

            onError: () => {
                toast.error('Cập nhật không thành công!');
            },
        },
    );
};