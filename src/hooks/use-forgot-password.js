import useSWRMutation from 'swr/mutation';
import { axiosInstance } from '@/libs/http/axios-instance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useForgotPassword = (id) => {
    // const navigate = useNavigate();
    return useSWRMutation(
        `/auth/forgotPassword/`,
        (url, { arg }) => {
            return axiosInstance().put(url, arg);
        },
        {
            onSuccess: () => {
                toast.success('Cập nhật thành công!');
                // navigate(`/tieng-viet/account`);
            },

            onError: () => {
                toast.error('Cập nhật không thành công!');
            },
        },
    );
};