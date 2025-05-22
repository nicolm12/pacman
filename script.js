document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const grid = document.querySelector('.grid');
    const cells = Array.from(grid.querySelectorAll('div'));
    const scoreDisplay = document.getElementById('score');

    // Rutas de las imágenes - REEMPLAZA ESTAS RUTAS CON LAS TUYAS
    const pacmanRightImg = 'Pacman.svg.png';
    const pacmanLeftImg = 'left-pacman.png';
    const pacmanUpImg = 'up-pacman.png';
    const pacmanDownImg = 'down-pacman.png';
    const ghostRedImg = 'ghost-red.png';
    const ghostPinkImg = 'pinky.png';

    // Variables del juego
    const width = 10;
    let pacmanIndex = 11;
    let score = 0;
    let dotsEaten = 0;
    let ghosts = [];
    let pacmanDirection = 'right';
    
    // Mapa de posiciones originales de los puntos
    const dotPositions = [];
    cells.forEach((cell, index) => {
        if (cell.classList.contains('dot')) {
            dotPositions.push(index);
        }
    });

    // Clase del fantasma
    class Ghost {
        constructor(name, startIndex, className, ghostImg, speed = 500) {
            this.name = name;
            this.startIndex = startIndex;
            this.currentIndex = startIndex;
            this.className = className;
            this.ghostImg = ghostImg;
            this.speed = speed;
            this.timerId = null;
            this.directions = [-1, 1, -width, width];
        }

        draw() {
            cells[this.currentIndex].classList.add('ghost', this.className);
            cells[this.currentIndex].style.background = `url('${this.ghostImg}')`;
        }

        erase() {
            cells[this.currentIndex].classList.remove('ghost', this.className);
            cells[this.currentIndex].style.background = '';
        }

        move() {
            const moveGhost = () => {
                const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
                const nextIndex = this.currentIndex + direction;

                // Verificar si el siguiente índice es válido
                if (
                    nextIndex >= 0 &&
                    nextIndex < cells.length &&
                    !cells[nextIndex].classList.contains('wall') &&
                    !cells[nextIndex].classList.contains('ghost')
                ) {
                    this.erase();
                    this.currentIndex = nextIndex;
                    this.draw();

                    // Verificar colisión con Pac-Man
                    if (cells[pacmanIndex].classList.contains('ghost')) {
                        // Fantasma come a Pac-Man - reiniciar juego
                        resetGame();
                    }
                } else {
                    moveGhost();
                }
            };

            this.timerId = setInterval(moveGhost, this.speed);
        }
    }

    // Función para obtener la imagen de Pac-Man según la dirección
    function getPacmanImage() {
        switch (pacmanDirection) {
            case 'right':
                return `url('${pacmanRightImg}')`;
            case 'left':
                return `url('${pacmanLeftImg}')`;
            case 'up':
                return `url('${pacmanUpImg}')`;
            case 'down':
                return `url('${pacmanDownImg}')`;
            default:
                return `url('${pacmanRightImg}')`;
        }
    }

    // Función para actualizar la puntuación
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
    }

    // Función para mover a Pac-Man
    function movePacman(e) {
        // Eliminar Pac-Man de la posición actual
        cells[pacmanIndex].classList.remove('pacman');
        cells[pacmanIndex].style.background = '';

        let direction = 0;

        // Determinar la dirección basada en la tecla presionada
        switch (e.key) {
            case 'ArrowRight':
                direction = 1;
                pacmanDirection = 'right';
                break;
            case 'ArrowLeft':
                direction = -1;
                pacmanDirection = 'left';
                break;
            case 'ArrowUp':
                direction = -width;
                pacmanDirection = 'up';
                break;
            case 'ArrowDown':
                direction = width;
                pacmanDirection = 'down';
                break;
            default:
                cells[pacmanIndex].classList.add('pacman');
                cells[pacmanIndex].style.background = getPacmanImage();
                return;
        }

        // Calcular la nueva posición
        const nextIndex = pacmanIndex + direction;

        // Verificar si la nueva posición es válida (no es una pared)
        if (!cells[nextIndex].classList.contains('wall')) {
            pacmanIndex = nextIndex;
        } else {
            cells[pacmanIndex].classList.add('pacman');
            cells[pacmanIndex].style.background = getPacmanImage();
            return;
        }

        // Añadir Pac-Man a la nueva posición
        cells[pacmanIndex].classList.add('pacman');
        cells[pacmanIndex].style.background = getPacmanImage();

        // Verificar si Pac-Man come un punto
        if (cells[pacmanIndex].classList.contains('dot')) {
            cells[pacmanIndex].classList.remove('dot');
            updateScore(10);
            dotsEaten++;
        }

        // Verificar colisión con fantasmas
        if (cells[pacmanIndex].classList.contains('ghost')) {
            // Fantasma come a Pac-Man - reiniciar juego
            resetGame();
        }
    }

    // Función para reiniciar el juego cuando Pac-Man es atrapado
    function resetGame() {
        // Detener los fantasmas
        ghosts.forEach(ghost => {
            if (ghost.timerId) clearInterval(ghost.timerId);
        });

        // Limpiar el tablero
        cells.forEach(cell => {
            cell.classList.remove('pacman', 'ghost', 'red', 'pink');
            cell.style.background = '';
        });

        // Restaurar todos los puntos
        dotPositions.forEach(index => {
            if (!cells[index].classList.contains('dot')) {
                cells[index].classList.add('dot');
            }
        });

        // Reiniciar variables
        pacmanIndex = 11;
        score = 0;
        dotsEaten = 0;
        scoreDisplay.textContent = '0';
        pacmanDirection = 'right';

        // Reiniciar Pac-Man
        cells[pacmanIndex].classList.add('pacman');
        cells[pacmanIndex].style.background = getPacmanImage();

        // Reiniciar fantasmas
        ghosts = [];
        const blinky = new Ghost('blinky', 35, 'red', ghostRedImg, 300);
        const pinky = new Ghost('pinky', 36, 'pink', ghostPinkImg, 400);
        ghosts = [blinky, pinky];

        // Dibujar y mover fantasmas
        ghosts.forEach(ghost => {
            ghost.draw();
            ghost.move();
        });
    }

    // Iniciar el juego automáticamente
    function initGame() {
        // Añadir Pac-Man al tablero
        cells[pacmanIndex].classList.add('pacman');
        cells[pacmanIndex].style.background = getPacmanImage();

        // Crear fantasmas
        const blinky = new Ghost('blinky', 35, 'red', ghostRedImg, 300);
        const pinky = new Ghost('pinky', 36, 'pink', ghostPinkImg, 400);
        ghosts = [blinky, pinky];

        // Dibujar y mover fantasmas
        ghosts.forEach(ghost => {
            ghost.draw();
            ghost.move();
        });
    }

    // Event listeners
    document.addEventListener('keydown', movePacman);

    // Iniciar el juego automáticamente cuando se carga la página
    initGame();
});