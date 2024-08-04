import BorderRank from '@/components/border-rank/border-rank';
import cn from '@/helper/cn';
import React, { useState } from 'react';

const FeedbackCard = ({ item }) => {
    const [isShow, setIsShow] = useState(true);
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
                {isShow && (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 p-2 bg-slate-200 rounded-lg w-fit">
                            <div className="flex gap-2 items-baseline">
                                <div className="font-medium">{item.createdBy.fullname}</div>
                                <div className="italic text-slate-500 text-[12px]">
                                    {formatDateISOString(item.createdAt)}
                                </div>
                            </div>
                            <div className="text-slate-600 text-[14px]">{item.comment}</div>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            {item.images?.map((image, index) => (
                                <div key={index} className="border border-gray-200">
                                    <img
                                        alt="image-upload-item"
                                        className="w-full h-[200px] object-contain"
                                        src={image}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button
                    className={cn(
                        'p-2 rounded text-white w-fit',
                        {
                            'bg-blue-500 hover:bg-blue-700': !isShow,
                        },
                        {
                            'bg-red-500 hover:bg-red-700': isShow,
                        },
                    )}
                    onClick={() => setIsShow(!isShow)}
                >
                    {isShow ? 'Ẩn bình luận' : 'Xem bình luận'}
                </button>
            </div>
        </div>
    );
};

export default FeedbackCard;