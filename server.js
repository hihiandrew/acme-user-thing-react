const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/acme-user-thing-react', {
  logging: false,
});

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
  },
});

const Thing = db.define('thing', {
  name: {
    type: Sequelize.STRING,
  },
});

const Own = db.define('own', {
  userId: Sequelize.INTEGER,
  thingId: Sequelize.INTEGER,
});

Own.belongsTo(Thing);
Own.belongsTo(User);
User.hasMany(Own); //enables eager loading to search with User.find..
Thing.hasMany(Own); //enables eager loading to search with Thing.find..

db.sync({ force: true })
  .then(() => console.log(`Synced`))
  .then(async () => {
    [moe, larry, curly, shep, joe] = await Promise.all([
      User.create({ name: 'moe' }),
      User.create({ name: 'larry' }),
      User.create({ name: 'curly' }),
      User.create({ name: 'shep' }),
      User.create({ name: 'joe' }),
    ]);
  })
  .then(() => console.log(`Users added`))
  .then(async () => {
    [foo, bazz] = await Promise.all([
      Thing.create({ name: 'foo' }),
      Thing.create({ name: 'bazz' }),
    ]);
  })
  .then(() => {
    return Promise.all([
      Own.create({ userId: moe.id, thingId: foo.id }),
      Own.create({ userId: moe.id, thingId: foo.id }),
      Own.create({ userId: larry.id, thingId: foo.id }),
      Own.create({ userId: larry.id, thingId: bazz.id }),
      Own.create({ userId: shep.id, thingId: bazz.id }),
    ]);
  })
  .then(() => console.log('Associations set'))
  .then(async () => {
    const users = await User.findAll({
      include: [
        {
          model: Own,
          include: [Thing],
        },
      ],
    });
    console.log(`Results:`);
    users.forEach(user => {
      console.log(user.name);
      user.owns.forEach(own => {
        console.log(own.thing.name);
      });
      console.log('----------');
    });
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`

    Listening on port: ${port}
    http://localhost:${port}
    `);
    });
  })
  .catch(err => console.log(`Error: ${err}`));

app.get('/api/users', async (req, res, next) => {
  const users = await User.findAll({
    include: [
      {
        model: Own,
        include: [Thing],
      },
    ],
  });
  res.json(users);
});

app.get('/api/users/:id', (req, res, next) => {
  res.json(`hi`);
});
