const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const player = {
  x: 100,
  y: 100,
  size: 20,
  speed: 4,
  color: '#3A9AD9'
};

const locations = [
  {
    name: "Community Center",
    x: 150,
    y: 150,
    w: 120,
    h: 120,
    text: "Urgent: Climate change warnings ignored! Flood risks rising, heatwaves more common."
  },
  {
    name: "School",
    x: 400,
    y: 300,
    w: 120,
    h: 120,
    text: "It’s hotter every year. Floods keep us home sometimes. I’m scared for the future."
  },
  {
    name: "Park",
    x: 650,
    y: 150,
    w: 120,
    h: 120,
    text: "Save our Earth - glaciers melting, fires spreading."
  },
  {
    name: "Family Home",
    x: 300,
    y: 500,
    w: 120,
    h: 120,
    text: "Photos of family. We stayed, but it’s hard seeing friends leave."
  },
  {
    name: "Silent Forest",
    x: 600,
    y: 400,
    w: 120,
    h: 120,
    text: "The ecosystem is dying. Immediate action needed."
  }
];

const collectedNotes = [];
let currentInteraction = null;

const keys = {};
window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

canvas.addEventListener('click', () => {
  checkInteraction(true);
});

document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'e') {
    checkInteraction(false);
  }
});

function checkInteraction(fromClick) {
  for (let loc of locations) {
    if (isNear(player, loc)) {
      if (fromClick || !currentInteraction) {
        currentInteraction = loc;
        showStory(loc.text);
        if (!collectedNotes.includes(loc.text)) {
          collectedNotes.push(loc.text);
          console.log('Notes collected:', collectedNotes.length);
        }
      }
      return;
    }
  }
  // If no interactable found
  if (!fromClick) {
    showStory('No nearby objects to interact with.');
  }
}

function isNear(p, loc) {
  const distX = (p.x + p.size / 2) - (loc.x + loc.w / 2);
  const distY = (p.y + p.size / 2) - (loc.y + loc.h / 2);
  const distance = Math.sqrt(distX * distX + distY * distY);
  return distance < 100; // interaction range
}

function showStory(text) {
  const box = document.getElementById('storyBox');
  box.innerHTML = text;
}

function update() {
  if (keys['w'] || keys['arrowup']) player.y -= player.speed;
  if (keys['s'] || keys['arrowdown']) player.y += player.speed;
  if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
  if (keys['d'] || keys['arrowright']) player.x += player.speed;

  // Clamp player inside canvas
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw locations
  locations.forEach(loc => {
    ctx.fillStyle = 'rgba(240, 130, 0, 0.5)';
    ctx.fillRect(loc.x, loc.y, loc.w, loc.h);
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 3;
    ctx.strokeRect(loc.x, loc.y, loc.w, loc.h);

    ctx.fillStyle = 'black';
    ctx.font = '14px sans-serif';
    ctx.fillText(loc.name, loc.x + 10, loc.y + 20);
  });

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
