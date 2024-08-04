import React, { useEffect, useState } from 'react';
import productData from '@/data/product';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import FoodContent from '@/components/food-content';




const Main = () => {
    const [topViewedProducts, setTopViewedProducts] = useState([]);
    const navigate = useNavigate()
    const images = [
        'https://raw.githubusercontent.com/thansouuu/data-image/main/nh%C3%A2n%20v%E1%BA%ADt/%C3%9At%20T%E1%BB%8Bch/1-1.jpg',
        'https://raw.githubusercontent.com/thansouuu/data-image/main/%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m/%C4%91%E1%BA%A1i%20di%E1%BB%87n.jpg',
        'https://raw.githubusercontent.com/thansouuu/data-image/main/D%C3%A2n%20t%E1%BB%99c/Ng%C6%B0%E1%BB%9Di%20Kinh/dai-dien.jpg',
        'https://raw.githubusercontent.com/thansouuu/data-image/main/D%C3%A2n%20t%E1%BB%99c/Ng%C6%B0%E1%BB%9Di%20Kinh/dai-dien.jpg',
    ];

    const paths=[
        `/tieng-viet/figure/1`,
        `/tieng-viet/figure/2`,
        `/tieng-viet/figure/10`,
        `/tieng-viet/figure/8`,
    ]
    const decrip=[
        'Nhân vật lịch sử',
        'Địa điểm nổi bật',
        'Sự kiện lịch sử',
        'Dân tộc',
    ]

    useEffect(() => {
        const products = Object.values(productData).flatMap((figure) => {
            const figureId = figure.figureId;
            return figure.data.map((product) => ({
                ...product,
                figureId: figureId
            }));
        });
        // Lọc các sản phẩm có số lượt xem (view) lớn hơn 0 (hoặc giá trị mình cần)
        const filteredProducts = products.filter((product) => product.view > 0);

        // Sắp xếp các sản phẩm theo số lượt xem (view) từ cao đến thấp
        filteredProducts.sort((a, b) => b.view - a.view);

        // Lấy top 3 sản phẩm có số lượt xem (view) cao nhất
        const topProducts = filteredProducts.slice(0, 3);
        console.log(topProducts);

        setTopViewedProducts(topProducts);

        
    }, []);


    const  handleClick=(index)=>{
        navigate(paths[index])
    }

    

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:max-w-[900px] mx-auto">
            
            <div className="col-span-full flex flex-col items-center">
            <div className="container mx-auto px-4 py-6">
                <div className="h-[100px]" />

                <video
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                    width="640"
                    height="360"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/testing-video.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
                <p className="mt-4 text-justify text-lg ">
                    <ul className="list-disc pl-5 space-y-4 text-gray-700 italic text-lg">
                        <li>"Lịch sử TV" là phần mềm bổ ích, giúp khám phá lịch sử phong phú cùng nền văn hóa độc đáo của tỉnh Trà Vinh. Với giao diện thân thiện và dễ sử dụng, ứng dụng cung cấp thông tin chi tiết về các di tích lịch sử, danh lam thắng cảnh, nhân vật và các sự kiện quan trọng trong tỉnh. Dựa trên sự tích hợp kiến thức từ sách Giáo dục Địa Phương tỉnh Trà Vinh theo Chương trình Giáo dục 2018, "Lịch sử TV" mang đến cho học sinh cách tiếp cận mới mẻ và hấp dẫn. </li>   
                        <li>Hiểu được rằng lịch sử thường khó tiếp cận đến giới trẻ, chúng tôi đã tạo ra những trải nghiệm sinh động cho người dùng qua các tính năng nổi bật như bài học dưới dạng hình ảnh, video, tour 3D, trò chơi tương tác và bản đồ trực quan. "Lịch sử TV" không chỉ là một công cụ học tập mà còn là cầu nối đưa học sinh đến gần hơn với quá khứ của quê hương, khơi dậy lòng tự hào và tình yêu đối với nơi mình sinh sống.</li>
                    </ul>
                </p>
            {/* </div> */}



                </div>
                
            </div>

            <div className="col-span-full">
                <FoodContent className="shadow-md flex justify-center items-center flex-wrap mb-6 flex-1 p-4 transition-margin duration-300" 
                    title="Những mục nổi bật" >
                    <div className="w-full">
                        <Carousel style={{ width: '100%', height: '300px' }}>
                            {images.map((image, idx) => (
                                <Carousel.Item key={idx} style={{ height: '300px' }}>
                                    <div className="flex flex-col justify-between items-center w-full h-full p-4">
                                        <img
                                            className="d-block w-full h-[95%] object-contain"
                                            onClick={() => handleClick(idx)}
                                            src={image}
                                            alt={`Slide ${idx}`}
                                            style={{ maxHeight: '300px' }} // Đảm bảo ảnh không vượt quá chiều cao phần tử chứa
                                        />
                                        <div className="w-full text-center mt-2 mb-4">
                                            <p className="text-[24px] leading-tight">
                                                <b><i>{decrip[idx]}</i></b>
                                            </p>
                                        </div>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </FoodContent>
            </div>
            <div className=" col-span-full"> 
            <FoodContent className="flex flex-col p-4" title="Top 3 bài viết nổi bật nhất" >
                <div className="overflow-x-auto">
                    <div className="flex space-x-4">
                        {topViewedProducts.map((product, index) => (
                            <div key={index} className="w-full lg:max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex-shrink-0">
                                <Link
                                    to={`/tieng-viet/figure/${product.figureId}/product/${product.id}`}>
                                    <img
                                        className="rounded-t-lg"
                                        src={product.imageCover}
                                        alt={product.title}
                                    />
                                </Link>
                                <div className="p-5">
                                    <Link
                                        to={`/tieng-viet/figure/${product.figureId}/product/${product.id}`}>
                                        <p className="text-[24px] font-semibold mb-2">{product.title}</p>
                                        {/* <p className="text-gray-600">Số lượt xem: {product.view}</p> */}
                                        <p className="text-gray-600">{product.description}</p>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FoodContent>
            </div>
        </div>
    );
};

export default Main;

