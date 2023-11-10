// Constants
const API_SERVER_URL = "http://localhost:8000";

// Declaring variables
let videoContainer = document.getElementById("videoContainer");
let micButton = document.getElementById("mic-btn");
let camButton = document.getElementById("cam-btn");
let ssButton = document.getElementById("ss-btn");
let screenShare = document.getElementById("screenShare");
let raiseHand = document.getElementById("raiseHand-btn");
let sendMessageBtn = document.getElementById("sendMessage-btn");
let participants = document.getElementById("participants");
let leaveMeetingBtn = document.getElementById("leaveMeeting-btn");
let endMeetingBtn = document.getElementById("endMeeting-btn");

// video element
let startVideoBtn = document.getElementById("startVideo-btn");
let stopVideoBtn = document.getElementById("stopVideo-btn");
let resumeVideoBtn = document.getElementById("resumeVideo-btn");
let pauseVideoBtn = document.getElementById("pauseVideo-btn");
let seekVideoBtn = document.getElementById("seekVideo-btn");

// recording

let startRecordingBtn = document.getElementById("startRecording-btn");
let stopRecordingBtn = document.getElementById("stopRecording-btn");

//videoPlayback DIV
let videoPlayback = document.getElementById("videoPlayback");

let meeting;
// Local participants
let localParticipant;
let localParticipantAudio;

// join page
let joinPageWebcam = document.getElementById("joinCam");

navigator.mediaDevices
  .getUserMedia({
    video: true,
    // audio: false,
  })
  .then((stream) => {
    // xjoinPageVideoStream = stream;
    joinPageWebcam.srcObject = stream;
    joinPageWebcam.play();
  });
// new Meeting
async function joinMeeting(newMeeting) {
  // let defaultMeeting="qwrc-b9ho-7x3j"
  let name = document.getElementById("joinMeetingName").value || "maharaja";
  let meetingId = document.getElementById("joinMeetingId").value;
  if (!meetingId && !newMeeting) {
    return alert("Please Provide a meetingId");
  }

  document.getElementById("joinPage").style.display = "none";

  // create new token
  let token = await window
    .fetch(API_SERVER_URL + "/get-token")
    .then(async (response) => {
      const { token } = await response.json();
      return token;
    });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  };

  //   validate meetingId;
  if (!newMeeting) {
    //  validate meetingId if provided
    meetingId = await fetch(
      API_SERVER_URL + "/validate-meeting/" + meetingId,
      options
    )
      .then(async (result) => {
        const { meetingId } = await result.json();
        console.log("meetingId", meetingId);
        return meetingId;
      })
      .catch(() => {
        alert("Invalid Meeting Id");
        window.location.href = "/";
        return;
      });
  }
  // create new meeting
  // get new meeting if new meeting requested;

  if (newMeeting) {
    meetingId = await fetch(API_SERVER_URL + "/create-meeting", options).then(
      async (result) => {
        const { meetingId } = await result.json();
        console.log("NEW MEETING meetingId", meetingId);
        return meetingId;
      }
    );
  }
  console.log("MEETING_ID::", meetingId);
  //set meetingId
  document.querySelector("#meetingid").innerHTML = meetingId;
  startMeeting(token, meetingId, name);
}
