const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:27017/toDos',
    { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.warn("failed to connect to MongoDB")
            console.error(err);
            process.exit(1);
        }
        console.info(`connected to DB successfully`);
    });