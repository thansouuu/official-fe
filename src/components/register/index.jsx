import { useForm } from "react-hook-form";
import InputField from "../form/input-field";

const Register = ({ onRegister }) => {
    const { handleSubmit, control } = useForm({});

    const onSubmit = (values) => onRegister?.(values)

    return (
        <div>        
            <div className="flex flex-col gap-4">


                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <InputField name="fullname" control={control} placeholder="Nhập họ tên" label="Họ tên" />
                    <InputField htmlType="email" name="email" control={control} placeholder="Nhập email đăng ký" label="Email" />

                    <InputField htmlType="password" name="password" control={control} placeholder="Nhập mật khẩu đăng ký" label="Password" />

                    <button
                        className="outline-none w-full py-2.5 rounded-xl text-white bg-cyan-700 transition-colors hover:bg-cyan-800"
                        type="submit"
                    >
                        Đăng ký
                    </button>    
                </form>


                                           
            </div>
        </div>
    );
};

export default Register;
