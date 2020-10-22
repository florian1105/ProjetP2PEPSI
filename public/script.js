const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");

myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443", 
});

let myVideoStream;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    socket.on("user-connected", (userId) => {
      console.log("user connected")
      connecToNewUser(userId, stream);
    });
    
  });

  

  peer.on("call", (call) => {
    console.log("calling")
    navigator.getUserMedia({video: true, audio: true}, function(stream) {
    call.answer(stream);
    });
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  });

peer.on("open", (id) => {
  console.log(id)
  socket.emit("join-room", ROOM_ID, id);
});

// socket.emit("join-room", ROOM_ID);

const connecToNewUser = (userId, stream) => {
  console.log(userId)
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    console.log("connect")
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

let text = $("input");
console.log(text);

$("html").keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val());
    socket.emit("message", text.val());
    text.val("");
  }
});

socket.on("createMessage", (message) => {
  $("ul").append(`<li class="message"><b>user</b/><br/>${message}</li>`);
  scrollToBottom();
});

const scrollToBottom = () => {
  let d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};
