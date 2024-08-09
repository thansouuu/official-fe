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
  const [userId, setUserId] = useState('');
  const [td_x, setTdX] = useState(null);
  const [td_y, setTdY] = useState(null);
  const [isadd, setIsAdd] = useState(true);
  

 
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
      console.log('a',done);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const findLocationNames = (locations, coordinates) => {
      return coordinates.map(coord => {
        const location = locations.find(loc => {
          return loc.latitude === coord.latitude && loc.longitude === coord.longitude;
        });
        return location ? location.name : 'Không tìm thấy';
      });
    };

    if (locations.length > 0 && coordinates.length > 0) {
      const names = findLocationNames(locations, coordinates);
      setLocationNames(names);
      setToDo(names.map((name, index) => ({ name, id: index, latitude: coordinates[index].latitude, longitude: coordinates[index].longitude })));
    }
  }, [locations, coordinates]);

  const [mapLoaded, setMapLoaded] = useState(false);

 

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
      trackUserLocation: true
    });
      map.addControl(geolocateControl);
      // if (td_x!==null && td_y!==null)
      //   map.removeControl(geolocateControl);
      map.on("load", function () {
        geolocateControl.trigger(); // add this if you want to fire it by code instead of the button
      });
      geolocateControl.on("geolocate", locateUser);
  
      function locateUser(e) {
        console.log("A geolocate event has occurred.");
        console.log("lng:" + e.coords.longitude + ", lat:" + e.coords.latitude);
          const longitude = e.coords.longitude;
          const latitude = e.coords.latitude;
          setTdX(longitude);
          setTdY(latitude);
      }
      
      const scale = new vtmapgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
        });
      map.addControl(scale);



      map.on('load', () => {
        map.addSource('places', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'properties': {
                  'description':
                    '<p>Đây là thành phố Đà Nẵng</p>',
                  'icon': 'rocket'
                },
                'geometry': {
                  'type': 'Point',
                  'coordinates': [108.202164, 16.054407]
                }
              },
              {
                'type': 'Feature',
                'properties': {
                  'description':
                    '<div><p>Đây là thủ đô Hà Nội</p> <p><a href="https://vi.wikipedia.org/wiki/%C4%90%C3%A0_N%E1%BA%B5ng" target="_blank">Learn more</a></p></div>',
                    // '<p><a href="https://vi.wikipedia.org/wiki/%C4%90%C3%A0_N%E1%BA%B5ng" target="_blank">Learn more</a></p>',
                  'icon': 'rocket'
                },
                'geometry': {
                  'type': 'Point',
                  'coordinates': [105.853882, 21.028280]
                }
              }]
          }
        });
        // Thêm layer hiển thị địa điểm
        map.addLayer({
          'id': 'places',
          'type': 'symbol',
          'source': 'places',
          'layout': {
            'icon-image': '{icon}-15',
            'icon-allow-overlap': true,
            'icon-size': 1
          }
        });
  
        // Bắt sự kiện click để hiển thị popup ngay tại vị trí địa điểm cùng với thông
        // tin từ thuộc tính description
        map.on('click', 'places', (e) => {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.description;
  
          new vtmapgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        });
  
        // Thay đổi con trỏ chuột thành pointer khi di chuyển qua địa điểm
        map.on('mouseenter', 'places', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
  
        map.on('mouseleave', 'places', () => {
          map.getCanvas().style.cursor = '';
        });
      });
   

    
    const navigationControl = new vtmapgl.NavigationControl();
    map.addControl(navigationControl, 'top-left');

    const roadDrawerControl  = new vtmapgl.RoadDrawerControl({
      accessToken: vtmapgl.accessToken,
      mode: 'driving',
      activeState: false,
      addable: false,
    });

    map.addControl(roadDrawerControl);
    setRoadDrawerControl(roadDrawerControl);
    roadDrawerControl.deactive();


    const points = await getListLocationUserForDirection();
    console.log('Points:', points);

    map.on('load', () => {
      console.log('Map loaded');
      setMapLoaded(true);
      if (points && points.length > 0) {
        try {
          console.log('Setting points:', points);
          roadDrawerControl.setPoints(points);
          console.log('Points set on map');
        } catch (error) {
          console.error('Error setting points:', error);
        }
      }
    });

    if (td_x!==null && td_y!==null)
      map.on("load", function () {
      geolocateControl.trigger(); // add this if you want to fire it by code instead of the button
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
    const userId  = localStorage.getItem('userId');
    const points = toDo.map(task => [task.longitude, task.latitude]);
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
      console.log('pretoDo',toDo);
      console.log('Updating points:', points);
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


  const handleClick = () => {
    setIsAdd(prevState => !prevState);
    const lastItem = toDo.slice(-1)[0];
    if (lastItem && isadd) {
      const updatedLastItem = { ...lastItem, name: 'current', longitude: td_x, latitude: td_y };
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
  
  return (
    <div className="relative h-full w-full flex flex-col items-center">
    <div>
    <button onClick={handleClick} className="btn-primary">
        {isadd ? 'Thêm vị trí' : 'Xóa vị trí'}
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
                  {index + 1}. {task.name}
                </li>
              ))}
            </ul>
          </div>
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            onClick={handleSave}
          >
            Lưu điểm hành trình
          </button>
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
                  {index + 1}. {location.name}
                </li>
              ))}
            </ul>            
          </div>
        </div>
      </div>
    </div>
    <div id="map" className="w-[80%] h-[810px]"></div>
  </div>
  );
};

function convertLocationsToPoints(data) {
  const { locations } = data;
  return locations.map(location => location.split(',').map(Number));
}

export default VtMap;