import cn from '@/helper/cn';
import React, { useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import {Tooltip} from 'react-tooltip';
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
} from 'react-share';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

const HighlightText = ({ text, highlights }) => {
    const [isModal, setIsModal] = useState(false);
    const [valueModal, setValueModal] = useState(null);

    const handleHighlightClick = (highlight) => {
        if (highlight?.valueModal?.type === 'image') {
            setIsModal(true);
            setValueModal(highlight?.valueModal?.value);
        }
    };

    const renderTooltipText = (text, id) => {
        return <a className={clsx('inline-block font-semibold text-[#be9f76] cursor-pointer', id)}>{text}</a>;
    };

    const getHighlightedText = (text, highlights) => {
        const values = highlights.map((h) => h.hightlight);
        const regex = new RegExp(`(${values.join('|')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) => {
            const highlight = highlights.find((h) => h.hightlight === part);
            return highlight ? (
                <span
                    key={index}
                    className={cn('inline relative highlighted-text text-amber-700 font-medium cursor-pointer', {
                        'group relative': highlight?.valueModal?.type == 'tooltip',
                    })}
                    onClick={() => handleHighlightClick(highlight)}
                >
                    {highlight?.valueModal?.type == 'tooltip' ? (
                        <>
                            {/* <a id={highlight?.valueModal?.id}>{part} </a>
                            <Tooltip anchorSelect={`#${highlight?.valueModal?.id}`} clickable>
                                {highlight?.valueModal?.ref ? <a href={highlight?.valueModal?.link} target="_blank">{highlight?.valueModal?.value}</a> : highlight?.valueModal?.value}
                            </Tooltip> */}
                            {highlight?.valueModal?.ref ? (
                                <Tippy 
                                    interactive={true} interactiveBorder={20}
                                    content={
                                        <div className='min-w-[95px]'>
                                            <Link to={highlight?.valueModal?.link}>
                                                {highlight?.valueModal?.value}
                                            </Link>
                                            {/* <a href={highlight?.valueModal?.link} target="_blank" rel="noreferrer">
                                                {highlight?.valueModal?.value}
                                            </a> */}
                                        </div>
                                    }
                                >
                                   <span className={'text-green-400'}> {part} </span>
                                </Tippy>
                            ) : (
                                <>
                                    {highlight?.type == 'out' ? ( 
                                        <Tippy className={' text-justify text-[16px]'} content={highlight?.valueModal?.value}>< span className={'text-[17px] text-gray-800 text-justify'}>{part}</span></Tippy>
                                    ) : (
                                        <> <Tippy  content={highlight?.valueModal?.value}><span>{part}</span></Tippy></>
                                    )}
                                </>
                                // <Tippy content={highlight?.valueModal?.value}><span>{part}</span></Tippy>
                                
                            
                            )}
                        </>
                    ) : (
                        part
                    )}

                </span>
            ) : (
                part
            );
        });
    };

    const handleDownload = async (url, filename) => {
        const response = await fetch(url, {
            mode: 'cors',
        });
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    return (
        <>
            <div>{getHighlightedText(text, highlights)}</div>
            {isModal && (
                <div className="fixed inset-0 bg-black/40 z-20 flex items-center justify-center overflow-y-auto">
                    <div className="bg-white p-2 rounded flex flex-col gap-4 absolute top-2 right-2">
                        <button
                            className="hover:bg-red-600 bg-red-500 p-2 rounded text-white"
                            onClick={() => setIsModal(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="currentColor"
                            >
                                <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
                            </svg>
                        </button>
                        <FacebookShareButton url={valueModal} quote={''}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        
                        {/* <WhatsappShareButton url={valueModal} title={""}>
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <EmailShareButton url={valueModal} subject={""}>
                            <EmailIcon size={32} round />
                        </EmailShareButton> */}
                        <a
                            href={`https://www.messenger.com/t/?link=${encodeURIComponent(valueModal)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="/images/mess.png"
                                alt="Share on Messenger"
                                style={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                        </a>
                        {/* <TwitterShareButton url={valueModal} title={""}>
                            <TwitterIcon size={32} round />
                        </TwitterShareButton> */}
                        {/* <a href={`https://zalo.me/share/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(product?.title)}`} target="_blank" rel="noopener noreferrer">
                            <img src="/public/images/zalo.png" alt="Share on Zalo" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        </a> */}
                        <button
                            className="hover:bg-blue-500 bg-blue-600 p-2 rounded text-white text-center"
                            onClick={() => handleDownload(valueModal, 'downloaded-image.jpg')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="currentColor"
                            >
                                <path
                                    d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012
                                v-8.861H25.462z"
                                />
                                <path
                                    d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723
                                c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742
                                c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193
                                C15.092,18.979,14.62,18.426,14.62,18.426z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="bg-white rounded-lg p-4 w-[80%] h-[200px] sm:h-[350px] md:h-[500px]">
                        <img src={valueModal} alt="image" className="w-full h-full object-contain" />
                    </div>
                </div>
            )}
        </>
    );
};

export default HighlightText;
