
var express = require('express')
var app = express();
var socketio = require('socket.io');


var server = app.listen(3001,()=>{
    console.log('Listening at port number 3001')
})

//return socket.io server.
var io = socketio.listen(server)

//This array shows who Is On this chatroom

var whoIsOn= [];


io.on('connection',function (socket){

    var nickname = ``


    // console.log('client has been logged in')
    // socket.on('clientMessage', function(data){
    //     console.log('Client Message : ' + data);
         
    //     var message = {
    //         msg : 'server',
    //         data : 'data'
    //     };
    //     socket.emit('serverMessage', message);
    // });



    socket.on('login',function(data){
        console.log(`${data} has entered chatroom! ---------------------`)
        whoIsOn.push(data)
        nickname = data

        //이렇게 하면 파싱을 할 수 있다 ㅡㅡ 그냥 넘기면 JSONArray로 넘어가서 복잡해짐
        var whoIsOnJson = `${whoIsOn}`
        console.log(whoIsOnJson)

        io.emit('newUser',whoIsOnJson)
    })

    socket.on('say',function(data){
        console.log(`${nickname} : ${data}`)
    


        socket.emit('myMsg',data)
        socket.broadcast.emit('newMsg',data)
    })

    socket.on('disconnect',function(){
        console.log(`${nickname} has left this chatroom ------------------------  `)
    })

    socket.on('logout',function(){

        //Delete user in the whoIsOn Arryay

        whoIsOn.splice(whoIsOn.indexOf(nickname),1);
        var data = {
            whoIsOn: whoIsOn,
            disconnected : nickname
        }
        socket.emit('logout',data)
    })


 


})

