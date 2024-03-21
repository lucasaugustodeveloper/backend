/* eslint-disable no-param-reassign */
module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.api.validation;

  const save = (req, res) => {
    const category = { ...req.body };

    if (req.params.id) category.id = req.params.id;

    try {
      existsOrError(category.name, 'Name is required');
    } catch (msg) {
      return res.status(400).send({
        status: 400,
        data: msg,
      });
    }

    if (category.id) {
      return app
        .db('categories')
        .update(category)
        .where({ id: category.id })
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).send({ status: 500, data: err }));
    }

    return app
      .db('categories')
      .insert(category)
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send({ status: 500, data: err }));
  };

  const remove = async (req, res) => {
    const { id } = req.params;

    try {
      existsOrError(id, 'Category id not informed');

      const subcategory = await app.db('categories').where({ parentId: id });
      const articles = await app.db('articles').where({ parentId: id });

      notExistsOrError(subcategory, 'Category have subcategory');
      notExistsOrError(articles, 'Category have articles');

      const rowsDeleted = await app.db('categories').where({ id }).del();

      existsOrError(rowsDeleted, 'Category not found');

      res.status(204).send();
    } catch (err) {
      res.status(500).send({ status: 500, data: err });
    }
  };

  const withPath = (categories) => {
    const getParent = (cat, parentId) => {
      const parent = cat.filter((p) => p.id === parentId);

      return parent.length ? parent[0] : null;
    };

    const categoriesWithPath = categories.map((category) => {
      let path = category.name;
      let parent = getParent(categories, category.parentId);

      while (parent) {
        path = `${parent.name} > ${path}`;
        parent = getParent(categories, parent.parentId);
      }

      return { ...category, path };
    });

    categoriesWithPath.sort((a, b) => {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });

    return categoriesWithPath;
  };

  const getCategories = (req, res) => {
    app
      .db('categories')
      .then((categories) =>
        res.status(200).send({
          status: 200,
          data: withPath(categories),
        })
      )
      .catch((err) => res.status(500).send({ status: 500, data: err }));
  };

  const getById = (req, res) => {
    const { id } = req.params;

    app
      .db('categories')
      .where({ id })
      .first()
      .then((category) => res.status(200).send({ status: 200, data: category }))
      .catch((err) => res.status(500).send({ status: 500, data: err }));
  };

  const toTree = (categories, tree) => {
    if (!tree) tree = categories.filter((c) => !c.parentId);

    tree = tree.map((parentNode) => {
      const isChild = (node) => node.parentId === parentNode.id;

      parentNode.children = toTree(categories, categories.filter(isChild));

      return parentNode;
    });

    return tree;
  };

  const getTree = (req, res) => {
    app
      .db('categories')
      .then((categories) => {
        console.log('categories', categories);
        res.status(200).send({
          status: 200,
          data: toTree(categories),
        });
      })
      .catch((err) => {
        res.status(500).send({ status: 500, data: err });
      });
  };

  return {
    save,
    remove,
    getCategories,
    getById,
    getTree,
  };
};
