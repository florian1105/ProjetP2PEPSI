// CHargement des librairies 
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// Chargement du langage de templeting ejs 
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/peerjs", peerServer);
// Génération d'un lien unique pour le numéro de la salle virtuelle et redirection 
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()} `);
});

// Redirection vers la salle d'attente personnelle à partir de l'URL /room 
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// Lors de la connexion à la socket  
io.on("connection", (socket) => {
  // Lors de l'evennement de demande de connexion à la salle 
  socket.on("join-room", (roomId, userId) => {
    // Accepter la connexion 
    socket.join(roomId);
    // Notifier de la connexion d'un nouvel utilisateur identifié par userId
    socket.to(roomId).broadcast.emit("user-connected", userId);
    // Ecouteur d'evenement pour l'envoi de message dans le chat 
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

// Ecoute du serveur express sur le port 3030 
server.listen(process.env.PORT || 3030);