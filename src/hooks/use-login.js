import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { axiosInstance } from '@/libs/http/axios-instance';
import { toast } from 'react-toastify';


export const useLogin = () => {
    const { mutate } = useSWRConfig();

    return useSWRMutation(
        '/auth/signin',
        (url, { arg }) => {
            return axiosInstance().post(url, arg);
        },
        {
            onSuccess: (data) => {
                const token = data?.accessToken?.token;

                if (token) {
                    localStorage.setItem('accessToken', token);
                    toast.success('Đăng nhập thành công!')

                    mutate('/me');
                }
            },
           
            onError: () => {
                toast.error('Đăng nhập không thành công!')

            }
        },
    );
};
