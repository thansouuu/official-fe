import { useForm} from "react-hook-form";
import { useParams} from 'react-router-dom';
import InputField from "../form/input-field";

const Login = ({ onLogin }) => {
    const { handleSubmit, control } = useForm({});
    const param=useParams();
    const onSubmit = (values) => onLogin?.(values)

    return (
        <div>        
            <div className="flex flex-col gap-4">


                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <InputField htmlType="email" name="email" control={control} placeholder="Email..." label="Email" />

                    <InputField htmlType="password" name="password" control={control} placeholder="Password..." label="Password" />

                    <button
                        className="outline-none w-full py-2.5 rounded-xl text-white bg-cyan-700 transition-colors hover:bg-cyan-800"
                        type="submit"
                    >
                        {param.language_id==='vi'?"Đăng nhập":"Login"}
                    </button>    
                </form>


                                           
            </div>
        </div>
    );
};

export default Login;
