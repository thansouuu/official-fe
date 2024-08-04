import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import linkData from '@/data/thinglink';

const Thinklink =() => {
    const params = useParams();
    const [product, setProduct] = useState(null);
    useEffect(() => {
        const product = linkData.find((item) => item.id == params.id);
        setProduct(product);
    }, [params]);
    return (
            <div className="flex flex-col gap-4  w-full h-screen">
                <iframe
                    className="w-full h-full"
                    // src='https://www.thinglink.com/view/scene/1873090905683001830'
                    src={product?.link}
                    allow="fullscreen;webkitallowfullscreen; mozallowfullscreen ;allowfullscreen"
                    allowFullScreen=""
                ></iframe>
                <script async src="//cdn.thinglink.me/jse/responsive.js"></script>
            </div>
        );
};

export default Thinklink;


