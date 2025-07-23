class MatrixPainter {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.drawing = false;
        this.history = [];
        this.currentStep = -1;
        this.particles = [];
        this.brush = {
            size: 5,
            color: '#00ff00'
        };

        this.initCanvas();
        this.initEventListeners();
        this.setupControls();
        this.setupHistory();
    }

    initCanvas() {
        const setCanvasSize = () => {
            this.canvas.width = window.innerWidth * window.devicePixelRatio;
            this.canvas.height = window.innerHeight * window.devicePixelRatio;
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
        };

        window.addEventListener('resize', () => {
            setCanvasSize();
            this.restoreFromHistory();
        });

        setCanvasSize();
    }

    setupControls() {
        this.brushSize = document.getElementById('brushSize');
        this.colorPicker = document.getElementById('colorPicker');
        this.clearBtn = document.getElementById('clearBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.brushSizeValue = document.getElementById('brushSizeValue');

        // Инициализация значений
        this.brushSize.value = this.brush.size;
        this.brushSizeValue.textContent = `${this.brush.size}px`;
        this.colorPicker.value = this.brush.color;

        // Обработчики событий
        this.brushSize.addEventListener('input', (e) => {
            this.brush.size = e.target.value;
            this.brushSizeValue.textContent = `${e.target.value}px`;
        });

        this.colorPicker.addEventListener('input', (e) => {
            this.brush.color = e.target.value;
        });

        this.clearBtn.addEventListener('click', () => this.clearCanvas());
        this.undoBtn.addEventListener('click', () => this.undo());

        // Глобальные горячие клавиши
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') this.undo();
        });
    }

    initEventListeners() {
        const getCanvasCoords = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            let clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        };

        // Обработчики для мыши
        this.canvas.addEventListener('mousedown', (e) => {
            this.startDrawing(getCanvasCoords(e));
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.draw(getCanvasCoords(e));
        });

        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

        // Обработчики для сенсорных устройств
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(getCanvasCoords(e.touches[0]));
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(getCanvasCoords(e.touches[0]));
        });

        this.canvas.addEventListener('touchend', () => this.stopDrawing());
    }

    startDrawing(pos) {
        this.drawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineWidth = this.brush.size;
        this.ctx.strokeStyle = this.brush.color;
        this.addToHistory();
    }

    draw(pos) {
        if (!this.drawing) return;

        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);

        // Добавление частиц
        if (Math.random() < 0.3) {
            this.createParticle(pos.x, pos.y);
        }
    }

    stopDrawing() {
        if (this.drawing) {
            this.drawing = false;
            this.ctx.closePath();
            this.addToHistory();
        }
    }

    setupHistory() {
        this.history = [];
        this.currentStep = -1;
        this.addToHistory();
    }

    addToHistory() {
        if (this.currentStep < this.history.length - 1) {
            this.history.length = this.currentStep + 1;
        }
        
        const imageData = this.ctx.getImageData(
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
        
        this.history.push(imageData);
        this.currentStep++;
        
        if (this.history.length > 20) {
            this.history.shift();
            this.currentStep--;
        }
    }

    restoreFromHistory() {
        if (this.history[this.currentStep]) {
            this.ctx.putImageData(this.history[this.currentStep], 0, 0);
        }
    }

    undo() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.restoreFromHistory();
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setupHistory();
    }

    createParticle(x, y) {
        const particle = {
            x: x / window.devicePixelRatio,
            y: y / window.devicePixelRatio,
            alpha: 1,
            velocity: Math.random() * 2 + 1
        };

        const animate = () => {
            if (particle.alpha <= 0) return;

            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = this.brush.color;
            this.ctx.beginPath();
            this.ctx.arc(
                particle.x, 
                particle.y, 
                this.brush.size / 4, 
                0, 
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.restore();

            particle.y += particle.velocity;
            particle.alpha -= 0.02;

            requestAnimationFrame(animate);
        };

        animate();
    }
}

// Инициализация приложения
window.addEventListener('load', () => {
    new MatrixPainter();
});
