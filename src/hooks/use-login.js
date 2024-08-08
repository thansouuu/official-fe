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
                    fetchUser();
                    mutate('/me');
                }
            },
           
            onError: () => {
                toast.error('Đăng nhập không thành công!')

            }
        },
    );
};

const fetchUser = async () => {
    try {
        const response = await fetch(`http://localhost:3001/api/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('userId', userData.data.id);
            console.log(userId)
        } 
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};