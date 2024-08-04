import useSWRMutation from 'swr/mutation';
import { axiosInstance } from '@/libs/http/axios-instance';
import { toast } from 'react-toastify';


export const useRegister = () => {

    return useSWRMutation(
        '/auth/signup',
        (url, { arg }) => {
            return axiosInstance().post(url, arg);
        },
        {
            onSuccess: () => {

                toast.success('Đăng ký thành công!')                
            },
           
            onError: () => {
                toast.error('Đăng ký không thành công!')

            }
        },
    );
};
