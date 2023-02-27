import { findCoffeeStoreFilter, getMinifyRecords, table } from 'lib/airtable';

const favoriteCoffeeStoreById = async (req, res) => {
  try {
    const { id } = await JSON.parse(req.body);
    if (req.method === 'PUT') {
      if (id) {
        const records = await findCoffeeStoreFilter(id);
        if (records.length !== 0) {
          const record = records[0];
          const upVoting = record.total_ratings + 1;
          const updatedRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                total_ratings: upVoting,
              },
            },
          ]);
          if (updatedRecord) {
            const minifyRecords = getMinifyRecords(updatedRecord);
            res.status(200).json(minifyRecords);
          }
        } else {
          res.status(404).json({ message: 'Id not exist in coffee store' });
        }
      } else {
        res.status(400).json({ message: 'Id is Missing' });
      }
    } else {
      res.status(400).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Updating coffee store records failed', err });
  }
};

export default favoriteCoffeeStoreById;
