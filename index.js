// Import required modules
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3000;
const http = require("http");
const socketio = require("socket.io");

const app = express();

const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketio(server);

// Initialize the Express application

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the directory for EJS templates
app.set("views", path.join(__dirname, "views"));

// Define the main route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" }); // Pass data to the template
});

// socket io connection
io.on("connection", (socket) => {
  socket.on("send_location", (location) => {
    io.emit("receive_location", { id: socket.id, ...location });
  });
  socket.on("disconnect", () => {
    io.emit("disconnected", { id: socket.id });
  });
});

// Set the port, defaulting to 3000 if not specified in the environment variables

// Start the server and log a message to the console
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware (optional)
// This is a catch-all for unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
