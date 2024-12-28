/* eslint-disable no-unused-vars */
import RootLayout from '@/layouts/root-layout';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';
import Account from '@/pages/tiengviet/account';
import Hdsd from '@/pages/tiengviet/hdsd';
import ForgotPassword from '@/pages/tiengviet/ForgotPassword';
import Download from '@/pages/tiengviet/download';
import Categories from '@/pages/tiengviet/categories';
import Product from '@/pages/tiengviet/product';
import Tag from '@/pages/tiengviet/tag';
import Figure from '@/pages/tiengviet/figure';
import Map from '@/pages/tiengviet/map';
import LikedPosts from '@/pages/tiengviet/like';
import Main from '@/pages/tiengviet/main';
import Thinglink from '@/pages/tiengviet/thinglink';
import Find from '@/pages/tiengviet/find';
import Bot from '@/pages/tiengviet/chatbot';
import City from '@/pages/tiengviet/city';
import VtMap from '@/pages/tiengviet/vt-map'
import List from '@/pages/tiengviet/list';
import Story from '@/pages/tiengviet/story';
import Mapphone from '@/pages/tiengviet/map-phone';
import Mapadvanced from '@/pages/tiengviet/map-advanced';
import Hometown from '@/pages/tiengviet/hometown';

export const routes = [
    {
        path: '/download',
        element: <Download />,
    },
    {
        path: '/language/:language_id',
        element: <RootLayout />,
        children: [
            {
                path: 'thinglink/:id',
                element: <Thinglink />,
            },
            {
                path: 'story/',
                element: <List />,
            },
            {
                path: 'story/:id',
                element: <Story />,
            },
            {
                path: 'account',
                element: <Account />,
            },
            { 
                index: true, 
                element: <Home /> ,
            },
            { 
                path: 'figure', 
                element: <Figure />, 
            },
            { 
                path: 'hometown', 
                element: <Hometown />, 
            },
            { 
                path: 'figure/:id', 
                element: <Categories /> ,
            },
            { 
                path: 'figure/:figureId/product/:id', 
                element: <Product /> ,
            },
            { 
                path: 'tag/:id', 
                element: <Tag /> ,
            },
            { 
                path: 'city/:id', 
                element: <City /> ,
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />,
            },
            {
                path: 'map',
                element: <Map />,
            },
            {
                path: 'vt-map',
                element: <VtMap />,
            },
            {
                path: 'map-phone',
                element: <Mapphone />,
            },
            {
                path: 'map-advanced',
                element: <Mapadvanced/>
            },
            {
                path: 'like',
                element: <LikedPosts />,
            },
            {
                path: 'main',
                element: <Main />,
            },
            {
                path: 'find',
                element: <Find />,
            },
            {
                path: 'chatbot',
                element: <Bot />,
            },
            
            {
                path: 'hdsd',
                element: <Hdsd />,
            },
            { 
                path: '*', 
                element: <NotFound /> ,
            },
        ],
    },
];
