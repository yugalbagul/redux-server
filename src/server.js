import Server from 'socket.io';
import http from 'http'

//created http server for express app to work

export function startServer(app,store) {
  var server = http.createServer(app);
  const io = new Server.listen(server);
  server.listen(8090);
  // subscribe to store and emit when state changes 
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );
  console.log("server started");
  // listen for connection event from cliebt 
   io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store)); 
  });
 
}