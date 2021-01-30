require('express-async-errors') 
const express = require('express')
const app = express()
const config = require('config');
const error = require('./middlewares/error');

require('./dbConnection');
const todoRouter = require('./routers/todo');
const postRouter = require('./routers/post');
const userRouter = require('./routers/user');

if(!config.get('jwtKey')){
    console.log("FATAL ERROR: jwtKey is not defined.")
    process.exit(1);
} 

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

app.use(error);

app.listen(process.env.PORT || 2919, () => {
    console.info(`server listening on port 2919`);
});

