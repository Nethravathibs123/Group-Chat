const path = require('path');
const fs=require('fs');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const sequelize = require ('./util/database');

const User=require('./models/user');
const app = express();
const userRoutes=require('./routes/user')

app.use(express.static(path.join(__dirname, 'public'),{ maxAge: '1d' }));
app.use(express.json());
app.use(cors({origin:"*",credentials:true    }));
app.use(bodyParser.json());
app.use(express.static('public', { maxAge: 0 }));

app.use('/', userRoutes);
sequelize.sync().then(r=>{    
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

}).catch(e=>console.log(e)
)