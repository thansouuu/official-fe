import { Link, useParams } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';
import storyData from '@/data/story';

const List = memo(() => {
    const param = useParams()
    const introduce='rnvnjkdnfvkfkdv'
    const sortedProducts = storyData.sort((a, b) => a.title.localeCompare(b.title));
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:max-w-[900px] mx-auto">
           
            <div className="col-span-full p-4 bg-gray-200 rounded-lg shadow-md">
                <div className="text-[22px] font-bold text-gray-800 text-center">
                    câu chuyện
                </div>
                <div className="mt-1 text-lg text-gray-700 leading-relaxed text-justify">
                    {introduce}
                </div>
            </div>
            {sortedProducts?.map((product, index) => (          
                <div  key={index} className="w-full lg:max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <Link to={`/tieng-viet/story/${product.id}`}>
                        <img className="rounded-t-lg" src={product.imageCover} alt={product.title} />
                    </Link>
                    <div className="p-5">
                    <Link to={`/tieng-viet/story/${product.id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.title}</h5>
                    </Link>
                    <Link to={`/tieng-viet/story/${product.id}`}>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-justify">{product.description}</p>
                    </Link>
                    <Link to={`/tieng-viet/story/${product.id}`} className="inline-flex items-center px-3 py-2 text-sm         font-medium     text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none         focus:ring-blue-300     dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Xem thêm
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"viewBox="0        0     14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9" />
                        </svg>
                    </Link>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default List;

List.displayName = 'List';
