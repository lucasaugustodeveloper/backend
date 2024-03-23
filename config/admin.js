module.exports = (middleware) => (req, res, next) => {
  if (req.user.admin) {
    return middleware(req, res, next);
  }

  return res.status(401).send({ status: 401, data: 'User not admin' });
};
