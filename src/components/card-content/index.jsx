import React, { memo } from 'react';

const CardContent = memo(({ children, title }) => {
    return (
        <div className='flex flex-col gap-4 p-4 bg-white rounded'>
            <h4 className='text-lg font-medium'>{title}</h4>
            {children}
        </div>
    );
});

export default CardContent;

CardContent.displayName = 'CardContent';