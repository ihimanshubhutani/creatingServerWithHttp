const fs = require('fs');

const read = filename => {
  const fileData = JSON.parse(fs.readFileSync(filename, 'utf8'));
  return fileData;
};

const routes = {
  '/': read('./model/index.json'),
  '/users': read('./model/users.json'),
  '/people': read('./model/people.json'),
};

module.exports = routes;
