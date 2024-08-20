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

const Mapadvanced = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const token = localStorage.getItem('accessToken');
    const [locations, setLocations] = useState([]);
    const [coordinates, setCoordinates] = useState([]);
    const [locationNames, setLocationNames] = useState([]);
    const [toDo, setToDo] = useState([]);
    const [done, setDone] = useState([]);
    const [prepare,setPrepare]= useState([]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [roadDrawerControl, setRoadDrawerControl] = useState(null);
    const [listLngLat, setlistLngLat] = useState([]);
    const [userId, setUserId] = useState('');
    const [td_x, setTdX] = useState(null);
    const [td_y, setTdY] = useState(null);
    const [isadd, setIsAdd] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationData,setLocationData]=useState([]);
    const { isLoggedIn, mutate, data } = useAuth();
    const [mapLoaded, setMapLoaded] = useState(false);
    const [destination,setDestination]=useState([]);

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
      const sortedLocations = [...filteredLocations].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });      
      setLocations(locationsData);
      // setDone(sortedLocations);
      setPrepare(sortedLocations)
      setCoordinates(coordinates);
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
      console.log('data to draw hehe ',toDo)
    }
  }, [locations, coordinates]);


  const replaceSvgWithImage = () => {
    // Chọn tất cả các marker với class mới
    const markers = document.querySelectorAll('.indexed-marker.vtmapgl-marker.vtmapgl-marker-anchor-center');
    
    markers.forEach(marker => {
      // Tìm thẻ svg trong thẻ div marker
      const svgElement = marker.querySelector('svg');
      if (svgElement && !marker.querySelector('img')) {
        // Tạo thẻ img và thay thế thẻ svg
        const imgElement = document.createElement('img');
        imgElement.src = '/destination.png';
        imgElement.alt = 'Location Image';
        imgElement.style.width = '55px'; // Đặt chiều rộng
        imgElement.style.height = '55px'; // Đặt chiều cao
        marker.replaceChild(imgElement, svgElement);
      }
    });
  };
  
  

  useEffect(() => {
    replaceSvgWithImage();
    const observer = new MutationObserver(() => replaceSvgWithImage());
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    return () => observer.disconnect();
  }, []); 
 

  useEffect(() => {
    const scripts = {
      script: document.createElement('script'),
      link: document.createElement('link'),
    };

    // Cấu hình thẻ script
    scripts.script.src = 'https://files-maps.viettel.vn/sdk/vtmap-gl-directions/v4.1.0/vtmap-gl-directions.js';
    scripts.script.defer = true;
    document.body.appendChild(scripts.script);

    // Cấu hình thẻ link
    scripts.link.href = 'https://files-maps.viettel.vn/sdk/vtmap-gl-directions/v4.1.0/vtmap-gl-directions.css';
    scripts.link.rel = 'stylesheet';
    document.head.appendChild(scripts.link);


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

    const direction = new Directions({
        accessToken: vtmapgl.accessToken,
        interactive: false,
        alternatives: false,
        controls: {
          profileSwitcher: false
        },
        profile: 'driving'
    });
      
    map.addControl(direction, 'top-left');

    const mapStyleControl = new vtmapgl.MapStyleControl();
    map.addControl(mapStyleControl);
    
    const scale = new vtmapgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
    });
    map.addControl(scale);

    const coordinatesData = await getListLocationUserForDirection();
    const locationsData = await getListLocation();
    setLocationData(locationsData);
    // Tạo một mảng des từ locationsData và coordinatesData
    const des = coordinatesData.map(([long, lat]) => {
        // Tìm phần tử trong locationsData có longitude và latitude khớp với long và lat hiện tại
        const location = locationsData.find(loc => loc.longitude === long && loc.latitude === lat);
      
        // Nếu tìm thấy phần tử phù hợp, trả về đối tượng với tên từ locationsData và long, lat từ coordinatesData
        // Nếu không tìm thấy, trả về đối tượng với tên 'vị trí của bạn'
        return location ? { name: location.name, long, lat } : { name: 'Vị trí của bạn', long, lat };
      });
    setDestination(des);
    
  console.log('desssss ',des);

  
    des.forEach(data => {
        // Tạo phần tử div cho marker
        const el = document.createElement('div');
        el.innerHTML = `
      <div class="flex flex-col items-center text-center">
        <span class="text-sm font-bold mb-1">${data.name}</span>
        <img src="/destination.png" alt="Marker Image" class="w-[55px] h-[55px] object-cover">
      </div>
    `;

        // Thêm sự kiện click vào marker
        el.setAttribute('data-name', data.name);

// Thêm sự kiện click vào marker
        el.addEventListener('click', function() {
          console.log('click ',locationData);
        // Lấy giá trị từ thuộc tính data-name
            const name = el.getAttribute('data-name');
        // window.alert(name);
            const location = locationData.find(loc => loc.name === name);
    
            if (location) {
            setSelectedLocation(location);
            } else {
            setSelectedLocation((prevLocation) => ({
                ...prevLocation,
                name: 'Đây là vị trí của bạn',
            }));
            }
        });

        // Khởi tạo và thêm marker vào bản đồ
        new vtmapgl.Marker(el)
          .setLngLat([data.long, data.lat])
          .addTo(map);
      });

      console.log('toDo prepare hành trình ',des);
      map.on('load', () => {
        if (des.length >= 2) { // Đảm bảo mảng có ít nhất 2 phần tử (điểm đầu và điểm cuối)
          direction.setOrigin([des[0].long, des[0].lat]); // Điểm đầu
          direction.setDestination([des[des.length - 1].long, des[des.length - 1].lat]); // Điểm cuối
          des.slice(1, des.length - 1).forEach((point, index) => {
            direction.addWaypoint(index, [point.long, point.lat]);
          });
        } else {
          console.error('Mảng toDo không đủ phần tử để thiết lập hành trình.');
        }
      });
      const getLatLngData = () => {
        const firstOlElement = document.querySelector('ol.vtmap-directions-steps');

        if (firstOlElement) {
            const liElements = firstOlElement.querySelectorAll('li.vtmap-directions-step');
            // Tạo mảng chứa dữ liệu từ các thẻ <li>
            const latLngArray = Array.from(liElements).map(li => ({
              lat: li.getAttribute('data-lat'),
              lng: li.getAttribute('data-lng')
            }));

            // Cập nhật state với mảng latLngArray
            setlistLngLat(latLngArray);
        }
        };
    
        getLatLngData();

        console.log('veeeee ',listLngLat);

        const animatePoints = new vtmapgl.AnimationPoints({
          path: listLngLat,
          iconUrl: 'https://img.icons8.com/office/2x/circled-up.png',
          iconSize: 0.35,
          strokeColor: '#007cbf',
          strokeOpacity: 1,
          strokeWeight: 2,
          replay: true,
          velocity: 1200
      }).addTo(map);
  
      map.on('load', () => {
          animatePoints.start();
      })
      


      
      
  };


  useEffect(() => {
    const handleClick = (event) => {
      const clickedDiv = event.currentTarget;
  
      // Tìm thẻ <div> con bên trong thẻ <div> chính
      const childDiv = clickedDiv.querySelector('div');
  
      // Nếu có thẻ <div> con, tìm thẻ <span> trong thẻ <div> đó
      if (childDiv) {
        const firstSpan = childDiv.querySelector('span');
  
        if (firstSpan) {
          const spanText = firstSpan.textContent.trim(); // Sử dụng trim() để loại bỏ khoảng trắng thừa
  
          const location = locationData.find(loc => loc.name === spanText);
  
          if (location) {
            setSelectedLocation(location);
          } else {
            setSelectedLocation((prevLocation) => ({
              ...prevLocation,
              name: 'Đây là vị trí của bạn',
            }));
          }
        }
      }
    };
  
    const addClickListener = () => {
      const divElements = document.querySelectorAll('.vtmapgl-marker .vtmapgl-marker-anchor-center');
      divElements.forEach((element) => {
        if (!element.hasAttribute('data-listener-attached')) {
          element.addEventListener('click', handleClick);
          element.setAttribute('data-listener-attached', 'true');
        }
      });
    };
  
    // Khởi tạo MutationObserver để theo dõi sự thay đổi trong DOM
    const observer = new MutationObserver(() => {
      addClickListener();
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Cleanup function
    return () => {
      observer.disconnect();
      document.querySelectorAll('.vtmapgl-marker .vtmapgl-marker-anchor-center').forEach((element) => {
        element.removeEventListener('click', handleClick);
      });
    };
  }, []);
  

  useEffect(() => {
    // Chỉ thực hiện khi listLngLat rỗng
    if (listLngLat.length === 0) {
        const getLatLngData = () => {
            const firstOlElement = document.querySelector('ol.vtmap-directions-steps');

            if (firstOlElement) {
                const liElements = firstOlElement.querySelectorAll('li.vtmap-directions-step');
                // Tạo mảng chứa dữ liệu từ các thẻ <li>
                const latLngArray = Array.from(liElements).map(li => ({
                    lat: li.getAttribute('data-lat'),
                    lng: li.getAttribute('data-lng')
                }));

                // Cập nhật state với mảng latLngArray
                setlistLngLat(latLngArray);
            }
        };

        getLatLngData();

        const observer = new MutationObserver(() => {
            getLatLngData();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
        };
    }
}, [listLngLat]); // Thêm listLngLat vào dependency array

      


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

    const [typeMap,setTypeMap]=useState(1);

    const handleTypeMap=(e)=>{
      setTypeMap(e);
    }

  return (
    <div className="relative h-full w-full flex flex-col">
        {console.log('li ',listLngLat)}
      <div className="relative h-full w-full flex flex-col items-center">
        <div className="mb-4 w-full md:w-[30%] bg-gray-100 rounded-lg p-4 shadow-md">
          <div className="flex gap-4">
            <button 
              onClick={() => handleTypeMap(1)} 
              className={`flex-1 px-4 py-2 rounded transform transition-transform duration-300 ease-in-out ${typeMap === 1 ? 'bg-blue-600 font-bold text-black hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-105 active:scale-95' : 'bg-blue-400 text-gray-800 hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300'}`}
            >
              Mô phỏng
            </button>
            <button 
              onClick={() => handleTypeMap(2)} 
              className={`flex-1 px-4 py-2 rounded transform transition-transform duration-300 ease-in-out ${typeMap === 2 ? 'bg-green-600 font-bold text-black hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 active:scale-95' : 'bg-green-400 text-gray-800 hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300'}`}
            >
              Thực tế
            </button>
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

export default Mapadvanced;