const keys = document.querySelectorAll(".key");
const noteDisplay = document.querySelector(".nowplaying");
const hints = document.querySelectorAll(".hints");
const gameContainer = document.querySelector(".game-container");
const scoreElement = document.getElementById("score");

let score = 0;

const songs = {
  song1: [
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
  song2: ["I", "I", "I", "I", "O", "P", "O", "I", "P", "O", "O", "I"],
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

let currentSong = [];
let currentNoteIndex = 0;
const dropInterval = 800; // milliseconds

function createNoteElement(note) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note", `note-${note}`);
  noteElement.dataset.note = note;
  return noteElement;
}

function dropNote() {
  if (currentNoteIndex >= currentSong.length) {
    return;
  }

  const currentNote = currentSong[currentNoteIndex];
  const noteContainer = document.getElementById(currentNote);
  const noteElement = createNoteElement(currentNote);
  noteContainer.appendChild(noteElement);

  let position = 0;
  const interval = setInterval(() => {
    position += 2;
    noteElement.style.top = position + "px";
    if (position > 385) {
      clearInterval(interval);
      noteElement.remove();
    }
  }, 1000 / 60);

  currentNoteIndex++;

  setTimeout(dropNote, dropInterval);
}

function playNoteFromKey(e) {
  const key = e.key ? e.key.toUpperCase() : e.target.dataset.key.toUpperCase();
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  const keyElement = document.querySelector(`.key[data-key="${key}"]`);

  if (!keyElement) {
    return;
  }

  const keyNote = keyElement.getAttribute("data-note");
  keyElement.classList.add("playing");
  noteDisplay.innerHTML = keyNote;

  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }

  handleNoteHit(key);
}

function handleNoteHit(note) {
  const activeNotes = document.querySelectorAll(`.note[data-note="${note}"]`);
  activeNotes.forEach((note) => {
    const noteRect = note.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    const finishLineHeightPx = 48;
    const hitZoneStart =
      containerRect.top + gameContainer.offsetHeight - finishLineHeightPx;
    const hitZoneEnd = containerRect.top + gameContainer.offsetHeight;

    if (noteRect.top > hitZoneStart && noteRect.top < hitZoneEnd) {
      note.remove();
      updateScore(1);
    }
  });
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

function hintsOn(e, index) {
  e.setAttribute("style", "transition-delay:" + index * 1 + "ms");
}

function startSong(songName) {
  const song = songs[songName];
  if (!song) {
    console.log(`Song not found: ${songName}`);
    return;
  }

  console.log(`Starting song: ${songName}`);
  document.getElementById("song-selection-modal").style.display = "none";

  currentNoteIndex = 0;
  score = 0;
  updateScore(0);
  currentSong = song;

  dropNote();
}

function updateScore(points) {
  score += points;
  scoreElement.textContent = score;
}

hints.forEach(hintsOn);
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);
  key.addEventListener("click", playNoteFromKey);
});
window.addEventListener("keydown", playNoteFromKey);
