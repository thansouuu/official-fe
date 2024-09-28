import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import productData from '@/data/product';
import './style-map.css'
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/use-auth';
import $ from 'jquery';
import { Helmet } from 'react-helmet';
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [marker,setMarker]=useState([]);
  const [typeMap,setTypeMap]=useState(1);
  const [map, setMap] = useState(null);
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
    }
  }, [locations, coordinates]);


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

//   useEffect(() => {
//     // Chỉ thực hiện khi listLngLat rỗng
//     // if (listLngLat.length === 0) {
//         const getLatLngData = () => {
//             const firstOlElement = document.querySelector('ol.vtmap-directions-steps');

//             if (firstOlElement) {
//                 const liElements = firstOlElement.querySelectorAll('li.vtmap-directions-step');
//                 // Tạo mảng chứa dữ liệu từ các thẻ <li>
//                 const latLngArray = Array.from(liElements).map(li => ({
//                     lat: li.getAttribute('data-lat'),
//                     lng: li.getAttribute('data-lng')
//                 }));

//                 // Cập nhật state với mảng latLngArray
//                 setlistLngLat(latLngArray);
//             }
//         };

//         getLatLngData();

//         const observer = new MutationObserver(() => {
//             getLatLngData();
//         });

//         observer.observe(document.body, { childList: true, subtree: true });

//         return () => {
//             observer.disconnect();
//         };
//     // }
// }, [listLngLat]); 

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

useEffect(() => {
  // Chỉ thực hiện khi listLngLat rỗng
  if (listLngLat.length === 0) {
      

      getLatLngData();

      const observer = new MutationObserver(() => {
          getLatLngData();
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
          observer.disconnect();
      };
  }
}, []); // useEffect sẽ chỉ chạy 1 lần khi component mounted

 

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = "https://files-maps.viettel.vn/sdk/vtmap-gl-directions/v4.1.0/vtmap-gl-directions.js";
    script1.async = false;
    document.head.appendChild(script1);

    // Thêm thẻ <link> cho CSS
    const link1 = document.createElement('link');
    link1.href = "https://files-maps.viettel.vn/sdk/vtmap-gl-js/v1.13.1/vtmap-gl.css";
    link1.rel = "stylesheet";
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.href = "https://files-maps.viettel.vn/sdk/vtmap-gl-directions/v4.1.0/vtmap-gl-directions.css";
    link2.rel = "stylesheet";
    link2.type = "text/css";
    document.head.appendChild(link2);

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

  const removeMarkers = () => {
    marker.forEach(marker => marker.remove());
    setMarker([]); // Xóa mảng `testing` sau khi đã remove tất cả các marker
  };

  const addMarker = () => {
    if (!map) {
      console.error('Map is not initialized');
      return;
    }
    removeMarkers();
    const points = toDo.map(task => [task.longitude, task.latitude]);

    const newMarkers = points.map((lngLat, index) => {
      const el = document.createElement('div');
      // el.innerHTML = `<div class="custom-marker"><img src="/destination.png"><span>Marker ${index + 1}</span></div>`;
      el.innerHTML = `<div class="custom-marker" style="position: relative; width: 55px; height: 55px;">
        <span style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 1; padding: 2px 5px; border-radius: 3px;">Marker ${index}</span>
        <img src="/destination.png" style="width: 55px; height: 55px; border-radius: 50%;">
      </div>`;
      el.addEventListener('click', () => {
        const spanContent = el.querySelector('span').innerText;
        const markerIndex = parseInt(spanContent.split(' ')[1], 10);
        const matchedLocation = locationData.find(location => location.name === toDo[markerIndex].name);
        if (matchedLocation) setSelectedLocation(matchedLocation);
          if (matchedLocation === undefined) {
            setSelectedLocation((prevLocation) => ({
              ...prevLocation,
              name: 'Đây là vị trí của bạn',
            }));
          }

      });

      return new vtmapgl.Marker(el)
        .setLngLat(lngLat)
        .addTo(map); 
    });
    setMarker(newMarkers);
  };
  const [direction,setTest]=useState(null);
  const initializeMap = async () => {
    console.log('Initializing map');
    vtmapgl.accessToken = '272ee553681f6e55bfa579bda02ebdd4';
    var mapInstance = new vtmapgl.Map({
      container: 'map',
      style: vtmapgl.STYLES.VTRANS,
      center: [106.31371494579435, 9.92895623029051],
      zoom: 13,
      preserveDrawingBuffer: true
    });

    setMap(mapInstance); // Lưu map vào state
    

    const mapStyleControl = new vtmapgl.MapStyleControl();
    mapInstance.addControl(mapStyleControl);

    // const direction = new Directions({
    //   accessToken: vtmapgl.accessToken,
    //   interactive: false,
    //   alternatives: false,
    //   controls: {
    //     profileSwitcher: false
    //   },
    //   profile: 'driving'
    // });
    // mapInstance.addControl(direction, 'top-left');

    const geolocateControl = new vtmapgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserLocation: true,
      showAccuracyCircle: false
    });

    mapInstance.addControl(geolocateControl);

    geolocateControl.on("geolocate", locateUser);

    function locateUser(e) {
        const longitude = e.coords.longitude;
        const latitude = e.coords.latitude;
        setTdX(longitude);
        setTdY(latitude);
        // Di chuyển bản đồ đến vị trí người dùng
        mapInstance.flyTo({
            center: [longitude, latitude],
            zoom: 15
        });
    }

    const scale = new vtmapgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    });
    mapInstance.addControl(scale);

    // var direction = new Directions({
    //   accessToken: vtmapgl.accessToken,
    //   profile: 'cycling',
    //   interactive: true,
    //   alternatives: true,
    //   routingPanel: document.getElementById('routing-panel')
    // });
    // setTest(direction);
    // direction.onAdd(mapInstance);

    const direction = new Directions({
      accessToken: vtmapgl.accessToken,
      controls: {
        profileSwitcher: false
      },
      profile: 'driving'
    });
    mapInstance.addControl(direction, 'top-left');

    const coordinatesData = await getListLocationUserForDirection();
    const locationsData = await getListLocation();
    setLocationData(locationsData);
    const des = coordinatesData.map(([long, lat]) => {
        const location = locationsData.find(loc => loc.longitude === long && loc.latitude === lat);
        return location ? { name: location.name, long, lat } : { name: 'Vị trí của bạn', long, lat };
      });
    setDestination(des);
    console.log('des ',des);

    mapInstance.on('style.load', () => {
      const waiting = () => {
      if (!mapInstance.isStyleLoaded()) {
        setTimeout(waiting, 200);
      } else {
        console.log('yess');
        if (des.length >= 2) { // Đảm bảo mảng có ít nhất 2 phần tử (điểm đầu và điểm cuối)
          direction.setOrigin([des[0].long, des[0].lat]); // Điểm đầu
          direction.setDestination([des[des.length - 1].long, des[des.length - 1].lat]); // Điểm cuối
          des.slice(1, des.length - 1).forEach((point, index) => {
            direction.addWaypoint(index, [point.long, point.lat]);
          });
          getLatLngData();
          console.log('lol ',listLngLat);
        } else {
          console.error('Mảng toDo không đủ phần tử để thiết lập hành trình.');
        }
        // direction.setOrigin([106.68309, 10.784739]);
        // direction.setDestination([106.68866802228689, 10.785274343222795]);
      }
      };
      waiting();
    });
    
    
    
    // mapInstance.on('load', () => {
    //   if (des.length >= 2) { // Đảm bảo mảng có ít nhất 2 phần tử (điểm đầu và điểm cuối)
    //     direction.setOrigin([des[0].long, des[0].lat]); // Điểm đầu
    //     direction.setDestination([des[des.length - 1].long, des[des.length - 1].lat]); // Điểm cuối
    //     des.slice(1, des.length - 1).forEach((point, index) => {
    //       direction.addWaypoint(index, [point.long, point.lat]);
    //     });
    //   } else {
    //     console.error('Mảng toDo không đủ phần tử để thiết lập hành trình.');
    //   }
    // });


  };
 
  useEffect(() => {
    addMarker();
  }, [toDo]);
  

  // useEffect(() => {
  //   const animatePoints = new vtmapgl.AnimationPoints({
  //     path: listLngLat,
  //     iconUrl: 'https://img.icons8.com/office/2x/circled-up.png',
  //     iconSize: 0.35,
  //     strokeColor: '#007cbf',
  //     strokeOpacity: 1,
  //     strokeWeight: 2,
  //     replay: true,
  //     velocity: 1200
  //   }).addTo(map);
  //   map.on('load', () => {
  //     animatePoints.start();
  //   });
  // }, [listLngLat]);

    useEffect(() => {
      const handleClick = (event) => {
        const clickedDiv = event.currentTarget;
        const firstSpan = clickedDiv.querySelector('span');
        if (firstSpan) {
          const a=toDo[firstSpan.textContent];
          const location = locationData.find(loc => loc.name === a.name);
          if (location) setSelectedLocation(location);
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

  const handleTypeMap=(e)=>{
    setTypeMap(e);
  }

  useEffect(() => {
    initializeMap();
  }, []);

    

  return (
    <div className="relative h-full w-full flex flex-col">
      {console.log('list ',listLngLat)}
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

export default VtMap;