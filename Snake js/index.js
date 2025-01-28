$(document).ready(function () {
  const gameContainer = $("#gameContainer");
  const scoreDisplay = $(".score");
  const gameOverDisplay = $(".game-over");
  const reiniciar = $("#reload");
  const containerSize = 400;
  const snakeSize = 20;
  let snake = [{ x: 0, y: 0 }];
  let food = { x: 0, y: 0 };
  let direction = "RIGHT";
  let score = 0;
  let speed = 200;
  let gameInterval;
  let isPaused = false;

  function createSnake() {
    gameContainer.find(".snake").remove();
    snake.forEach((segment) => {
      gameContainer.append(
        `<div class="snake" style="left: ${segment.x}px; top:${segment.y}px;"></div>`
      );
    });
  }

  function createFood() {
    let isFoodOnSnake;
    do {
      isFoodOnSnake = false;
      food.x =
        Math.floor(Math.random() * (containerSize / snakeSize)) * snakeSize;
      food.y =
        Math.floor(Math.random() * (containerSize / snakeSize)) * snakeSize;
      snake.forEach((segment) => {
        if (segment.x === food.x && segment.y === food.y) {
          isFoodOnSnake = true;
        }
      });
    } while (isFoodOnSnake);
    gameContainer.append(
      `<div class="food" style="left: ${food.x}px; top:${food.y}px;"></div>`
    );
  }

  function moveSnake() {
    let newHead = { ...snake[0] };

    switch (direction) {
      case "RIGHT":
        newHead.x += snakeSize;
        break;
      case "LEFT":
        newHead.x -= snakeSize;
        break;
      case "UP":
        newHead.y -= snakeSize;
        break;
      case "DOWN":
        newHead.y += snakeSize;
        break;
    }

    if (
      newHead.x >= containerSize ||
      newHead.x < 0 ||
      newHead.y >= containerSize ||
      newHead.y < 0 ||
      isCollision(newHead)
    ) {
      clearInterval(gameInterval);
      gameOverDisplay.show();
      return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
      score += 10;
      scoreDisplay.text(`Score: ${score}`);
      gameContainer.find(".food").remove();
      createFood();
      if (score % 50 === 0) {
        speed *= 0.9;
        clearInterval(gameInterval);
        gameInterval = setInterval(moveSnake, speed);
      }
    } else {
      snake.pop();
    }

    snake.unshift(newHead);
    createSnake();
  }

  function isCollision(newHead) {
    for (let i = 0; i < snake.length; i++) {
      if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }

  $(document).keydown(function (e) {
    switch (e.which) {
      case 37: // Left
        if (direction !== "RIGHT") direction = "LEFT";
        break;
      case 38: // Up
        if (direction !== "DOWN") direction = "UP";
        break;
      case 39: // Right
        if (direction !== "LEFT") direction = "RIGHT";
        break;
      case 40: // Down
        if (direction !== "UP") direction = "DOWN";
        break;
      case 32: // Space (Pause)
        isPaused = !isPaused;
        if (isPaused) {
          clearInterval(gameInterval);
        } else {
          gameInterval = setInterval(moveSnake, speed);
        }
        break;
    }
  });

  reiniciar.click(function () {
    startGame();
  });

  function startGame() {
    createSnake();
    createFood();
    gameInterval = setInterval(moveSnake, speed);
  }

  startGame();
});
