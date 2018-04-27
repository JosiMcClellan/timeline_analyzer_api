const express = require('express');
const heroku = require('../../../services/herokuService')
const travis = require('../../../services/travisService')
const projects = require('../../../tables/projectsTable');
const projectUsers = require('../../../tables/projectUsersTable');
const makeFilter = require('../../../utils/makeFilter');

const filter = makeFilter(
  'id',
  'nameWithOwner',
  'travisId',
  'herokuSlug',
  'herokuOwnerId'
);


module.exports = express.Router();

module.exports.param('project_id', (req, res, next, projectId) => {
  if (!req.user) return next(401);
  projects.forUser(projectId, req.user.id)
    .then((project) => {
      if (!project) return next(404);
      req.project = project;
      next();
    })
    .catch(next);
});

module.exports.post('/', async(req, res) => {
  const repo = filter(req.body);
  let status = 200, project = await projects.first(repo.id);
  if (!project) status = 201, project = await projects.create(repo);
  if (!project) return next(422);
  await projectUsers.create(project.id, req.body.userId);
  res.status(status).json(project)
});

module.exports.get('/:project_id', async(req, res, next) => {
  const project = filter(req.project);
  Promise.all([
    heroku.getDeploys(project, req.user),
    travis.getBuilds(project, req.user)
  ]).then(([deploys, builds]) => {
    res.status(200).json({ deploys, builds, project });
  }).catch(next);
});

module.exports.patch('/:project_id/heroku', async(req, res) => {
  const herokuSlug = req.body.herokuSlug || null;
  const herokuOwnerId = herokuSlug ? req.user.id : null;
  const [updated, deploys] = await Promise.all([
    projects.update(req.project.id, { herokuSlug, herokuOwnerId }),
    heroku.getDeploys({ ...req.project, herokuSlug, herokuOwnerId }, req.user)
  ]);
  if (!updated) return next(422);
  res.status(201).json({ updated, deploys });
});
