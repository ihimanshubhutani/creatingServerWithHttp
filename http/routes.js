const fs = require('fs');

const read = filename => {
  const fileData = JSON.parse(fs.readFileSync(filename, 'utf8'));
  return fileData;
};

const routes = {
  '/': read('./api/index.json'),
  '/users': read('./api/users.json'),
  '/people': read('./api/people.json'),
};

module.exports = routes;
