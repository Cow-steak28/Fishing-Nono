// Global Variables for Game State
let fishCaught = 0;
let credits = 100;
let level = 1;
let isCasting = false;
let tension = 50; // Range 0-100

// DOM Elements
const castBtn = document.getElementById('cast-btn');
const reelBtn = document.getElementById('reel-btn');
const tensionBtn = document.getElementById('tension-btn');
const scoreElement = document.getElementById('fish-caught');
const creditsElement = document.getElementById('credits');
const levelElement = document.getElementById('level');

// Cast Line Function
function castLine() {
    if (!isCasting) {
        isCasting = true;
        console.log('Casting line...');
        // Simulate casting animation (later via WebGL)
        setTimeout(() => {
            isCasting = false;
            console.log('Fish on the line! Start reeling in.');
        }, 3000); // Casting delay
    }
}

// Reel In Function
function reelIn() {
    if (isCasting) {
        console.log('Reeling in...');
        // Random chance to catch a fish
        if (Math.random() > 0.5) {
            fishCaught++;
            credits += 20; // Add credits for caught fish
            updateScore();
            console.log('Fish caught!');
        } else {
            console.log('Fish got away...');
        }
        isCasting = false;
    }
}

// Adjust Tension (For Advanced Mechanics)
function adjustTension() {
    tension = Math.floor(Math.random() * 100);
    console.log(`Tension adjusted to: ${tension}`);
}

// Update the Scoreboard
function updateScore() {
    scoreElement.textContent = fishCaught;
    creditsElement.textContent = credits;
    levelElement.textContent = level;
}

// Event Listeners
castBtn.addEventListener('click', castLine);
reelBtn.addEventListener('click', reelIn);
tensionBtn.addEventListener('click', adjustTension);

// Initialize Game
updateScore();
