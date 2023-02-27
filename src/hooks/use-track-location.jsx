import { ACTION_TYPE, StoreContext } from '@/context/storeContext';
import React, { useState, useContext } from 'react';

const useTrackLocation = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    dispatch({ type: ACTION_TYPE.SET_LAT_LONG, payload: { lat: latitude, long: longitude } });
    setLat(latitude);
    setLong(longitude);

    setIsFindingLocation(false);
    setErrorMessage('');
  };

  const error = () => {
    setErrorMessage('Unable to retrieve your location');
  };
  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser');
      setIsFindingLocation(false);
    } else {
      // status.textContent = 'Locating…';

      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return { errorMessage, lat, long, handleTrackLocation, isFindingLocation };
};

export default useTrackLocation;
