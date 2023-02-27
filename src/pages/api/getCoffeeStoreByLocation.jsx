import { fetchCoffeeStore } from 'lib/coffee-store';
const getCoffeeStoreByLocation = async (req, res) => {
  try {
    const { lat, long, query, limit } = req.query;
    const response = await fetchCoffeeStore(lat, long, query, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default getCoffeeStoreByLocation;
