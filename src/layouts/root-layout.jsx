import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';

const RootLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        "https://via.placeholder.com/1200x300?text=Slide+1",
        "/public/images/food-0.jpg",
        "https://via.placeholder.com/1200x300?text=Slide+3",
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    
   
    
    return (
        <>
            <div className="h-screen flex flex-col">
                
                <Header toggleSidebar={toggleSidebar} />
                <div className="flex flex-1">
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                    <main className={`flex-1 p-4 mt-[72px] transition-margin duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
                        
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default RootLayout;
