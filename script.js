// ===== SUPABASE АВТОРИЗАЦИЯ =====
let sb = null;

function getSupabase() {
    if (!sb) {
        sb = supabaseClient;
    }
    return sb;
}

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

document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

function switchMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    var btn = document.getElementById('authBtn');
    var switchText = document.getElementById('switchText');
    if (isLoginMode) {
        btn.textContent = 'Войти';
        switchText.innerHTML = 'Нет аккаунта? <a href="#" onclick="switchMode(event)">Зарегистрироваться</a>';
    } else {
        btn.textContent = 'Зарегистрироваться';
        switchText.innerHTML = 'Уже есть аккаунт? <a href="#" onclick="switchMode(event)">Войти</a>';
    }
}

// ===== ВХОД EMAIL =====
async function handleEmail(e) {
    e.preventDefault();
    var email = document.getElementById('emailInput').value;
    var password = document.getElementById('passwordInput').value;
    var btn = document.getElementById('authBtn');
    var originalText = btn.textContent;

    if (!email || !password) {
        showError('Введите email и пароль');
        return false;
    }
    if (password.length < 6) {
        showError('Пароль минимум 6 символов');
        return false;
    }

    btn.textContent = 'Загрузка...';
    btn.disabled = true;

    try {
        var client = getSupabase();
        if (isLoginMode) {
            var result = await client.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (result.error) {
                if (result.error.message.includes('Invalid login')) {
                    showError('Неверный email или пароль');
                } else if (result.error.message.includes('Email not confirmed')) {
                    showError('Подтвердите email! Проверьте почту.');
                } else {
                    showError(result.error.message);
                }
            } else {
                await createProfileIfNeeded(result.data.user);
                window.location.href = '/dashboard.html';
            }
        } else {
            var result = await client.auth.signUp({
                email: email,
                password: password
            });
            if (result.error) {
                if (result.error.message.includes('already registered')) {
                    showError('Этот email уже зарегистрирован');
                } else {
                    showError(result.error.message);
                }
            } else {
                showSuccess('Проверьте почту для подтверждения!');
                isLoginMode = true;
                btn.textContent = 'Войти';
            }
        }
    } catch (err) {
        showError('Ошибка соединения');
        console.error(err);
    }

    btn.textContent = originalText;
    btn.disabled = false;
    return false;
}

// ===== ПРОФИЛЬ =====
async function createProfileIfNeeded(user) {
    try {
        var client = getSupabase();
        var result = await client.from('users').select('id').eq('id', user.id).single();
        if (result.error && result.error.code === 'PGRST116') {
            await client.from('users').insert({
                id: user.id,
                email: user.email,
                display_name: user.email.split('@')[0],
                charges: 0,
                role: 'user'
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// ===== СООБЩЕНИЯ =====
function showError(msg) {
    removeMessages();
    var form = document.querySelector('.modal-form');
    var div = document.createElement('div');
    div.className = 'auth-message auth-error';
    div.textContent = msg;
    form.appendChild(div);
    setTimeout(function() { div.remove(); }, 5000);
}

function showSuccess(msg) {
    removeMessages();
    var form = document.querySelector('.modal-form');
    var div = document.createElement('div');
    div.className = 'auth-message auth-success';
    div.textContent = msg;
    form.appendChild(div);
    setTimeout(function() { div.remove(); }, 5000);
}

function removeMessages() {
    document.querySelectorAll('.auth-message').forEach(function(m) { m.remove(); });
}

// ===== GOOGLE =====
async function loginGoogle() {
    try {
        var client = getSupabase();
        await client.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'https://anti-mat.ru/dashboard.html' }
        });
    } catch (err) {
        showError('Google вход временно недоступен');
    }
}

// ===== ПРОВЕРКА АВТОРИЗАЦИИ =====
async function checkAuth() {
    try {
        var client = getSupabase();
        var result = await client.auth.getSession();
        if (result.data.session) {
            var loginBtn = document.querySelector('.btn-login');
            if (loginBtn) {
                loginBtn.textContent = 'Личный кабинет';
                loginBtn.onclick = function() {
                    window.location.href = '/dashboard.html';
                };
            }
        }
    } catch (err) {
        console.error(err);
    }
}

// ===== FAQ =====
function toggleFaq(button) {
    var item = button.parentElement;
    var isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(function(el) {
        el.classList.remove('active');
    });
    if (!isActive) item.classList.add('active');
}

// ===== ПРОКРУТКА =====
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== АНИМАЦИЯ =====
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// ===== ЗАПУСК =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.feature-card, .price-card, .faq-item, .tech-card').forEach(function(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    checkAuth();
});
