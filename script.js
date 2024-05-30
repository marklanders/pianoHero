// Select all key elements and store them in the "keys" variable
const keys = document.querySelectorAll(".key");
// Select the element that displays the currently playing note
const noteDisplay = document.querySelector(".nowplaying");
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
const dropInterval = 800; // Set interval to 800 milliseconds

//Declare the songs notes
const songs = {
  song1: ["I", "I", "I", "O", "P", "O", "I", "P", "O", "O", "I"],

  song2: [
    "I",
    "I",
    "I",
    "I",
    "U",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "P",
    "P",
    "P",
    "O",
    "I",
    "I",
    "O",
    "P",
    "Q",
    "I",
    "9",
    "D",
    "0",
    "F",
  ],
  song3: [
    "P",
    "P",
    "Q",
    "S",
    "S",
    "Q",
    "P",
    "O",
    "I",
    "I",
    "O",
    "P",
    "P",
    "O",
    "O",
    "P",
    "P",
    "Q",
    "S",
    "S",
    "Q",
    "P",
    "O",
    "I",
    "I",
    "O",
    "P",
    "P",
    "O",
    "O",
    "O",
    "O",
    "P",
    "I",
    "O",
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

  const currentNote = currentSong[currentNoteIndex];
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
      noteElement.remove();
      checkForLastNote();
    }
  }, 1000 / 60);
}

function playNoteFromKey(e) {
  const key = e.key ? e.key.toUpperCase() : e.target.dataset.key.toUpperCase();
  const keyElement = document.querySelector(`.key[data-key="${key}"]`);

  if (!keyElement) return;

  const audio = document.querySelector(`audio[data-key="${key}"]`);
  const keyNote = keyElement.getAttribute("data-note");

  keyElement.classList.add("playing");
  noteDisplay.textContent = keyNote;

  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }

  handleNoteHit(key);
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
  const noteRect = noteElement.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();
  const finishLineHeightPx = 60;
  const hitZoneStart =
    containerRect.top + gameContainer.offsetHeight - finishLineHeightPx;
  const hitZoneEnd = containerRect.top + gameContainer.offsetHeight;

  return noteRect.top > hitZoneStart && noteRect.top < hitZoneEnd;
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("playing");
}

function hintsOn(hint, index) {
  hint.style.transitionDelay = `${index * 1}ms`;
}

function startSong(songName) {
  const song = songs[songName];
  currentNoteIndex = 0;
  score = 0;
  updateScore(0);
  currentSong = song;

  document.querySelector("#song-selection-modal").style.display = "none";
  document.querySelector("#song-over-modal").style.display = "none";

  dropNote();
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

hints.forEach(hintsOn);
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);
  key.addEventListener("click", playNoteFromKey);
});
window.addEventListener("keydown", playNoteFromKey);
document
  .querySelector("#restart-button")
  .addEventListener("click", restartGame);
