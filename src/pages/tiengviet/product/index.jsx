import React, { memo, useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';

import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import cn from '@/helper/cn';
import FoodContent from '@/components/food-content';
import FeedbackCard from '@/components/feedback-detail/feedback-card';

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


const Product = memo(() => {
    const { isLoggedIn, mutate, data } = useAuth();

    // const { isLoggedIn } = useAuth();
    const [product, setProduct] = useState(null);
    const [isComent, setIsComemt] = useState(false);
    const [isBonus, setIsBonus] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [images, setImages] = useState([]);
    const [imageValue, setImagevalue] = useState('');
    const [cloudinaryFiles, setCloudinaryFiles] = useState({});
    const [isCreateFeedback, setIsCreateFeedback] = useState(false);
    const [comment, setComment] = useState('');
    const [convertFeedBacks, setConvertFeedBacks] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showInfos, setShowInfos] = useState(false);
    const [users, setUsers] = useState([]);
    const [mentionList, setMentionList] = useState([]);
    const params = useParams();
    const [isModal, setIsModal] = useState(false);
    const [imageModal, setImageModal] = useState('');
    // const [image, setImage] = useState('')
    // const [isModal, setIsModal] = useState(false);
    // const [valueModal, setValueModal] = useState(null);

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
        handleSort('desc', data?.data);
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        setImagevalue(event.target.value);
        const selectedImagesArray = Array.from(files).map((file) => URL.createObjectURL(file));
        setImages(selectedImagesArray);
        setCloudinaryFiles(files);
    };

    useEffect(() => {
        const productList = productData.find((item) => item.figureId == params.figureId);
        const product = productList?.data.find((item) => item.id == params.id);

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

    const sortFeedBack = (type, data) => {
        if ('desc' == type) {
            return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        if ('asc' == type) {
            return data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    };

    const handleSort = (type, data) => {
        setConvertFeedBacks(sortFeedBack(type, getFeedBackByIdProduct(params.figureId, params.id, data)));
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
                toast.success('Product liked successfully');
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
                toast.success('Link copied to clipboard');
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



    return (
        
        <div className="flex flex-col gap-4 pb-4 max-w-[992px] mx-auto">
            {/* <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3, minimum-scale=1" />
            </Helmet> */}
            {product?.video!='' && 
            <iframe
                className="w-full h-auto aspect-video border-4 border-gray-600 rounded-xl overflow-hidden"
                src={product?.video}
                title="Thuyết trình về món Bánh canh Bến Có"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
            ></iframe>
            }
            <h2 className="text-3xl text-center pb-4 border-b border-slate-800 flex justify-center items-center gap-2">
                {product?.title}
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
                    <FoodContent title={content.title} key={index}>
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
                            className={cn(' text-white w-fit m-auto px-4 rounded py-2 mt-2', {
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
                                                        alt={user.fullname}
                                                        className="w-6 h-6 rounded-full"
                                                    />
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
                <FoodContent title="Chia sẻ bài viết">
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
                            <TwitterIcon size={32} round />
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
                <FoodContent title="Trò chơi thử thách">
                    <button
                        className={cn('text-white w-fit m-auto px-4 rounded-2xl py-2', {
                            'bg-gray-300 hover:bg-gray-400': !showInfos,
                            'bg-gray-400 hover:bg-gray-500': showInfos,
                        })}
                        onClick={toggleInfos}
                    >
                        {showInfos ? 'Ẩn thông tin thêm' : 'Hiển thị thông tin thêm'}
                    </button>
                    {showInfos && (
                        <div className="mt-4">
                            <ul>
                                <li>
                                    Đặt tên trong trò chơi là gmail mà bạn dùng trong tài khoản này :{' '}
                                    {data?.data?.email}
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
                                        title="Thuyết trình về món Bánh canh Bến Có"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </>
                    )}
                </FoodContent>
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
    );
});

export default Product;

Product.displayName = 'Product';
