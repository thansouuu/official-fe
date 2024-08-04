import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import productData from '@/data/product';
import Thinklink from '../thinglink';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


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
      const locationsData = await getListLocation();
      const coordinatesData = await getListLocationUserForDirection();
      setLocations(locationsData);
      setCoordinates(coordinatesData);
    };

    fetchData();
  }, []);

  // useEffect để cập nhật tên địa danh khi locations hoặc coordinates thay đổi
  useEffect(() => {
    const findLocationNames = (locations, coordinates) => {
      return coordinates.map(coord => {
        const location = locations.find(loc => {
          return loc.latitude === coord[1] && loc.longitude === coord[0];
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
    <div className="relative h-full w-full flex flex-col">
      <div className="flex justify-center items-center space-x-2 py-4">
      <div className="App">
        <h1>Danh sách hành trình</h1>
        <ul>
          {locationNames.map((name, index) => (
            <li key={index}>{index}.{name}</li>
          ))}
        </ul>
      </div>
      </div>
      <div id="map" style={{ width: '100%', height: '810px' }}>Loading Map...</div>

    </div>
  );
};

function convertLocationsToPoints(data) {
  const { locations } = data;
  return locations.map(location => location.split(',').map(Number));
}

const findLocationNames = (locations, coordinates) => {
  return coordinates.map(coord => {
    const location = locations.find(loc => {
      return loc.latitude === coord[1] && loc.longitude === coord[0];
    });
    return location ? location.name : 'Không tìm thấy';
  });
};

export default VtMap;