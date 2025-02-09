$(document).ready(function () {
  const gameContainer = $("#gameContainer");
  const verPuntos = $(".puntos");
  const verGameOver = $(".game-over");
  const containerSize = 400;
  const snakeSize = 20;
  let snake = [{ x: 0, y: 0 }];
  let manzana = { x: 0, y: 0 };
  let direccion = "RIGHT";
  let puntos = 0;
  let speed = 200;
  let intervalo;
  let pausa = false;

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
      manzana.x =
        Math.floor(Math.random() * (containerSize / snakeSize)) * snakeSize;
      manzana.y =
        Math.floor(Math.random() * (containerSize / snakeSize)) * snakeSize;
      snake.forEach((segment) => {
        if (segment.x === manzana.x && segment.y === manzana.y) {
          isFoodOnSnake = true;
        }
      });
    } while (isFoodOnSnake);
    gameContainer.append(
      `<div class="manzana" style="left: ${manzana.x}px; top:${manzana.y}px;"></div>`
    );
  }

  function moveSnake() {
    let newHead = { ...snake[0] };

    switch (direccion) {
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
      clearInterval(intervalo);
      verGameOver.show();
      return;
    }

    if (newHead.x === manzana.x && newHead.y === manzana.y) {
      puntos += 10;
      verPuntos.text(`Puntos: ${puntos}`);
      gameContainer.find(".manzana").remove();
      createFood();
      if (puntos % 50 === 0) {
        speed *= 0.9;
        clearInterval(intervalo);
        intervalo = setInterval(moveSnake, speed);
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
      case 37: // Ixquierada
        if (direccion !== "RIGHT") direccion = "LEFT";
        break;
      case 38: // Arriba
        if (direccion !== "DOWN") direccion = "UP";
        break;
      case 39: // Derecha
        if (direccion !== "LEFT") direccion = "RIGHT";
        break;
      case 40: // abajo
        if (direccion !== "UP") direccion = "DOWN";
        break;
      case 32: // tecla espacio (Pausa)
        pausa = !pausa;
        if (pausa) {
          clearInterval(intervalo);
        } else {
          intervalo = setInterval(moveSnake, speed);
        }
        break;
    }
  });
  function startGame() {
    createSnake();
    createFood();
    intervalo = setInterval(moveSnake, speed);
  }

  startGame();
});
