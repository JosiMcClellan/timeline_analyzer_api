module.exports = (...allowed) => object => (
  allowed.reduce((filtered, name) => {
    if (object.hasOwnProperty(name)) filtered[name] = object[name];
    return filtered;
  }, {})
);
