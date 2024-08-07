import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';

const FoodContent = ({ title, children }) => {
    const [image, setImage] = useState('/background.svg');
    const { data, isLoggedIn } = useAuth();
    const [borderBackground, setBorderBackground] = useState('');

    const role = data?.data?.role;

    useEffect(() => {
        if (data && role && isLoggedIn) {
            if (role === 'good') {
                setBorderBackground('/border/top3.svg');
            }
            if (role === 'best') {
                setBorderBackground('/border/top1.svg');
                // setBorderBackground('https://github.com/buhkhkt/CHINH/blob/main/ba%20kh%C3%ADa.jpg');
            }
            if (role === 'top-good') {
                setBorderBackground('/border/top2.svg');
            }
        }
    }, [role, isLoggedIn]);

    const checkEmpty = (value) => {
        return value === '' || value === null || value === undefined;
    }

    // Determine text color based on title
    const titleColorClass = ['TOP 3 BÀI VIẾT NỔI BẬT', 'NHỮNG MỤC NỔI BẬT'].includes(title) ? 'text-red-800' : 'text-gray-800';

    const fontWeightClass = ['TOP 3 BÀI VIẾT NỔI BẬT', 'NHỮNG MỤC NỔI BẬT'].includes(title) ? 'font-bold' : 'font-semibold';

    return (
        <>
            <div className="bg-opacity-40 p-4 bg-white/80 rounded-2xl shadow flex flex-col gap-4 mb-4">

                <div className="flex gap-x-5 flex-wrap">
                    {/* {role && role !== 'normal' && <img src={checkEmpty(data?.data?.imageIcon) ? 'https://static.thenounproject.com/png/4974686-200.png': data?.data?.imageIcon} className="w-10 h-10" alt="" />} */}
                    {role && role !== 'normal' && <img src={data?.data?.imageIcon} className="w-10 h-10" alt="" />}
                    <h3 className={`text-2xl ${titleColorClass} ${fontWeightClass}`}>{title} :</h3>
                </div>

                <div className="text-justify break-words whitespace-pre-wrap">
                    {children}
                </div>
            </div>
        </>
    );
};

export default FoodContent;
