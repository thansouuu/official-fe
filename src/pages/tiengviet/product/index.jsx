import React, { memo, useEffect, useState,useRef,useLayoutEffect } from 'react';
import { Carousel } from 'react-bootstrap';

import { Link, useParams, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import cn from '@/helper/cn';
import FoodContent from '@/components/food-content';
import FeedbackCard from '@/components/feedback-detail/feedback-card';
import '../story/styles.css'
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
} from 'react-share';
import { useAuth } from '@/hooks/use-auth';
import productData from '@/data/product';
import productData_english from '@/data/product_english';
import { uploadToCloudinary } from '@/hooks/use-upload-cloudinary';
import CardContentHightlight from '@/components/card-content/card-content-hightlight';
import CardContentText from '@/components/card-content/card-content-text';

import good_icon1 from '@/assets/good/good1.png'
import good_icon2 from '@/assets/good/good2.png'
import good_icon3 from '@/assets/good/good3.png'
import good_icon4 from '@/assets/good/good4.png'
import good_icon5 from '@/assets/good/good5.png'
import good_icon6 from '@/assets/good/good6.png'

import top_good_icon1 from '@/assets/top-good/top-good1.png'
import top_good_icon2 from '@/assets/top-good/top-good2.png'
import top_good_icon3 from '@/assets/top-good/top-good3.png'
import top_good_icon4 from '@/assets/top-good/top-good4.png'
import top_good_icon5 from '@/assets/top-good/top-good5.png'
import top_good_icon6 from '@/assets/top-good/top-good6.png'

import best_icon1 from '@/assets/best/best1.png'
import best_icon2 from '@/assets/best/best2.png'
import best_icon3 from '@/assets/best/best3.png'
import best_icon4 from '@/assets/best/best4.png'
import best_icon5 from '@/assets/best/best5.png'
import best_icon6 from '@/assets/best/best6.png'
import Bot from '@/pages/tiengviet/chatbot';
import { param } from 'jquery';

const Product = memo(() => {
    const { isLoggedIn, mutate, data } = useAuth();
    const navigate = useNavigate();
    // const { isLoggedIn } = useAuth();
    const [product, setProduct] = useState(null);
    const [product_nonmain, setProductnonmain] = useState(null);
    const [isComent, setIsComemt] = useState(false);
    const [isBonus, setIsBonus] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesBonus, setImagesBonus] = useState([]);
    const [imageValue, setImagevalue] = useState('');
    const [imageValueBonus, setImagevalueBonus] = useState('');
    const [cloudinaryFiles, setCloudinaryFiles] = useState({});
    const [cloudinaryFilesBonus, setCloudinaryFilesBonus] = useState({});
    const [isCreateFeedback, setIsCreateFeedback] = useState(false);
    const [isCreateBonus, setIsCreateBonus] = useState(false);
    const [comment, setComment] = useState('');
    const [commentBonus, setCommentBonus] = useState('');
    const [convertFeedBacks, setConvertFeedBacks] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showInfos, setShowInfos] = useState(false);
    const [users, setUsers] = useState([]);
    const [mentionList, setMentionList] = useState([]);
    const params = useParams();
    const [isModal, setIsModal] = useState(false);
    const [imageModal, setImageModal] = useState('');
    const [image, setImage] = useState('')
    // const [isModal, setIsModal] = useState(false);
    // const [valueModal, setValueModal] = useState(null);
    const [timeType, setTimeType] = useState('desc');
    const [likesType, setLikesType] = useState('most');

    const handleComemt = async (e) => {
        setIsCreateFeedback(true);
        e.preventDefault();
        try {
            const result = await uploadToCloudinary(cloudinaryFiles);
            const imageUrlList = result.map((file) => file.secure_url);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    foodName: product?.title,
                    comment: comment,
                    overview: 'none',
                    making: 'none',
                    enjoy: 'none',
                    restaurant: 'none',
                    images: imageUrlList,
                    productId: product?.id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Bình luận đã được gửi');
                getListFeedBack();
                return;
            }
            toast.error(data?.message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreateFeedback(false);
            setComment('');
            setImages([]);
            setCloudinaryFiles({});
            setImagevalue('');
        }
    };

    const handleOpenComment = () => {
        if (!isLoggedIn) {
            toast.error('Bạn phải đăng nhập để đánh giá!');
            return;
        }
        setIsComemt(!isComent);
    };

    const handleBonus = async (e) => {
        setIsCreateBonus(true);
        e.preventDefault();
        try {
            const result = await uploadToCloudinary(cloudinaryFilesBonus);
            const imageUrlList = result.map((file) => file.secure_url);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    foodName: product?.title,
                    comment: 'none',
                    overview: comment,
                    making: 'none',
                    enjoy: 'none',
                    restaurant: 'none',
                    images: imageUrlList,
                    productId: product?.id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Bổ sung đã được gửi');
                getListFeedBack();
                return;
            }
            toast.error(data?.message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreateBonus(false);
            setCommentBonus('');
            setImagesBonus([]);
            setCloudinaryFilesBonus({});
            setImagevalueBonus('');
        }
    };

    const handleOpenBonus = () => {
        if (!isLoggedIn) {
            toast.error('Bạn phải đăng nhập để bổ sung!');
            return;
        }
        setIsBonus(!isBonus);
    };

    const getListFeedBack = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setFeedbacks(data?.data);
        handleSort();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        setImagevalue(event.target.value);
        const selectedImagesArray = Array.from(files).map((file) => URL.createObjectURL(file));
        setImages(selectedImagesArray);
        setCloudinaryFiles(files);
    };

    const handleFileChangeBonus = (event) => {
        const files = event.target.files;
        setImagevalueBonus(event.target.value);
        const selectedImagesArray = Array.from(files).map((file) => URL.createObjectURL(file));
        setImagesBonus(selectedImagesArray);
        setCloudinaryFilesBonus(files);
    };



    useEffect(() => {
        let productList
        if (params.language_id==='vi') productList = productData.find((item) => item.figureId == params.figureId);
        else  productList=productData_english.find((item) => item.figureId == params.figureId);
        const product = productList?.data.find((item) => item.id == params.id);
        setProduct(product);
        if (12<=params.figureId&&params.figureId<=14) setImage(product.image_mindmap);
        getListFeedBack();
    }, [params]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log(data?.data.likes?.includes(product?.title));
                console.log(product?.title);
                if (data) {
                    setIsLiked(data?.data.likes?.includes(product?.title));
                }
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchUser();
        }
    }, [isLoggedIn, product]);

    const fetchAllUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.data);
                console.log(data.data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleMentionInput = (e) => {
        const inputValue = e.target.value;
        setComment(inputValue);

        // const lastChar = inputValue.slice(-1);
        // if (lastChar === '@') {
        //     setMentionList(users);
        // } else if (inputValue.includes('@')) {
        //     const searchTerm = inputValue.split('@').pop();
        //     const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
        //     setMentionList(filteredUsers);
        // } else {
        //     setMentionList([]);
        // }
    };

    const handleMentionInputBonus = (e) => {
        const inputValue = e.target.value;
        setCommentBonus(inputValue);
    };

    const selectUser = (user) => {
        const updatedComment = comment + user.name + ' ';
        setComment(updatedComment);
        setMentionList([]);
    };

    const getFeedBackByIdProduct = (figureId, id, data) => {
        const productList = productData.find((item) => item.figureId == figureId);
        const product = productList?.data.find((item) => item.id == id);
        return data?.filter((item) => item.productId == product?.id);
    };

    const handleSort = () => {
        
        let data = getFeedBackByIdProduct(params.figureId, params.id, feedbacks);
        console.log('sort ',data);
        // Sắp xếp theo thời gian nếu `timeType` không phải là rỗng
        if (timeType==='desc') {
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        if (timeType==='asc'){
            data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        if (likesType==='most'){
            data.sort((a, b) => a.likes.length - b.likes.length);
        }
        if (likesType==='least'){
            data.sort((a, b) => b.likes.length - a.likes.length);
        }
        setConvertFeedBacks(data);
    };
    

    const handleLike = async () => {
        try {
            const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (!userResponse.ok) {
                toast.info('Vui lòng đăng nhập để yêu thích bài viết');
                return;
            }

            const userData = await userResponse.json();
            console.log(userData);

            const likeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userData,
                    productTitle: product?.title,
                }),
            });

            if (likeResponse.ok) {
                toast.success('Đã thêm bài viết vào mục yêu thích');
                fetchUser();
            } else {
                const likeData = await likeResponse.json();
                toast.error(likeData.message);
            }
        } catch (error) {
            console.error('Error liking product:', error);
            toast.error('Error liking product');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product?.title || 'Review Product',
                    text: 'Check out this amazing product review!',
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            toast.error('Web Share API is not supported in your browser.');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                toast.success('Sao chép link trang thành công');
            })
            .catch((err) => {
                console.error('Failed to copy link:', err);
                toast.error('Failed to copy link');
            });
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };
    const toggleInfos = () => {
        if (!isLoggedIn) {
            toast.error('Bạn phải đăng nhập để chơi trò chơi!');
            return;
        }
        setShowInfos(!showInfos);
    };

    const encodedUrl = encodeURIComponent(window.location.href);
    const encodedTitle = encodeURIComponent(product?.title || 'Review Product');

    const imageIconDefault = {
        good: [good_icon1, good_icon2, good_icon3, good_icon4, good_icon5, good_icon6],
        'top-good': [
            top_good_icon1,
            top_good_icon2,
            top_good_icon3,
            top_good_icon4,
            top_good_icon5,
            top_good_icon6,
            good_icon1,
            good_icon2,
            good_icon3,
            good_icon4,
            good_icon5,
            good_icon6,
        ],
        best: [
            best_icon1,
            best_icon2,
            best_icon3,
            best_icon4,
            best_icon5,
            best_icon6,
            top_good_icon1,
            top_good_icon2,
            top_good_icon3,
            top_good_icon4,
            top_good_icon5,
            top_good_icon6,
            good_icon1,
            good_icon2,
            good_icon3,
            good_icon4,
            good_icon5,
            good_icon6,
        ],
    };
    const [mainBackground, setMainBackground] = useState('');
    const [borderBackground, setBorderBackground] = useState('');
    const role = data?.data?.role;
    useEffect(() => {
        // window.location.reload()
        if (data && role && isLoggedIn) {
            if (role === 'good') {
                setMainBackground('/background/background3.png');
                setBorderBackground('/border/top3.svg');
            }
            if (role === 'best') {
                setMainBackground('/background/background1.png');
                setBorderBackground('/border/top1.svg');
            }
            if (role === 'top-good') {
                setMainBackground('/background/background2.png');
                setBorderBackground('/border/top2.svg');
            }
        }
    }, [role, isLoggedIn]);

    const handleModalImageCarousel = (image) => {
        setIsModal(true)
        setImageModal(image)
    };

    const handleDownload = async (url, filename) => {
        const response = await fetch(url, {
            mode: 'cors',
        });
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };
    // window.location.reload()

    useEffect(() => {
        setVideo(product?.video || '');
    }, [product?.video]);

    const [isvideo,setisVideo]=useState(false);
    const [video, setVideo] = useState('');

    const handleVideo = () => {
        setisVideo(prevState => !prevState); 
        if (!isvideo) toast.success('Đã thêm thủ ngữ vào video'); else toast.warning('Đã bỏ thủ ngữ khỏi video');
        if (!isvideo && product.video2!=undefined) {setVideo(product?.video2); console.log('chuyen sang thu ngu');}
        else {setVideo(product?.video); console.log('chuyen sang binh thuong');}
    };

    const titleRef = useRef(null);

    useEffect(() => {
        // Focus vào phần tử khi component được mount
        if (titleRef.current) {
          titleRef.current.focus();
        }
    }, [product]);

    const contentRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const handleShowSource = () => {
        setIsVisible(prevState => !prevState); // Chuyển đổi giá trị của `isVisible`
      };

    const typing = {
        27: [
            { label: "Người Kinh", value: '25' },
            { label: "Người Hoa", value: '27' },
            { label: "Người Khmer", value: '26' },
        ],
        26: [
            { label: "Nút 1", value: '20' },
            { label: "Nút 2", value: '25' },
            { label: "Nút 3", value: '30' },
            { label: "Nút 4", value: '35' },
        ],
    };

    const [res, setRes] = useState({ label: '', value: '0' });
    // Biến res để lưu kết quả nút bấm

    const handleButtonClick = (buttonValue) => {
        if (res.value===buttonValue.value) setRes({label:'',value:'0'});
        else setRes(buttonValue); // Cập nhật giá trị res
    };
    const [maxHeight, setMaxHeight] = useState('0px');
    useEffect(() => {
        const productList = productData.find((item) => item.figureId == params.figureId);
        const product = productList?.data.find((item) => item.id == res.value);
        setProductnonmain(product);
    }, [res]);
    useEffect(() => {
        setTimeout(() => {
            setIsVisible(prevState => !prevState);
            if (contentRef.current) {
                setMaxHeight(contentRef.current.scrollHeight + 'px');
            }
        }, 2000); 
    }, [product_nonmain]);

    const [ismindmap, setIsmindmap] = useState(false);

    const handlemindmap = () => {
        setIsmindmap(prevState => !prevState); // Chuyển đổi giá trị của `isVisible`
    };

    return (
        <>
        <div className="flex flex-col gap-4 pb-4 max-w-[992px] mx-auto">
            {product?.video!='' && 
                <div className='flex flex-col items-center'>
                    <iframe
                        className=" mb-2 w-full h-auto aspect-video border-4 border-gray-600 rounded-xl overflow-hidden"
                        src={video}
                        allow="fullscreen;webkitallowfullscreen; mozallowfullscreen ;allowfullscreen"
                        allowFullScreen=""
                    ></iframe>
                    <script async src="//cdn.thinglink.me/jse/responsive.js"></script>
                    <button
                            onClick={handleVideo}
                            // className="mt-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            className={cn('px-4 py-2 text-white w-fit m-auto  rounded ', {
                                'bg-green-400 hover:bg-green-500': !isvideo,
                                'bg-red-400 hover:bg-red-500': isvideo,
                            })}
                        >   
                            {params.language_id==='vi'?
                                !isvideo ? 'Thêm thủ ngữ' : 'Bỏ thủ ngữ'
                                :
                                !isvideo ? 'Add sign language' : 'Remove sign language'
                            }

                    </button>
                </div>
            }

            
            <h2 className="text-3xl text-center pb-4 border-b border-slate-800 flex justify-center items-center gap-2">
                <div
                    ref={titleRef}
                    tabIndex={-1} // tabIndex cần thiết để phần tử không tương tác có thể focus
                    style={{ outline: 'none' }} // Loại bỏ viền focus mặc định nếu cần
                >
                    {product?.title}
                </div>
                <button onClick={handleLike}>
                    {isLiked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="red"
                            width="24"
                            height="24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            />
                        </svg>
                    )}
                </button>
            </h2>

            <div className="text-center">
                {role && role !== 'normal' && (
                    <div className="right-main_icon flex justify-center gap-x-5">
                        <img className="w-10 h-10" src={mainBackground} alt="" />
                        <img className="w-10 h-10" src={mainBackground} alt="" />
                        <img className="w-10 h-10" src={mainBackground} alt="" />
                        <img className="w-10 h-10" src={mainBackground} alt="" />
                    </div>
                )}
            </div>
            {console.log('params ',params)}
            <>
  {params.figureId !== '14' ? (
    <div className="text-[20px] text-right italic underline text-blue-800">
      Trích:{' '}  
      <Link 
        to={`https://travinh.gov.vn/con-nguoi-tra-vinh/nguyen-thi-ut-1931-1968-599383`} 
      >
        Cổng thông tin Điện tử Tỉnh Trà Vinh
      </Link>
    </div>
  ) : (
    <div className="text-[20px] text-right italic underline text-blue-800">
      {/* Nội dung khác (nếu có) */}
      Trích:{' '}  
      <Link 
        to={`https://travinh.gov.vn/con-nguoi-tra-vinh/nguyen-thi-ut-1931-1968-599383`} 
      >
        Sách Giáo dục địa phương tỉnh Trà Vinh
      </Link>
    </div>
  )}
</>





            {params.figureId==="14"&&<>
                <>
                {console.log('cac ',params.id)}
                {image!==''&&
                    // <div className="flex justify-center items-center ">
                    //     <img className="w-[60%] h-[60%] rounded-lg" src={image} alt="" />
                    // </div>
                    <>
                        <button 
                            onClick={handlemindmap}
                            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 w-[80%] mx-auto"
                        >
                            {!ismindmap ? 'Xem sơ đồ tư duy' : 'Đóng sơ đồ tư duy'}
                        </button>
                        <div
                            ref={contentRef}
                            className={`overflow-hidden transition-max-height duration-700 ease-in-out`}
                            style={{ maxHeight: ismindmap ? contentRef.current.scrollHeight + 'px' : '0px' }}
                        >
                            <Carousel style={{ width: '100%', height: '300px' }}>
                                <Carousel.Item style={{ height: '300px' }}>
                                    <img
                                        className="d-block w-full h-full object-contain"
                                        onClick={() => handleModalImageCarousel(image)}
                                        src={image}
                                        // alt={`Slide ${idx}`}
                                    />
                                </Carousel.Item>                         
                            </Carousel>
                        </div>


                    </>
                }
                </>
                
                {/* {params.id==='27' && */}
                    <div className="flex flex-col items-center justify-center mb-2">
                        {typing[params.id]?.map((button, index) => (
                            <button
                                key={index}
                                onClick={() => handleButtonClick(button)}
                                className=" w-[70%] px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 m-2"
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                {/* } */}
               
                <div
                    // ref={contentRef}
                    // className={`overflow-hidden transition-max-height duration-700 ease-in-out`}
                    // // style={{
                    // //     maxHeight:maxHeight,
                    // // }}
                    // style={{ maxHeight: isVisible ? maxHeight: '0px' }}
                >

                    {product_nonmain?.contents?.map((content, index) => (
                        <>
                        <FoodContent 
                            title={content.title} 
                            key={index}
                        >
                            {content.data?.map((item, key) => (
                                <div key={key}>
                                    {item.type === 'text' && <CardContentText value={item.value} />}
                                    {item.type === 'bold' && (
                                        <>
                                            <p className="my-2 text-[18px]">
                                                <i><b>{item.value}</b></i>
                                            </p>
                                        </>
                                    )}
                                    {item.type === 'hightlight' && (
                                        <CardContentHightlight value={item.value} hightlightList={item.hightlightList} />
                                    )}
                                    {item.type === 'grid-image' &&
                                        (item.value.length > 0 ? (
                                            <div className="my-2">
                                                <Carousel style={{ width: '100%', height: '300px' }}>
                                                    {item.value.map((image, idx) => (
                                                        <Carousel.Item key={idx} style={{ height: '300px' }}>
                                                            <img
                                                                className="d-block w-full h-full object-contain"
                                                                onClick={() => handleModalImageCarousel(image)}
                                                                src={image}
                                                                alt={`Slide ${idx}`}
                                                            />
                                                        </Carousel.Item>
                                                    ))}
                                                </Carousel>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                {item.value.map((image, idx) => (
                                                    <div className="border border-gray-200 rounded-md" key={idx}>
                                                        <img
                                                            alt="content-item"
                                                            className="w-full h-[200px] object-contain rounded-md"
                                                            src={image}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </FoodContent>
                        
                    </>
                ))}
                    {res.value!=='0'&&<>
                        <FoodContent 
                            title={params.language_id === 'vi' ? "Câu hỏi kiểm tra" : "Test questions"}
                        >
                        <button
                            className={cn('text-white w-fit m-auto px-4 rounded-2xl py-2', {
                                'bg-gray-300 hover:bg-gray-400': !showInfos,
                                'bg-gray-400 hover:bg-gray-500': showInfos,
                            })}
                            onClick={toggleInfos}
                        >
                            {
                                params.language_id==='vi' ?
                                    showInfos ? 'Ẩn thông tin thêm' : 'Hiển thị thông tin thêm'
                                :
                                    showInfos ? 'Hide additional information' : 'Show more information'
                            }
                        </button>
                        {showInfos && (
                            <div className="mt-4">
                                <ul>
                                    <li>
                                        Đặt tên trong trò chơi là gmail mà bạn dùng trong tài khoản này :{' '}
                                        <b>{data?.data?.email}</b>
                                    </li>
                                    <li>
                                        Bạn sẽ nhận được bộ ảnh đặc quyền tùy theo mức hạng mà bạn đạt được:
                                        <div className="flex flex-col gap-4">
                                            <div className="flex  flex-col gap-4 md:border-none border-t pt-4">
                                                <span className="">Đối với những hạng từ 4-10, sẽ nhận được bộ ảnh:</span>
                                                <ul className="list-none flex-wrap flex items-center gap-4">
                                                    {imageIconDefault['good']?.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <img
                                                                    src={item}
                                                                    alt="image-icon"
                                                                    className="w-10 h-10 rounded-full border border-gray-700"
                                                                />
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="flex  flex-col gap-4 md:border-none border-t pt-4">
                                                <span className="">Đối với những hạng từ 1-3, sẽ nhận được bộ ảnh:</span>
    
                                                <ul className="list-none flex-wrap flex items-center gap-4">
                                                    {imageIconDefault['top-good']?.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <img
                                                                    src={item}
                                                                    alt="image-icon"
                                                                    className="w-10 h-10 rounded-full border border-gray-700"
                                                                />
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="mt-4">Cuối cùng, chúc bạn chơi trò chơi vui vẻ và may mắn !</li>
                                </ul>
    

                            </div>
                        )}
                        {isLoggedIn && product?.game!='' &&  (
                            <>
                                <div className="mt-4">
                                    <div className="flex justify-center mb-4">
                                        <iframe
                                            className="w-full h-auto aspect-video border-4 border-gray-600 rounded-xl overflow-hidden"
                                            src={product_nonmain?.game}
                                            title="game"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </>
                        )}
                    </FoodContent>
                    </>}
                    
                </div>
            </>}

            <div className="flex flex-col gap-4">
                {params.figureId!=="14"&&<>
                {product?.contents?.map((content, index) => (
                    <FoodContent title={content.title} key={index}>
                        {content.data?.map((item, key) => (
                            <div key={key}>
                                {item.type === 'audio' && (
                                    <audio key={index} controls>
                                    <source src={item.src} type="audio/mpeg" />
                                    Trình duyệt của bạn không hỗ trợ phần tử audio.
                                  </audio>
                                )}

                                {item.type === 'text' && <CardContentText value={item.value} />}
                                {item.type === 'bold' && (
                                    <>
                                        <p className="my-2 text-[18px]">
                                            <i><b>{item.value}</b></i>
                                        </p>
                                    </>
                                )}
                                {item.type === 'hightlight' && (
                                    <CardContentHightlight value={item.value} hightlightList={item.hightlightList} />
                                )}
                                {item.type === 'grid-image' &&
                                    (item.value.length > 0 ? (
                                        <div className="my-2">
                                            <Carousel style={{ width: '100%', height: '300px' }}>
                                                {item.value.map((image, idx) => (
                                                    <Carousel.Item key={idx} style={{ height: '300px' }}>
                                                        <img
                                                            className="d-block w-full h-full object-contain"
                                                            onClick={() => handleModalImageCarousel(image)}
                                                            src={image}
                                                            alt={`Slide ${idx}`}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {item.value.map((image, idx) => (
                                                <div className="border border-gray-200 rounded-md" key={idx}>
                                                    <img
                                                        alt="content-item"
                                                        className="w-full h-[200px] object-contain rounded-md"
                                                        src={image}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </FoodContent>
                ))}
                
                    <FoodContent 
                        title={params.language_id === 'vi' ? "Liên quan" : "Relate to"}
                    >
                        <div className="flex items-center gap-2 flex-wrap">
                            {product?.tags?.map((tag, index) => (
                                <button key={index} className="py-2 px-4 bg-slate-200 hover:bg-slate-300">
                                    <Link to={`/language/${params.language_id}${tag.link}`}>{tag.title}</Link>
                                </button>
                            ))}
                        </div>
                    </FoodContent>
                </>}
                
                <FoodContent 
                    title={params.language_id === 'vi' ? "Đánh giá và nhận xét" : "Ratings and comments"}
                >
                    <div >
                        <button
                            className={cn('text-white w-fit m-auto px-4 rounded py-2', {
                                'bg-green-400 hover:bg-green-500': !isComent,
                                'bg-red-400 hover:bg-red-500': isComent,
                            })}
                            onClick={handleOpenComment}
                        >
                            {
                                params.language_id==='vi'?
                                    isComent ? 'Hủy đánh giá' : 'Viết đánh giá'
                                :
                                    isComent ? 'Cancel review' : 'Write a review'
                            }
                        </button>
                        {isComent && (
                            <form onSubmit={handleComemt} className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-col gap-1 relative">
                                    <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="comment">
                                        Bình luận
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline box-border"
                                        id="comment"
                                        name="comment"
                                        rows="5"
                                        placeholder="Nhập đánh giá..."
                                        required
                                        value={comment}
                                        onChange={handleMentionInput}
                                    ></textarea>
                                    {/* {mentionList.length > 0 && (
                                        <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                                            {mentionList.map((user, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                                                    onClick={() => selectUser(user)}
                                                >
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    {user.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )} */}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="fileInput"> Hình ảnh đính kèm:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        id="fileInput"
                                        value={imageValue}
                                        onChange={handleFileChange}
                                        className="w-full h-10"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 rounded-md">
                                    {images?.map((image, index) => (
                                        <div className="border border-gray-200 rounded-md" key={index}>
                                            <img
                                                alt="image-upload-item"
                                                className="w-[80%] h-[200px] object-contain rounded-md"
                                                src={image}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-fit"
                                    type="submit"
                                >
                                    {isCreateFeedback ? 'Đang gửi...' : 'Gửi'}
                                </button>
                            </form>
                         )} 
                    </div>
                    <div>
                        <button
                            className={cn(' text-white w-fit m-auto px-4 rounded py-2 mt-4', {
                                'bg-green-400 hover:bg-green-500': !isBonus,
                                'bg-red-400 hover:bg-red-500': isBonus,
                            })}
                            onClick={handleOpenBonus}
                        >
                            {
                                params.language_id==='vi'?
                                    isBonus ? 'Hủy bổ sung' : 'Viết bổ sung'
                                :
                                    isBonus ? 'Cancel additional' : 'Additional writing'
                            }
                        </button>
                        {/* <div
                            ref={contentRef}
                            className={`overflow-hidden transition-max-height duration-700 ease-in-out`}
                            style={{ maxHeight: isBonus ? contentRef.current.scrollHeight + 'px' : '0px' }}
                        > */}
                        {isBonus && (
                            <form onSubmit={handleBonus} className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-col gap-1 relative">
                                    <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="comment">
                                        Bình luận
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="comment"
                                        name="comment"
                                        rows="5"
                                        placeholder="Nhập bổ sung..."
                                        required
                                        value={commentBonus}
                                        onChange={handleMentionInputBonus}
                                    ></textarea>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="fileInput"> Hình ảnh đính kèm:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        id="fileInput"
                                        value={imageValueBonus}
                                        onChange={handleFileChangeBonus}
                                        className="w-full h-10"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 rounded-md">
                                    {imagesBonus?.map((image, index) => (
                                        <div className="border border-gray-200 rounded-md" key={index}>
                                            <img
                                                alt="image-upload-item"
                                                className="w-full h-[200px] object-contain rounded-md"
                                                src={image}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-fit"
                                    type="submit"
                                >
                                    {isCreateBonus ? 'Đang gửi...' : 'Gửi'}
                                </button>
                            </form>
                            )} 
                            {/* // </div> */}
                    </div>
                </FoodContent>
                <FoodContent 
                    title={params.language_id === 'vi' ? "Danh sách đánh giá" : "Review list"}
                >
                    <div className="mt-4">
                       <div className="flex flex-wrap justify-center mb-4 gap-4">
                            <select
                                name="sortTime"
                                id="sortTime"
                                onChange={(e) => { setTimeType(e.target.value); handleSort(); }}
                                className="min-w-[150px]"
                            >
                                
                                <option value="desc">{params.language_id==='vi'?"Mới nhất":"Latest"}</option>
                                <option value="asc">{params.language_id==='vi'?"Cũ nhất":"Oldest"}</option>
                                <option value=""> </option>
                            </select>
                            <select
                                name="sortLikes"
                                id="sortLikes"
                                onChange={(e) => { setLikesType(e.target.value); handleSort(); }}
                                className="min-w-[150px]" 
                            >
                                <option value="most">{params.language_id==='vi'?"Nhiều lượt thích nhất":"Most likes"}</option>
                                <option value="least">{params.language_id==='vi'?"Ít lượt thích nhất":"Fewest likes"}</option>
                                <option value=""> </option>
                            </select>
                        </div>



                        <div className="flex flex-col gap-4">
                            {convertFeedBacks.map((item, index) => (
                                <div key={index}>
                                    <FeedbackCard item={item} />
                                </div>
                            ))}

                            {convertFeedBacks.length == 0 && <div className="text-center">Chưa có đánh giá</div>}
                        </div>
                    </div>
                </FoodContent>
                <FoodContent 
                    title={params.language_id === 'vi' ? "Chia sẻ bài viết" : "Share the article"}
                >
                    <div className="flex gap-4">
                        <FacebookShareButton hashtag={'Phần mềm Lịch sử địa phương Trà Vinh cung cấp cho tôi những thông tin rất hữu ích'} url={window.location.href} quote={product?.title}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        
                        {/* <WhatsappShareButton url={window.location.href} title={product?.title}>
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton> */}
                        {/* <EmailShareButton url={window.location.href} subject={product?.title}>
                            <EmailIcon size={32} round />
                        </EmailShareButton> */}
                        <a
                            href={`https://www.messenger.com/t/?body=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="/images/mess.png"
                                alt="Share on Messenger"
                                style={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                        </a>
                        <TwitterShareButton url={window.location.href} title={product?.title}>
                            <img
                                src="/images/twitter.jpg"
                                alt="Twitter"
                                style={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                        </TwitterShareButton>

                        <button onClick={handleCopyLink} className="flex items-center gap-2">
                            <img
                                src="/images/link.png"
                                alt="Copy Link"
                                style={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                            {/* Copy Link */}
                        </button>
                    </div>
                </FoodContent>
                {params.figureId!=='14'&&<>
                
                
                <FoodContent 
                    title={params.language_id === 'vi' ? "Câu hỏi kiểm tra" : "Test questions"}
                >
                    <button
                        className={cn('text-white w-fit m-auto px-4 rounded-2xl py-2', {
                            'bg-gray-300 hover:bg-gray-400': !showInfos,
                            'bg-gray-400 hover:bg-gray-500': showInfos,
                        })}
                        onClick={toggleInfos}
                    >
                        {
                                params.language_id==='vi' ?
                                    showInfos ? 'Ẩn thông tin thêm' : 'Hiển thị thông tin thêm'
                                :
                                    showInfos ? 'Hide additional information' : 'Show more information'
                        }
                    </button>
                    {showInfos && (
                        <div className="mt-4">
                            <ul>
                                <li>
                                    Đặt tên trong trò chơi là gmail mà bạn dùng trong tài khoản này :{' '}
                                    <b>{data?.data?.email}</b>
                                </li>
                                <li>
                                    Bạn sẽ nhận được bộ ảnh đặc quyền tùy theo mức hạng mà bạn đạt được:
                                    <div className="flex flex-col gap-4">
                                        <div className="flex  flex-col gap-4 md:border-none border-t pt-4">
                                            <span className="">Đối với những hạng từ 4-10, sẽ nhận được bộ ảnh:</span>
                                            <ul className="list-none flex-wrap flex items-center gap-4">
                                                {imageIconDefault['good']?.map((item, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <img
                                                                src={item}
                                                                alt="image-icon"
                                                                className="w-10 h-10 rounded-full border border-gray-700"
                                                            />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div className="flex  flex-col gap-4 md:border-none border-t pt-4">
                                            <span className="">Đối với những hạng từ 1-3, sẽ nhận được bộ ảnh:</span>

                                            <ul className="list-none flex-wrap flex items-center gap-4">
                                                {imageIconDefault['top-good']?.map((item, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <img
                                                                src={item}
                                                                alt="image-icon"
                                                                className="w-10 h-10 rounded-full border border-gray-700"
                                                            />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li className="mt-4">Cuối cùng, chúc bạn chơi trò chơi vui vẻ và may mắn !</li>
                            </ul>

                            {/* <p>asacdcdds</p>

                            {
                                data?.data?.fullname
                            } */}
                        </div>
                    )}
                    {isLoggedIn && product?.game!='' &&  (
                        <>
                            <div className="mt-4">
                                <div className="flex justify-center mb-4">
                                    <iframe
                                        className="w-full h-auto aspect-video border-4 border-gray-600 rounded-xl overflow-hidden"
                                        src={product?.game}
                                        title="game"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </>
                    )}
                </FoodContent>
                </>}
            </div>
            {isModal && (
                <div className="fixed inset-0 bg-black/40 z-20 flex items-center justify-center overflow-y-auto">
                    <div className="bg-white p-2 rounded flex flex-col gap-4 absolute top-2 right-2">
                        <button
                            className="hover:bg-red-600 bg-red-500 p-2 rounded text-white"
                            onClick={() => setIsModal(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="currentColor"
                            >
                                <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
                            </svg>
                        </button>
                        <FacebookShareButton hashtag={'Phần mềm Lịch sử địa phương Trà Vinh cung cấp cho tôi những thông tin rất hữu ích'} url={imageModal} quote={''}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        {/* <TwitterShareButton url={imageModal} title={""}>
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton url={imageModal} title={""}>
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <EmailShareButton url={imageModal} subject={""}>
                            <EmailIcon size={32} round />
                        </EmailShareButton> */}
                        <a
                            href={`https://www.messenger.com/t/?link=${encodeURIComponent(imageModal)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="/images/mess.png"
                                alt="Share on Messenger"
                                style={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                        </a>
                        {/* <a href={`https://zalo.me/share/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(product?.title)}`} target="_blank" rel="noopener noreferrer">
                            <img src="/public/images/zalo.png" alt="Share on Zalo" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        </a> */}
                        <button
                            className="hover:bg-blue-500 bg-blue-600 p-2 rounded text-white text-center"
                            onClick={() => handleDownload(imageModal, 'downloaded-image.jpg')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="currentColor"
                            >
                                <path
                                    d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012
                                v-8.861H25.462z"
                                />
                                <path
                                    d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723
                                c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742
                                c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193
                                C15.092,18.979,14.62,18.426,14.62,18.426z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="bg-white rounded-lg p-4 w-[80%] h-[200px] sm:h-[350px] md:h-[500px]">
                        <img src={imageModal} alt="image" className="w-full h-full object-contain" />
                    </div>
                </div>
            )}
        </div>
        </>
    );
});

export default Product;

Product.displayName = 'Product';
