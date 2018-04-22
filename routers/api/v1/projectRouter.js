const express = require('express');
const router = express.Router();

const projectUsersTable = require('../../../tables/projectUsersTable');
const projectsTable = require('../../../tables/projectsTable');
const repoFilter = require('./filterParams')(
  'id',
  'nameWithOwner',
  'travisId',
  'herokuSlug'
);

router.post('/', async(req, res) => {
  const repo = repoFilter(req.body);
  let project, ok = 200;
  project = await projectsTable.findBy('id', repo.id);
  if (!project) {
    project = await projectsTable.create(repo);
    ok = 201;
  }
  await projectUsersTable.join(repo.id, req.body.userId);
  res.status(ok).json(project)
});

module.exports = router;
