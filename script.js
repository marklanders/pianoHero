const keys = document.querySelectorAll(".key");
const noteDisplay = document.querySelector(".nowplaying");
const hints = document.querySelectorAll(".hints");
const gameContainer = document.querySelector(".game-container");
const scoreElement = document.getElementById("score");
let score = 0;
const song = [
  "A",
  "1",
  "Z",
  "2",
  "E",
  "R",
  "3",
  "T",
  "4",
  "Y",
  "5",
  "U",
  "I",
  "6",
  "O",
  "7",
  "P",
  "Q",
  "8",
  "S",
  "9",
  "D",
  "0",
  "F",
];
let currentNoteIndex = 0;
let dropNoteInterval;

function createNoteElement(note) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note", `note-${note}`);
  noteElement.dataset.note = note;
  return noteElement;
}

function dropNote() {
  if (currentNoteIndex >= song.length) {
    clearInterval(dropNoteInterval);
    return;
  }

  const currentNote = song[currentNoteIndex];
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
}

function playNoteFromKey(e) {
  const key = e.key.toUpperCase();
  console.log(`Key pressed: ${key}`);
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  const keyElement = document.querySelector(`.key[data-key="${key}"]`);

  if (!keyElement) {
    console.log(`No key element found for key: ${key}`);
    return;
  }

  const keyNote = keyElement.getAttribute("data-note");
  keyElement.classList.add("playing");
  noteDisplay.innerHTML = keyNote;

  if (audio) {
    console.log(`Playing sound for key: ${key}`);
    audio.currentTime = 0;
    audio.play();
  } else {
    console.log(`No audio found for key: ${key}`);
  }

  handleNoteHit(key);
}

function handleNoteHit(note) {
  const activeNotes = document.querySelectorAll(`.note[data-note="${note}"]`);
  activeNotes.forEach((note) => {
    const noteRect = note.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    if (
      noteRect.top > containerRect.top + 360 &&
      noteRect.top < containerRect.top + 400
    ) {
      note.remove();
      updateScore(1); // Increase the score by 1 for each correct note hit
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
  console.log(`Starting song: ${songName}`);
  document.getElementById("song-selection-modal").style.display = "none";

  currentNoteIndex = 0;
  score = 0; // Reset the score at the start of a new song
  updateScore(0);
  dropNoteInterval = setInterval(dropNote, 800);
}

function updateScore(points) {
  score += points;
  scoreElement.textContent = score;
}

hints.forEach(hintsOn);
keys.forEach((key) => key.addEventListener("transitionend", removeTransition));
window.addEventListener("keydown", playNoteFromKey);
