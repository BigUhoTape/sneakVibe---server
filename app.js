const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const keys = require('./config/keys');

const app = express();

app.set('PORT', process.env.PORT || 8081);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));

//use for routes
app.use('/api/product', require('./routes/productRoute'));
app.use('/api/user', require('./routes/userRoute'));


async function start() {
    try {
        await mongoose.connect(keys.mongoDB.connectURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true
        });

        app.listen(app.get('PORT'), () => {
            console.log('Server has been started on port ', app.get('PORT'));
        });
    } catch (e) {
        console.log(e);
    }
}

start();