import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import productData from '@/data/product';
import './style-map.css'
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/use-auth';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 200px)' 
};

const Mapphone = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

    // useEffect(() => {
    //   const token = localStorage.getItem('accessToken');
    //   if (!token) {
    //     setShowAlert(true);
    //     navigate('/tieng-viet/account');
    //   }
    // }, [navigate]);
  
    // useEffect(() => {
    //   if (showAlert) {
    //     toast.warning('Bạn cần đăng nhập để truy cập trang này');
    //     setShowAlert(false);
    //   }
    // }, [showAlert]);
  
    // Nếu không có token thì sẽ không render gì cả
    
    // if (!token) {
    //   return null;
    // }
    const token = localStorage.getItem('accessToken');
  const [locations, setLocations] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [locationNames, setLocationNames] = useState([]);
  const [toDo, setToDo] = useState([]);
  const [done, setDone] = useState([]);
  const [prepare,setPrepare]= useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [roadDrawerControl, setRoadDrawerControl] = useState(null);
  // const [animatePoints, setAnimatePoints] = useState(null);
  const [listLngLat, setlistLngLat] = useState([
    [-74.006, 40.7128],
    [-73.935242, 40.730610],
    // Thêm nhiều tọa độ nếu cần
  ]);
  const [userId, setUserId] = useState('');
  const [td_x, setTdX] = useState(null);
  const [td_y, setTdY] = useState(null);
  const [isadd, setIsAdd] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationData,setLocationData]=useState([]);
  const { isLoggedIn, mutate, data } = useAuth();

  // Fetching the list of locations
  const getListLocation = async () => {
    try {
      const response = await axios.get(`https://historic-be.onrender.com/api/locations/list/tra-vinh`);
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  };

  

  // Fetching the list of coordinates for the user direction
  const getListLocationUserForDirection = async () => {
    try {
      // console.log('userlocationdata ',isLoggedIn);
      // if (!isLoggedIn) return [];
      // console.log('login ',isLoggedIn);
      // const token = localStorage.getItem('accessToken');
      const userId  = localStorage.getItem('userId');
      // mutate();
      // const userId=data?.data?._id;
      console.log('id ',userId);
      
      // const userId=data?.data?._id;
      const response = await axios.get(`https://historic-be.onrender.com/api/locations/direction/${userId}`);
      return convertLocationsToPoints(response.data);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const coordinatesData = await getListLocationUserForDirection();
      const locationsData = await getListLocation();
      setLocationData(locationsData);
      const coordinates = coordinatesData.map(coord => {
        const [longitude, latitude] = coord;
        return { latitude, longitude };
      });

      const filteredLocations = locationsData.filter(location => {
        return !coordinates.some(coord => 
          coord.latitude === location.latitude && coord.longitude === location.longitude
        );
      });
      const sortedLocations = [...filteredLocations].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });      
      setLocations(locationsData);
      // setDone(sortedLocations);
      setPrepare(sortedLocations)
      setCoordinates(coordinates);
      console.log('type data od done ',done);
      console.log('all des ',locationsData);

    };

    fetchData();
  }, []);

  useEffect(() => {
    const findLocationNames = (locations, coordinates) => {
      return coordinates.map(coord => {
        const location = locations.find(loc => {
          return loc.latitude === coord.latitude && loc.longitude === coord.longitude;
        });
        return location ? location.name : 'Vị trí của bạn';
      });
    };

    if (locations.length > 0 && coordinates.length > 0) {
      const names = findLocationNames(locations, coordinates);
      setLocationNames(names);
      setToDo(names.map((name, index) => ({ name, id: index, latitude: coordinates[index].latitude, longitude: coordinates[index].longitude })));
    }
  }, [locations, coordinates]);


  const [mapLoaded, setMapLoaded] = useState(false);


  const replaceSvgWithImage = () => {
    const markers = document.querySelectorAll('.indexed-marker.vtmapgl-marker.vtmapgl-marker-anchor-bottom');
    markers.forEach(marker => {
      const spans = marker.querySelectorAll('span');
      if (spans.length >= 2) {
        const secondSpan = spans[1];
        const svgElement = secondSpan.querySelector('svg');
        if (svgElement && !secondSpan.querySelector('img')) {
          const imgElement = document.createElement('img');
          imgElement.src = '/destination.png';
          imgElement.alt = 'Location Image';
          imgElement.style.width = '55px'; // Đặt chiều rộng
          imgElement.style.height = '55px'; // Đặt chiều cao
          secondSpan.replaceChild(imgElement, svgElement);
        }
      }
    });
  };

  useEffect(() => {
    // Gọi hàm để thay thế SVG và điều chỉnh kích thước ảnh
    replaceSvgWithImage();

    // Sử dụng MutationObserver để theo dõi các thay đổi động trong DOM
    const observer = new MutationObserver(() => replaceSvgWithImage());
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Dọn dẹp khi component unmount
    return () => observer.disconnect();
  }, []); 
 

  useEffect(() => {
    // const scripts = {
    //   script: document.createElement('script'),
    //   link: document.createElement('link'),
    // };

    // // Cấu hình thẻ script
    // scripts.script.src = 'https://files-maps.viettel.vn/sdk/vtmap-gl-directions/v4.1.0/vtmap-gl-directions.js';
    // scripts.script.defer = true;
    // document.body.appendChild(scripts.script);

    // // Cấu hình thẻ link
    // scripts.link.href = 'https://files-maps.viettel.vn/sdk/vtmap-gl-directions/v4.1.0/vtmap-gl-directions.css';
    // scripts.link.rel = 'stylesheet';
    // document.head.appendChild(scripts.link);


    const script = document.createElement('script');
    script.src = 'https://files-maps.viettel.vn/sdk/vtmap-gl-js/v1.13.1/vtmap-gl.js';
    script.onload = () => {
      console.log('Script loaded successfully');
      initializeMap();
    };
    script.onerror = () => {
      console.error('Failed to load the script');
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);





  const initializeMap = async () => {
    console.log('Initializing map');
    vtmapgl.accessToken = '272ee553681f6e55bfa579bda02ebdd4';
    const map = new vtmapgl.Map({
      container: 'map',
      style: vtmapgl.STYLES.VTRANS,
      center: [106.31371494579435, 9.92895623029051],
      zoom: 13,
      preserveDrawingBuffer: true
    });
      const geolocateControl = new vtmapgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserLocation:true
    });
    // new geolocateControl(trackUserLocation?);
    // new GeolocateControl.options(showUserLocation);
    
      map.addControl(geolocateControl);
      map.on("load", function () {
        geolocateControl.trigger(1); // add this if you want to fire it by code instead of the button
      });
      geolocateControl.on("geolocate", locateUser);
  
      function locateUser(e) {
          const longitude = e.coords.longitude;
          const latitude = e.coords.latitude;
          setTdX(longitude);
          setTdY(latitude);
          // geolocateControl.trigger(0);
          map.removeControl(geolocateControl);
      }
      
     
      const scale = new vtmapgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
        });
      map.addControl(scale);


      // const direction = new Directions({
      //   accessToken: vtmapgl.accessToken,
      //   interactive: false,
      //   alternatives: false,
      //   controls: {
      //     profileSwitcher: false
      //   },
      //   profile: 'driving'
      // });
      
      // map.addControl(direction, 'top-left');
      // // direction.deactive();
      // map.on('load', () => {
      //   direction.setOrigin([106.02222,9.894042]);
      //   direction.addWaypoint(0, [106.30402,9.91769]);
      //   direction.addWaypoint(1, [105.98233,9.894804]);
      //   direction.setDestination([106.30402,9.91769]);
      // })


    // const navigationControl = new vtmapgl.NavigationControl();
    // map.addControl(navigationControl, 'top-left');

    const roadDrawerControl  = new vtmapgl.RoadDrawerControl({
      accessToken: vtmapgl.accessToken,
      mode: 'driving',
      activeState: false,
      addable: false,
    });

    map.addControl(roadDrawerControl);
    setRoadDrawerControl(roadDrawerControl);    
    roadDrawerControl.deactive();
    // setlistLngLat(await getListLocationUserForDirection());
    
    // setAnimatePoints(animatePoints);


    const points = await getListLocationUserForDirection();
    console.log('Points:', points);

    const locationsData = await getListLocation();
    // const Destination = setDestination(points, locationsData);
    // console.log('destination ',Destination);

    map.on('load', () => {
      console.log('Map loaded');
      setMapLoaded(true);
      if (points && points.length > 0) {
        try {
          console.log('Setting points:', points);
          roadDrawerControl.setPoints(points);
        } catch (error) {
          console.error('Error setting points:', error);
        }
      }
    });


  };



  // const token = localStorage.getItem('accessToken');

  const handleSave = async () => {
    // const userId  = localStorage.getItem('userId');
    const userId=data?.data?._id;
    console.log(userId);
    const points = toDo
      .filter(task => task.name !== 'Vị trí của bạn') // Lọc các task có tên khác 'Vị trí của bạn'
      .map(task => [task.longitude, task.latitude]); // Trích xuất kinh độ và vĩ độ

    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để lưu hành trình!');
      return;
    }
    // if (!token ) {
    //   toast.error('Vui lòng đăng nhập để lưu hành trình!');
    //   return;
    // }
    try {
      const response = await axios.post(`https://historic-be.onrender.com/api/locations/${userId}`, {points});
      toast.success('Danh sách hành trình đã được lưu');
    } catch (error) {
      console.error('Error saving the list:', error);
      toast.error('Lưu danh sách hành trình thất bại');
    }
  };

  useEffect(() => {
    if (roadDrawerControl && mapLoaded) {
      const points = toDo.map(task => [task.longitude, task.latitude]);
      setlistLngLat(points);
      console.log('update bay ',listLngLat);
      // animatePoints.addTo(mapp);
      // const locationsData = await getListLocation();
      // const Destination = setDestination(points, locationData);
      // console.log('update data ',Destination);
      console.log('Updating toDo:', toDo);
      try {
        if (points.length > 0 && points[0].length === 2) {
          console.log('Setting points from toDo:', points);
          roadDrawerControl.setPoints(points);
        } else if (points.length===0){
          roadDrawerControl.setPoints([]);
          console.error('Invalid points format:', points);
        }
      } catch (error) {
        console.error('Error updating points:', error);
      }
    }
  }, [toDo, roadDrawerControl, mapLoaded]);



    useEffect(() => {
      console.log('Giá trị toDo trong useEffect:', toDo);
    
      const handleClick = (event) => {
        const clickedDiv = event.currentTarget;
        const firstSpan = clickedDiv.querySelector('span');
        if (firstSpan) {
          console.log('Nội dung của span đầu tiên:', firstSpan.textContent);
          console.log('Giá trị toDo con cặc:', toDo);
          console.log('compare with ',locationData);
          const a=toDo[firstSpan.textContent];
          const location = locationData.find(loc => loc.name === a.name);
          // Cập nhật selectedLocation nếu tìm thấy
          if (location) {
            setSelectedLocation(location);
          }
          
          if (location === undefined) {
            setSelectedLocation((prevLocation) => ({
              ...prevLocation,
              name: 'Đây là vị trí của bạn',
            }));
          }
        }
      };
    
      const addClickListener = () => {
        const divElements = document.querySelectorAll('.indexed-marker.vtmapgl-marker.vtmapgl-marker-anchor-bottom');
        divElements.forEach((element) => {
          if (!element.hasAttribute('data-listener-attached')) {
            element.addEventListener('click', handleClick);
            element.setAttribute('data-listener-attached', 'true');
          }
        });
      };
    
      const observer = new MutationObserver(() => {
        addClickListener();
      });
    
      observer.observe(document.body, { childList: true, subtree: true });
    
      return () => {
        observer.disconnect();
        document.querySelectorAll('.indexed-marker.vtmapgl-marker.vtmapgl-marker-anchor-bottom').forEach((element) => {
          element.removeEventListener('click', handleClick);
        });
      };
    }, [toDo]);


    

  const handleClick = () => {
    setIsAdd(prevState => !prevState);
    if (isadd) toast.success('Đã thêm vị trí bạn vào chuyến đi'); else toast.info('Đã xóa vị trí bạn khỏi chuyến đi');
    if (isadd) {
      setToDo((prevToDo) => {
        if (prevToDo.length > 0) {
          const lastItem = prevToDo.slice(-1)[0];
          const updatedLastItem = { ...lastItem, name: 'Vị trí của bạn', longitude: td_x, latitude: td_y };
          return [...prevToDo, updatedLastItem];
        } else {
          return [{ name: 'Vị trí của bạn', longitude: td_x, latitude: td_y }];
        }
      });
    }
    else {
      const toMove = toDo.filter(item => item.longitude === td_x && item.latitude === td_y);
      const remaining = toDo.filter(item => !(item.longitude === td_x && item.latitude === td_y));
      const newToDo = remaining.concat(toMove);
      setToDo(newToDo);
      toast.info('Thao tác của bạn đang chậm lại, vui lòng đợi...');
      setTimeout(() => {
        setToDo(prevToDo =>
          prevToDo.filter(item => item.longitude !== td_x || item.latitude !== td_y)
        );
      toast.dismiss(); // Ẩn thông báo trước
      toast.success('Thao tác đã hoàn tất.');
      }, 200);
    }
    console.log('data from todo to update point when click add postition ', toDo);
    if (roadDrawerControl && mapLoaded) {
      const points = toDo.map(task => [task.longitude, task.latitude]);
      
      console.log('pretoDo',toDo);
      console.log('Updating points:', points);
      setlistLngLat(points);
      try {
        if (points.length > 0 && points[0].length === 2) {
          console.log('Setting points from toDo:', points);
          roadDrawerControl.setPoints(points);
        } else if (points.length===0) {
          roadDrawerControl.setPoints([]);
          console.error('Invalid points format:', points);
        }
      } catch (error) {
        console.error('Error updating points:', error);
      }
    } 

  };


  const [selectedOptions, setSelectedOptions] = useState([]);

  // Danh sách các tùy chọn với giá trị thực và văn bản hiển thị
  const options = [
    { value: 'lua-chon-1', label: 'Lựa chọn 1' },
    { value: 'lua-chon-2', label: 'Lựa chọn 2' },
    { value: 'lua-chon-3', label: 'Lựa chọn 3' },
    { value: 'lua-chon-4', label: 'Lựa chọn 4' },
    { value: 'lua-chon-5', label: 'Lựa chọn 5' }
  ];

  // Hàm xử lý khi người dùng chọn hoặc bỏ chọn một checkbox
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedOptions(prevOptions =>
      prevOptions.includes(value)
        ? prevOptions.filter(option => option !== value)
        : [...prevOptions, value]
    );
  };

  // Hàm xử lý khi người dùng bấm nút gửi
  const handleSubmit = () => {
    // Hiển thị giá trị thực đã chọn
    alert(`Các giá trị đã chọn: ${selectedOptions.join(', ')}`);
    // Bạn có thể thực hiện hành động gửi dữ liệu ở đây
  };
  

  const getIdAddress = (title) => {
    for (let index = 0; index < productData.length; index++) {
        const element = productData[index];
        for (let j = 0; j < element.data.length; j++) {
            const child = element.data[j];
            if (child.title === title) {
                return {
                    figue_id: element.figureId,
                    product_id: child.id,
                    tour_id: child.tour,
                }
            }
        }
    }
}
  
  const handleProduct=()=>{
    if (selectedLocation) {
      navigate(`/tieng-viet/figure/${getIdAddress(selectedLocation.name).figue_id}/product/${getIdAddress(selectedLocation.name).product_id}`)
    }
  };

  const handleTour=()=>{
    if (selectedLocation.tourUrl!=''){
      window.location.assign(selectedLocation.tourUrl)
    }
    else if (getIdAddress(selectedLocation.name).tour_id!='0'){
    navigate(`/tieng-viet/thinglink/${getIdAddress(selectedLocation.name).tour_id}`)
    }
  }
  const handleClose = () => {
    setSelectedLocation(null);
  };

    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
      setPrepare((prevPrepare) => prevPrepare.filter(item => item !== option));
      setDone((prevDone) => {
        const updatedDone = [...prevDone, option];
        const sortedDone = updatedDone.sort((a, b) => a.name.localeCompare(b.name));
        return sortedDone;
      });
    };

    const handleaddToDo = (option) => {
      setDone((prevdone) => prevdone.filter(item => item !== option));
      setToDo((prevtodo) => [...prevtodo, option]);
    };

    const handleremoveDone = (option) => {
      setDone((prevdone) => prevdone.filter(item => item !== option));
      // setPrepare((prevprepare) => [option,...prevprepare]);
      setPrepare((prevprepare) => {
        const updatedPrepare = [...prevprepare, option];
        const sortedPrepare = updatedPrepare.sort((a, b) => a.name.localeCompare(b.name));
        return sortedPrepare;
      });
    };

    const handleIncrease = (index) => {
      setToDo(prevTodos => {
        const todos = [...prevTodos];
        const length = todos.length;
    
        // Xác định chỉ số mục cần hoán đổi
        const swapIndex = index === 0 ? length - 1 : index - 1;
    
        // Hoán đổi các giá trị
        [todos[index], todos[swapIndex]] = [todos[swapIndex], todos[index]];
    
        return todos;
      });
    };

    const handleremoveToDo=(option) =>{
      setToDo((prevtodo) => prevtodo.filter(item => item !== option));
      setDone((prevdone) => [option,...prevdone]);
    }
    

    const hometown=(e)=>{
      if (e==='cau-ke') return "Cầu Kè";
      if (e==='duyen-hai') return "Duyên Hải";
      if (e==='tieu-can') return "Tiểu Cần";
      if (e==='tra-vinh') return "Trà Vinh";
      if (e==='cau-ngang') return "Cầu Ngang";
      if (e==='cau-ke') return "Cầu Kè";
      if (e==='tra-cu') return "Trà Cú";
      if (e==='chau-thanh') return "Châu Thành";
      return "undefined";
    }

    const [typeMap,setTypeMap]=useState(1);

    const handleTypeMap=(e)=>{
      setTypeMap(e);
    }

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="relative h-full w-full flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center items-stretch md:space-x-0 space-y-4 md:space-y-0 py-4 w-full max-w-4xl">
          <div className="list-card w-full md:w-1/2 p-4">
            <div
              className="card list-card-done bg-white shadow rounded p-4 flex flex-col"
            >
              <h1 className="text-lg font-bold text-center">Danh sách hành trình</h1>
              <div className=" task-list flex-grow">
              <ul className="list-disc pl-5">
                {toDo.map((location, index) => (
                  <li
                    className=" task mt-2 flex items-center px-4 py-2 border border-gray-300 cursor-pointer rounded-lg transition-all duration-300 hover:border-green-500"
                    key={index}
                  >
                    <span className="text-base font-semibold">{index}. {location.name}</span>
                    <div className="flex space-x-2 ml-auto">
                      <button
                        onClick={() => handleIncrease(index)}
                        className="bg-green-500 text-white py-1 px-2 rounded transition-colors duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                      >
                        <svg className='w-5'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z"></path></svg>
                      </button>
                      <button
                        onClick={() => handleremoveToDo(location)}
                        className="bg-red-500 text-white py-1 px-2 rounded transition-colors duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 transition duration-300"
                  onClick={handleSave}
                >
                  Lưu điểm hành trình
                </button>
                <button
                  onClick={handleClick}
                  className={`ml-auto px-4 py-2 rounded text-white transition duration-300 ${
                    isadd
                      ? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                      : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                  }`}
                >
                  {isadd ? 'Thêm vị trí' : 'Xóa vị trí'}
                </button>
              </div>
            </div>
          </div>
          <div className="list-card  w-full md:w-1/2 p-4">
            <div
              className="card list-card-done bg-white shadow rounded p-4 flex flex-col"
            >
              <h1 className="text-lg font-bold text-center">Địa điểm hứng thú</h1>
              <div className="flex-grow">
                <ul className="pl-5">
                  {done.map((location, index) => (
                    <li 
                      className="mt-1 flex items-center justify-between px-4 py-2 border border-gray-300 cursor-pointer rounded-lg transition-all duration-300 hover:border-green-500"
                      key={index}
                    > 
                      <span className="text-base font-semibold">{location.name}</span>
                      <div className="flex space-x-2 ml-auto">  
                        <button
                          onClick={() => handleaddToDo(location)}
                          className="bg-green-500 text-white py-1 px-2 rounded transition-colors duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                          <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path></svg>
                        </button>
                        <button
                          onClick={() => handleremoveDone(location)}
                          className="bg-red-500 text-white py-1 px-2 rounded transition-colors duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                        </button>
                      </div>
                    </li>

                  ))}
                </ul>            
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col items-center mb-4">
          <button
            type="button"
            onClick={toggleDropdown}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-1"
          >
            {!isOpen ? 'Mở kho địa điểm' : 'Đóng kho địa điểm'}
            
          </button>
          {isOpen && (
            <ul className="w-[100%] bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
              {prepare.map((location, index) => (
                <li 
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  key={index}
                > 
                  <div>
                    <span className="text-base font-semibold">{location.name}</span>
                    <div className="text-sm text-gray-500 italic ">
                      Thuộc:{' '}{hometown(location.country)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOptionClick(location)}
                    className="bg-green-500 text-white py-1 px-2 rounded transition-colors duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="button-container mb-4 w-full md:w-[30%]"> 
          <button 
            onClick={() => handleTypeMap(1)}
            className={`flex-1 px-4 py-2 my-2 rounded transform transition-transform duration-300 ease-in-out ${typeMap === 1 ? 'bg-blue-600 text-black hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-105 active:scale-95' : 'bg-blue-400 text-gray-800 hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300'}`}
          >
            Hành trình
          </button>
          <button 
            onClick={() => handleTypeMap(2)}
            className={`flex-1 px-4 py-2 my-2 rounded transform transition-transform duration-300 ease-in-out ${typeMap === 2 ? 'bg-green-600 text-black hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 active:scale-95' : 'bg-green-400 text-gray-800 hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300'}`}
          >
            Địa điểm
          </button>
        </div>



      </div>
      
      {/* <div id="map" className="w-[80%] h-[810px]"></div> */}
      <div className="flex-1 relative">
        <div id="map" className="w-full h-[610px]"></div>
        <div
        className={`absolute bottom-0 left-0 w-full bg-black text-white p-4 border-t border-gray-200 transition-opacity duration-500 ease-in-out ${
          selectedLocation ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {selectedLocation && (
          <>
            <button
            className="absolute top-2 right-2 text-white text-lg px-4 py-2 bg-red-500 rounded-full hover:bg-red-600 active:bg-red-700 transition duration-300"
            onClick={handleClose}
            >
            X
            </button>
            <h2 className="text-2xl font-bold ">{selectedLocation.name}</h2>
            {selectedLocation.name!=='Đây là vị trí của bạn' && (
            <>
              <p>{selectedLocation.decription}</p>
              <div className="flex items-center space-x-2 mt-2">
                {/* <button
                  className="bg-white text-black px-4 py-2 rounded"
                  onClick={handleFindPath}
                >
                  Tìm đường
                </button> */}
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleProduct}
                >
                  Thuyết minh
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleTour}
                >
                  3D - VR Tour
                </button>
              </div>
            </>
            )}
            <div className='h-[50px]'/>          
          </>
        )}
      </div>
      </div>
    
  </div>
  // </div>
  );
};

function convertLocationsToPoints(data) {
  const { locations } = data;
  return locations.map(location => location.split(',').map(Number));
}

export default Mapphone;