$(document).ready(function () {
  const gameContainer = $("#gameContainer");
  const scoreDisplay = $("score");
  const gameOverDisplay = $("#gama-over");
  const containerSize = 400;
  const snakeSize = 20;
  let snake = [
    {
      x: 0,
      y: 0,
    },
  ];
  let food = [
    {
      x: 0,
      y: 0,
    },
  ];
  let direction = "RIGHT";
  let score = 0;
  let speed = 200;
  let gameInterval;
  let isPaused = false;

  function crateSnake() {
    gameContainer.find(".snake").remove();
    snake.forEach((segment) => {
      gameContainer.append(
        `<div class = "snake" style= "left: ${segment.x}px; top:${segment.y}px;"`
      );
    });
  }

  /*function createFood() {
    let isFoodOnSnake;
    do{
        isFoodOnSnake = false;
        food.x = Math.floor(Math.random() * (containerSize / snakeSize)) * snakeSize;
    }
  }*/

  function startGame() {
    createSnake();
    createFood();
    gameInterval = setInterval();
  }
});
