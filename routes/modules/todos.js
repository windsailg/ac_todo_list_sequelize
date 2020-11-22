const express = require('express')
const router = express.Router()

const db = require('../../models')
const todoModel = db.Todo

router.get('/new', (req, res) => {
  return res.render('new')
})

// new post
router.post('/', (req, res) => {
  const UserId = req.user.id
  const name = req.body.name
  return todoModel.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// router.post('/', (req, res) => {
//   const UserId = req.user.id
//   const name = req.body.name

//   return todoModel.create({ name, UserId })
//     .then(() => res.redirect('/'))
//     .catch(error => console.log(error))
// })

// detail
router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return todoModel.findOne({ where: { id, UserId } })
    .then(todos => res.render('detail', { todo: todos.toJSON() }))
    .catch(error => console.log(error))
})

// edit
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return todoModel.findOne({ where: { id, UserId } })
    .then(todos => res.render('edit', { todo: todos.get() }))
    .catch(error => console.log(error))
})

// edit post
router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body
  return todoModel.findOne({ where: { id, UserId } })
    .then(todoItem => {
      todoItem.name = name
      todoItem.isDone = isDone === 'on'
      return todoItem.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return todoModel.findOne({ where: { id, UserId } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
