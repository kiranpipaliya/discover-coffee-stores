const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIR_TABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIR_TABLE_BASE_KEY);
const table = base('coffee-stores');

const getMinifyRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};
const getMinifyRecords = (records) => {
  return records.map((record) => getMinifyRecord(record));
};

const findCoffeeStoreFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifyRecords(findCoffeeStoreRecords);
};

export { table, getMinifyRecords, getMinifyRecord, findCoffeeStoreFilter };
