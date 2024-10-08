// Initialize global variables
let scene, camera, renderer, water, sky, fish, fishList = [], activeFish = null;
let isCasting = false, fishCaught = 0, credits = 0, level = 1, tension = 0;

// Fish types with size, speed, and difficulty to catch
const fishTypes = [
    { type: "Bass", size: 2, speed: 0.5, difficulty: 20 },
    { type: "Trout", size: 1.5, speed: 0.7, difficulty: 15 },
    { type: "Catfish", size: 3, speed: 0.3, difficulty: 25 }
];

// HTML Elements
const castBtn = document.getElementById('cast-btn');
const reelBtn = document.getElementById('reel-btn');
const tensionBtn = document.getElementById('tension-btn');
const scoreElement = document.getElementById('score');
const creditsElement = document.getElementById('credits');
const levelElement = document.getElementById('level');

// Initialize Three.js scene
function init() {
    scene = new THREE.Scene();

    // Set Up Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Set Up Renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87ceeb); // Sky blue

    // Add Skybox
    sky = new THREE.Mesh(
        new THREE.SphereGeometry(500, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide })
    );
    scene.add(sky);

    // Add Water
    const waterGeometry = new THREE.PlaneGeometry(100, 100);
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e88e5,
        shininess: 100,
        reflectivity: 0.6
    });
    water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2; // Flat water surface
    scene.add(water);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft ambient light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    animate(); // Start animation loop
}

// Animate the scene (render loop)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Fish class
class Fish {
    constructor(type, size, speed, difficulty) {
        this.type = type;
        this.size = size;
        this.speed = speed;
        this.difficulty = difficulty;
        this.position = new THREE.Vector3(
            (Math.random() - 0.5) * 20, // X axis
            -1, // Depth
            (Math.random() - 0.5) * 20 // Z axis
        );
    }

    swim() {
        // Random swimming behavior
        this.position.x += (Math.random() - 0.5) * this.speed;
        this.position.z += (Math.random() - 0.5) * this.speed;
    }

    checkBait(baitPosition) {
        // Check if fish is near bait
        const distance = this.position.distanceTo(baitPosition);
        if (distance < 1) {
            console.log(`${this.type} is near the bait!`);
            return true;
        }
        return false;
    }

    struggle() {
        return Math.random() > 0.5 ? 'tug' : 'relax'; // Simulate struggle
    }
}

// Spawn fish in the lake
function spawnFish() {
    for (let i = 0; i < 10; i++) {
        const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        const fish = new Fish(fishType.type, fishType.size, fishType.speed, fishType.difficulty);
        fishList.push(fish);
    }
}

// Fish animation loop
function animateFish() {
    fishList.forEach(fish => fish.swim());
    requestAnimationFrame(animateFish);
}

// Casting the line
function castLine() {
    if (!isCasting) {
        isCasting = true;
        console.log("Casting line...");

        // Set bait position
        const baitPosition = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            -1,
            (Math.random() - 0.5) * 20
        );

        // Check for nearby fish
        const nearbyFish = fishList.find(fish => fish.checkBait(baitPosition));

        if (nearbyFish) {
            console.log(`${nearbyFish.type} is biting!`);
            activeFish = nearbyFish;
        } else {
            console.log("No fish near the bait.");
            isCasting = false;
        }
    }
}

// Reeling in the fish
function reelIn() {
    if (activeFish) {
        const fishStruggle = activeFish.struggle();
        if (fishStruggle === 'tug') {
            console.log(`${activeFish.type} is struggling, don't pull too hard!`);
            tension -= 10;
        } else {
            console.log(`${activeFish.type} is relaxing, keep reeling in!`);
            tension += 5;
        }

        if (tension > 100) {
            console.log(`${activeFish.type} escaped!`);
            activeFish = null;
            isCasting = false;
        }

        if (tension < 20) {
            fishCaught++;
            console.log(`Caught a ${activeFish.type}!`);
            credits += 20; // Reward for catching
            activeFish = null;
            isCasting = false;
        }
    }
}

// Adjust tension mechanics
function adjustTension() {
    tension = Math.floor(Math.random() * 100);
    console.log(`Tension adjusted to: ${tension}`);
}

// Update scoreboard
function updateScore() {
    scoreElement.textContent = fishCaught;
    creditsElement.textContent = credits;
    levelElement.textContent = level;
}

// Event Listeners
castBtn.addEventListener('click', castLine);
reelBtn.addEventListener('click', reelIn);
tensionBtn.addEventListener('click', adjustTension);

// Initialize game
spawnFish();
animateFish();
updateScore();
init();
// Gear Types
const gear = {
    rods: [
        { name: "Basic Rod", strength: 10, cost: 0 },
        { name: "Pro Rod", strength: 20, cost: 100 },
        { name: "Master Rod", strength: 40, cost: 250 }
    ],
    reels: [
        { name: "Basic Reel", durability: 10, cost: 0 },
        { name: "Pro Reel", durability: 20, cost: 100 },
        { name: "Master Reel", durability: 40, cost: 250 }
    ],
    baits: [
        { name: "Worm", attraction: 10, cost: 0 },
        { name: "Shiner", attraction: 20, cost: 50 },
        { name: "Lure", attraction: 30, cost: 150 }
    ]
};

// Player's Inventory (Initial Gear)
let currentRod = gear.rods[0];
let currentReel = gear.reels[0];
let currentBait = gear.baits[0];

// Purchase gear function
function purchaseGear(type, index) {
    const selectedGear = gear[type][index];
    if (credits >= selectedGear.cost) {
        credits -= selectedGear.cost;
        if (type === 'rods') currentRod = selectedGear;
        if (type === 'reels') currentReel = selectedGear;
        if (type === 'baits') currentBait = selectedGear;
        console.log(`Purchased: ${selectedGear.name}`);
        updateScore();
    } else {
        console.log("Not enough credits to buy this gear!");
    }
}

// Casting with upgraded gear
function castLine() {
    if (!isCasting) {
        isCasting = true;
        console.log(`Casting line with ${currentRod.name}, ${currentReel.name}, and ${currentBait.name}...`);

        const baitPosition = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            -1,
            (Math.random() - 0.5) * 20
        );

        const nearbyFish = fishList.find(fish => fish.checkBait(baitPosition, currentBait.attraction));

        if (nearbyFish) {
            console.log(`${nearbyFish.type} is biting!`);
            activeFish = nearbyFish;
        } else {
            console.log("No fish near the bait.");
            isCasting = false;
        }
    }
}

// Reel in with upgraded gear
function reelIn() {
    if (activeFish) {
        const fishStruggle = activeFish.struggle();
        const rodStrength = currentRod.strength;
        const reelDurability = currentReel.durability;

        if (fishStruggle === 'tug') {
            console.log(`${activeFish.type} is struggling!`);
            tension -= 10 - rodStrength / 5; // Rod strength reduces the tension loss
        } else {
            console.log(`${activeFish.type} is relaxing, reel it in!`);
            tension += 5 + reelDurability / 5; // Reel durability helps gain more tension
        }

        if (tension > 100) {
            console.log(`${activeFish.type} escaped!`);
            activeFish = null;
            isCasting = false;
        }

        if (tension < 20) {
            fishCaught++;
            console.log(`Caught a ${activeFish.type} with ${currentRod.name}!`);
            credits += 20; // Reward for catching
            activeFish = null;
            isCasting = false;
        }
    }
}
// Weather States
const weatherStates = ['Sunny', 'Rainy', 'Cloudy', 'Night'];
let currentWeather = weatherStates[0];

// Change weather periodically
function changeWeather() {
    currentWeather = weatherStates[Math.floor(Math.random() * weatherStates.length)];
    console.log(`Weather changed to: ${currentWeather}`);
    updateFishBehavior();
}

// Update fish behavior based on weather
function updateFishBehavior() {
    fishList.forEach(fish => {
        if (currentWeather === 'Rainy') {
            fish.speed *= 1.2; // Fish swim faster during rain
        } else if (currentWeather === 'Night') {
            fish.speed *= 0.8; // Fish swim slower at night
        } else {
            fish.speed = fishTypes.find(type => type.type === fish.type).speed; // Reset to default speed
        }
    });
}

// Weather change loop
setInterval(changeWeather, 30000); // Change weather every 30 seconds
// Day-Night Cycle Variables
let timeOfDay = 'Day'; // Initial time is day
const dayDuration = 60000; // 1 minute per cycle

// Update lighting for day-night cycle
function updateLighting() {
    if (timeOfDay === 'Day') {
        directionalLight.intensity = 0.8;
        ambientLight.intensity = 0.5;
    } else if (timeOfDay === 'Night') {
        directionalLight.intensity = 0.2;
        ambientLight.intensity = 0.1;
    }
}

// Change time of day
function changeTimeOfDay() {
    timeOfDay = timeOfDay === 'Day' ? 'Night' : 'Day';
    console.log(`Time of day changed to: ${timeOfDay}`);
    updateLighting();
}

// Day-Night cycle loop
setInterval(changeTimeOfDay, dayDuration);
// Modify fish behavior based on gear and environment
function checkBait(baitPosition, baitAttraction) {
    const distance = this.position.distanceTo(baitPosition);
    let chanceToBite = baitAttraction;

    if (currentWeather === 'Rainy') chanceToBite += 5; // Rain makes fish more likely to bite
    if (timeOfDay === 'Night') chanceToBite -= 5; // Fish are more cautious at night

    if (distance < 1 && Math.random() * 100 < chanceToBite) {
        console.log(`${this.type} is biting!`);
        return true;
    }
    return false;
}
