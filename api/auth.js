const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const config = require('../config/config');

module.exports = (app) => {
  const signin = async (req, res) => {
    if (!req.body.email && !req.body.password) {
      return res
        .status(400)
        .send({ status: 400, data: 'Informe usuário e senha!' });
    }

    const user = await app.db('users').where({ email: req.body.email }).first();

    if (!user) {
      return res
        .status(400)
        .send({ status: 400, data: 'Usuário não encontrado!' });
    }

    const isMatch = bcrypt.compareSync(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .send({ status: 401, data: 'Email/Password is invalid!' });
    }

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      iat: now,
      exp: now + 60 * 60,
    };

    return res.status(200).send({
      status: 200,
      data: { ...payload, token: jwt.encode(payload, config.authSecret) },
    });
  };

  const validateToken = (req, res) => {
    const userData = req.body || null;

    try {
      if (userData) {
        const token = jwt.decode(userData.token, config.authSecret);

        if (new Date(token.exp * 1000) > new Date()) {
          return res.status(200).send({
            status: 200,
            data: true,
          });
        }
      }
    } catch (err) {
      console.log('error', err);
    }

    return res.status(401).send({ status: 401, data: false });
  };

  return { signin, validateToken };
};
