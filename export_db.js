const fs = require('fs');
const db = require('./backend/db');

const rows = db.prepare(`
  SELECT *
  FROM moderation_logs
  ORDER BY id
`).all();

if (!rows.length) {
  console.log('No rows found.');
  process.exit(0);
}

const headers = Object.keys(rows[0]);

function escapeCsv(value) {
  if (value === null || value === undefined) return '';

  const text = String(value).replace(/"/g, '""');

  return `"${text}"`;
}

const csv = [
  headers.join(','),
  ...rows.map(row =>
    headers.map(header => escapeCsv(row[header])).join(',')
  )
].join('\n');

fs.writeFileSync(
  'moderation_logs_export.csv',
  csv,
  'utf8'
);

console.log(
  `Exported ${rows.length} rows to moderation_logs_export.csv`
);

db.close();