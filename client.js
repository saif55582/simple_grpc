const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const operation = parseInt(process.argv[2]);

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

if (operation === 1) {
  const body = process.argv[3];
  client.createTodo(
    {
      id: -1,
      body: body,
    },
    (err, response) => {
      console.log("Received from server", JSON.stringify(response));
    }
  );
} else if (operation === 2) {
  client.readTodos(null, (err, response) => {
    console.log("List of todos.\n");

    response.items.forEach((todo) => {
      console.log(todo);
    });
  });
} else if (operation === 3) {
  const call = client.readTodosStream();
  console.log("Receiving stream from server.\n");

  call.on("data", (todo) => {
    console.log("Stream data", todo);
  });

  call.on("end", (e) => {
    console.log("Done receiving stream");
  });
}
