import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import productData from '@/data/product';
import cn from '@/helper/cn';
import { useNavigate } from 'react-router-dom';



const Find = () => {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showFind, setShowFinds] = useState(false);

    const navigate = useNavigate();
    const toggleFinds = () => {
        setShowFinds(!showFind);
    };

    const handleSearchClose = () => {
        setSearchResult([]);
        setSearchTerm('');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm === '') {
            setSearchResult([]);
            return;
        }
        const products = Object.values(productData).flatMap((figure) => (
            figure.data.map((product) => ({
                ...product,
                figureId: figure.figureId, // Thêm thông tin figureId vào từng sản phẩm
            }))
        ));
        const tmp = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResult(tmp);
    };

    const imageStyle = {
        width: '310px',
        height: '310px',
        display: 'block',
        margin: '0 auto', // Căn giữa hình ảnh theo chiều ngang
    };

    // const buttonStyle = (top, left) => ({
    //     position: 'absolute',
    //     top: top,
    //     left: left,
    //     width: '6%', // Kích thước nút
    //     height: '6%', // Kích thước nút
    //     backgroundColor: '#0D6DDB',
    //     color: 'white',
    //     border: 'none',
    //     borderRadius: '50%', // Làm cho nút hình tròn
    //     cursor: 'pointer',
    //     fontSize: '16px',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     transform: 'translate(-50%, -50%)' // Căn giữa nút
    // });

    const buttonStyle = (top, left) => ({
        position: 'absolute',
        top: top,
        left: left,
        width: '6%',
        height: '6%',
        backgroundColor: '#0D6DDB',
        color: 'white',
        border: 'none',
        borderRadius: '50%', // Làm cho nút hình tròn
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translate(-50%, -50%)', // Căn giữa nút
        animation: 'blink-animation 3s infinite' // Thêm hiệu ứng nhấp nháy
      });

    const styles = `
    @keyframes blink-animation {
        0% {
        opacity: 1;
        }
        50% {
        opacity: 0;
        }
        100% {
        opacity: 1;
        }
    }
    `;

    const handleClick = (idx) => {
        navigate(`/tieng-viet/city/${idx}`);
    };

    return (
        <>
            <div>
                <button
                    className={cn('text-white w-fit m-auto px-4 rounded-2xl py-2 my-2', {
                        'bg-gray-300 hover:bg-gray-400': !showFind,
                        'bg-gray-400 hover:bg-gray-500': showFind,
                        'flex items-center justify-center': true,
                    })}
                    onClick={toggleFinds}
                >
                    {showFind ? 'Ẩn tìm kiếm' : 'Tìm kiếm bằng thành phố'}
                </button>
                {showFind && (
                    <div className="mt-4 my-4" style={{ position: 'relative', textAlign: 'center', width: '310px', margin: '0 auto' }}>
                        <style>{styles}</style>
                        <img
                            src="/location.png"
                            alt="Your Image"
                            style={imageStyle}
                        />
                        <button 
                            //tra vinh
                            style={buttonStyle('25%', '60%')}
                            onClick={() => handleClick(1)}
                        ></button>
                        <button 
                            //cau ke
                            style={buttonStyle('38%', '24%')}
                            onClick={() => handleClick(2)}
                        ></button>
                        <button 
                            //cang long
                            style={buttonStyle('28%', '46%')}
                            onClick={() => handleClick(3)}
                        ></button>
                        <button 
                            //chau thanh
                            style={buttonStyle('34%', '68%')}
                            onClick={() => handleClick(4)}
                        ></button>
                        <button 
                            //thi xa duyen hai
                            style={buttonStyle('75%', '85%')}
                            onClick={() => handleClick(5)}
                        ></button>
                        <button 
                            //tra cu
                            style={buttonStyle('66%', '48%')}
                            onClick={() => handleClick(6)}
                        ></button>
                        <button 
                            //cau ngang
                            style={buttonStyle('48%', '80%')}
                            onClick={() => handleClick(7)}
                        ></button>
                        <button 
                            //huyen duyen hai
                            style={buttonStyle('78%', '66%')}
                            onClick={() => handleClick(8)}
                        ></button>
                        <button 
                            //huyen tieu can
                            style={buttonStyle('55%', '36%')}
                            onClick={() => handleClick(9)}
                        ></button>
                    </div>
                )}
                <form onSubmit={handleSearchSubmit} className="flex w-full items-center space-x-2">
                    <input
                        type="text"
                        className="w-full px-4 py-2 text-black rounded-md"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md">
                        Tìm
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-white bg-red-500 rounded-full"
                        onClick={handleSearchClose}
                    >
                        x
                    </button>
                </form>
                {searchResult.length > 0 && (
                    <ul className='bg-white rounded-lg'>
                        {searchResult.map((product) => (
                            <li
                                key={product.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={handleSearchClose}
                            >
                                <Link
                                    to={`/tieng-viet/figure/${product.figureId}/product/${product.id}`}
                                    className="block"
                                    onClick={() => setSearchResult([])}
                                >
                                    {product.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default Find;
