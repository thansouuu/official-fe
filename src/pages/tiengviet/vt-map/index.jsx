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


const VtMap = () => {
  const [locations, setLocations] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [locationNames, setLocationNames] = useState([]);
  const [toDo, setToDo] = useState([]);
  const [done, setDone] = useState([]);

  // Fetching the list of locations
  const getListLocation = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/locations/list/tra-vinh`);
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  };

  // Fetching the list of coordinates for the user direction
  const getListLocationUserForDirection = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/locations/direction/669cd9c2ffe2c00a4bdb1848`);
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
      setToDo(names.map((name, index) => ({ name, id: index })));
    }
  }, [locations, coordinates]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://files-maps.viettel.vn/sdk/vtmap-gl-js/v1.13.1/vtmap-gl.js';
    script.onload = async () => {
      initializeMap();
    };
    document.head.appendChild(script);

    const initializeMap = async () => {
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
        mode: 'driving',
        activeState: false,
        addable: false,
      });
      map.addControl(roadDrawerControl);

      const points = await getListLocationUserForDirection();
      
      map.on('load', () => {
        roadDrawerControl.setPoints(points);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (task, source) => {
    return (event) => event.dataTransfer.setData('task', JSON.stringify({ task, source }));
  };

  const handleDrop = (event, destination) => {
    const data = JSON.parse(event.dataTransfer.getData('task'));
    if (data.source !== destination) {
      if (destination === 'toDo') {
        setDone((prev) => prev.filter((task) => task.name !== data.task.name));
        setToDo((prev) => [...prev, data.task]);
      } else {
        setToDo((prev) => prev.filter((task) => task.name !== data.task.name));
        setDone((prev) => [...prev, data.task]);
      }
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center">
      <div className="flex flex-col md:flex-row justify-center items-stretch md:space-x-0 space-y-4 md:space-y-0 py-4 w-full max-w-4xl">
        <div className="list-card w-full md:w-1/2 p-4">
          <div
            className="card list-card-done bg-white shadow rounded p-4 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, 'toDo')}
          >
            <h1 className="text-lg font-bold text-center">Danh sách hành trình</h1>
            <div className="task-list flex-grow">
              <ul className="list-disc pl-5">
                {toDo.map((task, index) => (
                  <li className="task py-1" key={index} draggable onDragStart={handleDragStart(task, 'toDo')}>
                    {index + 1}. {task.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="list-card w-full md:w-1/2 p-4">
          <div
            className="card list-card-done bg-white shadow rounded p-4 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, 'done')}
          >
            <h1 className="text-lg font-bold text-center">Danh sách địa điểm</h1>
            <div className="task-list flex-grow">
              <ul className="list-disc pl-5">
                {done.map((location, index) => (
                  <li className="task py-1" key={location._id} draggable onDragStart={handleDragStart(location, 'done')}>
                    {index + 1}. {location.name}
                  </li>
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