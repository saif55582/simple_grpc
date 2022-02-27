const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();

server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());

server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream,
});

server.start();

const todos = [];

function createTodo(call, callback) {
  const todoItem = {
    id: todos.length + 1,
    body: call.request.body,
  };

  console.log("received from client", JSON.stringify(todoItem));

  todos.push(todoItem);

  console.log("TODOS ", JSON.stringify(todos));

  callback(null, todoItem);
}

function readTodos(call, callback) {
  callback(null, { items: todos });
}

function readTodosStream(call, callback) {
  todos.forEach((todo) => call.write(todo));
  call.end();
}
