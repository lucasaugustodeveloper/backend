module.exports = (app) => {
  const Stat = app.mongoose.model('Stat', {
    users: Number,
    categories: Number,
    articles: Number,
    createdAt: Date,
  });

  const get = (req, res) => {
    Stat.findOne({}, {}, { sort: { createdAt: -1 } }).then((stat) =>
      res.status(200).json(
        stat || {
          users: 0,
          categories: 0,
          articles: 0,
        }
      )
    );
  };

  return { Stat, get };
};
