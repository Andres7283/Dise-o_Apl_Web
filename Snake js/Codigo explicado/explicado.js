$(document).ready(function () {
  // *** INICIALIZACIÓN Y VARIABLES ***

  // jQuery: $(document).ready() es un evento en jQuery que asegura que el código dentro de la función se ejecute solo cuando el DOM haya sido completamente cargado.
  // Esencialmente, espera a que todos los elementos HTML y CSS estén listos antes de ejecutar cualquier otro código de JavaScript.
  // Se utiliza para evitar errores si intentamos manipular elementos HTML antes de que se hayan cargado completamente.
  // Esto es más conveniente que usar el evento de JavaScript puro 'window.onload'.
  // Aquí, se ejecuta el código del juego cuando el DOM está listo.

  const gameContainer = $("#gameContainer"); // jQuery: selecciona el contenedor del juego utilizando el id "gameContainer". Nos devuelve un objeto jQuery que podemos manipular.
  const scoreDisplay = $(".score"); // jQuery: selecciona el elemento con la clase "score" que muestra la puntuación actual del jugador.
  const gameOverDisplay = $(".game-over"); // jQuery: selecciona el elemento con la clase "game-over" que muestra el mensaje cuando el jugador pierde.
  const containerSize = 400; // Definimos el tamaño del área de juego, que será un cuadrado de 400x400 píxeles.
  const snakeSize = 20; // El tamaño de cada segmento de la serpiente, en este caso, cada segmento mide 20x20 píxeles.

  // *** VARIABLES DEL JUEGO ***
  let snake = [{ x: 0, y: 0 }]; // El array 'snake' contiene la serpiente, que comienza con un solo segmento en la posición (0, 0).
  let food = { x: 0, y: 0 }; // La comida es representada como un objeto con las coordenadas (x, y).
  let direction = "RIGHT"; // La dirección inicial de la serpiente es hacia la derecha.
  let score = 0; // La puntuación inicial del jugador.
  let speed = 200; // La velocidad inicial del juego (en milisegundos), el tiempo entre cada movimiento de la serpiente.
  let gameInterval; // Variable para almacenar el identificador del intervalo del juego (usado para detener y reiniciar el juego).
  let isPaused = false; // Indica si el juego está pausado o no.

  // *** FUNCIONES DEL JUEGO ***

  // FUNCION PARA DIBUJAR LA SERPIENTE EN EL JUEGO
  function createSnake() {
    // jQuery: gameContainer.find(".snake").remove() encuentra todos los elementos con la clase "snake" dentro del contenedor de juego y los elimina.
    // Esto se hace para asegurarnos de que no haya duplicados de segmentos de la serpiente cada vez que la volvemos a dibujar.
    gameContainer.find(".snake").remove();

    // Iteramos sobre el array 'snake', donde cada segmento tiene las coordenadas (x, y) de la serpiente.
    snake.forEach((segment) => {
      // jQuery: append() añade un nuevo elemento HTML al final del contenido del contenedor 'gameContainer'.
      // En este caso, añadimos un div con la clase 'snake' y establecemos las posiciones 'left' y 'top' usando las coordenadas del segmento de la serpiente.
      gameContainer.append(
        `<div class="snake" style="left: ${segment.x}px; top: ${segment.y}px;"></div>`
      );
    });
  }

  // FUNCION PARA CREAR LA COMIDA EN UNA POSICIÓN ALEATORIA
  function createFood() {
    let isFoodOnSnake; // Variable para verificar si la comida generada está en la misma posición que un segmento de la serpiente.

    do {
      isFoodOnSnake = false; // Inicialmente, asumimos que la comida no está sobre la serpiente.

      // jQuery: La función Math.random() genera un número aleatorio entre 0 (inclusive) y 1 (exclusivo).
      // Multiplicamos ese número por (containerSize / snakeSize) para que caiga dentro de las posiciones válidas de la cuadrícula.
      // Luego, usamos Math.floor() para redondear hacia abajo al múltiplo más cercano de 'snakeSize', asegurando que la comida esté alineada en la cuadrícula.
      food.x =
        Math.floor(Math.random() * (containerSize / snakeSize)) * snakeSize;
      food.y =
        Math.floor(Math.random() * (containerSize / snakeSize)) * snakeSize;

      // jQuery: recorremos los segmentos de la serpiente para comprobar si la comida generada coincide con la posición de un segmento de la serpiente.
      snake.forEach((segment) => {
        if (segment.x === food.x && segment.y === food.y) {
          // Si la comida está sobre la serpiente, marcamos que la comida está sobre la serpiente y generamos una nueva posición.
          isFoodOnSnake = true;
        }
      });
    } while (isFoodOnSnake); // Si la comida está sobre la serpiente, la volvemos a generar.

    // jQuery: Añadimos un div para la comida en el DOM con las coordenadas generadas de la comida.
    gameContainer.append(
      `<div class="food" style="left: ${food.x}px; top: ${food.y}px;"></div>`
    );
  }

  // FUNCION PARA MOVER LA SERPIENTE
  function moveSnake() {
    // Usamos el operador de propagación {...} para crear una copia de la cabeza de la serpiente (el primer segmento).
    let newHead = { ...snake[0] };

    // *** DETERMINAR LA DIRECCIÓN DE MOVIMIENTO ***
    // La dirección se determina con un switch basado en el valor de la variable 'direction'.
    // Según la dirección, actualizamos las coordenadas de la nueva cabeza de la serpiente.
    switch (direction) {
      case "RIGHT":
        newHead.x += snakeSize; // Si la dirección es "RIGHT", incrementamos 'x' en 'snakeSize'.
        break;
      case "LEFT":
        newHead.x -= snakeSize; // Si la dirección es "LEFT", decrementamos 'x' en 'snakeSize'.
        break;
      case "UP":
        newHead.y -= snakeSize; // Si la dirección es "UP", decrementamos 'y' en 'snakeSize'.
        break;
      case "DOWN":
        newHead.y += snakeSize; // Si la dirección es "DOWN", incrementamos 'y' en 'snakeSize'.
        break;
    }

    // *** COMPROBACIÓN DE COLISIONES ***
    // Comprobamos si la nueva cabeza de la serpiente colisiona con los bordes del contenedor o con su propio cuerpo.
    // Si ocurre alguna colisión, el juego termina.
    if (
      newHead.x >= containerSize || // Si la cabeza se mueve fuera del borde derecho.
      newHead.x < 0 || // Si la cabeza se mueve fuera del borde izquierdo.
      newHead.y >= containerSize || // Si la cabeza se mueve fuera del borde inferior.
      newHead.y < 0 || // Si la cabeza se mueve fuera del borde superior.
      isCollision(newHead) // Si la nueva cabeza colisiona con cualquier segmento del cuerpo de la serpiente.
    ) {
      clearInterval(gameInterval); // Si hay colisión, detenemos el juego.
      gameOverDisplay.show(); // Mostramos el mensaje de "Game Over".
      return; // Salimos de la función.
    }

    // *** COMPROBACIÓN DE COMIDA ***
    // Si la cabeza de la serpiente coincide con la comida (es decir, las coordenadas son iguales), incrementamos la puntuación.
    if (newHead.x === food.x && newHead.y === food.y) {
      score += 10; // Incrementamos la puntuación en 10.
      scoreDisplay.text(`Score: ${score}`); // Actualizamos el marcador de puntuación en la pantalla.

      // Eliminamos la comida actual y generamos una nueva.
      gameContainer.find(".food").remove();
      createFood();

      // Si el jugador alcanza una puntuación múltiplo de 50, el juego se acelera (disminuye el intervalo entre movimientos).
      if (score % 50 === 0) {
        speed *= 0.9; // Acelera el juego (disminuye el tiempo entre cada movimiento).
        clearInterval(gameInterval); // Detenemos el intervalo actual.
        gameInterval = setInterval(moveSnake, speed); // Reiniciamos el intervalo con la nueva velocidad.
      }
    } else {
      // Si no ha comido, eliminamos el último segmento de la serpiente (la cola).
      snake.pop();
    }

    // Agregamos el nuevo segmento (la cabeza) al principio de la serpiente.
    snake.unshift(newHead);

    // Redibujamos la serpiente con su nueva posición.
    createSnake();
  }

  // FUNCIÓN PARA COMPROBAR COLISIONES CON EL CUERPO DE LA SERPIENTE
  function isCollision(newHead) {
    // Recorremos todos los segmentos del cuerpo de la serpiente (excepto la cabeza).
    for (let i = 0; i < snake.length; i++) {
      // Si la nueva cabeza coincide con cualquier segmento del cuerpo, hay una colisión.
      if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
        return true; // Retorna 'true' si hay colisión.
      }
    }
    return false; // Retorna 'false' si no hay colisión.
  }

  // *** EVENTOS DE TECLADO ***

  // Capturamos eventos de teclado para mover la serpiente y pausar el juego.
  $(document).keydown(function (e) {
    switch (e.which) {
      case 37: // Flecha izquierda
        if (direction !== "RIGHT") direction = "LEFT"; // Evita que la serpiente vaya en la dirección opuesta.
        break;
      case 38: // Flecha arriba
        if (direction !== "DOWN") direction = "UP"; // Evita que la serpiente vaya en la dirección opuesta.
        break;
      case 39: // Flecha derecha
        if (direction !== "LEFT") direction = "RIGHT"; // Evita que la serpiente vaya en la dirección opuesta.
        break;
      case 40: // Flecha abajo
        if (direction !== "UP") direction = "DOWN"; // Evita que la serpiente vaya en la dirección opuesta.
        break;
      case 32: // Barra espaciadora (para pausar o reanudar el juego)
        isPaused = !isPaused; // Alterna entre pausar o reanudar el juego.
        if (isPaused) {
          clearInterval(gameInterval); // Si se está pausando, detiene el intervalo.
        } else {
          gameInterval = setInterval(moveSnake, speed); // Si se reanuda, reinicia el intervalo del juego.
        }
        break;
    }
  });

  // *** FUNCIONES DE INICIO DEL JUEGO ***

  function startGame() {
    // Reseteamos el estado del juego al inicio.
    gameOverDisplay.hide(); // Oculta el mensaje de "Game Over" si estaba visible.
    score = 0; // Reinicia la puntuación.
    scoreDisplay.text(`Score: ${score}`); // Actualiza el marcador de puntuación a 0.
    snake = [{ x: 0, y: 0 }]; // Reinicia la serpiente a un solo segmento en la posición (0, 0).
    direction = "RIGHT"; // Resetea la dirección a "RIGHT".
    createSnake(); // Dibuja la serpiente inicial.
    createFood(); // Genera la primera comida.
    gameInterval = setInterval(moveSnake, speed); // Inicia el bucle del juego con la velocidad inicial.
  }

  // *** INICIO DEL JUEGO ***
  startGame(); // Llama a la función para iniciar el juego.
});
