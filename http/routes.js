const fs = require('fs');

const open = (filename) => {
  const fileData = JSON.parse(fs.readFileSync(filename, 'utf8'));

  return fileData;
};

let id;

const directory = {
  '/': open('./api/index.json', id),
  '/users': open('./api/users.json', id),
  '/people': open('./api/people.json', id),
};

module.exports = directory;
