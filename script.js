// Select all key elements and store them in the 'keys' variable
const keys = document.querySelectorAll(".key");

// Select the element that displays the currently playing note
const noteDisplay = document.querySelector(".nowplaying");

// Select all hint elements and store them in the 'hints' variable
const hints = document.querySelectorAll(".hints");

// Select the game container element
const gameContainer = document.querySelector(".game-container");

// Select the element that displays the score
const scoreElement = document.getElementById("score");

// Select the element that displays the final score
const finalScoreElement = document.getElementById("final-score");

// Initialize the score variable
let score = 0;

// Define the songs with their respective note sequences
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

// Initialize the current song array and the current note index
let currentSong = [];
let currentNoteIndex = 0;

// Set the interval for dropping notes
const dropInterval = 800; // milliseconds

// Function to create a note element
function createNoteElement(note) {
  // Create a div element for the note
  const noteElement = document.createElement("div");
  // Add classes for styling the note element
  noteElement.classList.add("note", `note-${note}`);
  // Set the data attribute for the note
  noteElement.dataset.note = note;
  return noteElement;
}

// Function to drop a note
function dropNote() {
  // Check if all notes in the current song have been dropped
  if (currentNoteIndex >= currentSong.length) {
    return;
  }

  // Get the current note and its container element
  const currentNote = currentSong[currentNoteIndex];
  const noteContainer = document.getElementById(currentNote);
  // Create a note element and append it to the container
  const noteElement = createNoteElement(currentNote);
  noteContainer.appendChild(noteElement);

  // Initialize the position of the note
  let position = 0;
  // Set an interval to move the note down
  const interval = setInterval(() => {
    position += 2;
    noteElement.style.top = position + "px";
    // Check if the note has reached the bottom
    if (position > 385) {
      clearInterval(interval);
      noteElement.remove();
      checkForLastNote(); // Check if it is the last note
    }
  }, 1000 / 60);

  // Move to the next note in the song
  currentNoteIndex++;

  // Schedule the next note drop
  setTimeout(dropNote, dropInterval);
}

// Function to handle key presses or clicks
function playNoteFromKey(e) {
  // Determine the key that was pressed or clicked
  const key = e.key ? e.key.toUpperCase() : e.target.dataset.key.toUpperCase();
  // Select the audio and key elements associated with the key
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  const keyElement = document.querySelector(`.key[data-key="${key}"]`);

  // If the key element doesn't exist, exit the function
  if (!keyElement) {
    return;
  }

  // Get the note associated with the key and display it
  const keyNote = keyElement.getAttribute("data-note");
  keyElement.classList.add("playing");
  noteDisplay.innerHTML = keyNote;

  // Play the associated audio if it exists
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }

  // Handle the note hit
  handleNoteHit(key);
}

// Function to handle when a note is hit
function handleNoteHit(note) {
  // Select all active notes with the same data-note attribute
  const activeNotes = document.querySelectorAll(`.note[data-note="${note}"]`);
  activeNotes.forEach((note) => {
    // Get the bounding rectangles of the note and container
    const noteRect = note.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    // Define the hit zone
    const finishLineHeightPx = 48;
    const hitZoneStart =
      containerRect.top + gameContainer.offsetHeight - finishLineHeightPx;
    const hitZoneEnd = containerRect.top + gameContainer.offsetHeight;

    // Check if the note is within the hit zone
    if (noteRect.top > hitZoneStart && noteRect.top < hitZoneEnd) {
      note.remove();
      updateScore(1); // Update the score
      checkForLastNote(); // Check if it is the last note
    }
  });
}

// Function to remove the transition effect from the key
function removeTransition(e) {
  // Check if the transition is for the transform property
  if (e.propertyName !== "transform") return;
  // Remove the playing class from the key
  this.classList.remove("playing");
}

// Function to set transition delays for hints
function hintsOn(e, index) {
  e.setAttribute("style", "transition-delay:" + index * 1 + "ms");
}

// Function to start a song
function startSong(songName) {
  // Get the song by its name
  const song = songs[songName];
  // If the song doesn't exist, log an error and exit the function
  if (!song) {
    console.log(`Song not found: ${songName}`);
    return;
  }

  // Log the start of the song
  console.log(`Starting song: ${songName}`);
  // Hide the song selection modal and the song over modal
  document.getElementById("song-selection-modal").style.display = "none";
  document.getElementById("song-over-modal").style.display = "none";

  // Reset the current note index and score
  currentNoteIndex = 0;
  score = 0;
  updateScore(0);
  // Set the current song
  currentSong = song;

  // Start dropping notes
  dropNote();
}

// Function to update the score
function updateScore(points) {
  score += points;
  scoreElement.textContent = score;
}

// Add an event listener to the restart button to restart the game
document
  .getElementById("restart-button")
  .addEventListener("click", restartGame);

// Function to restart the game
function restartGame() {
  clearIntervals(); // Clear any existing intervals
  // Remove all note elements
  document.querySelectorAll(".note").forEach((note) => note.remove());
  // Reset the score and note index
  score = 0;
  updateScore(0);
  currentNoteIndex = 0;
  // Show the song selection modal and hide the song over modal
  document.getElementById("song-selection-modal").style.display = "flex";
  document.getElementById("song-over-modal").style.display = "none";
}

// Function to clear all intervals
function clearIntervals() {
  // Get the highest interval ID and clear all intervals up to that ID
  const highestIntervalId = setInterval(() => {});
  for (let i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }
}

// Function to check if the last note has been removed
function checkForLastNote() {
  // Check if there are no more notes and the current note index is at the end of the song
  if (
    document.querySelectorAll(".note").length === 0 &&
    currentNoteIndex >= currentSong.length
  ) {
    // Wait 1 second before showing the song over modal
    setTimeout(() => {
      finalScoreElement.textContent = score;
      document.getElementById("song-over-modal").style.display = "flex";
    }, 1000);
  }
}

// Function to show the song over modal
function showSongOverModal() {
  finalScoreElement.textContent = score;
  document.getElementById("song-over-modal").style.display = "flex";
}

// Apply the hintsOn function to all hint elements
hints.forEach(hintsOn);

// Add event listeners to keys for transition end and click events
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);
  key.addEventListener("click", playNoteFromKey);
});

// Add an event listener to the window for keydown events
window.addEventListener("keydown", playNoteFromKey);
