import React, { useEffect, useState } from 'react';
import FoodContent from '@/components/food-content';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'react-toastify';
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon
} from 'react-share';

import productData from '@/data/product';
import storyData from '@/data/story'
import { Link,useParams} from 'react-router-dom';
import Bot from '@/pages/tiengviet/chatbot';

const LikedPosts = () => {
    const { isLoggedIn } = useAuth();
    const [likedPosts, setLikedPosts] = useState([]);
    const [userId, setUserId] = useState('');
    const [types, setTypes] = useState(0);
    const [list, setList] = useState([]);
    const [post, setPost] = useState([]);
    const [story, setStory] = useState([]);
    const [activeButton, setActiveButton] = useState(null);


    const fetchLikedPosts = async () => {
        try {
            const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                setUserId(userData._id);
                if (userData.data.likes) {
                    setLikedPosts(userData.data.likes);
                } else {
                    setLikedPosts([]);
                }
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching liked posts:', error);
            setLikedPosts([]);
        }
    };


    useEffect(() => {
        if (isLoggedIn) {
            fetchLikedPosts();
        }
    }, [isLoggedIn]);

    const handleRemoveLike = async (postTitle) => {
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

            const removeLikeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userData,
                    productTitle: postTitle,
                }),
            });

            if (removeLikeResponse.ok) {
                toast.success('Đã xóa khỏi mục yêu thích');
                fetchLikedPosts(); // Refresh the liked posts list
            } else {
                const removeLikeData = await removeLikeResponse.json();
                toast.error(removeLikeData.message);
            }
        } catch (error) {
            console.error('Error removing like:', error);
            toast.error('Error removing like');
        }
    };


    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
          () => {
            toast.success('Sao chép link trang thành công');
          },
          (err) => {
            toast.error('Failed to copy link');
            console.error('Failed to copy: ', err);
          }
        );
      };

    const sortedProducts = likedPosts.sort((a, b) => a.localeCompare(b));
    // console.log(sortedProducts)

    

    const handleButtonClick = (value) => {
        setTypes(value);
        setActiveButton(value);
        if (value === 1) {
            setList(post); 
        }
        else setList(story);
        console.log(list);
    };

    useEffect(() => {
        const updateArrayOfType = () => {
          const result1 = [];
          const result2 = [];
          
          for (let id = 0; id < sortedProducts.length; id++) {
            const title = sortedProducts[id];
            for (let index = 0; index < productData.length; index++) {
              const element = productData[index];
              for (let j = 0; j < element.data.length; j++) {
                const child = element.data[j];
                if (child.title === title) {
                  result1.push({
                    title_id:title,
                    figure_id: element.figureId,
                    product_id: child.id,
                    image_id: child.imageCover,
                    decrip_id: child.description,
                  });
                }
              }
            }
    
            for (let index = 0; index < storyData.length; index++) {
              if (storyData[index].title === title) {
                result2.push({
                  title_id:title,
                  product_id: storyData[index].id,
                  image_id: storyData[index].imageCover,
                  decrip_id: storyData[index].description,
                });
              }
            }
          }
    
          setPost(result1);
          setStory(result2);
        };
    
        updateArrayOfType();
      }, [sortedProducts]);

      useEffect(() => {
        if (types === 1) {
          setList(post); 
        } else {
          setList(story);
        }
      }, [types, post, story]);
      console.log(story);
      console.log(post);
    const param=useParams();
    return (
        <>
            {/* <Bot/> */}
        
        <div className="flex flex-col gap-4 pb-4 max-w-[992px] mx-auto">
            <h2 className="text-3xl text-center pb-4 border-b border-slate-800">{param.language_id==='vi'?"Yêu thích":"Favourites"}</h2>
            <div className="col-span-full bg-white p-6 rounded shadow-md flex justify-center items-center flex-wrap mb-6">
                <button 
                    onClick={() => handleButtonClick(1)}
                    className="w-40 px-4 py-2 my-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-focus:ring-blue-300 transform transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 mr-4"
                >
                    {param.language_id==='vi'?"Bài viết":"Article"}
                </button>
                <button 
                    onClick={() => handleButtonClick(2)}
                    className="w-40 px-4 py-2 my-2 bg-green-500 text-white rounded hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-focus:ring-green-300 transform transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 mr-4"
                >
                    {param.language_id==='vi'?"Câu chuyện":"Story"}
                </button>
            </div>


            <div className="flex flex-col gap-4">
                {list.map((item, index) => (
                    <>
                    { types === 1 && 
                        <>
                            <div key={index}>
                            <FoodContent title={item.title_id} key={index} >

                                <Link to={`/language/${param.language_id}/figure/${item.figure_id}/product/${item.product_id}`}>

                                    <div className='text-[15px]'>
                                        <img
                                            className="d-block w-full h-full object-contain my-2"
                                            src={item.image_id}

                                        />
                                        {item.decrip_id}
                                    </div>
                                </Link>
                                <div className="flex gap-4 my-3 text-[15px]">
                                    <FacebookShareButton hashtag={'Phần mềm Lịch sử địa phương Trà Vinh cung cấp cho tôi những thông tin rất hữu ích'} 
                                    url={`https://lichsudiaphuong-travinh.netlify.app/language/${param.language_id}/figure/${item.figure_id}/product/${item.product_id}`} quote={item.title_id}>
                                        <FacebookIcon size={32} round />
                                    </FacebookShareButton>

                                    {/* <WhatsappShareButton url={window.location.href} title={postTitle}>
                                        <WhatsappIcon size={32} round />
                                    </WhatsappShareButton> */}
                                    {/* <EmailShareButton url={window.location.href} subject={postTitle}>
                                        <EmailIcon size={32} round />
                                    </EmailShareButton> */}
                                    <a href={`https://www.messenger.com/t/?link=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener     noreferrer">
                                    <img src="/images/mess.png" alt="Share on Messenger" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                    </a>
                                    <TwitterShareButton url={window.location.href} title={item.title_id}>
                                        <img
                                            src="/images/twitter.jpg"
                                            alt="Twitter"
                                            style={{ width: 32, height: 32, borderRadius: '50%' }}
                                        />
                                    </TwitterShareButton>
                                    <button
                                        onClick={() => copyToClipboard(`https://lichsudiaphuong-travinh.netlify.app/language/${param.language_id}/figure/${item.figure_id}/product/${item.product_id}`)}
                                        className="flex items-center gap-2"
                                        >
                                        <img
                                            src="/images/link.png"
                                            alt="Copy Link"
                                            style={{ width: 32, height: 32, borderRadius: '50%' }}
                                        />
                                        {/* Copy Link */}
                                        </button>
                                    <button 
                                    onClick={() => handleRemoveLike(item.title_id)} 
                                        // className="text-red-600"
                                        className="hover:bg-red-600 bg-red-500 p-2 rounded text-white"
                                    >
                                        {/* Remove Like */}
                                        <svg xmlns="http://www.w3.org/2000/svg"  width="16"
                                        height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
                                    </button>
                                </div>
                            </FoodContent>
                            
                            </div>
                            
                        </>
                    }
                    { types === 2 && 
                        <>
                            <div key={index}>
                            <FoodContent title={item.title_id} key={index} >

                                <Link to={`/language/${param.language_id}/story/${item.product_id}`}>

                                    <div className='text-[15px]'>
                                        <img
                                            className="d-block w-full h-full object-contain my-2"
                                            src={item.image_id}

                                        />
                                        {item.decrip_id}
                                    </div>
                                </Link>
                                <div className="flex gap-4 my-3 text-[15px]">
                                    <FacebookShareButton hashtag={'Phần mềm Lịch sử địa phương Trà Vinh cung cấp cho tôi những thông tin rất hữu ích'} 
                                    url={`https://lichsudiaphuong-travinh.netlify.app/language/${param.language_id}/story/${item.product_id}`} quote={item.title_id}>
                                        <FacebookIcon size={32} round />
                                    </FacebookShareButton>

                                    {/* <WhatsappShareButton url={window.location.href} title={postTitle}>
                                        <WhatsappIcon size={32} round />
                                    </WhatsappShareButton> */}
                                    {/* <EmailShareButton url={window.location.href} subject={postTitle}>
                                        <EmailIcon size={32} round />
                                    </EmailShareButton> */}
                                    <a href={`https://www.messenger.com/t/?link=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener     noreferrer">
                                    <img src="/images/mess.png" alt="Share on Messenger" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                    </a>
                                    <TwitterShareButton url={window.location.href} title={item.title_id}>
                                        <TwitterIcon size={32} round />
                                    </TwitterShareButton>
                                    <button
                                        onClick={() => copyToClipboard(`https://lichsudiaphuong-travinh.netlify.app/language/${param.language_id}/story/${item.product_id}`)}
                                        className="flex items-center gap-2"
                                        >
                                        <img
                                            src="/images/link.png"
                                            alt="Copy Link"
                                            style={{ width: 32, height: 32, borderRadius: '50%' }}
                                        />
                                        {/* Copy Link */}
                                        </button>
                                    <button 
                                    onClick={() => handleRemoveLike(item.title_id)} 
                                        // className="text-red-600"
                                        className="hover:bg-red-600 bg-red-500 p-2 rounded text-white"
                                    >
                                        {/* Remove Like */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                        height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
                                    </button>
                                </div>
                            </FoodContent>
                            </div>
                            {list.length === 0 && <div className="text-center">Không có câu chuyện yêu thích</div>}
                        </>
                    }
                    </>
                   
                ))}
                {list.length === 0 && <div className="text-center">Không có nội dung yêu thích</div>}
            </div>
        </div>
        </>
    );
};

export default LikedPosts;
