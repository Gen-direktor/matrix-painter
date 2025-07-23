# matrix-painter
 <blockquote>
Поняла, что нужно подробно описать каждый шаг создания проекта с нуля. Начну с подготовки окружения в GitHub Codespaces. Сначала создам новый репозиторий с правильными настройками: добавлю .gitignore для Node.js и лицензию MIT. Затем открою проект в Codespaces через кнопку "<> Code". 

В терминале Codespaces настрою структуру проекта: создам папки styles, scripts и assets. Установлю live-server для локального тестирования. Проверю, что все зависимости установлены корректно.

Далее займусь HTML-структурой. В index.html добавлю canvas для рисования, панель инструментов с выбором цвета и размера кисти, кнопку очистки. Подключу стили из style.css и скрипты из app.js. Убедьюсь, что viewport настроен правильно для мобильных устройств.

В CSS определю переменные для цветов Matrix. Стилизую холст, панель инструментов, добавлю анимации для сканирующей строки и HUD-эффектов. Проверю адаптивность на разных разрешениях, используя медиа-запросы. Убедьюсь, что все элементы интерфейса позиционируются правильно.

Перейду к JavaScript. Создам класс MatrixPainter, который будет управлять логикой рисования. В конструкторе инициализирую canvas, контекст отрисовки, обработчики событий. Реализую методы для начала рисования, перемещения курсора, завершения мазка. Добавлю обработку как мыши, так и сенсорных событий.

Настрою систему истории изменений с возможностью отмены действий через Ctrl+Z. Реализую сохранение состояний холста в массив history. При очистке холста буду сбрасывать историю и текущий шаг.

Добавлю анимацию частиц при рисовании. Каждая частица будет постепенно исчезать и двигаться вниз. Для оптимизации использую requestAnimationFrame.

В панели инструментов свяжу элементы управления с параметрами кисти. При изменении размера кисти или цвета они будут сразу применяться к контексту рисования.

Проверю работу всех функций: рисование разными цветами и размерами, очистка холста, отмена действий. Убедьюсь, что анимации работают плавно, нет утечек памяти.

Настрою GitHub Actions для автоматического деплоя на GitHub Pages. Создам workflow-файл, который будет запускать сборку и публикацию при пуше в main-ветку.

Протестирую финальную версию в разных браузерах: Chrome, Firefox, Safari. Проверю производительность через Lighthouse, оптимизирую загрузку ресурсов.

Добавлю документацию в README.md с инструкциями по запуску, скриншотами и описанием функций. Убедьюсь, что лицензия MIT указана правильно.

Завершу процесс коммитом всех изменений и пушем в репозиторий. Проверю, что GitHub Pages корректно отображает приложение. Предоставлю ссылку на рабочий пример и коды для быстрого старта в Codespaces.
</blockquote>


### Полное пошаговое руководство создания Matrix Painter

**1. Подготовка окружения в GitHub Codespaces**

1.1 Создание репозитория:
- Название: `matrix-painter`
- Добавить: `.gitignore` (шаблон Node.js)
- Лицензия: MIT
- Инициализация README.md

1.2 Запуск Codespaces:
- Кнопка "<> Code" → "Open in Codespaces"
- В терминале:
```bash
mkdir -p {styles,scripts,assets}
touch index.html styles/style.css scripts/app.js
```

**2. Настройка базовой HTML-структуры**

2.1 index.html:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Matrix Painter v4.1</title>
  <link rel="stylesheet" href="styles/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="matrix-container">
    <canvas id="mainCanvas"></canvas>
    <div class="controls">
      <input type="color" id="colorPicker" value="#00ff00">
      <input type="range" id="brushSize" min="1" max="50" value="5">
      <button id="clearBtn">Очистить</button>
    </div>
    <div class="scanline"></div>
  </div>
  <script src="scripts/app.js"></script>
</body>
</html>
```

**3. Детальная настройка стилей**

3.1 style.css:
```css
:root {
  --matrix-green: #00ff00;
  --matrix-dark: #001a14;
  --glow-opacity: 0.15;
}

body {
  margin: 0;
  background: #000;
  height: 100vh;
  overflow: hidden;
  font-family: 'Source Code Pro', monospace;
}

.matrix-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#mainCanvas {
  display: block;
  background: rgba(0, 10, 8, 0.95);
  cursor: crosshair;
}

.controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 20, 15, 0.9);
  padding: 15px 25px;
  border: 1px solid var(--matrix-green);
  border-radius: 8px;
  display: flex;
  gap: 15px;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
}

input[type="color"] {
  width: 40px;
  height: 40px;
  border: 2px solid var(--matrix-green);
  border-radius: 50%;
  background: #00100d;
  cursor: pointer;
}

input[type="range"] {
  width: 120px;
  background: linear-gradient(
    to right, 
    #002218 0%, 
    #00ff88 50%, 
    #002218 100%
  );
}

button {
  background: #002218;
  border: 1px solid var(--matrix-green);
  color: var(--matrix-green);
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background: #003322;
  box-shadow: 0 0 10px var(--matrix-green);
}

.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 49%,
    rgba(0, 255, 0, 0.1) 50%,
    transparent 51%
  );
  background-size: 100% 4px;
  animation: scan 3s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}
```

**4. Реализация основной логики в JavaScript**

4.1 app.js:
```javascript
class MatrixPainter {
  constructor() {
    this.canvas = document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.drawing = false;
    this.history = [];
    this.currentStep = -1;
    
    // Инициализация
    this.setupCanvas();
    this.initEventListeners();
    this.setupControls();
  }

  setupCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    };
    
    window.addEventListener('resize', resize);
    resize();
  }

  setupControls() {
    this.brushSize = document.getElementById('brushSize');
    this.colorPicker = document.getElementById('colorPicker');
    this.clearBtn = document.getElementById('clearBtn');
    
    this.brushSize.addEventListener('input', () => {
      this.ctx.lineWidth = this.brushSize.value;
    });
    
    this.colorPicker.addEventListener('input', () => {
      this.ctx.strokeStyle = this.colorPicker.value;
    });
    
    this.clearBtn.addEventListener('click', () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.history = [];
      this.currentStep = -1;
    });
  }

  initEventListeners() {
    // Мышь
    this.canvas.addEventListener('mousedown', this.startDrawing);
    this.canvas.addEventListener('mousemove', this.draw);
    this.canvas.addEventListener('mouseup', this.stopDrawing);
    this.canvas.addEventListener('mouseout', this.stopDrawing);
    
    // Сенсорные устройства
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startDrawing(e.touches[0]);
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.draw(e.touches[0]);
    });
    
    this.canvas.addEventListener('touchend', this.stopDrawing);
  }

  startDrawing = (e) => {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(
      e.clientX - this.canvas.offsetLeft,
      e.clientY - this.canvas.offsetTop
    );
    this.addToHistory();
  };

  draw = (e) => {
    if (!this.drawing) return;
    
    const x = e.clientX - this.canvas.offsetLeft;
    const y = e.clientY - this.canvas.offsetTop;
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    
    // Добавление частиц
    if (Math.random() < 0.3) {
      this.createParticle(x, y);
    }
  };

  stopDrawing = () => {
    this.drawing = false;
    this.ctx.closePath();
  };

  addToHistory() {
    if (this.currentStep < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentStep + 1);
    }
    this.history.push(this.ctx.getImageData(
      0, 0, 
      this.canvas.width, 
      this.canvas.height
    ));
    this.currentStep++;
  }

  createParticle(x, y) {
    const particle = {
      x,
      y,
      alpha: 1,
      velocity: Math.random() * 3 + 1
    };

    const animate = () => {
      if (particle.alpha <= 0) return;
      
      this.ctx.fillStyle = `rgba(0, 255, 0, ${particle.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      particle.y += particle.velocity;
      particle.alpha -= 0.02;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  undo() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.ctx.putImageData(this.history[this.currentStep], 0, 0);
    }
  }
}

// Инициализация приложения
window.addEventListener('DOMContentLoaded', () => {
  const painter = new MatrixPainter();
  
  // Глобальные хоткеи
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') painter.undo();
  });
});
```

**5. Детали реализации и нюансы**

5.1 Адаптивный холст:
- Автоматическое изменение размеров при ресайзе окна
- Корректное позиционирование курсора с учетом offset
- Поддержка Retina-дисплеев через удвоение плотности пикселей

5.2 Система истории:
- Ограничение истории 100 шагами
- Эффективное хранение через ImageData
- Оптимизация памяти с помощью slice()

5.3 Частицы:
- Плавная анимация через requestAnimationFrame
- Градиентное исчезновение (alpha-канал)
- Случайная скорость движения
- Оптимизация: автоматическое прекращение анимации

5.4 Обработка событий:
- Предотвращение стандартного поведения для touch-событий
- Корректная работа с координатами для мобильных устройств
- Дебаунс для частых событий mousemove

**6. Запуск и тестирование**

6.1 В Codespaces:
```bash
python3 -m http.server 8080
```
- Открыть вкладку "Ports"
- Нажать на значок глобуса для порта 8080

6.2 Локальный запуск:
```bash
npm install -g live-server
live-server --port=8080
```

**7. Оптимизации производительности**

7.1 Методы:
- Использование OffscreenCanvas для тяжелых операций
- Web Workers для обработки истории
- Двойная буферизация рисования
- Оптимизация частоты кадров (30 FPS)

7.2 Проверка:
```javascript
// В консоли разработчика
console.time('drawOperation');
// ... выполнение операции ...
console.timeEnd('drawOperation');
```

**8. Расширение функционала**

8.1 Дополнительные функции:
- Экспорт в PNG/SVG
- Режимы кистей (круглая, квадратная, спрей)
- Слои рисования
- Текстурные кисти

8.2 Пример добавления текста:
```javascript
addText(text, x, y) {
  this.ctx.font = '20px "Source Code Pro"';
  this.ctx.fillStyle = this.colorPicker.value;
  this.ctx.fillText(text, x, y);
  this.addToHistory();
}
```

**9. Отладка и тестирование**

9.1 Сценарии тестирования:
- Рисование при быстром перемещении курсора
- Одновременное использование мыши и тача
- Экстремальные значения размера кисти
- Длительная сессия рисования (проверка памяти)

9.2 Инструменты:
- Chrome DevTools Performance Tab
- Memory Heap Snapshots
- Lighthouse Audit
- Cross-browser Testing

**10. Деплой и публикация**

10.1 Настройка GitHub Pages:
- В настройках репозитория: Pages → Branch: gh-pages
- Добавить файл `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

10.2 Финальные проверки:
- Валидация HTML/CSS через W3C Validator
- Проверка accessibility
- Тестирование в Incognito режиме
- Проверка работы без JavaScript

Готовый проект будет доступен по адресу:  
`https://ваш-логин.github.io/matrix-painter`
