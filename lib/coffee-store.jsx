const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.API_KEY,
  },
};

const getUrlCoffeeStore = (lat, long, query, limit) => {
  // return `https://api.foursquare.com/v3/places/search?ll=${lat}%2C${long}&query=${query}&client_id=${proccess.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET_KEY}&limit=${limit}`;
  return `https://api.foursquare.com/v3/places/search?ll=${lat},${long}&query=${query}&limit=${limit}`;
};

export const fetchCoffeeStore = async (lat = '21.164596036666325', long = '73.55794974640862', query = 'coffee', limit = '9') => {
  try {
    const fetchDataRespons = await fetch(getUrlCoffeeStore(lat, long, query, limit), options);
    console.log(
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      fetchDataRespons,
    );
    if (!fetchDataRespons.ok) throw 'Something went wrong';
    const data = await fetchDataRespons.json();
    console.log('fetchDataResponsffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', data);
    return data.results;
  } catch (err) {
    console.error('error', err);
  }
};

const getUrlCoffeeStoreDetail = (id, dataNeed) => {
  return `https://api.foursquare.com/v3/places/${id}${dataNeed}`;
};

export const fetchCoffeeStoreDetail = async (id, dataNeed) => {
  const fetchDataRespons = await fetch(getUrlCoffeeStoreDetail(id, dataNeed), options);
  const data = await fetchDataRespons.json();

  return data;
};
