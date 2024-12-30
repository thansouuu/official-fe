import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import cn from '@/helper/cn';
import { useAuth } from '@/hooks/use-auth';
import Category from '@/components/utils/Category';
import Map from '@/components/utils/Map';
import Login from '@/components/utils/Login';
import Magnify from '@/components/utils/Magnify';
import Burger from '@/components/utils/Burger';
import Logo from '@/components/utils/Logo';
import productData from '@/data/product';
import Like from '@/components/utils/Like';
import Home from '@/components/utils/Home';
import Bot from '@/components/utils/Bot';
import Manual from '@/components/utils/Manual';
// import { useNavigate } from 'react-router-dom';
import Dropdown from '@/components/dropdown';
import Travel from '@/components/utils/Travel';
import Story from '@/components/utils/Story';
import Hometown from '@/components/utils/Hometown';
import Chat_Bot from '@/pages/tiengviet/chatbot';
import { useNavigate, useParams ,useLocation} from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(1);
    const { language_id, id, productId } = useParams();
    
    const images = ['/flag/vietnam.png', '/flag/english.webp']; 
  

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
        <>
        {/* <Chat_Bot/> */}
        <div
            className={`hidden md:block z-20 fixed top-0 left-0 h-full w-[18%] bg-white text-red-800 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out overflow-auto`}
        >
            <div className="flex justify-end p-4" onClick={toggleSidebar}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="black">
                    <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
                </svg>
            </div>
            <ul className="mt-3">
                <span
                    // to="/tieng-viet/main"
                    onClick={() => {
                        navigate(`/language/${language_id}/main`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Home />
                        {language_id === 'vi' ? 'Trang chủ' : 'Home'}
                    </li>
                </span>
                <span
                    // to="/tieng-viet/account"
                    className={location.pathname.includes('account') ? 'bg-gray-700' : ''}
                    onClick={() => {
                        navigate(`/language/${language_id}/account`);
                        // window.location.reload();
                    }}
                >
                    <li className="p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black">
                        <Login />
                        {language_id==='vi'?"Đăng ký / Đăng nhập": "Register / Login"}

                    </li>
                </span>
                <span
                    // to="/tieng-viet/figure"
                    onClick={() => {
                        navigate(`/language/${language_id}/figure`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Category />
                        {language_id==='vi'? "Danh mục": "Categories"}
                    </li>
                </span>
                <span
                    // to="/tieng-viet/hometown"
                    onClick={() => {
                        navigate(`/language/${language_id}/hometown`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Hometown />
                        {language_id==='vi'? "Giáo dục địa phương": "Local Education"}
                    </li>
                </span>
                <span
                    // to="/tieng-viet/story"
                    onClick={() => {
                        navigate(`/language/${language_id}/story`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Story />
                        {language_id==='vi'? "Câu chuyện": "Stories"}
                    </li>
                </span>
                <span
                    // to="/tieng-viet/like"
                    onClick={() => {
                        navigate(`/language/${language_id}/like`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Like />
                        {language_id==='vi'? "Yêu thích": "Favorites"}
                    </li>
                </span>
                <span
                    // to="/tieng-viet/vt-map"
                    onClick={() => {
                        navigate(`/language/${language_id}/map-phone`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Map />
                        {language_id==='vi'? "Khám phá du lịch": "Tourism"}
                    </li>
                </span>
                {/* <Link
                    to="/tieng-viet/chatbot"
                    onClick={() => {
                        // navigate(`/tieng-viet/chatbot`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Bot />
                        Chatbot
                    </li>
                </Link> */}
                <span
                    // to="/tieng-viet/find"
                    onClick={() => {
                        navigate(`/language/${language_id}/find`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Magnify />
                        {language_id==='vi'? "Tìm kiếm": "Search"}
                    </li>
                </span>
                <span
                    // to="/tieng-viet/hdsd"
                    onClick={() => {
                        navigate(`/language/${language_id}/hdsd`);
                        // window.location.reload();
                    }}
                >
                    <li
                        className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold border-t border-b border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
                        <Manual />
                        {language_id==='vi'? "Hướng dẫn sử dụng": "User Guide"}
                    </li>
                </span>
                <span>
                    <li className={`p-4 hover:bg-red-300 flex items-center gap-4 font-bold  border-b border-black ${
                            location.pathname.includes('categories') ? 'bg-gray-900' : ''
                        }`}
                    >
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
                </span>
                <div className='h-[100px]'></div>
            </ul>
            
        </div>
    </>
    );
};

export default Sidebar;
