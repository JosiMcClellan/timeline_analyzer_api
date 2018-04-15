var table = require('./table');

const userTable = {
  find(githubId) {
    return table('users').where({ githubId }).first()
      .catch(console.log);
  },

  create(params) {
    return table('users').insert(params).returning('*');
  },
}

module.exports = userTable;
