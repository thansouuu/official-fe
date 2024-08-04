import { Link, useParams } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';
import productData from '@/data/product';

const Categories = memo(() => {
    // {window.location.reload()}
    const [products, setProducts] = useState([])
    const [types, setTypes] = useState(0);
    const [tmp, setTmp] = useState(0);
    const param = useParams()
    useEffect(() => {
        const filterProduct = productData.find(product => product.figureId == param.id)
        if(!filterProduct) return
        setProducts(filterProduct?.data); 
        setTypes(filterProduct?.type);
    },[])
    if(!products) return 'Loading...'
    
    const handleButtonClick = (buttonId) => {
        setTmp(buttonId)
    };

    const decrip=[
        {name:'Giai đoạn 1 (1732-1945)',value:'Giai đoạn này chứng kiến nhiều sự kiện lịch sử quan trọng, từ việc hình thành các làng nghề truyền thống đến cuộc kháng chiến chống ngoại xâm. Đây là thời kỳ nổi bật với sự giao thoa văn hóa và các hoạt động đấu tranh mạnh mẽ, góp phần định hình lịch sử địa phương.',},
        {name:'Giai đoạn 2 (1945-1954)',value:'Giai đoạn này là trung tâm kháng chiến chống thực dân Pháp, nổi bật với các hoạt động cách mạng sôi nổi và sự lãnh đạo của các chiến sĩ nổi tiếng. Đây là thời kỳ quyết định trong cuộc đấu tranh giành độc lập, ghi dấu ấn sâu đậm trong lịch sử địa phương.',},
        {name:'Giai đoạn 3 (1954-1975)',value:'Ở giai đoạn này, tỉnh Trà Vinh là điểm nóng trong cuộc kháng chiến chống Mỹ, nổi bật với sự lãnh đạo kiên cường của các lực lượng cách mạng. Đây là thời kỳ chứng kiến những trận đánh quyết liệt và sự đóng góp to lớn vào cuộc đấu tranh giải phóng miền Nam.',},
        {name:'Giai đoạn 4 (1975-1995)',value:' Ở giai đoạn này, tỉnh Trà Vinh chứng kiến sự chuyển mình mạnh mẽ sau giải phóng miền Nam, nổi bật với quá trình tái thiết và phát triển kinh tế. Đây là thời kỳ quan trọng đánh dấu sự ổn định và phát triển nhanh chóng, góp phần vào sự đổi mới của tỉnh.',},
    ]

    const filteredProducts = products?.filter(product => product.type === tmp);
    const sortedProducts = filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:max-w-[900px] mx-auto">
            {types===1 &&
                <>
                    <div className="col-span-full bg-white p-6 rounded shadow-md flex justify-center items-center flex-wrap mb-6">
                        <button 
                            onClick={() => handleButtonClick(1)}
                            className="px-4 py-2 my-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
                        >
                            Giai đoạn 1
                        </button>
                        <button 
                            onClick={() => handleButtonClick(2)}
                            className="px-4 py-2 my-2 bg-green-500 text-white rounded hover:bg-green-600 mr-4"
                        >
                            Giai đoạn 2
                        </button>
                        <button 
                            onClick={() => handleButtonClick(3)}
                            className="px-4 py-2 my-2 bg-red-500 text-white rounded hover:bg-red-600 mr-4"
                        >
                            Giai đoạn 3
                        </button>
                        <button 
                            onClick={() => handleButtonClick(4)}
                            className="px-4 py-2 my-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-4"
                        >
                            Giai đoạn 4
                        </button>
                    </div>
                </>
            }
            {types===1 && 1<=tmp && tmp<=4 &&
                <>
                    <div className="col-span-full p-4 bg-gray-200 rounded-lg shadow-md">
                        <div className="text-[22px] font-bold text-gray-800 text-center">
                            {decrip[tmp-1].name}
                        </div>
                        <div className="mt-1 text-lg text-gray-700 leading-relaxed text-justify">
                            {decrip[tmp-1].value}
                        </div>
                    </div>
                </>
            }
            {sortedProducts?.map((product, index) => (          
                <div  key={index} className="w-full lg:max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <Link to={`/tieng-viet/figure/${param.id}/product/${product.id}`}>
                        <img className="rounded-t-lg" src={product.imageCover} alt={product.title} />
                    </Link>
                    <div className="p-5">
                    <Link to={`/tieng-viet/figure/${param.id}/product/${product.id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.title}</h5>
                    </Link>
                    <Link to={`/tieng-viet/figure/${param.id}/product/${product.id}`}>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-justify">{product.description}</p>
                    </Link>
                    <Link to={`/tieng-viet/figure/${param.id}/product/${product.id}`} className="inline-flex items-center px-3 py-2 text-sm         font-medium     text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none         focus:ring-blue-300     dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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

export default Categories;

Categories.displayName = 'Categories';
