const socket = io('https://ge-chat.onrender.com');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving messages
var audio = new Audio('alert.mp3');

// Function which will append event info to the contaner
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}


const popup = document.querySelector('.popup');
const userNameInput = document.querySelector('.setUsername');
const setUsernameButton = document.querySelector('.setUsernameBtn');

let name = '';
const getname = () => {
    if (userNameInput.value != null && userNameInput.value.length > 4) {
        let name = userNameInput.value;
        setUsernameButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>`;
        localStorage.setItem('username', name);
        setTimeout(() => {
            popup.style.display = 'none';
            socket.emit('new-user-joined', name);
        }, 1000);
    }
    else if(name == 'rahul'){
      alert("this name is for admin only!");
    }
    else {
        alert("invalid name");
        userNameInput.style.borderColor = 'red';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('username')) {
        popup.style.display = 'block';
    }
    else {
        let name = localStorage.getItem('username');
        socket.emit('new-user-joined', name);
        popup.style.display = 'none';
    }
});
setUsernameButton.addEventListener('click', () => {
    getname();
});





// If a new user joins, receive his/her name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left')
})

// If server sends a message, receive it
socket.on('receive', data => {
    append(`<span class='sendersName'>${data.name}</span> ${data.message}`, 'left')
    messageContainer.scroll({
  top: 1000000000,
  left: 0,
  behavior: "smooth",
});
})

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'left')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
     messageContainer.scroll({
  top: 1000000000,
  left: 0,
  behavior: "smooth",
});
})

const coseNtf = document.querySelector('.coseNtf');
const ntf = document.querySelector('.notif');
coseNtf.addEventListener('click', () => {
    ntf.style.opacity = '0';
    setTimeout(() => {
        ntf.style.visibility = 'hidden';
    }, 1000);
    setTimeout(() => {
        ntf.style.display = 'none';
    }, 500);
});
