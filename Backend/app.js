const path = require('path');
const fs=require('fs');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const sequelize = require ('./util/database');

const User=require('./models/user');
const Message=require('./models/message.js')
const GroupMembership=require('./models/groupmember')
const Group=require('./models/group.js')
const app = express();
const userRoutes=require('./routes/user')
const ArchivedChat=require('./models/ArchivedChat')
const groupRoutes=require('./routes/group');
const { log } = require('console');
app.use(cors({origin:"*",credentials:true    }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public'),{ maxAge: '1d' }));
app.use(express.json());
app.use(cors({origin:"*",credentials:true    }));
app.use(bodyParser.json());
app.use(express.static('public', { maxAge: 0 }));

app.use('/', userRoutes);
app.use('/groups',groupRoutes);

User.hasMany(Message,{foreignKey:"userId", onDelete: 'CASCADE'})
Message.belongsTo(User,{foreignKey:"userId"});


Group.hasMany(GroupMembership,{foreignKey:"groupId", onDelete: 'CASCADE'});
GroupMembership.belongsTo(Group,{foreignKey:"groupId"});

Group.hasMany(Message,{foreignKey:"groupId", onDelete: 'CASCADE'});
Message.belongsTo(Group,{foreignKey:"groupId"});

User.hasMany(GroupMembership,{foreignKey:"userId", onDelete: 'CASCADE'});
GroupMembership.belongsTo(User,{foreignKey:"userId"});

User.hasMany(ArchivedChat,{foreignKey:"userId",onDelete:"CASCADE"});
ArchivedChat.belongsTo(User,{foreignKey:"userId"});

Group.hasMany(ArchivedChat,{foreignKey:"groupId",onDelete:"CASCADE"});
ArchivedChat.belongsTo(Group,{foreignKey:"groupId"});

sequelize.sync().then(r=>{    
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

}).catch(e=>console.log(e)
)