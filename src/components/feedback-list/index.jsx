import { Swiper, SwiperSlide } from 'swiper/react';

import FeedbackCard from '../feedback-card';

/* eslint-disable no-unused-vars */
const FeedbackList = ({ isLoading, feedbacks }) => {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        // <div className="grid grid-cols-4 gap-6">
        //     {feedbacks.data.map((feedback) => (
        //         <FeedbackCard key={feedback._id} feedback={feedback} />
        //     ))}
        // </div>
        <div className="container">
            <Swiper slidesPerView={3} spaceBetween={30}>
                {feedbacks.data.map((feedback) => (
                    <SwiperSlide key={feedback._id}>
                        <FeedbackCard feedback={feedback} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default FeedbackList;
