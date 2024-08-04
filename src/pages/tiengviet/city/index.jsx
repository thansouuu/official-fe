import { Link, useParams } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';
import productData from '@/data/product';


const City = () => {

    const param = useParams()
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const newProducts = [];
        for (let index = 0; index < productData.length; index++) {
            const element = productData[index];
            for (let j = 0; j < element.data.length; j++) {
                const child = element.data[j];
                console.log(child.city)
                if (child.city == param.id) {
                    newProducts.push(child);
                }
            }
        }
        setProducts(newProducts);
    }, [param.id]);   
    if(!products) return 'Loading...'

    const decrip=[
        {
            name:'Thành phố Trà Vinh',
            value:'Thành phố Trà Vinh, trung tâm tỉnh Trà Vinh, nổi bật với di sản văn hóa đa dạng, cảnh quan xanh mát, và nhịp sống yên bình, phản ánh sự hòa quyện của các dân tộc Kinh, Khmer, Hoa.',
        },
        {
            name:'Huyện Cầu Kè',
            value:'Huyện Cầu Kè, được thiên nhiên ưu đãi với tài nguyên du lịch phong phú và đa dạng. Nổi bật với vườn trái cây trù phú, di tích văn hóa đặc sắc, và lễ hội dân gian sôi động, Cầu Kè là điểm đến hấp dẫn bậc nhất trong vùng.',
        },
        {
            name:'Huyện Càng Long',
            value:'Huyện Càng Long, tỉnh Trà Vinh, nổi bật với di tích lịch sử lâu đời và đặc sản gạo thơm ngon, thu hút nhiều lượt khách du lịch tâm linh hàng năm, trở thành điểm đến hấp dẫn trong khu vực.',
        },
        {
            name:'Huyện Châu Thành',
            value:'Huyện Châu Thành nổi tiếng với các làng nghề truyền thống đặc sắc, cảnh quan sông nước hữu tình, và những lễ hội văn hóa đặc biệt, thu hút đông đảo du khách mỗi năm.',
        },
        {
            name:'Thị xã Duyên Hải',
            value:'Thị xã Duyên Hải nổi bật với bãi biển hoang sơ đẹp nhất vùng.Nơi đây không chỉ thu hút du khách bởi cảnh quan thiên nhiên tươi đẹp mà còn nhờ các điểm đến văn hóa độc đáo và lễ hội sôi động.',
        },
        {
            name:'Huyện Trà Cú',
            value:'Huyện Trà Cú là nơi sinh sống lâu đời của ba dân tộc Kinh - Khmer - Hoa. Truyền thống giao thoa văn hóa lâu đời  đã tạo ra một nền văn hóa độc đáo và đặc sắc, kết hợp với cảnh quan thiên nhiên tuyệt đẹp và lịch sử vẻ vang.',
        },
        {
            name:'Huyện Cầu Ngang',
            value:'Huyện Cầu Ngang sở hữu tiềm năng du lịch phong phú với các điểm đến sinh thái tuyệt đẹp và du lịch tâm linh đặc sắc. Đây là địa điểm lý tưởng để khám phá nền nông nghiệp trù phú và thưởng thức các đặc sản địa phương.',
        },
        {
            name:'Huyện Duyên Hải',
            value:'Huyện Duyên Hải là đô thị ven biển màu mỡ với khí hậu ôn hòa và tài nguyên sinh thái phong phú. Nơi đây nổi bật với cảnh quan thiên nhiên trong lành, mát mẻ và các điểm đến du lịch hấp dẫn, cùng với bề dày lịch sử - văn hóa lâu đời, đặc biệt là những điểm đến tâm linh quyến rũ du khách khám phá.',
        },
        {
            name:'Huyện Tiểu Cần',
            value:'Huyện Tiểu Cần là điểm đến du lịch hấp dẫn với nền văn hóa giao thoa giữa ba dân tộc Kinh, Hoa và Khmer. Du khách có thể khám phá các ngôi chùa Hoa và đền Khmer đặc sắc, cùng với lễ hội truyền thống sôi động, trong một không gian văn hóa đa dạng và phong phú.',
        },

    ]

    const sortedProducts = products.sort((a, b) => a.title.localeCompare(b.title));

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:max-w-[900px] mx-auto">
        <div className="col-span-full p-4 bg-gray-200 rounded-lg shadow-md">
            <div className="text-[22px] font-bold text-gray-800 text-center">
                {decrip[param.id-1].name}
            </div>
            <div className="mt-1 text-lg text-gray-700 leading-relaxed text-justify">
                {decrip[param.id-1].value}
            </div>
        </div>
        {sortedProducts?.map((product, index) => (
            <div  key={index} className="w-full lg:max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <Link to={`/tieng-viet/figure/${product.link}/product/${product.id}`}>
                        <img className="rounded-t-lg" src={product.imageCover} alt={product.title} />
                    </Link>
                    <div className="p-5">
                    <Link to={`/tieng-viet/figure/${product.link}/product/${product.id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.title}</h5>
                    </Link>
                    <Link to={`/tieng-viet/figure/${product.link}/product/${product.id}`}>
                        <p className=" text-justify mb-3 font-normal text-gray-700 dark:text-gray-400">{product.description}</p>
                    </Link>
                    <Link to={`/tieng-viet/figure/${product.link}/product/${product.id}`} className="inline-flex items-center px-3 py-2 text-sm         font-medium     text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none         focus:ring-blue-300     dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
};

export default City;