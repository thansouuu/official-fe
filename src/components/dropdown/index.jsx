import React, { useState } from 'react';

const Dropdown = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left w-full">
            <div className="flex justify-between items-center p-4 hover:bg-gray-700 w-full" onClick={toggleDropdown}>
               <div>{title}</div>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path></svg>
            </div>

            {isOpen && (
                <div
                >
                    <div className="py-1">
                        {items.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                target='_blank'
                                className=" px-4 py-2 text-sm text-gray-500 hover:text-white flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M5 11V13H19V11H5Z"></path></svg>
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
