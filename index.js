'use strict'
const idConn=0;

var peer = new Peer({
    host: "localhost",
	port: "9000",
	path: '/'}); 

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  })

const conn = peer.connect(idConn);
conn.send('hi!');

conn.on('data', function(data) {
	console.log(data)
})

