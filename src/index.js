const express = require('express');
const cors = require('cors');

const { v4: uuidv4} = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const userExists = users.find(user => user.username === username);

  if (!userExists) {
    response.status(404).json({ error: 'user not found'});
  }

  request.user = userExists;

  next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userExists = users.find(user => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: 'Mensagem de erro'});
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todoExists = user.todos.find(todo => todo.id === id);
  if (!todoExists) {
    response.status(404).json({ error: 'todo not found'});
  }

  todoExists.title = title;
  todoExists.deadline = deadline;

  response.json(todoExists);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const todoExists = user.todos.find(todo => todo.id === id);

  if (!todoExists) {
    response.status(404).json({ error: 'todo not found'});
  }

  todoExists.done = true;

  response.json(todoExists);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    response.status(404).json({ error: 'todo not found'});
  }

  user.todos.splice(todoIndex, 1);

  response.status(204).send();
});

module.exports = app;