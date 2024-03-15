const existsOrError = (value, msg) => {
  if (!value) throw msg;

  if (Array.isArray(value) && !value.length) throw msg;

  if (typeof value === 'string' && !value.trim()) throw msg;
};

const notExistsOrError = (value, msg) => {
  try {
    existsOrError(value, msg);
  } catch (err) {
    console.log('error', err);
  }

  throw msg;
};

const equalsOrError = (valueA, valueB, msg) => {
  if (valueA !== valueB) throw msg;
};

module.exports = {
  existsOrError,
  notExistsOrError,
  equalsOrError,
};
