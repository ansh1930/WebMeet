const socket = io('https://weebmeeet.herokuapp.com')
// const socket = io('localhost:8001')
const videoGrid = document.getElementById('video-grid')

// const myPeer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: "8001",
// })

var myPeer = new Peer(); 

// var a_random_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

// var myPeer = new Peer(a_random_id, {key: 'myapikey'}); 
console.log(myPeer)

let myVideoStream; 

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    // video.className="mw-100"
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

function disconnect() {

  // window.location='http://localhost:8001'
  window.location='https://weebmeeet.herokuapp.com/'

}

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id,Username)
  console.log(ROOM_ID);
  console.log(id)
  // For Chat Connection
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

var elms = 0

let changeCssVideos = (main) => {
  let widthMain = main.offsetWidth
  let minWidth = "30%"
  if ((widthMain * 30 / 100) < 300) {
    minWidth = "300px"
  }
  let minHeight = "40%"

  let height = String(100 / elms) + "%"
  let width = ""
  if(elms === 0 || elms === 1) {
    width = "100%"
    height = "100%"
  } else if (elms === 2) {
    width = "45%"
    height = "100%"
  } else if (elms === 3 || elms === 4) {
    width = "35%"
    height = "50%"
  } else {
    width = String(100 / elms) + "%"
  }

  let videos = main.querySelectorAll("video")
  for (let a = 0; a < videos.length; ++a) {
    videos[a].style.minWidth = minWidth
    videos[a].style.minHeight = minHeight
    videos[a].style.setProperty("width", width)
    videos[a].style.setProperty("height", height)
  }

  return {minWidth, minHeight, width, height}
}

function addVideoStream(video, stream,name) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
  changeCssVideos(video)
  
  // let totalUsers = document.getElementsByTagName("video").length;
  // if (totalUsers > 1) {
  //   for (let index = 0; index < totalUsers; index++) {
  //     document.getElementsByTagName("video")[index].style.width =
  //       100 / totalUsers + "%";
  //   }
  // }
}


// microphone,play/pause

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  const html = `<i class="unmute fas fa-video-slash"></i>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=" fa fa-video-camera"></i>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fa fa-microphone-slash"></i>`;
  document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class="fa fa-microphone"></i>`;
  document.getElementById("muteButton").innerHTML = html;
};




// for chat
let message = document.getElementById('message')
let form_send = document.getElementById('form_message')
let inputmessage = document.getElementById('input_message')
// let List = document.getElementById('list')


form_send.addEventListener('submit',(e)=>{
    e.preventDefault();
    let div = document.createElement('div')
    div.classList.add('d-flex','justify-content-start','mb-4')
    let inner_div = document.createElement('div')
    inner_div.classList.add('msg_cotainer')
    inner_div.innerText='you: '+ inputmessage.value
    div.append(inner_div)
    message.append(div)
    socket.emit('send',inputmessage.value)
    inputmessage.value='';
})




socket.on('user_joined',name=>{
    // console.log(name)
    new_user_joined(name)
})



function new_user_joined(name){
    // let p =document.createElement('p')
    // p.classList.add('right_text')
    // p.innerText=name
    // message.append(p)


    let div = document.createElement('div')
    div.classList.add('d-flex','justify-content-end','mb-4')
    let inner_div = document.createElement('div')
    inner_div.classList.add('msg_cotainer_send')
    inner_div.innerText=name
    div.append(inner_div)
    message.append(div)
    // socket.emit('send',inputmessage.value)
    // inputmessage.value='';

}


function messages(new_message,user_name){
    // let p =document.createElement('p')
    // p.classList.add('right_text')
    // p.innerText= `${user_name} : ${new_message}`
    // message.append(p)

    let div = document.createElement('div')
    div.classList.add('d-flex','justify-content-end','mb-4')
    let inner_div = document.createElement('div')
    inner_div.classList.add('msg_cotainer_send')
    inner_div.innerText=`${user_name} : ${new_message}`
    div.append(inner_div)
    message.append(div)
}


socket.on('receive',(message)=>{
    // console.log(message.message)
    // console.log(message.user)
    messages(message.message,message.user)
})

socket.on('leave' , message=>{
    messages('left the chat',message.message)
})