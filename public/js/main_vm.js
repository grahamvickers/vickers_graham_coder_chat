// imports always go first
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

// setting userId
function setUserId({sID, count}) {
    //debugger;
    vm.socketID = sID;

    // counts all active users
    vm.userCount = count; 
};

// adding sound everytime user joins
function userPing(message){
    // Plays sound when a user connects
    var userPing = new Audio("audio/user_ping.mp3");
    userPing.play();

    // adding the user to the online users count
    vm.userCount += 1;

    // displaying the connection message
    if(message !== vm.socketID) {
        socket.emit('notification_message', {
            content: `A new coder joined the chat`,
            name: "Notification"
        })
    }
};

// sending the message
function appendNewMessage(msg) {
    // take the incoming message and push it into the Vue instance 
    // into the messages array
    vm.messages.push(msg);

    // When users send new messages they will be nofified by this sound
    if(msg.id !== this.id && msg.message.name !== "Notification"){
        var newMessageSound = new Audio("audio/user_ping.mp3");
        newMessageSound.play();
    }
};

// logs diconnects and subracts from the usercount
function runDisconnectMessage(message) {
    //debugger;
    //console.log(packet);

    // removing the user from the online count
    vm.userCount -= 1;

    // removing the disconnected user from the user count
    socket.emit('notification_message', {
        content: message,
        name: "Notification"
    })
};

// this is the main Vue instance
const vm = new Vue({
    data: {
        socketID: "",      
        messages: [],
        message: "",
        nickName: "",
        userCount: 0
    },

    methods: {
        dispatchMessage() {
            // emit a message event and send the message to the server
            // console.log('message sent');

            socket.emit('chat_message', { 
                content: this.message,
                name: this.nickName || "creeper"
                // || is called a double pipe operator or an "or" operator
                // if this.nickName is set, use it as the value
            })

            this.message = "";
        }

    },

    components: {
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log('mounted');
    }
}).$mount("#app");


// some event handling -> these events are coming from the server
socket.addEventListener('connected', setUserId);
socket.addEventListener('new_user', userPing);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);