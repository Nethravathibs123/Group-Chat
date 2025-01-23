const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const sequelize = require('./util/database');
const User = require('./models/user');
const Message = require('./models/message');
const GroupMembership = require('./models/groupmember');
const Group = require('./models/group');
const ArchivedChat = require('./models/ArchivedChat');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');

const app = express(); // Define the app first

// Set up middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json()); // Only one instance needed
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Routes
app.use('/', userRoutes);
app.use('/groups', groupRoutes);

// Set up database associations
User.hasMany(Message, { foreignKey: "userId", onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: "userId" });

Group.hasMany(GroupMembership, { foreignKey: "groupId", onDelete: 'CASCADE' });
GroupMembership.belongsTo(Group, { foreignKey: "groupId" });

Group.hasMany(Message, { foreignKey: "groupId", onDelete: 'CASCADE' });
Message.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(GroupMembership, { foreignKey: "userId", onDelete: 'CASCADE' });
GroupMembership.belongsTo(User, { foreignKey: "userId" });

User.hasMany(ArchivedChat, { foreignKey: "userId", onDelete: "CASCADE" });
ArchivedChat.belongsTo(User, { foreignKey: "userId" });

Group.hasMany(ArchivedChat, { foreignKey: "groupId", onDelete: "CASCADE" });
ArchivedChat.belongsTo(Group, { foreignKey: "groupId" });

// Create HTTP server and attach Socket.IO
const server = createServer(app); // Ensure server is created after app
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

// Sync the models with the database and start the server
sequelize.sync().then(() => {
    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch(e => console.log(e));
