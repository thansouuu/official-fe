import clsx from 'clsx';

const IntroCard = ({ title, subtitle, description, className, onFeedback }) => {
    return (
        <div
            className={clsx(
                'text-white tracking-tight p-10 flex justify-center items-start flex-col gap-4 font-light',
                className,
            )}
        >
            <div className="title text-2xl md:text-6xl font-light" data-swiper-parallax="-300">
                {title}
            </div>
            <div className="subtitle text-lg md:text-3xl" data-swiper-parallax="-200">
                {subtitle}
            </div>
            <div className="text text-base md:text-xl max-w-[400px]" data-swiper-parallax="-100">
                <p>{description}</p>
            </div>

            <div className="mt-8">
                <button
                    type="button"
                    className="outline-none flex items-center justify-center px-6 py-3 rounded-full bg-transparent border border-white font-semibold transition-colors duration-300 hover:bg-white hover:text-black active:scale-95"
                    onClick={() => onFeedback?.()}
                >
                    Đánh giá ngay
                </button>
            </div>
        </div>
    );
};

export default IntroCard;
