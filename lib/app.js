const express = require('express');
const app = express();
const County = require('./models/county');

app.use(express.json());

app.post('/api/v1/counties', async(req, res, next) => {
  try {
    const createdCounty = await County.insert(req.body);
    res.send(createdCounty);
  } catch(error) {
    next(error);  
  }
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
