import React, { memo } from 'react';
import HighlightText from '@/components/hightlight-text';
const CardContentHightlight = memo(({ children, value, hightlightList}) => {
    return (
        <>
            <HighlightText text={value} highlights={hightlightList} />
            {children}
        </>
    );
});

export default CardContentHightlight;

CardContentHightlight.displayName = 'CardContentHightlight';