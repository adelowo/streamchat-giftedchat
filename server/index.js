require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const StreamChat = require('stream-chat').StreamChat;
const Faker = require('faker');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new StreamChat(process.env.API_KEY, process.env.API_SECRET);

const users = [];

app.post('/login', (req, res) => {
  const username = req.body.username;

  if (username === undefined || username.length == 0) {
    res.status(400).send({
      status: false,
      message: 'Please provide your username',
    });
    return;
  }

  let user = users.find(u => u.name.trim() === username.trim());

  if (user === undefined) {
    user = {
      id: uuidv4(),
      name: username,
    };

    users.push(user);
  }

  res.status(200);
  res.send({
    status: true,
    message: 'You have been successfully authenticated',
    token: client.createToken(user.id),
    user_id: user.id,
  });
});

const robotUserID = '123456789';

app.post('/hook', (req, res) => {
  const otherMessage = {
    _id: uuidv4(),
    text: Faker.lorem.sentence(),
    user: {
      id: robotUserID,
      avatar: 'https://placeimg.com/140/140/any',
    },
  };

  const userID = req.body.message.user.id;

  const user = users.find(u => {
    return u.id === userID;
  });

  if (user === undefined) {
    res.status(200);
    return;
  }

  client.channel('messaging', user.name).sendMessage(otherMessage);

  res.status(200);
  res.send({
    status: true,
  });
});

app.set('port', process.env.PORT || 5200);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running on port ${server.address().port}`);
});
