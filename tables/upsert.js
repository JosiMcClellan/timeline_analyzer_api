const table = require('./table');

const upsertAgainstGithubId = ({ tableName, params, returning })=> {
  const insert = table(tableName).insert(params);
  const update = table.queryBuilder().update(params);
  return table.raw(
    `? ON CONFLICT (id) DO ? returning ?`,
    [insert, update, '*']).toString()
};

module.exports = upsertAgainstGithubId;
