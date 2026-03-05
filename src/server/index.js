require('dotenv').config();
const express = require('express');
const cors = require('cors');
const postRouter = require('./src/post/post-router');
const authRouter = require('./src/auth/auth-router');
const userRouter = require('./src/user/user-router');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'User-Agent', 'Access-Control-Allow-Credentials'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use('/api', postRouter);
app.use('/api', userRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
