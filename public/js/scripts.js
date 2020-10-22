// When the DOM is ready
document.addEventListener("DOMContentLoaded", function(event) {
    // All the code of scripts.js here ...
}, false);

var peer_id;
var username;
var conn;

/**
 * Important: the host needs to be changed according to your requirements.
 * e.g if you want to access the Peer server from another device, the
 * host would be the IP of your host namely 192.xxx.xxx.xx instead
 * of localhost.
 * 
 * The iceServers on this example are public and can be used for your project.
 */
var peer = new Peer({
    host: "localhost",
    port: 9000,
    path: '/peerjs',
    debug: 3,
    config: {
        'iceServers': [
            { url: 'stun:stun1.l.google.com:19302' },
            {
                url: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            }
        ]
    }
});