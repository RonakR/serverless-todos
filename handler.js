const completed = require('./src/events/completed');
const createTodo = require('./src/todos/create');
const deleteTodo = require('./src/todos/delete');
const getTodo = require('./src/todos/get');
const updateTodo = require('./src/todos/update');

module.exports = {
  todosHandler: (event, context, callback) => {
    if (event.httpMethod === 'GET') {
      console.log('Received GET event');
      getTodo(event.body)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    } else if (event.httpMethod === 'POST') {
      console.log('Received POST event');
      createTodo(event.body)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    } else if (event.httpMethod === 'PUT') {
      console.log('Received PUT event');
      updateTodo(event.pathParameters.id, event.body)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    } else if (event.httpMethod === 'DELETE') {
      console.log('Received DELETE event');
      deleteTodo(event.pathParameters.id)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    }
  },
  completedHandler: (event, context, callback) => {
    completed(context)
      .then(result => callback(null, result))
      .catch(err => callback(err));
  },
  snsListner: (event, context, callback) => {
    console.log(event.Records[0].Sns);
    callback(null, event);
  }
};
