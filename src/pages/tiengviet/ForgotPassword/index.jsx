import InputField from '@/components/form/input-field';
import { useAuth } from '@/hooks/use-auth';
import { useForgotPassword } from '@/hooks/use-forgot-password';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const index = () => {
    const navigate = useNavigate();
    const { handleSubmit, control } = useForm({
        defaultValues: {
            id: '',
            password: '',
            email: '',
        },
        mode: 'onChange',
    });
    const { trigger: forgotPassword } = useForgotPassword();
    const onSubmit = (values) => {
        forgotPassword(values);
    };
    return (
        <div className="w-[50%] mt-[100px] mx-auto">
            {' '}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <InputField name="id" control={control} placeholder="Nhập id của bạn" label="ID" />
                <InputField name="email" control={control} placeholder="Nhập email của bạn" label="Email" />
                <InputField
                    htmlType="password"
                    name="password"
                    control={control}
                    placeholder="Nhập mật khẩu đăng nhập"
                    label="Password"
                />

                <button
                    className="outline-none w-full py-2.5 rounded-xl text-white bg-cyan-700 transition-colors hover:bg-cyan-800"
                    type="submit"
                >
                    Cập nhật
                </button>
                <button
                    onClick={() => {
                        navigate('/tieng-viet/account');
                    }}
                    className="outline-none w-full py-2.5 rounded-xl text-white bg-red-700 transition-colors hover:bg-red-800"
                    type="submit"
                >
                    Trở về
                </button>
            </form>
        </div>
    );
};

export default index;

