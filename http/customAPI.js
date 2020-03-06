const http = require('http');
const _ = require('lodash');
const fs = require('fs');
const url = require('url');
const directory = require('./routes');

const getData = (data, id, response) => {
  if (id) {
    displayRecord(data, id, response);
    return;
  }

  response.write(JSON.stringify(data));
  response.end();
};

const writeCreated = (response) => {
  response.writeHead(201, 'CREATED', { 'Content-type': 'application/json ' });
  response.write('{ "detail": "DATA CREATED" }');
  response.end();
};

const writeBadRequest = (response) => {
  response.writeHead(400, 'BAD REQUEST', { 'Content-type': 'application/json ' });
  response.write('{ "detail": "Bad Request" }');
  response.end();
};


const writeNotFound = (response) => {
  response.writeHead(404, 'NOT FOUND', { 'Content-type': 'application/json ' });
  response.write('{ "detail": "Not found" }');
  response.end();
};


const breakUrl = (requestUrl) => {
  const path = url.parse(requestUrl).pathname.split('/')[1];
  const id = url.parse(requestUrl).pathname.split('/')[2];
  return { path, id };
};

const writeToFile = (filename, data) => {
  fs.writeFileSync(
    filename, JSON.stringify(data), error => {
      if (error) throw error;
    },
  );
};

const createData = (fetchedData, data, path, response) => {
  const { username, userid } = JSON.parse(fetchedData);

  if (!(username || userid)) {
    writeNotFound(response);
    return;
  }
  data.totalCount += 1;
  data.members.push({ username, userid });
  writeToFile(`./api/${path}.json`, data);
  writeCreated(response);
};

const displayRecord = (data, id, response) => {
  const record = JSON.stringify(data.members[id - 1]);

  if (!record) {
    writeNotFound(response);
    return;
  }

  response.write(record);
  response.end();
};

const updateData = (id, data, fetchedData, path, response) => {
  const { username, userid } = JSON.parse(fetchedData);

  if (!(username || userid)) {
    writeBadRequest(response);
    return;
  }

  if (!id) {
    data.totalCount += 1;
    data.members.push({ username, userid });
    writeToFile(`./api/${path}.json`, data);
    writeCreated(response);
    return;
  }

  data.members[id - 1] = { username, userid };
  writeToFile(`./api/${path}.json`, data);
  response.write('{ "detail": "DATA UPDATED" }');
  response.end();
};

const deleteData = (id, data, path, response) => {
  if (!data.members[id - 1]) {
    writeBadRequest(response);
    return;
  }
  console.log(id);
  console.log(_.pullAt(data.members, id - 1));
  console.log(data.members);
  writeToFile(`./api/${path}.json`, data);
  response.write('{ "detail": "DELETED" }');
  response.end();
};


const server = http.createServer((request, response) => {
  response.writeHead(200, 'OK', { 'Content-type': 'application/json ' });
  const { path, id } = breakUrl(request.url);

  const data = directory[`/${path}`];

  if (!data) {
    writeBadRequest(response);
    return;
  }

  if (request.method === 'GET') {
    getData(data, _.parseInt(id), response);
  }

  if (request.method === 'POST') {
    let fetchedData = '';
    request.on('data', chunk => {
      fetchedData += chunk;
    });

    request.on('end', () => createData(fetchedData, data, path, response));
  }

  if (request.method === 'PUT') {
    let fetchedData = '';
    request.on('data', chunk => {
      fetchedData += chunk;
    });

    request.on('end', () => updateData(id, data, fetchedData, path, response));
  }

  if (request.method === 'DELETE') {
    deleteData(id, data, path, response);
  }
});

server.listen(3000);
