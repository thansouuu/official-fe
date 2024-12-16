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

    const [fontSize, setFontSize] = useState(16); // State để lưu kích cỡ chữ

    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value); // Cập nhật kích cỡ chữ khi người dùng kéo thanh trượt
    };

    return (
        <>
            <div className="bg-opacity-40 p-4 bg-white/80 rounded-2xl shadow flex flex-col gap-4 mb-4">
                <div className="flex gap-x-5 flex-wrap items-center">
                    <h3 className="text-2xl">{title} :</h3>
                    {/* Thanh trượt điều chỉnh kích cỡ chữ */}
                    <input
                        type="range"
                        min="12"
                        max="30"
                        step="1"
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        className="w-48" // Chiều rộng của thanh trượt
                    />
                </div>

                <div
                    className="text-justify break-words whitespace-pre-wrap"
                    style={{ fontSize: `${fontSize}px` }} // Áp dụng kích cỡ chữ
                >
                    {children}
                </div>
            </div>
        </>
    );
};

export default FoodContent;
