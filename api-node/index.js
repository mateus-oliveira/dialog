require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/db');
const conrsConfig = require('./config/cors');
const routes = require('./routes');

const app = express();
app.use(morgan('tiny'));

app.use(express.json());
app.use(cors(conrsConfig));
app.use('/api', routes);

const PORT = process.env.PORT || 3333;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});