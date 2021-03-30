const server = require('../../../index');
const io = require('socket.io')(server);
const SocketEvent = require('./socket_event')



//ON CONNECTION READY
io.on(SocketEvent.CONNECTION, socket => {

    const chatUserId = socket.handshake.query.userId;

    console.log("onConnectionEstablished => with userId : "+ chatUserId)

    // joining chat
    //and on disconnect
    //remove userId from chat
    socket.join(chatUserId)

    //on user disconnected from app
    socket.on(SocketEvent.DISCONNECT,()=>{
        console.log("DisConnected => userId : "+chatUserId)
        socket.leave(chatUserId)
    })

    //when user logged in app
    socket.emit(SocketEvent.ONLINE_USER,{
        "userId" : chatUserId,
        "isOnline" : true
    })

    // typing message on chat screen
    socket.on(SocketEvent.TYPING,(data)=>{
        console.log("Typing")
        socket.broadcast.emit(SocketEvent.TYPING,data)
    })

    //when user send message
    socket.on(SocketEvent.SEND_MESSAGE, (data)=>{
        onSendMessage(socket,data)
    })
});

function onSendMessage(socket,data) {
    const fromUser = data.fromUser
    const content = data.content
    console.log("message from : "+fromUser + " => "+content)

    //emit the incoming message to
    //selected user
    inReceiveMessage(socket,data)

}

function inReceiveMessage(socket,data) {
    const toUser = data.toUser;
    const fromUser = data.fromUser;
    const content = data.content;
    socket.in(toUser).emit(SocketEvent.RECEIVE_MESSAGE,{
        "toUser" : toUser,
        "fromUser" : fromUser,
        "content" : content,
        "createdAt" : ""
    })
}

