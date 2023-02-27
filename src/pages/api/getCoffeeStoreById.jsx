import { findCoffeeStoreFilter } from 'lib/airtable';

const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const records = await findCoffeeStoreFilter(id);
      if (records.length !== 0) {
        res.status(200).json(records);
      }
    } else {
      res.status(400).json({ message: 'Id Is Missing' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving id' });
  }
};

export default getCoffeeStoreById;
