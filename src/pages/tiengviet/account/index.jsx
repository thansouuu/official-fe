import Detail from '@/components/detail';
import Login from '@/components/login';
import Register from '@/components/register';
import { useAuth } from '@/hooks/use-auth';
import { useLogin } from '@/hooks/use-login';
import { useRegister } from '@/hooks/use-register';
import { useUpdate } from '@/hooks/use-update';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { isLoggedIn, mutate } = useAuth();
    const { trigger: login } = useLogin();
    const { trigger: update } = useUpdate();
    const { trigger: register } = useRegister();
    const navigate = useNavigate();
    const accountInit = [
        {
            label: 'Đăng nhập',
            component: <Login onLogin={loginHandler} />,
        },
        {
            label: 'Đăng kí',
            component: <Register onRegister={registerHandler} />,
        },
    ];

    function loginHandler(values) {
        login(values);
    }
    function updateHandler(values) {
        update(values);
    }
    function registerHandler(values) {
        register(values);
    }

    return (
        <div className="container mx-auto p-4 flex justify-center">
            {/* <div className="w-full md:w-[500px] mx-auto max-h-screen overflow-y-auto bg-black/60 p-8 rounded-2xl backdrop-blur-md">
                {
                    isLoggedIn || anonymousMode ?
                    <button
                        className="outline-none w-full py-2.5 rounded-xl text-white bg-white/10 transition-colors hover:bg-white/20"
                        onClick={logoutHandler}
                    >
                        Đăng xuất
                    </button>
                    :
                    <Login onLogin={loginHandler} />            
                }               
            </div> */}
            <div className="w-full max-w-md px-2 py-16 sm:px-0">
                {!isLoggedIn ? (
                    <>
                        <Tab.Group>
                            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                                {accountInit.map((account, index) => (
                                    <Tab
                                        key={index}
                                        className={({ selected }) =>
                                            clsx(
                                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                                selected
                                                    ? 'bg-white/80 text-gray-800 shadow'
                                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                                            )
                                        }
                                    >
                                        {account.label}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <Tab.Panels className="mt-2">
                                {accountInit.map((account, idx) => (
                                    <Tab.Panel
                                        key={idx}
                                        className={clsx(
                                            'rounded-xl bg-white/80 p-3',
                                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        )}
                                    >
                                        {account.component}
                                    </Tab.Panel>
                                ))}
                            </Tab.Panels>
                        </Tab.Group>
                        <p
                            onClick={() => navigate('/tieng-viet/forgot-password')}
                            className="text-right mt-[40px] font-bold cursor-pointer"
                        >
                            Quên mật khẩu?
                        </p>
                    </>
                ) : (
                    <>
                        <Detail onUpdate={updateHandler}></Detail>
                    </>
                )}
            </div>
            <div className="h-[1000px]"></div>
        </div>
    );
};

export default LoginPage;