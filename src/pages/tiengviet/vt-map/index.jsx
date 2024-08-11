import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import productData from '@/data/product';
import Thinklink from '../thinglink';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './style-map.css'
import { toast } from 'react-toastify';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 200px)' 
};

const VtMap = () => {
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
    // const token = localStorage.getItem('accessToken');
    // if (!token) {
    //   return null;
    // }
  
  const [locations, setLocations] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [locationNames, setLocationNames] = useState([]);
  const [toDo, setToDo] = useState([]);
  const [done, setDone] = useState([]);
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
  const [tmp, setTmp] = useState([]);

 
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
      const userId  = localStorage.getItem('userId');
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

      
      setLocations(locationsData);
      setDone(filteredLocations);
      setCoordinates(coordinates);
      
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


  // function setDestination(points, locationsData) {
  //   const destination = locationsData
  //     .filter(location =>
  //       points.some(point => point[0] === location.longitude && point[1] === location.latitude)
  //     )
  //     .map(location => ({
  //       ...location,
  //       coordinates: [location.longitude, location.latitude],
  //       message: 'Meow Meow!',
  //       imageUrl: 'https://raw.githubusercontent.com/thansouuu/data-image/main/%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m/Ch%C3%B9a%20Can%20Snom/23.jpg'
  //     }));
  
  //   return destination;
  // }

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
          imgElement.src = '/public/destination.png';
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
          console.log('bay ',listLngLat);
          console.log('Points set on map');

        
        } catch (error) {
          console.error('Error setting points:', error);
        }
      }
    });

    
  };




  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (task, source, index) => {
    setDraggedItem({ task, source, index });
  };

  const handleDrop = (event, destination, index) => {
    event.preventDefault();
    const data = draggedItem;
    if (!data) return;

    if (data.source === destination) {
      if (destination === 'toDo') {
        const updated = [...toDo];
        const [removed] = updated.splice(data.index, 1);
        updated.splice(index, 0, removed);
        setToDo(updated);
      } else {
        const updated = [...done];
        const [removed] = updated.splice(data.index, 1);
        updated.splice(index, 0, removed);
        setDone(updated);
      }
    } else {
      if (destination === 'toDo') {
        setDone((prev) => prev.filter((task) => task.name !== data.task.name));
        setToDo((prev) => {
          const updated = [...prev];
          updated.splice(index, 0, data.task);
          return updated;
        });
      } else {
        setToDo((prev) => prev.filter((task) => task.name !== data.task.name));
        setDone((prev) => {
          const updated = [...prev];
          updated.splice(index, 0, data.task);
          return updated;
        });
      }
    }
    setDraggedItem(null);
  };

  const getDropIndex = (event, destinationList) => {
    const rect = event.target.getBoundingClientRect();
    const offset = event.clientY - rect.top;
    const height = rect.height;
    const totalItems = destinationList.length;
    const ratio = offset / height;
    const index = Math.floor(ratio * totalItems);
    return index;
  };

  const token = localStorage.getItem('accessToken');

  const handleSave = async () => {
    // const geolocateControl = new vtmapgl.GeolocateControl({
    //   positionOptions: {
    //     enableHighAccuracy: true
    //   },
    //   trackUserLocation: true,
    //   showUserLocation:true,
    // });
    // new geolocateControl(trackUserLocation());
    const userId  = localStorage.getItem('userId');
    const points = toDo
      .filter(task => task.name !== 'Vị trí của bạn') // Lọc các task có tên khác 'Vị trí của bạn'
      .map(task => [task.longitude, task.latitude]); // Trích xuất kinh độ và vĩ độ

    if (!token) {
      toast.error('Vui lòng đăng nhập để lưu hành trình!');
      return;
    }
    try {
      const response = await axios.post(`https://historic-be.onrender.com/api/locations/${userId}`, {points});
      toast.success('Danh sách hành trình đã được lưu');

    } catch (error) {
      console.error('Error saving the list:', error);
      toast.error('Lưu danh sách hành trình thất bại');
    }
  };

  useEffect(() => {


    if (roadDrawerControl && mapLoaded && toDo.length > 0) {
      const points = toDo.map(task => [task.longitude, task.latitude]);
      setlistLngLat(points);
      console.log('update bay ',listLngLat);
      // animatePoints.addTo(mapp);
      setTmp(toDo);
      // const locationsData = await getListLocation();
      // const Destination = setDestination(points, locationData);
      // console.log('update data ',Destination);
      console.log('Updating toDo:', toDo);
      try {
        if (points.length > 0 && points[0].length === 2) {
          console.log('Setting points from toDo:', points);
          roadDrawerControl.setPoints(points);
        } else {
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
    if (isadd) toast.success('Đã thêm vị trí bạn vào chuyến đi'); else toast.warning('Đã xóa vị trí bạn khỏi chuyến đi');
    setIsAdd(prevState => !prevState);
    const lastItem = toDo.slice(-1)[0];
    if (lastItem && isadd) {
      const updatedLastItem = { ...lastItem, name: 'Vị trí của bạn', longitude: td_x, latitude: td_y };
      setToDo((prevToDo) => [updatedLastItem,...prevToDo ]);
    }
    else {
      setToDo(prevToDo => 
        prevToDo.filter(item => item.longitude !== td_x || item.latitude !== td_y)
      );
    }
    if (roadDrawerControl && mapLoaded && toDo.length > 0) {
      const points = toDo.map(task => [task.longitude, task.latitude]);
      console.log('pretoDo',toDo);
      console.log('Updating points:', points);
      setlistLngLat(points);
      try {
        if (points.length > 0 && points[0].length === 2) {
          console.log('Setting points from toDo:', points);
          roadDrawerControl.setPoints(points);
        } else {
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


  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="relative h-full w-full flex flex-col items-center">
      <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Chọn nhiều tùy chọn:</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex items-center">
            <label htmlFor={`checkbox-${index}`} className="flex-1">{option.label}</label>
            <input
              type="checkbox"
              id={`checkbox-${index}`}
              value={option.value}
              checked={selectedOptions.includes(option.value)}
              onChange={handleCheckboxChange}
              className="ml-3"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Gửi
      </button>
    </div>
        <div className="flex flex-col md:flex-row justify-center items-stretch md:space-x-0 space-y-4 md:space-y-0 py-4 w-full max-w-4xl">
          <div className="list-card w-full md:w-1/2 p-4">
            <div
              className="card list-card-done bg-white shadow rounded p-4 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, 'toDo', getDropIndex(event, toDo))}
            >
              <h1 className="text-lg font-bold text-center">Danh sách hành trình</h1>
              <div className="task-list flex-grow">
                <ul className="list-disc pl-5">
                  {toDo.map((task, index) => (
                    <li
                      className="task py-1"
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(task, 'toDo', index)}
                      onDragOver={handleDragOver}
                    >
                      {index}. {task.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center space-x-4">
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
        {/* </div> */}
            </div>
          </div>
          <div className="list-card w-full md:w-1/2 p-4">
            <div
              className="card list-card-done bg-white shadow rounded p-4 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, 'done', getDropIndex(event, done))}
            >
              <h1 className="text-lg font-bold text-center">Danh sách địa điểm</h1>
              <div className="task-list flex-grow">
                <ul className="list-disc pl-5">
                  {done.map((location, index) => (
                    <li
                      className="task-1 py-1"
                      key={location._id}
                      draggable
                      onDragStart={() => handleDragStart(location, 'done', index)}
                      onDragOver={handleDragOver}
                    >
                      {index +1 }. {location.name}
                    </li>
                  ))}
                </ul>            
              </div>
            </div>
          </div>
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

export default VtMap;