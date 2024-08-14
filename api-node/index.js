const express = require('express');
const sequelize = require('./config/db');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3333;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});