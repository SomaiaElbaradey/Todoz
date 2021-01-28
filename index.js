const express = require('express')
const app = express()

require('./config/dbConnection');
const todoRouter = require('./routers/todo');
const postRouter = require('./routers/post');
const userRouter = require('./routers/user');

app.use(express.static('public'));
app.use(express.json());
//middleware that logs the request url, method, and current time 
let logs = (req, res, next) => {
    console.log('the request url:', req.url);
    console.log('the request method:', req.method);
    console.log('the current time:', new Date());
    next();
};
app.use(logs);

app.use('/api/todo', todoRouter);
app.use('/api/post', postRouter);
app.use('/api/user', userRouter);

app.listen(process.env.PORT || 2919, () => {
    console.info(`server listening on port 2919`);
});