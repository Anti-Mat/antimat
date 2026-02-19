/* ============================================
   АНТИМАТ — Скрипты
   ============================================ */

// --- Мобильное меню ---
function toggleMenu() {
    var menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// --- FAQ ---
function toggleFaq(item) {
    var allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(function(el) {
        if (el !== item) el.classList.remove('open');
    });
    item.classList.toggle('open');
}

// --- Демо терминал (анимация строк) ---
function animateDemo() {
    var demoBody = document.getElementById('demoBody');
    if (!demoBody) return;

    var rect = demoBody.getBoundingClientRect();
    if (rect.top > window.innerHeight - 100) return;

    var lines = demoBody.querySelectorAll('.demo-line');
    var alreadyAnimated = demoBody.getAttribute('data-animated');
    if (alreadyAnimated) return;
    demoBody.setAttribute('data-animated', 'true');

    lines.forEach(function(line) {
        var delay = parseInt(line.getAttribute('data-delay')) || 0;
        setTimeout(function() {
            line.classList.add('visible');
        }, delay);
    });
}

// --- Загрузка файла ---
var uploadArea = document.getElementById('uploadArea');
var fileInput = document.getElementById('fileInput');

if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', function() {
        if (fileInput.files[0]) {
            handleFile(fileInput.files[0]);
        }
    });
}

function handleFile(file) {
    var sizeMB = (file.size / 1024 / 1024).toFixed(1);
    var sizeGB = (file.size / 1024 / 1024 / 1024).toFixed(2);
    var sizeText = sizeMB > 1024 ? sizeGB + ' ГБ' : sizeMB + ' МБ';

    // Показываем настройки
    var settings = document.getElementById('uploadSettings');
    var fileInfo = document.getElementById('fileInfo');

    if (uploadArea) uploadArea.style.display = 'none';
    if (settings) settings.style.display = 'block';
    if (fileInfo) fileInfo.textContent = '📁 ' + file.name + ' (' + sizeText + ')';

    updateSummary();
}

// --- Обновление итого ---
function updateSummary() {
    var tariff = document.getElementById('settingTariff');
    var format = document.getElementById('settingFormat');
    var summary = document.getElementById('uploadSummary');
    var btn = document.querySelector('.btn-process');

    if (!tariff || !format) return;

    var charges = {
        'standard': { video: 5, audio: 3, time: '~4 мин' },
        'maximum': { video: 8, audio: 5, time: '~6 мин' },
        'turbo': { video: 12, audio: 8, time: '~3 мин' }
    };

    var t = tariff.value;
    var f = format.value;
    var c = charges[t];
    var cost = f === 'video' ? c.video : c.audio;

    if (summary) {
        summary.innerHTML =
            '<div class="summary-line">Стоимость: <b>' + cost + ' ⚡</b></div>' +
            '<div class="summary-line">Примерное время обработки: <b>' + c.time + '</b></div>' +
            '<div class="summary-line dim">Бонусом: субтитры .srt + таймкоды + полный текст</div>';
    }

    if (btn) {
        btn.textContent = '⚡ Обработать за ' + cost + ' зарядов';
    }
}

// Слушаем изменения настроек
['settingTariff', 'settingFormat', 'settingCensor', 'settingType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', updateSummary);
});

// --- Кнопка "Обработать" ---
function startProcess() {
    // Пока показываем авторизацию (когда бэкенд будет — заменим)
    var settings = document.getElementById('uploadSettings');
    var authBlock = document.getElementById('authBlock');

    if (settings) settings.style.display = 'none';
    if (authBlock) authBlock.style.display = 'block';
}

// --- Вход через Google (заглушка) ---
function loginGoogle() {
    alert('Авторизация через Google будет подключена после запуска бэкенда! Мы работаем над этим 🚀');
}

// --- Калькулятор ---
function updateCalc() {
    var minutes = parseInt(document.getElementById('calcMinutes').value) || 1;
    var tariff = document.getElementById('calcTariff').value;
    var format = document.getElementById('calcFormat').value;

    var base = {
        'standard': { video: 5, audio: 3, speed: 5 },
        'maximum': { video: 8, audio: 5, speed: 4 }
    };

    var t = base[tariff];
    var baseCost = format === 'video' ? t.video : t.audio;

    var multiplier = 1;
    if (minutes > 120) multiplier = 4;
    else if (minutes > 60) multiplier = 3;
    else if (minutes > 30) multiplier = 2;

    var totalCharges = baseCost * multiplier;
    var processingTime = Math.ceil(minutes / t.speed);

    var r = document.getElementById('calcResult');
    if (r) {
        r.innerHTML =
            '<div class="calc-charges">' + totalCharges + ' ⚡</div>' +
            '<div class="calc-time">≈ ' + processingTime + ' мин обработки</div>';
    }
}

// Слушаем изменения калькулятора
['calcMinutes', 'calcTariff', 'calcFormat'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', updateCalc);
        el.addEventListener('change', updateCalc);
    }
});

// --- Анимация появления при скролле ---
function animateOnScroll() {
    var elements = document.querySelectorAll(
        '.step-card, .feature-card, .price-card, .stat-card, .faq-item, .compare-card, .contact-card'
    );
    elements.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });

    // Демо анимация
    animateDemo();
}

// Начальное состояние для анимации
document.addEventListener('DOMContentLoaded', function() {
    var elements = document.querySelectorAll(
        '.step-card, .feature-card, .price-card, .stat-card, .faq-item, .compare-card'
    );
    elements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Запускаем
    setTimeout(animateOnScroll, 100);
    updateCalc();
});

// Скролл
window.addEventListener('scroll', animateOnScroll);

// --- Тень навбара ---
window.addEventListener('scroll', function() {
    var nav = document.querySelector('.nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// --- Плавный скролл ---
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            var navHeight = document.querySelector('.nav').offsetHeight;
            var pos = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        }
    });
});