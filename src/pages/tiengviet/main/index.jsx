import React, { useEffect, useState,useRef } from 'react';
import productData from '@/data/product';
import { Link } from 'react-router-dom';
import { useNavigate,useParams } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import FoodContent from '@/components/food-content';
import './index.css'
import Slider from 'react-slick';



const Main = () => {
    const param=useParams();
    const [topViewedProducts, setTopViewedProducts] = useState([]);
    const navigate = useNavigate()
    const images = [
        'https://raw.githubusercontent.com/thansouuu/data-image/main/nh%C3%A2n%20v%E1%BA%ADt/%C3%9At%20T%E1%BB%8Bch/1-1.jpg',
        'https://raw.githubusercontent.com/thansouuu/data-image/main/%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m/%C4%91%E1%BA%A1i%20di%E1%BB%87n.jpg',
        'https://raw.githubusercontent.com/thansouuu/data-image/main/S%E1%BB%B1%20ki%E1%BB%87n%20l%E1%BB%8Bch%20s%E1%BB%AD/%20%C4%90%E1%BA%A5u%20tranh%20ch%E1%BB%91ng%20ch%C3%ADnh%20quy%E1%BB%81n%20M%E1%BB%B9-Di%E1%BB%87m/II-2.jpg',
        'https://raw.githubusercontent.com/thansouuu/data-image/main/M%C3%B3n%20%C4%83n/B%C3%BAn%20n%C6%B0%E1%BB%9Bc%20l%C3%A8o/III-1.jpg',
    ];

    const paths=[
        `/language/${param.language_id}/figure/1`,
        `/language/${param.language_id}/figure/2`,
        `/language/${param.language_id}/figure/10`,
        `/language/${param.language_id}/figure/3`,
    ]
    const decrip=[
        'Nhân vật lịch sử',
        'Địa điểm nổi bật',
        'Sự kiện lịch sử',
        'Món ăn',
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

    const [isVisible, setIsVisible] = useState(false);
    const contentRef = useRef(null);

    const handleShowIntro = () => {
        setIsVisible(prevState => !prevState); // Chuyển đổi giá trị của `isVisible`
    };

    const backgroundStyle = {
        backgroundImage: 'url(/trongsuot.jpg)', // Thay thế bằng đường dẫn đúng đến hình ảnh
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '1rem', // Padding để hình ảnh không bị che khuất
        borderRadius: '0.5rem' // Tùy chọn: Bo tròn góc
      };
      const settings = {
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 500, // 2 giây
        cssEase: "linear",
      };
      
    
    return (
        <>
        {/* <Bot/> */}
        <div className="bg-gray-800 -mx-6 -mb-[200px] p-6 text-white">
  <div className="grid grid-cols-1 gap-4">
    <div className="col-span-full w-full">
      <Carousel style={{ width: '100%', height: '300px' }} interval={1000} fade>
        {images.map((image, idx) => (
          <Carousel.Item key={idx} style={{ height: '300px' }}>
            <div className="flex flex-col justify-between items-center w-full h-full p-4">
              <img
                className="d-block w-full h-[95%] object-contain"
                onClick={() => handleClick(idx)}
                src={image}
                alt={`Slide ${idx}`}
                style={{ maxHeight: '300px' }}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  </div>
</div>


        <div className="h-[200px]">

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:max-w-[900px] mx-auto">
            
            <div className="col-span-full flex flex-col items-center">
            <div className="container mx-auto px-4 mt-4">
                <video
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                    width="640"
                    height="360"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/logo-xoay.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
                <div className="flex justify-center my-3 ">
                    <button 
                        onClick={handleShowIntro}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        
                        {!isVisible ? 'Xem giới thiệu' : 'Đóng giới thiệu'}
                    </button>
                </div>
                <div
                    ref={contentRef}
                    className={`overflow-hidden transition-max-height duration-700 ease-in-out`}
                    style={{ maxHeight: isVisible ? contentRef.current.scrollHeight + 'px' : '0px' }}
                >
                    <p style={backgroundStyle} className="text-justify text-lg">
                        <ul className="list-disc pl-5 space-y-4 text-[#f0f8ff] italic text-lg">
                            <li>
                            Trà Vinh là tỉnh nằm trong khu vực Đồng bằng sông Cửu Long, phía bắc tiếp giáp tỉnh Bến Tre, phía nam giáp tỉnh Sóc Trăng, phía tây giáp tỉnh Vĩnh Long, phía đông giáp biển với chiều dài bờ biển 65 km, mặt giáp biển thông qua 03 cửa sông chính là Cổ Chiên, Cung Hầu và Định An. Khí hậu nhiệt đới gió mùa, ít bị ảnh hưởng bởi bão, lũ.
                            </li>
                            <li>
                            Chúng em chính là thế hệ tương lai sẽ xây dựng và phát triển quê hương mình ngày càng giàu mạnh. Để làm điều đó, là học sinh trong thời đại công thông tin 4.0 chúng em mong muốn góp phần nhỏ vào việc truyền thụ những kiến thức về văn hoá, lịch sử, địa lí, kinh tế, chính trị xã hội và môi trường của Trà Vinh thông qua ứng dụng mà chúng em thiết kế. Website Lịch sử tỉnh Trà Vinh gắn với môn học Giáo dục địa phương sẽ là cầu nối tri thức giúp người dùng hiểu biết về nơi mình sinh ra và lớn lên, bồi dưỡng tình yêu quê hương, ý thức tìm hiểu và vận dụng những điều đã học từ đó bước đầu nuôi dưỡng những ước mơ, đự định trong tương lai.
                            </li>
                            <li>
                            "Lịch sử Tỉnh Trà Vinh" là ứng bổ ích, giúp khám phá lịch sử phong phú cùng nền văn hóa độc đáo của tỉnh Trà Vinh. Với giao diện thân thiện và dễ sử dụng, ứng dụng cung cấp thông tin chi tiết về các di tích lịch sử, danh lam thắng cảnh, nhân vật và các sự kiện quan trọng trong tỉnh. Dựa trên sự tích hợp kiến thức từ sách Giáo dục Địa Phương tỉnh Trà Vinh theo Chương trình Giáo dục 2018, "Lịch sử Tỉnh Trà Vinh" mang đến cho người dùng cách tiếp cận mới mẻ và hấp dẫn.
                            </li>
                        </ul>
                    </p>
                </div>
                
            {/* </div> */}



                </div>
                
            </div>

            {/* <div className="col-span-full">
                <FoodContent className="shadow-md flex justify-center items-center flex-wrap mb-6 flex-1 p-4 transition-margin duration-300" 
                    title="NHỮNG MỤC NỔI BẬT" >
                    <div className="w-full">
                        <Carousel style={{ width: '100%', height: '300px' }} interval={100}>
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
            </div> */}

            <div className=" col-span-full"> 
            <FoodContent className="flex flex-col p-4" title="TOP 3 BÀI VIẾT NỔI BẬT" >
                <div className="overflow-x-auto">
                    <div className="flex space-x-4">
                        {topViewedProducts.map((product, index) => (
                            <div key={index} className="w-full lg:max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex-shrink-0">
                                <Link
                                    to={`/language/${param.language_id}/figure/${product.figureId}/product/${product.id}`}>
                                    <img
                                        className="rounded-t-lg"
                                        src={product.imageCover}
                                        alt={product.title}
                                    />
                                </Link>
                                <div className="p-5">
                                    <Link
                                        to={`/language/${param.language_id}/figure/${product.figureId}/product/${product.id}`}>
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
        </>
    );
};

export default Main;

