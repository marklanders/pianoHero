// Select all key elements and store them in the "keys" variable
const keys = document.querySelectorAll(".key");
// Select the element that displays the currently playing note
// const noteDisplay = document.querySelector(".nowplaying");
//Select all hint elements and store them in the 'hints' variable
const hints = document.querySelectorAll(".hints");
//Select the game container element
const gameContainer = document.querySelector(".game-container");
// select the display score element
const scoreElement = document.querySelector("#score");
// Select the element displaying the final score
const finalScoreElement = document.querySelector("#final-score");

let score = 0;
let currentSong = [];
let currentNoteIndex = 0;
let isPracticeMode = false;
const easterEggSequence = ["D", "R", "E"];
let currentSequenceIndex = 0;

//Declare the songs notes
const songs = {
  song1: [
    ["I", 400],
    ["I", 400],
    ["I", 400],
    ["O", 400],
    ["P", 800],
    ["O", 800],
    ["I", 400],
    ["P", 400],
    ["O", 400],
    ["O", 400],
    ["I", 800],
  ],
  song2: [
    ["I", 400],
    ["I", 400],
    ["I", 800],
    ["I", 800],
    ["U", 400],
    ["Y", 400],
    ["U", 400],
    ["I", 400],
    ["O", 400],
    ["P", 800],
    ["P", 800],
    ["P", 800],
    ["P", 800],
    ["O", 400],
    ["I", 400],
    ["O", 400],
    ["P", 800],
    ["Q", 800],
    ["S", 800],
    ["I", 400],
    ["D", 400],
    ["S", 400],
    ["Q", 400],
    ["P", 400],
    ["O", 400],
    ["I", 400],
  ],

  song3: [
    ["P", 400],
    ["P", 400],
    ["Q", 400],
    ["S", 400],
    ["S", 400],
    ["Q", 800],
    ["P", 400],
    ["O", 400],
    ["I", 400],
    ["I", 400],
    ["O", 400],
    ["P", 800],
    ["P", 400],
    ["O", 400],
    ["O", 400],
    ["P", 400],
    ["P", 400],
    ["Q", 800],
    ["S", 400],
    ["S", 400],
    ["Q", 400],
    ["P", 400],
    ["O", 400],
    ["I", 400],
    ["I", 400],
    ["O", 400],
    ["P", 400],
    ["P", 400],
    ["O", 400],
    ["O", 400],
    ["O", 400],
    ["O", 400],
    ["P", 400],
    ["I", 400],
    ["O", 400],
  ],
};

// function to display the note by creating a new div element.
function createNoteElement(note) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note", `note-${note}`); //https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

  noteElement.dataset.note = note; //https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
  return noteElement;
}

function dropNote() {
  if (currentNoteIndex >= currentSong.length) return; //Stop if we reached the end of the song

  const [currentNote, dropInterval] = currentSong[currentNoteIndex];
  const noteContainer = document.getElementById(currentNote);
  const noteElement = createNoteElement(currentNote);
  noteContainer.appendChild(noteElement); // Append the note element to the container.

  animateNoteDrop(noteElement);
  currentNoteIndex++;
  setTimeout(dropNote, dropInterval); //Schedule the next note drop
}

function animateNoteDrop(noteElement) {
  let position = 0;
  const interval = setInterval(() => {
    position += 2;
    noteElement.style.top = `${position}px`; //https://developer.mozilla.org/en-US/docs/Web/CSS/top, define the top style of the element
    if (position > 385) {
      clearInterval(interval);
      noteElement.remove(); // Remove the note element
      checkForLastNote(); //check if it s the last element to end the game
    }
  }, 1000 / 60);
}

function playNoteFromKey(e) {
  let key;
  if (e.key) {
    key = e.key.toUpperCase();
  } else {
    key = e.target.dataset.key.toUpperCase();
  }
  const keyElement = document.querySelector(`.key[data-key="${key}"]`);

  if (!keyElement) return;

  const audio = document.querySelector(`audio[data-key="${key}"]`);
  const keyNote = keyElement.getAttribute("data-note");

  keyElement.classList.add("playing");
  // noteDisplay.textContent = keyNote;

  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }

  handleNoteHit(key);
  checkEasterEggSequence(key);
}

function handleNoteHit(note) {
  const activeNotes = document.querySelectorAll(`.note[data-note="${note}"]`);
  activeNotes.forEach((noteElement) => {
    if (isInHitZone(noteElement)) {
      noteElement.remove();
      updateScore(1);
      checkForLastNote();
    }
  });
}

function isInHitZone(noteElement) {
  //https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  const noteRect = noteElement.getBoundingClientRect(); // Get the bounding rectangle of the note element
  const containerRect = gameContainer.getBoundingClientRect(); // Get the bounding rectangle of the game container
  const finishLineHeightPx = 60;
  const hitZoneStart =
    containerRect.top + gameContainer.offsetHeight - finishLineHeightPx;
  const hitZoneEnd = containerRect.top + gameContainer.offsetHeight;
  return noteRect.top > hitZoneStart && noteRect.top < hitZoneEnd; // Return true if the note is in the hit zone
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("playing");
}

function hintsOn(hint, index) {
  hint.style.transitionDelay = `${index * 1}ms`;
}

function startSong(songName) {
  isPracticeMode = false;
  const song = songs[songName];
  currentNoteIndex = 0;
  score = 0;
  updateScore(0);
  currentSong = song;

  document.querySelector("#song-selection-modal").style.display = "none";
  document.querySelector("#song-over-modal").style.display = "none";

  dropNote();
}

function startPracticeMode() {
  isPracticeMode = true;
  currentNoteIndex = 0;
  document.getElementById("song-selection-modal").style.display = "none"; // Hide the song selection modal
  document.getElementById("song-over-modal").style.display = "none"; // Hide the song over modal
}

function updateScore(points) {
  score += points;
  scoreElement.textContent = score;
}

function restartGame() {
  clearIntervals();
  document.querySelectorAll(".note").forEach((note) => note.remove());
  score = 0;
  updateScore(0);
  currentNoteIndex = 0;

  document.querySelector("#song-selection-modal").style.display = "flex";
  document.querySelector("#song-over-modal").style.display = "none";
}

function clearIntervals() {
  let highestIntervalId = setInterval(() => {});
  for (let i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }
}

function checkForLastNote() {
  if (
    document.querySelectorAll(".note").length === 0 &&
    currentNoteIndex >= currentSong.length
  ) {
    setTimeout(showSongOverModal, 1000);
  }
}

function showSongOverModal() {
  finalScoreElement.textContent = score;
  document.querySelector("#song-over-modal").style.display = "flex";
}

function checkEasterEggSequence(key) {
  if (!isPracticeMode) return;

  if (key === easterEggSequence[currentSequenceIndex]) {
    currentSequenceIndex++;
    if (currentSequenceIndex === easterEggSequence.length) {
      displayEasterEgg();
      currentSequenceIndex = 0;
    }
  } else {
    currentSequenceIndex = 0;
  }
}

function displayEasterEgg() {
  const finishLine = document.querySelector(".finish");
  const gifSrc = "./img/snoop-dogg-dance.gif";
  const audioElement = document.getElementById("easter-egg-audio");

  for (let i = 0; i < 5; i++) {
    const easterEggElement = document.createElement("img");
    easterEggElement.src = gifSrc;
    easterEggElement.alt = "Snoop Dogg Dance";
    easterEggElement.style.position = "absolute";
    easterEggElement.style.width = "100px";
    easterEggElement.style.height = "auto";
    easterEggElement.style.zIndex = "1000";
    easterEggElement.style.bottom = "60px"; // Position above the finish line
    easterEggElement.style.left = `${(i + 1) * 15}%`;

    finishLine.appendChild(easterEggElement);

    setTimeout(() => {
      easterEggElement.remove();
    }, 10000);
  }

  // audioElement.play();

  // setTimeout(() => {
  //   audioElement.pause();
  //   audioElement.currentTime = 0; // Reset audio to the start
  // }, 10000);
}

hints.forEach(hintsOn);
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);
  key.addEventListener("click", playNoteFromKey);
});
window.addEventListener("keydown", playNoteFromKey);
document
  .querySelector("#restart-button")
  .addEventListener("click", restartGame);
document
  .getElementById("practice-button")
  .addEventListener("click", startPracticeMode);
