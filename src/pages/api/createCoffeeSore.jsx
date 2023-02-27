import { findCoffeeStoreFilter, getMinifyRecords, table } from 'lib/airtable';

const createCoffeeSore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, total_ratings, categories, name, address, neighbourhood, imgUrl } = await JSON.parse(req.body);
    try {
      if (id) {
        const records = await findCoffeeStoreFilter(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          //Create Record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  total_ratings,
                  name,
                  address,
                  neighbourhood,
                  imgUrl,
                  categories,
                },
              },
            ]);
            const records = getMinifyRecords(createRecords);
            res.json(records);
          } else {
            res.status(400).json({ message: 'Id Or Name Is Missing' });
          }
        }
      } else {
        res.status(400).json({ message: 'Id Is Missing' });
      }
    } catch (err) {
      console.log('Find Or Create  coffee store records failed');
      res.status(500).json({ message: 'Find Or Create coffee store records failed', err });
    }
  } else {
    res.json({ message: 'Method GET' });
  }
};

export default createCoffeeSore;
