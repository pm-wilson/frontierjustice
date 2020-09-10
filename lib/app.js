const express = require('express');
const app = express();
const County = require('./models/county');
const Town = require('./models/town');

app.use(express.json());

app.post('/api/v1/counties', async(req, res, next) => {
  try {
    const createdCounty = await County.insert(req.body);
    res.send(createdCounty);
  } catch(error) {
    next(error);  
  }
});

app.get('/api/v1/counties', async(req, res, next) => {
  try {
    const foundCounty = await County.find();
    res.json(foundCounty);
  } catch(error) {
    next(error); 
  }
});

app.get('/api/v1/counties/:id', async(req, res, next) => {
  try {
    const countyId = req.params.id;
    const foundCounty = await County.findById(countyId);
    res.json(foundCounty);
  } catch(error) {
    next(error);
  }
});

app.delete('/api/v1/counties/:id', async(req, res, next) => {
  try {
    const countyId = req.params.id;
    const deletedCounty = await County.delete(countyId);
    res.json(deletedCounty);
  } catch(error) {
    next(error);
  }
});

app.put('/api/v1/counties/:id', async(req, res, next) => {
  try {
    const countyId = req.params.id;
    const updatedCounty = await County.update(countyId, req.body);
    res.json(updatedCounty);
  } catch(error) {
    next(error);
  }
});

app.post('/api/v1/towns', async(req, res, next) => {
  try {
    const createdTown = await Town.insert(req.body);
    res.send(createdTown);
  } catch(error) {
    next(error);  
  }
});

app.get('/api/v1/towns', async(req, res, next) => {
  try {
    const foundTown = await Town.find();
    res.json(foundTown);
  } catch(error) {
    next(error); 
  }
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
