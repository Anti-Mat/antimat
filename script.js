// ===== МОДАЛЬНОЕ ОКНО =====
let isLoginMode = true;

function openModal() {
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Закрытие по клику на фон
document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Переключение Войти / Регистрация
function switchMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    const btn = document.getElementById('authBtn');
    const switchText = document.getElementById('switchText');
    
    if (isLoginMode) {
        btn.textContent = 'Войти';
        switchText.innerHTML = 'Нет аккаунта? <a href="#" onclick="switchMode(event)">Зарегистрироваться</a>';
    } else {
        btn.textContent = 'Зарегистрироваться';
        switchText.innerHTML = 'Уже есть аккаунт? <a href="#" onclick="switchMode(event)">Войти</a>';
    }
}

// Обработка email формы (заглушка)
function handleEmail(e) {
    e.preventDefault();
    alert('Авторизация через email будет доступна скоро! Пока используйте Google.');
    return false;
}

// Вход через Google (заглушка)
function loginGoogle() {
    alert('Авторизация через Google будет подключена скоро!');
}

// ===== FAQ =====
function toggleFaq(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    // Закрываем все
    document.querySelectorAll('.faq-item').forEach(function(el) {
        el.classList.remove('active');
    });
    
    // Открываем нажатый (если был закрыт)
    if (!isActive) {
        item.classList.add('active');
    }
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ =====
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', function() {
    var cards = document.querySelectorAll('.feature-card, .price-card, .faq-item');
    cards.forEach(function(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});
