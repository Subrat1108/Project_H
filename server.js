const express = require('express');
const connectDB = require('./config/db');
const app = express();

//connect mongodb
connectDB();

//init middleware

app.use(express.json()); // for body parser

app.use('/api/v1/user', require('./routes/api/v1/users'));
app.use('/api/v1/post', require('./routes/api/v1/posts'));
app.use('/api/v1/profile', require('./routes/api/v1/profiles'));
app.use('/api/v1/auth', require('./routes/api/v1/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
