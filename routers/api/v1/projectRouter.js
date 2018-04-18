const express = require('express');
const router = express.Router();

const projectsTable = require('../../../tables/projectsTable');
const filter = require('./filterParams')(
  'githubName',
  'githubId',
  'hasTravis',
  'herokuSlug'
)

router.post('/', (req, res) => {
  const userId = req.body.userId;
  const params = filter(req.body);
  projectsTable.create(userId, params).then(project => {
    res.status(201).json(project)
  })
})




// router.post('/', function(req, res, _next) {
//   const params = filterObject(req.body.food, 'name', 'calories')
//   Project.create(params)
//     .then(created => res.status(201).json(created[0]))
//     .catch(error => res.status(422).json({ error }))
// })
//
// router.patch('/:id', function(req, res, _next) {
//   const { id } = req.params
//   const params = filterObject(req.body, 'name', 'calories')
//   if (Object.keys(params).length !== 1) return res.status(422).json({ error: "Incorrect parameters" })
//   Project.update(id, params)
//     .then(updated => res.status(201).json(updated[0]))
//     .catch(error => res.status(422).json({ error }))
// })
//
// router.delete('/:id', function(req, res, _next) {
//   const { id } = req.params
//   Project.destroy(id)
//     .then(() => res.status(204).json({}))
//     .catch(error => res.status(500).json({ error }))
// })

module.exports = router
