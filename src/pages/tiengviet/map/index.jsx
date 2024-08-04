import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import productData from '@/data/product';
import Thinklink from '../thinglink';


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




const Map = () => {
  const [selectedCountry, setSelectedCountry] = useState('tra-vinh');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [customIcon, setCustomIcon] = useState(null);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleSearch = async () => {
    try {
      // const response = await axios.get(`http://localhost:3001/api/locations/${selectedCountry}`);
      const response = await axios.get(`https://historic-be.onrender.com/api/locations/${selectedCountry}`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const onLoad = () => {
    setCustomIcon({
      url: '/images/location.png',
      scaledSize: new window.google.maps.Size(25, 41),
      anchor: new window.google.maps.Point(12, 41),
    });
  };

  const handleFindPath = () => {
    if (selectedLocation) {
      const destination = `${selectedLocation.latitude},${selectedLocation.longitude}`;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    }
  };

  const navigate = useNavigate()

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

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="flex justify-center items-center space-x-2 py-4">
        <select
          className="bg-blue-500 text-white px-4 py-2 rounded"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="" disabled>Chọn nơi cần tìm</option>
          <option value="tra-vinh">Thành phố Trà Vinh</option>
          <option value="duyen-hai">Huyện, Thị xã Duyên Hải</option>
          <option value="chau-thanh">Huyện Châu Thành</option>
          <option value="cau-ngang">Huyện Cầu Ngang</option>
          <option value="cang-long">Huyện Càng Long</option>
          <option value="tieu-can">Huyện Tiểu Cần</option>
          <option value="cau-ke">Huyện Cầu Kè</option>
          <option value="tra-cu">Huyện Trà Cú</option>
          {/* <option value="vietnam">Vietnam</option>
          <option value="thailand">Thailand</option>
          <option value="cambodia">Cambodia</option> */}

        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          Tìm gần đây 
        </button>
      </div>
      <div className="flex-1 relative">
        <LoadScript googleMapsApiKey="" onLoad={onLoad}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            // center={{ lat: 10.030, lng: 105.770 }}
            center={get_toado(selectedCountry)}
            zoom={15}
          >
            {locations.map((location) => (
              <Marker
                key={location._id}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={customIcon}
                onClick={() => handleMarkerClick(location)}
              />
            ))}
            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  {/* <h2>here</h2> */}
                  {/* <h5>{selectedLocation.name}</h5> */}
                  {/* <p>{selectedLocation.presentationUrl}</p>  */}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
        <div
          className={`absolute bottom-0 left-0 w-full bg-black text-white p-4 border-t border-gray-200 transition-opacity duration-500 ease-in-out ${
            selectedLocation ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {selectedLocation && (
            <>
              <h2 className="text-xl font-bold">{selectedLocation.name}</h2>
              {/* <p>{selectedLocation.country}</p> */}
              <p>{selectedLocation.decription}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  className="bg-white text-black px-4 py-2 rounded"
                  onClick={handleFindPath}
                >
                  Tìm đường
                </button>
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
        </div>
      </div>
    </div>
  );
};

export default Map;
