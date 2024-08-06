import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import productData from '@/data/product';
import Thinklink from '../thinglink';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './style-map.css'

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 200px)' 
};

function get_toado(e){
  if (e=='tra-vinh') return { lat: 9.949760, lng: 106.334424 };
  if (e=='duyen-hai') return { lat: 9.613467, lng: 106.486928 }; 
  if (e=='chau-thanh') return { lat: 9.873405, lng: 106.348992 }; 
  if (e=='cau-ngang') return { lat: 9.771646, lng: 106.450268 }; 
  if (e=='cang-long') return { lat: 9.954877, lng: 106.221149 }; 
  if (e=='tieu-can') return { lat: 9.798397, lng: 106.179883 }; 
  if (e=='cau-ke') return { lat: 9.870940, lng: 106.076089 };
  if (e=='tra-cu') return { lat: 9.693124, lng: 106.289475 }; 
}

const VtMap = () => {
  const [locations, setLocations] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [locationNames, setLocationNames] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('tra-vinh');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations123, setLocations123] = useState([]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  // Hàm gọi API để lấy danh sách địa điểm
  const getListLocation = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/locations/list/tra-vinh`);
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  };

  // Hàm gọi API để lấy danh sách tọa độ
  const getListLocationUserForDirection = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/locations/direction/669cd9c2ffe2c00a4bdb1848`);
      return convertLocationsToPoints(response.data);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return [];
    }
  };

  // useEffect để gọi API khi component được render lần đầu tiên
  useEffect(() => {
    const fetchData = async () => {
      const coordinatesData = await getListLocationUserForDirection();
      const locationsData = await getListLocation();

      // Chuyển đổi tọa độ thành mảng các đối tượng với các thuộc tính latitude và longitude
      const coordinates = coordinatesData.map(coord => {
        const [longitude, latitude] = coord;
        return { latitude, longitude };
      });

      // Lọc các địa điểm không có trong danh sách tọa độ
      const filteredLocations = locationsData.filter(location => {
        return !coordinates.some(coord => 
          coord.latitude === location.latitude && coord.longitude === location.longitude
        );
      });
      
      setLocations(locationsData);
      setLocations123(filteredLocations);
      setCoordinates(coordinates);
    };

    fetchData();
  }, []);

  // useEffect để cập nhật tên địa danh khi locations hoặc coordinates thay đổi
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
      setLocationNames(findLocationNames(locations, coordinates));
    }
  }, [locations, coordinates]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://files-maps.viettel.vn/sdk/vtmap-gl-js/v1.13.1/vtmap-gl.js';
    script.onload = async () => { // Make onload handler async
      initializeMap();
    };
    document.head.appendChild(script);

    const initializeMap = async () => { // Make this function async
      vtmapgl.accessToken = '272ee553681f6e55bfa579bda02ebdd4';
      const map = new vtmapgl.Map({
        container: 'map',
        style: vtmapgl.STYLES.VTRANS,
        center: [106.31371494579435, 9.92895623029051],
        zoom: 13,
        preserveDrawingBuffer: true
      });

      const navigationControl = new vtmapgl.NavigationControl();
      map.addControl(navigationControl, 'top-left');

      const roadDrawerControl = new vtmapgl.RoadDrawerControl({
        accessToken: vtmapgl.accessToken,
        mode: 'driving'
      });
      map.addControl(roadDrawerControl);

      // Fetch points and set them after the map is loaded
      const points = await getListLocationUserForDirection(); // Await the points
      
      map.on('load', () => {
        roadDrawerControl.setPoints(points);
      });
    };

    const getPopupHtml = (address) => {
      return `
        <div>
          <span style="font-weight: bold">Địa chỉ: </span>
          <span>${address || 'N/A'}</span>
        </div>
      `;
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);
  

  return (
    <div className="relative h-full w-full flex flex-col items-center">
    <div className="flex flex-col md:flex-row justify-center items-center md:space-x-10 space-y-4 md:space-y-0 py-4 w-full max-w-4xl">
      <div className="list-card w-full md:w-1/2 p-4">
        <div className="card list-card-done bg-white shadow rounded p-4">
          <h1 className="text-lg font-bold text-center">Danh sách hành trình</h1>
          <div className="task-list">
            <ul className="list-disc pl-5">
              {locationNames.map((name, index) => (
                <li className="task py-1" key={index}>{index + 1}. {name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="list-card w-full md:w-1/2 p-4">
        <div className="card list-card-done bg-white shadow rounded p-4">
          <h1 className="text-lg font-bold text-center">Danh sách địa điểm</h1>
          <div className="task-list">
          <ul className="list-disc pl-5">
              {locations123.map((location, index) => (
                <li className="task py-1" key={location._id}>{index + 1}. {location.name}</li>
              ))}
          </ul>            
          </div>
        </div>
      </div>
    </div>
    <div id="map" className="w-full h-[810px]">Loading Map...</div>
  </div>
);
};

function convertLocationsToPoints(data) {
  const { locations } = data;
  return locations.map(location => location.split(',').map(Number));
}


export default VtMap;