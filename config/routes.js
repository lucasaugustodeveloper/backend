module.exports = (app) => {
  app.route('/users').post(app.api.user.save).get(app.api.user.getAllUsers);

  app.route('/users/:id').get(app.api.user.getById);

  app.route('/users/:id').put(app.api.user.save);

  app
    .route('/categories')
    .get(app.api.category.getCategories)
    .post(app.api.category.save);

  app
    .route('/categories/:id')
    .get(app.api.category.getById)
    .put(app.api.category.save)
    .delete(app.api.category.remove);
};
