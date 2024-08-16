import React, { memo, useEffect, useState, useRef} from 'react';
import { Carousel } from 'react-bootstrap';

import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import cn from '@/helper/cn';
import FoodContent from '@/components/food-content';
import FeedbackCard from '@/components/feedback-detail/feedback-card';
import './styles.css'
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
import storyData from '@/data/story'
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


const Story = memo(() => {
    const { isLoggedIn, mutate, data } = useAuth();

    // const { isLoggedIn } = useAuth();
    const [product, setProduct] = useState(null);
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
    const [showInfos, setShowInfos] = useState(false);
    const [users, setUsers] = useState([]);
    const params = useParams();
    const [isModal, setIsModal] = useState(false);


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
        console.log(feedbacks)
        handleSort('desc', data?.data);
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
        // const productList = productData.find((item) => item.figureId == params.figureId);
        // const product = productList?.data.find((item) => item.id == params.id);
        // setProduct(product);
        // getListFeedBack();
        const product = storyData.find((item) => item.id == params.id);
        setProduct(product);
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
    };

    const handleMentionInputBonus = (e) => {
        const inputValue = e.target.value;
        setCommentBonus(inputValue);
    };

    const getFeedBackByIdProduct = (id, data) => {
        const product = storyData?.find((item) => item.id == id);
        return data?.filter((item) => item.productId == product?.id);
    };

    const sortFeedBack = (type, data) => {
        if ('desc' == type) {
            return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        if ('asc' == type) {
            return data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    };

    const handleSort = (type, data) => {
        setConvertFeedBacks(sortFeedBack(type, getFeedBackByIdProduct(params.id, data)));
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
                toast.error('Failed to fetch user data');
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
                toast.success('Đã thêm câu chuyện vào mục yêu thích');
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

    const toggleInfos = () => {
        if (!isLoggedIn) {
            toast.error('Bạn phải đăng nhập để chơi trò chơi!');
            return;
        }
        setShowInfos(!showInfos);
    };
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
    const [isVisible, setIsVisible] = useState(false);
    const contentRef = useRef(null);

    // Hàm xử lý khi nút được click
    const handleShowSource = () => {
      setIsVisible(prevState => !prevState); // Chuyển đổi giá trị của `isVisible`
    };

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

    return (
        
        <div className="flex flex-col gap-4 pb-4 max-w-[992px] mx-auto">
            {/* <div className="flex flex-col gap-4 w-full "> */}
            {/* {params.id == 101 && (
                <div>
                    {(() => {
                        const values = product["1,1;2,2"];
                        if (values && values.length > 0) {
                            const nestedValues = values[0]["3,3;4,4"];
                            return nestedValues.map((value, index) => (
                                <p key={index}>{value}</p>
                               
                            ));
                        }
                        return null; 
                    })()}
                    <div className='h-[40px]'/>
                </div>
                
            )} */}
            <div className='flex flex-col items-center'>
                <iframe
                    className="mb-2 w-full h-auto aspect-video border-4 border-gray-600 rounded-xl overflow-hidden"
                    src={video}
                    allow="fullscreen;webkitallowfullscreen; mozallowfullscreen ;allowfullscreen"
                    allowFullScreen=""
                ></iframe>
                <script async src="//cdn.thinglink.me/jse/responsive.js"></script>
                <button
                        onClick={handleVideo}
                        className={cn('px-4 py-2 text-white w-fit m-auto  rounded ', {
                            'bg-green-400 hover:bg-green-500': !isvideo,
                            'bg-red-400 hover:bg-red-500': isvideo,
                        })}
                    >
                        {!isvideo ? 'Thêm thủ ngữ' : 'Bỏ thủ ngữ'}
                </button>
            </div>
            <h2 className="text-3xl text-center pb-4 border-b border-slate-800 flex justify-center items-center gap-2">
                {/* {product?.title} */}
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

            <div className="flex flex-col gap-4">
                {product?.contents?.map((content, index) => (
                    <div key={index}  >
                        <div className="flex justify-center mb-2">
                        <button 
                            onClick={handleShowSource}
                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                            
                            {!isVisible ? 'Xem diễn biến' : 'Đóng diễn biến'}
                        </button>
                        </div>
                        <div
                            ref={contentRef}
                            className={`overflow-hidden transition-max-height duration-700 ease-in-out`}
                            style={{ maxHeight: isVisible ? contentRef.current.scrollHeight + 'px' : '0px' }}
                        >
                            <FoodContent title={content.title}>
                            {content.data?.map((item, key) => (
                                <div key={key}>
                                    {item.type === 'text' && <CardContentText value={item.value} />}
                                </div>
                            ))}
                        </FoodContent>
                        </div>
                    </div>
                    
                ))}
                <FoodContent title="Liên quan">
                    <div className="flex items-center gap-2 flex-wrap">
                        {product?.tags?.map((tag, index) => (
                            <button key={index} className="py-2 px-4 bg-slate-200 hover:bg-slate-300">
                                <Link to={tag.link}>{tag.title}</Link>
                            </button>
                        ))}
                    </div>
                </FoodContent>
                <FoodContent title="Đánh giá và nhận xét">
                    <div>
                        <button
                            className={cn('text-white w-fit m-auto px-4 rounded py-2', {
                                'bg-green-400 hover:bg-green-500': !isComent,
                                'bg-red-400 hover:bg-red-500': isComent,
                            })}
                            onClick={handleOpenComment}
                        >
                            {isComent ? 'Hủy đánh giá' : 'Viết đánh giá'}
                        </button>
                        {isComent && (
                            <form onSubmit={handleComemt} className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-col gap-1 relative">
                                    <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="comment">
                                        Bình luận
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="comment"
                                        name="comment"
                                        rows="5"
                                        placeholder="Nhập đánh giá..."
                                        required
                                        value={comment}
                                        onChange={handleMentionInput}
                                    ></textarea>
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
                            {isBonus ? 'Hủy bổ sung thêm' : 'Viết bổ sung thêm'}
                        </button>
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
                    </div>
                </FoodContent>
                <FoodContent title="Danh sách đánh giá">
                    <div className="mt-4">
                        <div className="flex justify-center mb-4">
                            <select name="sort" id="sort" onChange={(e) => handleSort(e.target.value, feedbacks)}>
                                <option value="desc">Mới nhất</option>
                                <option value={'asc'}>Cũ nhất</option>
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
                <FoodContent title="Chia sẻ mẫu chuyện">
                    <div className="flex gap-4">
                        <FacebookShareButton hashtag={'Phần mềm Lịch sử địa phương Trà Vinh cung cấp cho tôi những thông tin rất hữu ích'} url={window.location.href} quote={product?.title}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
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
            </div>
        </div>
    );
});

export default Story;

Story.displayName = 'Story';
