const queries = require('./queries');

module.exports = (app) => {
  const { existsOrError } = app.api.validation;
  const limit = 10;

  const save = (req, res) => {
    const article = { ...req.body };

    if (req.params.id) article.id = req.params.id;

    try {
      existsOrError(article.name, 'Name not informed');
      existsOrError(article.description, 'Description not informed');
      existsOrError(article.categoryId, 'Id not informed');
      existsOrError(article.userId, 'author not informed');
      existsOrError(article.content, 'Content not informed');
    } catch (err) {
      res.status(400).send({ status: 400, data: err });
    }

    if (article.id) {
      return app
        .db('articles')
        .update(article)
        .where({ id: req.params.id })
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).send({ status: 500, data: err }));
    }

    return app
      .db('articles')
      .insert(article)
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send({ status: 500, data: err }));
  };

  const remove = async (req, res) => {
    const { id } = req.params;

    try {
      const rowsDeleted = await app.db('articles').where({ id }).del();

      try {
        existsOrError(rowsDeleted, 'Article not found');
      } catch (err) {
        return res.status(400).send({ status: 400, data: err });
      }
    } catch (err) {
      res.status(500).send({ status: 500, data: err });
    }

    return res.status(204).send();
  };

  const getArticles = async (req, res) => {
    const page = req.query.page || 1;

    const result = await app.db('articles').count('id').first();
    const count = parseInt(result.count, 10);

    app
      .db('articles')
      .select('id', 'name', 'description')
      .limit(limit)
      .offset(page * limit - limit)
      .then((articles) =>
        res.status(200).send({
          status: 200,
          data: articles,
          count,
          limit,
        })
      )
      .catch((err) => res.status(500).send({ status: 500, data: err }));
  };

  const getArticleById = async (req, res) => {
    app
      .db('articles')
      .where({ id: req.params.id })
      .first()
      .then((article) => {
        const newArticle = {
          ...article,
          content: article.content.toString(),
        };

        res.status(200).send({ status: 200, data: newArticle });
      })
      .catch((err) => res.status(500).send(err));
  };

  const getByCategory = async (req, res) => {
    const categoryId = req.params.id;
    const page = req.params.page || 1;
    const categories = await app.db.raw(
      queries.categoryWithChildren,
      categoryId
    );
    const ids = categories.rows.map((c) => c.id);

    app
      .db({ a: 'articles', u: 'users' })
      .select('a.id', 'a.name', 'a.description', 'a.imageUrl', {
        author: 'u.name',
      })
      .limit(limit)
      .offset(page * limit - limit)
      .whereRaw('?? = ??', ['u.id', 'a.userId'])
      .whereIn('categoryId', ids)
      .orderBy('a.id', 'desc')
      .then((articles) => res.status(200).send({ status: 200, data: articles }))
      .catch((err) => res.status(500).send({ status: 500, data: err }));
  };

  return {
    save,
    remove,
    getArticles,
    getArticleById,
    getByCategory,
  };
};
