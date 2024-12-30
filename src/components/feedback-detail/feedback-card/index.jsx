import BorderRank from '@/components/border-rank/border-rank';
import cn from '@/helper/cn';
import { useAuth } from '@/hooks/use-auth';
import React, { useState ,useRef, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { toast } from 'react-toastify';
import './style.css'

const FeedbackCard = ({ item }) => {
    const { isLoggedIn, mutate, data } = useAuth();
    const [isShow, setIsShow] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [imageModal, setImageModal] = useState('');
    const params = useParams();
    const [likesCount, setLikesCount] = useState(item.likes.length);
    function formatDateISOString(isoString) {
        const date = new Date(isoString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getUTCFullYear();

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

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

    const contentRef = useRef(null);
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = isShow ? `${contentRef.current.scrollHeight}px` : '0px';
        }
    }, [isShow]);

    const fetchFeedback = async (e) => {
        try {
            const feedbackResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/${e}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (feedbackResponse.ok && response.ok) {
                const data = await feedbackResponse.json();
                const data_user = await response.json();
                console.log('fb data ',data);
                console.log('user data',data_user);
                if (data) {
                    setIsLiked(data?.data.likes?.includes(data_user?.data?._id));
                    setLikesCount(data?.data.likes?.length);
                }
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleLike = async (e) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (!response.ok) {
                toast.info('Vui lòng đăng nhập để yêu thích bài viết');
                return;
            }
            const userData = await response.json();

            const likeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/${e}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userData,
                    feedback_id: e,
                }),
            });

            if (likeResponse.ok) {
                // toast.success('Đã thêm bài viết vào mục yêu thích');
                fetchFeedback(item._id);
            } else {
                const likeData = await likeResponse.json();
                toast.error(likeData.message);
            }
        } catch (error) {
            console.error('Error liking product:', error);
            toast.error('Error liking product');
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchFeedback(item._id);
        }
    }, [isLoggedIn,params]);

    return (
        <div className={cn(
            'flex gap-2',
            `${isShow ? 'items-start' : 'items-center'}`
        )}>
            <BorderRank role={item?.createdBy?.role} size={100}>
                <div className="w-[40px] h-[40px] rounded-full border-[4px] border-gray-700 overflow-hidden mx-auto flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src={item.createdBy.avatar} alt="user-avatar" className="w-full h-full object-cover" />
                </div>
            </BorderRank>

            <div className="flex flex-col gap-4">
                <div
                    ref={contentRef}
                    className="overflow-hidden transition-max-height duration-700 ease-in-out"
                >
                {/* { isShow && ( */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 p-2 bg-slate-200 rounded-lg w-fit">
                            {/* <div className="flex gap-2 items-baseline"> */}
                                <div className="font-medium text-left">{item.createdBy.fullname}</div>
                                <div className="italic text-slate-500 text-[12px]">
                                    {formatDateISOString(item.createdAt)}
                                </div>
                            {/* </div> */}
                            <div className="text-slate-600 text-[14px]">{item.comment}</div>
                            <div className="text-slate-600 text-[18px] text-right">{likesCount}{' '}
                            <button 
                                onClick={() => handleLike(item._id)}    
                            >
                                    {!isLiked ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(70,146,221,1)" width="24" height="24">
                                        <path d="M14.5998 8.00033H21C22.1046 8.00033 23 8.89576 23 10.0003V12.1047C23 12.3659 22.9488 12.6246 22.8494 12.8662L19.755 20.3811C19.6007 20.7558 19.2355 21.0003 18.8303 21.0003H2C1.44772 21.0003 1 20.5526 1 20.0003V10.0003C1 9.44804 1.44772 9.00033 2 9.00033H5.48184C5.80677 9.00033 6.11143 8.84246 6.29881 8.57701L11.7522 0.851355C11.8947 0.649486 12.1633 0.581978 12.3843 0.692483L14.1984 1.59951C15.25 2.12534 15.7931 3.31292 15.5031 4.45235L14.5998 8.00033ZM7 10.5878V19.0003H18.1606L21 12.1047V10.0003H14.5998C13.2951 10.0003 12.3398 8.77128 12.6616 7.50691L13.5649 3.95894C13.6229 3.73105 13.5143 3.49353 13.3039 3.38837L12.6428 3.0578L7.93275 9.73038C7.68285 10.0844 7.36341 10.3746 7 10.5878ZM5 11.0003H3V19.0003H5V11.0003Z"></path>
                                    </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(70,146,221,1)" width="24" height="24"><path d="M2 8.99997H5V21H2C1.44772 21 1 20.5523 1 20V9.99997C1 9.44769 1.44772 8.99997 2 8.99997ZM7.29289 7.70708L13.6934 1.30661C13.8693 1.13066 14.1479 1.11087 14.3469 1.26016L15.1995 1.8996C15.6842 2.26312 15.9026 2.88253 15.7531 3.46966L14.5998 7.99997H21C22.1046 7.99997 23 8.8954 23 9.99997V12.1043C23 12.3656 22.9488 12.6243 22.8494 12.8658L19.755 20.3807C19.6007 20.7554 19.2355 21 18.8303 21H8C7.44772 21 7 20.5523 7 20V8.41419C7 8.14897 7.10536 7.89462 7.29289 7.70708Z"></path></svg>
                                    )}
                                </button>
                            </div>
                            
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            {item.images?.map((image, index) => (
                                <div key={index} className="border border-gray-200">
                                    <img
                                        onClick={() => handleModalImageCarousel(image)}
                                        alt="image-upload-item"
                                        className="w-full h-[200px] object-contain"
                                        src={image}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 {/* )} */}
                
                <button
                    className={cn(
                        'p-2 rounded text-white w-fit',
                        isShow ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'
                    )}
                    onClick={() => setIsShow(!isShow)}
                >
                    {
                                params.language_id==='vi' ?
                                    !isShow ? 'Xem bình luận' : 'Ẩn bình luận'
                                :
                                    !isShow ? 'See comments' : 'Hide comments'
                    }
                </button>
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
};

export default FeedbackCard;