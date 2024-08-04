/* eslint-disable no-unused-vars */

import { useForm } from 'react-hook-form';
import InputField from '../form/input-field';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { uploadToCloudinary } from '@/hooks/use-upload-cloudinary';
import BorderRank from '../border-rank/border-rank';
import { MdRemoveCircle } from 'react-icons/md';
import { FaLockOpen, FaLock  } from "react-icons/fa";


import avatar1 from '@/assets/avartar/403019_avatar_male_man_person_user_icon.svg';
import avatar2 from '@/assets/avartar/628284_avatar_male_man_mature_old_icon.svg';
import avatar3 from '@/assets/avartar/4043232_avatar_batman_comics_hero_icon.svg';
import avatar4 from '@/assets/avartar/4043238_avatar_boy_kid_person_icon.svg';
import avatar5 from '@/assets/avartar/4043250_avatar_child_girl_kid_icon.svg';
import avatar6 from '@/assets/avartar/4043251_avatar_female_girl_woman_icon.svg';
import avatar7 from '@/assets/avartar/4043277_avatar_person_pilot_traveller_icon.svg';

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



const Detail = ({ onUpdate }) => {
    useEffect(() => {
        document.querySelectorAll('input.bg-white').forEach(input => {
          input.classList.remove('bg-white');
        });
    }, []);
    const { isLoggedIn, mutate, data } = useAuth();
    
    const [ images, setImages ] = useState([]);
    const [cloudinaryFiles, setCloudinaryFiles] = useState({});
    const [indexImage, setIndexImage] = useState(null)
    const [activeModal, setActiveModal] = useState(false)
    const [imageIcon, setImageIcon] = useState('')
    const [activeModalIcon, setActiveModalIcon] = useState(false)
    const [indexImageIcon, setIndexImageIcon] = useState(null)

    const [isDisableEmail, setIsDisableEmail] = useState(true)
    const [isDisablePassword, setIsDisablePassword] = useState(true)
    const [isDisableName, setIsDisableName] = useState(true)
    
    const imageDefaults = [
        avatar1,
        avatar2,
        avatar3,
        avatar4,
        avatar5,
        avatar6,
        avatar7,
    ]


    const imageIconDefault = {
        'good': [good_icon1, good_icon2, good_icon3, good_icon4, good_icon5, good_icon6],
        'top-good': [top_good_icon1, top_good_icon2, top_good_icon3, top_good_icon4, top_good_icon5, top_good_icon6,good_icon1, good_icon2, good_icon3, good_icon4, good_icon5, good_icon6],
        'best': [best_icon1, best_icon2, best_icon3, best_icon4, best_icon5,best_icon6,top_good_icon1, top_good_icon2, top_good_icon3, top_good_icon4, top_good_icon5, top_good_icon6, good_icon1, good_icon2, good_icon3, good_icon4, good_icon5, good_icon6],
    }

    const { handleSubmit, control } = useForm({
        defaultValues: {
            fullname: `${data?.data?.fullname}`,
            email: `${data?.data?.email}`,
            password: `${data?.data?.password_nohash}`,
            id: `${data?.data?._id}`,
        },
    });

    function isObjectEmpty(obj) {
        return obj === null || obj === undefined || Object.keys(obj).length === 0;
      }
      

    const onSubmit = async (values) => {
        if(!isObjectEmpty(cloudinaryFiles)) {  
            if(!imageDefaults.includes(images[0])){
                console.log('render')
                const result = await uploadToCloudinary(cloudinaryFiles)

                const imageUrlList = result.map((file) => file.secure_url)
                onUpdate?.({
                    ...values,
                    avatar: imageUrlList[0],
                    imageIcon: imageIcon
                })
                return
            }    
        }
        {console.log(values.password)}
        
        
        const update_data = {
            ...values,
            password_nohash:values.password,
            avatar: images[0],
            imageIcon: imageIcon,
            
        }
        onUpdate?.(update_data)
    }

    const logoutHandler = () => {
        localStorage.removeItem('accessToken');
        mutate();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        const selectedImagesArray = Array.from(files).map((file) => URL.createObjectURL(file));
        setImages(selectedImagesArray);
        setCloudinaryFiles(files);
    }
    

    const getImage = () => {
        if(images[0]) {
            return images[0]
        }
        if (data?.data?.avatar) {
            return data?.data?.avatar
        }
        return 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg'
    }


    const getImageIcon = () => {
        if('' !== imageIcon) {
            return imageIcon
        }
        if (data?.data?.imageIcon) {
            return data?.data?.imageIcon
        }
        return 'https://www.snapon.co.za/images/thumbs/default-image_550.png'
    }
    
    const handleSelectImage = (image) => {
        setImages([image])
        setActiveModal(false)
    }

    const handleSelectImageIcon = (image) => {
        setImageIcon(image)
        setActiveModalIcon(false)
    }


    return (
        <div>
            <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <BorderRank role={data?.data?.role}>
                        <div className='w-[70px] h-[70px] rounded-full border-[4px] border-gray-700 overflow-hidden mx-auto flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                            <img src={getImage()} alt="user-avatar" className='w-full h-full object-cover'/>
                        </div>
                    </BorderRank>
                    <div className='flex items-center gap-4 justify-center'>
                        <button type='button' className='bg-gray-700 text-white p-2 rounded'>
                            <label htmlFor="upload-avatar" className=''>
                                <span className=''>
                                    Chọn từ thiết bị
                                </span>
                                <input type="file" id="upload-avatar" accept="image/*" name='upload-avatar' className='hidden'
                                    onChange={handleFileChange}
                                />
                            </label>
                        </button>
                        <button type='button' className='bg-gray-700 text-white p-2 rounded'
                            onClick={() => setActiveModal(true)}
                        >
                            Chọn ảnh có sẵn
                        </button>
                    </div>

                   {
                        'normal' !== data?.data?.role && (
                            <div className='flex items-center gap-4 justify-center flex-col'>
                                <img src={getImageIcon()} alt="image-icon"  className='w-[40px] h-[40px] rounded-full border-2 border-gray-700' />
                                <button type='button' className='bg-gray-700 text-white p-2 rounded'
                                    onClick={() => setActiveModalIcon(true)}
                                >
                                    Chọn icon
                                </button>
                            </div>
                        )
                   }
                    <InputField
                        htmlType="text"
                        name="id"
                        control={control}
                        label="Id"
                        readOnly={true}
                        disabled={true}
                        style={{ background: '#8080808a' }}
                    />
                    
                    <div className='flex items-end gap-4'>
                        <InputField
                            htmlType="text"
                            name="fullname"
                            control={control}
                            placeholder="Nhập họ tên"
                            label="Họ tên"
                            disabled={isDisableName}
                            style={{ background: isDisableName && '#8080808a',}}
                            labelClassName="flex-1"
                        />
                        <button type='button' className="inline-flex items-center justify-center px-4 h-fit py-2 font-sans font-semibold tracking-wide text-white bg-blue-500 rounded-lg"
                            onClick={() => setIsDisableName(!isDisableName)}
                        >
                            {isDisableName ? <FaLock/> : <FaLockOpen/>}
                        </button>
                    </div>
                    <div className='flex items-end gap-4 w-full'>
                        <InputField
                            htmlType="email"
                            name="email"
                            control={control}
                            placeholder="Nhập email đăng nhập"
                            label="Email"
                            disabled={isDisableEmail}
                            style={{ background: isDisableEmail && '#8080808a',}}
                            labelClassName="flex-1"
                        />
                        <button type='button' className="inline-flex items-center justify-center px-4 h-fit py-2 font-sans font-semibold tracking-wide text-white bg-blue-500 rounded-lg"
                            onClick={() => setIsDisableEmail(!isDisableEmail)}
                        >
                            {isDisableEmail ? <FaLock/> : <FaLockOpen/>}
                        </button>
                    </div>

                    <div className='flex items-end gap-4 w-full'>
                        <InputField
                            htmlType="password"
                            name="password"
                            control={control}
                            placeholder="Nhập mật khẩu đăng nhập"
                            label="Password"
                            disabled={isDisablePassword}
                            style={{ background: isDisablePassword && '#8080808a'}}
                            labelClassName="flex-1"
                        />
                        <button type='button' className="inline-flex items-center justify-center px-4 h-fit py-2 font-sans font-semibold tracking-wide text-white bg-blue-500 rounded-lg"
                            onClick={() => setIsDisablePassword(!isDisablePassword)}
                        >
                            {isDisablePassword ? <FaLock/> : <FaLockOpen/>}
                        </button>
                        
                    </div>
                    <button
                        className="outline-none w-full py-2.5 rounded-xl text-white bg-cyan-700 transition-colors hover:bg-cyan-800"
                        type="submit"
                    >
                        Cập nhật
                    </button>
                    <button
                        className="outline-none w-full py-2.5 rounded-xl text-white bg-red-700 transition-colors hover:bg-red-800"
                        onClick={logoutHandler}
                    >
                        Đăng xuất
                    </button>
                </form>
            </div>
            {
                activeModal && (
                    <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
                        <p className='bg-white rounded p-4'>
                            <div className='flex items-center justify-between border-b pb-2'>
                                <span className='text-lg font-medium'>Thư viện ảnh</span>
                                <button onClick={() => setActiveModal(false)}>
                                    <MdRemoveCircle/>
                                </button>
                            </div>
                            <div className='grid grid-cols-3 gap-4 mt-4'>
                                {imageDefaults.map((item, index) => (
                                    <img src={item} key={index} alt='img-item' className={`cursor-pointer hover:border hover:border-red-600 ${indexImage === index && 'border border-blue-600'}`}
                                        onClick={() => setIndexImage(index)}
                                    />
                                ))}
                            </div>
                            <div className='flex items-center justify-end gap-4'>
                                <button className="rounded font-medium bg-transparent hover:bg-red-500 hover:text-white border border-red-500 text-red-500 px-6 py-2"
                                    onClick={() => setActiveModal(false)}
                                >
                                    Thoát
                                </button>
                                <button className="rounded font-medium bg-transparent hover:bg-blue-500 hover:text-white border border-blue-500 text-blue-500 px-6 py-2"
                                    onClick={() => handleSelectImage(imageDefaults[indexImage])}
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </p>
                    </div>
                )
            }


{
                activeModalIcon && (
                    <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
                        <p className='bg-white rounded p-4 flex flex-col gap-4'>
                            <div className='flex items-center justify-between border-b pb-2'>
                                <span className='text-lg font-medium'>Thư viện ảnh</span>
                                <button onClick={() => setActiveModalIcon(false)}>
                                    <MdRemoveCircle/>
                                </button>
                            </div>
                            <div className='grid grid-cols-5 gap-4 mt-4'>
                                {imageIconDefault[data?.data?.role].map((item, index) => (
                                    <img src={item} key={index} alt='img-item' className={`cursor-pointer hover:border hover:border-red-600 ${indexImageIcon === index && 'border border-blue-600'} w-[40px] h-[40px]`}
                                        onClick={() => setIndexImageIcon(index)}
                                    />
                                ))}
                            </div>
                            <div className='flex items-center justify-end gap-4'>
                                <button className="rounded font-medium bg-transparent hover:bg-red-500 hover:text-white border border-red-500 text-red-500 px-6 py-2"
                                    onClick={() => setActiveModalIcon(false)}
                                >
                                    Thoát
                                </button>
                                <button className="rounded font-medium bg-transparent hover:bg-blue-500 hover:text-white border border-blue-500 text-blue-500 px-6 py-2"
                                    onClick={() => handleSelectImageIcon(imageIconDefault[data?.data?.role][indexImageIcon])}
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </p>
                    </div>
                )
            }
        </div>
    );
};

export default Detail;