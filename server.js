const express = require("express");
const { createServer } = require("http");
const { Server } =  require("socket.io");
const { uid } = require("uid");


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
	cors: true,
	path: "/iRemote/"});

io.on('connection', (socket) => {
	// 創建房間
	socket.on('create', () => {
		console.log(socket.id+' create start '+new Date());
		var room = uid();
		socket.join(room);
		socket.emit('createsuccess', room);
		console.log(socket.id+' create End   '+new Date());
		console.log('=======================================')
	})
	
	// 加入房間
	socket.on('join', (room) => {
		console.log(socket.id+' join start   '+new Date());
		console.log(room)
		socket.join(room)
		socket.to(room).emit('ready', '準備通話')
		console.log(socket.id+' join End '+new Date());
		console.log('=======================================')
	})
	
	
	// 轉傳 Offer
	socket.on('offer', (room, desc) => {
		console.log(socket.id+' offer start '+new Date());
		socket.to(room).emit('offer', desc)
		console.log(socket.id+' offer End   '+new Date());
		console.log('=======================================')
	})

	// 轉傳 Answer
	socket.on('answer', (room, desc) => {
		console.log(socket.id+' answer start '+new Date());
		socket.to(room).emit('answer', desc)
		console.log(socket.id+' answer End   '+new Date());
		console.log('=======================================')
	})

	// 交換 ice candidate
	socket.on('ice_candidate', (room, data) => {
		console.log(socket.id+' ice_candidate start '+new Date());
		socket.to(room).emit('ice_candidate', data)
		console.log(socket.id+' ice_candidate End   '+new Date());
		console.log('=======================================')
	})

	// 離開房間
	socket.on('leave', (room) => {
		socket.to(room).emit('bye')
		socket.emit('leaved')
	})
})

httpServer.listen(80, () => {
	console.log('Server running in 80')
})
