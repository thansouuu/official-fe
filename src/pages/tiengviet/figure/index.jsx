import React from 'react';
import products from '@/data/figure';
import { Link } from 'react-router-dom';
import CardContentHightlight from '@/components/card-content/card-content-hightlight';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional


const Figure = () => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:max-w-[900px] mx-auto">
        {products.map((product, index) => (
            <div key={index} className="w-full lg:max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Link to={`/tieng-viet/figure/${product.id}`}>
                    <img className="rounded-t-lg h-[300px] object-cover w-full" src={product.image} alt={product.name}/>
                </Link>
                {/* <img className="rounded-t-lg h-[300px] object-cover w-full" src={product.image} alt={product.name}/> */}
                <div className="p-5">
                    <Link to={`/tieng-viet/figure/${product.id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                    </Link>
                    {product.description?.map((item,key) => (
                        <div key={key} className='my-2'>
                            <CardContentHightlight value={item?.value} hightlightList={item?.hightlightList} />
                        </div>
                    ))}
                    <Link to={`/tieng-viet/figure/${product.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Xem thêm
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </Link>
                </div>
            </div>
        ))}
    </div>
    );
};

export default Figure;