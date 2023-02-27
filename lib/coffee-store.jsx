const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.NEXT_PUBLIC_API_KEY,
  },
};

const getUrlCoffeeStore = (lat, long, query, limit) => {
  // 'https://api.foursquare.com/v3/places/search?query=coffee&ll=21.2249430456314%2C72.82701352630217&fields=fsq_id%2Ccategories%2Cstats%2Cname%2Clocation%2Cdistance%2Cgeocodes%2Clocation%2Cname&limit=1
  const fields = 'fsq_id%2Ccategories%2Cstats%2Cname%2Clocation%2Cdistance%2Cgeocodes%2Clocation%2Cname';
  return `https://api.foursquare.com/v3/places/search?ll=${lat},${long}&query=${query}&fields=${fields}&limit=${limit}`;
};

export const fetchCoffeeStore = async (lat = '21.2249430456314', long = '72.82701352630217', query = 'coffee', limit = 9) => {
  try {
    const fetchDataRespons = await fetch(getUrlCoffeeStore(lat, long, query, limit), options);
    if (!fetchDataRespons.ok) throw 'Something went wrong';
    const data = await fetchDataRespons.json();
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
