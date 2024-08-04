import React, { memo } from 'react';

const CardContentGridImage = memo (({value}) => {
    return (
        <div className='grid grid-cols-2 gap-2'>
            {value?.map((image, index) => (
                <img key={index} src={image} alt="content-image"  className="w-full h-full object-cover"/>
            ))}
        </div>
    );
});

export default CardContentGridImage;

CardContentGridImage.displayName = 'CardContentGridImage'