// تحقق من وجود اسم محفوظ
let savedName = localStorage.getItem("memoryGameName");

if (savedName) {
  document.querySelector(".name span").innerHTML = savedName;
  document.querySelector(".control-buttons").remove();
} else {
  document.querySelector(".control-buttons span").onclick = function () {
    let yourName = prompt("What's Your Name");

    if (yourName == null || yourName.trim() === "") {
      yourName = "Unknown";
    }

    // حفظ الاسم
    localStorage.setItem("memoryGameName", yourName);

    document.querySelector(".name span").innerHTML = yourName;

    document.querySelector(".control-buttons").remove();
  };
}

let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");
let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()];

// Shuffle blocks
shuffle(orderRange);

// Apply order and set click events
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];

  block.addEventListener("click", function () {
    flipBlock(block);
  });
});

// Flip Block
function flipBlock(selectedBlock) {
  if (
    selectedBlock.classList.contains("is-flipped") ||
    selectedBlock.classList.contains("has-match")
  ) {
    return;
  }

  selectedBlock.classList.add("is-flipped");

  let allFlippedBlocks = blocks.filter((block) =>
    block.classList.contains("is-flipped")
  );

  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Prevent clicking temporarily
function stopClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// Check matched blocks
function checkMatchedBlocks(firstBlock, secondBlock) {
  let triesElement = document.querySelector(".tries span");

  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
  } else {
    let triesCount = parseInt(triesElement.innerHTML);
    triesCount += 1;
    triesElement.innerHTML = triesCount;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);

    if (triesCount >= 5) {
      setTimeout(() => {
        showGameOver();
      }, duration);
    }
  }
}

// Show Game Over
function showGameOver() {
  let gameOverDiv = document.createElement("div");
  gameOverDiv.className = "game-over";
  gameOverDiv.innerHTML = "<span>💀 Game Over - اضغط لإعادة اللعبة</span>";

  document.body.appendChild(gameOverDiv);

  gameOverDiv.onclick = function () {
    location.reload(); // الاسم محفوظ في localStorage، هتبدأ تلقائيًا
  };
}

// Shuffle Function
function shuffle(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;

    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }

  return array;
}

