import React, { memo } from 'react';

const CardContentText = memo(({ children, value }) => {
    return (
        <>
            <p>
                {value}
            </p>
            {children}
        </>
    );
});

export default CardContentText;

CardContentText.displayName = 'CardContentText';