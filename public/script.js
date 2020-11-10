// Nouvelle socket 
const socket = io("/");
// Grille html pour l'affichage des video 
const videoGrid = document.getElementById("video-grid");
// Video de l'utilisateur 
const myVideo = document.createElement("video");

// Empeche le retour son 
myVideo.muted = true;
// Creation du serveur PeerJs sur le port 443
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443", 
});

let myVideoStream;
const peers = {};
// Demande d'acces à la vidéo et à l'audio par le navigateur 
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {  // Ajout de la video de l'utilisateur dans la salle 
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    // Ecouteur de connexion sur la socket
    socket.on("user-connected", (userId) => {
      // Connexion d'un nouvel utilisateur(userId) dans la salle(stream) 
      connecToNewUser(userId, stream);

    });
    
  });

  
// Ecouteur d'evenement d'appel sur le serveur PeerJs 
peer.on("call", (call) => {
  // Demande d'access au son et à la video pour le nouvel utilisateur 
  navigator.getUserMedia({video: true, audio: true}, function(stream) {
  // Repondre à l'appel 
    call.answer(stream);
  });
  // Creation d'un nouvel element html pour la video du nouvel utilisateur 
  const video = document.createElement("video");
  // Ajout de la video 
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
});

// Lors de l'ouverture d'une connexion au serveur peer 
peer.on("open", (id) => {
  // Envoi l'evenement join-room dans la socket avec les informations d'identification de la salle 
  socket.emit("join-room", ROOM_ID, id);
});

// Connexion d'un nouvel utilisateur à la salle virtuelle 
const connecToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

// Ajout de la video du nouvel utilisateur dans la salle virtuelle 
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

let text = $("input");

// Envoi du message lors de l'appuie sur la touche entrée
$("html").keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val());
    socket.emit("message", text.val());
    text.val("");
  }
});

//Ajout du message dans le chat 
socket.on("createMessage", (message) => {
  $("ul").append(`<li class="message"><b>user</b/><br/>${message}</li>`);
  scrollToBottom();
});

// Affichage des derniers messages 
const scrollToBottom = () => {
  let d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};
