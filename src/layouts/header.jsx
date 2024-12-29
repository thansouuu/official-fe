import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import classNames from 'classnames';
import cn from '@/helper/cn';
import { useAuth } from '@/hooks/use-auth';
import Category from '@/components/utils/Category';
import Map from '@/components/utils/Map';
import Login from '@/components/utils/Login';
import Magnify from '@/components/utils/Magnify';
import Burger from '@/components/utils/Burger';
import Logo from '@/components/utils/Logo';
import Like from '@/components/utils/Like';
import Home from '@/components/utils/Home';
import Bot from '@/components/utils/Bot';
import Manual from '@/components/utils/Manual';
import Travel from '@/components/utils/Travel';
import Story from '@/components/utils/Story';
import Hometown from '@/components/utils/Hometown';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const HeaderRoot = ({ toggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [navbarOpen, setNavbarOpen] = useState(false);
    const { isLoggedIn, mutate, data } = useAuth();
    const [zoomEnabled, setZoomEnabled] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleNavbarToggle = () => {
        setNavbarOpen(!navbarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        mutate();
        localStorage.removeItem('user');
        setDropdownOpen(false);
    };


    const handleZoomToggle = () => {
        setZoomEnabled(!zoomEnabled);
        if (zoomEnabled) window.location.reload();
        // document.body.style.touchAction = zoomEnabled ? 'auto' : 'none';
    };
   

    useEffect(() => {
        const addGoogleTranslateScript = () => {
            if (!document.querySelector('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
                const script = document.createElement('script');
                script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                script.async = true;
                document.body.appendChild(script);
                window.googleTranslateElementInit = () => {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'vi',
                            includedLanguages: 'en,vi,fr,es',
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        },
                        'google_translate_element',
                    );
                };
            } 
        };

        const hideGoogleTranslateBar = () => {
            const observer = new MutationObserver(() => {
                const translateBar = document.querySelector('.goog-te-banner-frame');
                if (translateBar) {
                    translateBar.style.display = 'none';
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        };

        const handleTranslateStart = () => {
            document.body.classList.add('translate-active');
            document.querySelector('body > .skiptranslate').style.display = 'normal';
        };

        const handleTranslateEnd = () => {
            document.body.classList.remove('translate-active');
            document.querySelector('body > .skiptranslate').style.display = 'none';
        };

        document.addEventListener('click', (event) => {
            const translateElement = document.getElementById('google_translate_element');
            if (translateElement?.contains(event.target)) {
                handleTranslateStart();
            } else {
                handleTranslateEnd();
            }
        });

        if (!window.google || !window.google.translate) {
            addGoogleTranslateScript();
            hideGoogleTranslateBar();
        } else {
            window.googleTranslateElementInit();
        }
    }, []);
    
    const handleSelectProduct = (product) => {
        setSearchTerm(product.title);
        setSearchResult([]);
    };

    const navigate = useNavigate();
    const param=useParams();
    const [value, setValue] = useState(1);
    const images = ['/flag/vietnam.png', '/flag/english.webp']; 
    const language_id=param.language_id;

  // Hàm xử lý thay đổi giá trị khi nút được bấm
    const handleClick = () => {
        if (value === 1) {
            const newPathname = location.pathname.replace('/vi/', '/en/');
            navigate(newPathname);
            setValue(2);  // Nếu giá trị hiện tại là 1, chuyển sang 2 (giữa)
        } else if (value === 2) {
            const newPathname = location.pathname.replace('/en/', '/vi/');
            navigate(newPathname);
            setValue(1);  // Nếu giá trị hiện tại là 2, chuyển sang 3 (phải)
        } 
    };

    return (
        <nav style={{
            backgroundImage: 'url("/header.png")',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            backgroundSize: 'contain',

            }} 
            className="bg-[#faebd7] px-4 border-gray-200 dark:bg-gray-900 fixed top-0 left-0 right-0 z-10">
            <div className="flex items-center mx-auto py-4 max-w-[992px] z-214783646">
                    <>
                    <Helmet>
                        {zoomEnabled && (
                        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3, minimum-scale=1" />
                        )}
                    </Helmet>
                    <button onClick={toggleSidebar} className="focus:outline-none hidden md:block">
                        <div className="border border-black p-2 rounded-lg bg-gray-200">
                            <Burger/>
                        </div>
                    </button>
                        <div className="relative flex items-center justify-end">
                            <button
                                data-collapse-toggle="navbar-user"
                                type="button"
                                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="navbar-user"
                                aria-expanded={navbarOpen}
                                onClick={handleNavbarToggle}
                            >
                                <span className="sr-only">Open main menu</span>
                                <Logo />
                            </button>
                        </div>
                        {/* <div className="flex items-center gap-1 mx-auto">
                            <div className="w-[35px] h-[35px] ">
                                <img
                                    src="https://raw.githubusercontent.com/thansouuu/data-image/main/%E1%BA%A3nh%20app/logo.jpg"
                                    alt="logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h5 className="text-nowrap text-[20px] font-medium">LỊCH SỬ TỈNH TRÀ VINH</h5>
                        </div> */}
                    </>
            </div>
                <div 
                    className={classNames(
                        'items-center justify-between w-[75%] md:flex md:w-auto md:order-1 absolute top-full left-0 transition-transform duration-300 ease-in-out',
                        {
                            'translate-x-0': navbarOpen,
                            '-translate-x-full': !navbarOpen,
                        },
                    )}
                    id="navbar-user"
                    
                >
                    <ul  className="flex h-screen flex-col font-medium p-4 md:p-0 border border-gray-100 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
                    >
                        <li 
                            
                        >
                            <Link
                                to={`/language/${param.language_id}/main`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Home/>
                                {language_id === 'vi' ? 'Trang chủ' : 'Home'}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/language/${param.language_id}/account`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}

                            >
                                <Login />
                                {language_id==='vi'?"Đăng ký / Đăng nhập": "Register / Login"}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/language/${param.language_id}/figure`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Category />
                                {language_id==='vi'? "Danh mục": "Categories"}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/language/${param.language_id}/hometown`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Hometown />
                                {language_id==='vi'? "Giáo dục địa phương": "Local Education"}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/language/${param.language_id}/story`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Story />
                                {language_id==='vi'? "Câu chuyện": "Stories"}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/language/${param.language_id}/like`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Like />
                                {language_id==='vi'? "Yêu thích": "Favorites"}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/language/${param.language_id}/map-phone`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Map />
                                {language_id==='vi'? "Khám phá du lịch": "Tourism"}
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                to="/tieng-viet/chatbot"
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Bot />
                                <div>Chatbot</div>
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                to={`/language/${param.language_id}/find`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Magnify />
                                {language_id==='vi'? "Tìm kiếm": "Search"}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/language/${param.language_id}/hdsd`}
                                className={cn('flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 md:hidden')}
                                aria-current="page"
                                onClick={() => {setNavbarOpen(false), window.Location.reload()}}
                            >
                                <Manual />
                                {language_id==='vi'? "Hướng dẫn sử dụng": "User Guide"}
                            </Link>
                        </li>
                        {/* <li>
                            <div
                                id="google_translate_element"
                                // className="flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 cursor-pointer"
                            ></div>  
                        </li> */}
                        <li>
                            <button 
                                onClick={handleClick} 
                                className="px-4 py-2 rounded flex items-center gap-2">
                                {/* Hiển thị "Ngôn ngữ" và hình ảnh trên cùng một dòng */}
                                <p className="text-lg font-semibold">{language_id==='vi'? "Ngôn ngữ": "Language"} </p>
                                <img 
                                    src={images[value - 1]} // Lấy hình ảnh dựa trên giá trị của value
                                    alt={`Hình ảnh ${value}`}
                                    className="w-12 h-7 object-cover" // Điều chỉnh kích thước hình ảnh
                                />
                            </button>
                        </li>
                        {/* <li>
                            <button
                                onClick={handleZoomToggle}
                                className="flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-200 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            >
                                {zoomEnabled ? 'Tắt thu phóng' : 'Bật thu phóng'}
                            </button>
                            
                        </li>                     */}
                        
                    </ul>
                </div>
        </nav>
    );
};

export default HeaderRoot;
