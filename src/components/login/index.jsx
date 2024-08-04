import { useForm } from "react-hook-form";
import InputField from "../form/input-field";

const Login = ({ onLogin }) => {
    const { handleSubmit, control } = useForm({});

    const onSubmit = (values) => onLogin?.(values)

    return (
        <div>        
            <div className="flex flex-col gap-4">


                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <InputField htmlType="email" name="email" control={control} placeholder="Nhập email đăng nhập" label="Email" />

                    <InputField htmlType="password" name="password" control={control} placeholder="Nhập mật khẩu đăng nhập" label="Password" />

                    <button
                        className="outline-none w-full py-2.5 rounded-xl text-white bg-cyan-700 transition-colors hover:bg-cyan-800"
                        type="submit"
                    >
                        Đăng nhập
                    </button>    
                </form>


                                           
            </div>
        </div>
    );
};

export default Login;
