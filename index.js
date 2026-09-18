/* =========================================================
   S3W03 — JavaScript
   Файл: index.js
   Назначение: валидация формы, показ пароля, проверка кнопки
   ========================================================= */

/* ---------- п.5: Объявление переменных ---------- */
const passwordInput = document.getElementById('password');
const submitBtn     = document.getElementById('formSubmitBtn');
const emailInput    = document.getElementById('email');

/* ---------- п.6: Изменение стиля полей по условию ---------- */
/**
 * Меняет цвет рамки поля ввода в зависимости от результата проверки.
 * @param {boolean} condition — прошла ли валидация
 * @param {HTMLElement} element — поле ввода, которому меняем стиль
 */
function validationStyle(condition, element) {
    if (condition) {
        element.style.borderColor = 'green';
    } else {
        element.style.borderColor = 'red';
    }
}

/* ---------- п.7: Функции валидации пароля и email ---------- */
/**
 * Проверяет пароль регулярным выражением:
 * минимум 6 символов, обязательно хотя бы одна цифра,
 * одна строчная, одна заглавная буква и один спецсимвол.
 */
function passwordValidate(password) {
    const regex = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/;
    validationStyle(regex.test(password.value), password);
    return regex.test(password.value);
}

/**
 * Проверяет email регулярным выражением.
 */
function emailValidate(email) {
    const regex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/;
    validationStyle(regex.test(email.value), email);
    return regex.test(email.value);
}

/* ---------- п.8: Включение/выключение кнопки «Отправить» ---------- */
/**
 * Если и email, и пароль валидны — снимаем атрибут disabled с кнопки,
 * иначе — устанавливаем обратно.
 */
function checkInputs() {
    const isEmailValid    = emailValidate(emailInput);
    const isPasswordValid = passwordValidate(passwordInput);

    if (isEmailValid && isPasswordValid) {
        submitBtn.removeAttribute('disabled');
    } else {
        submitBtn.setAttribute('disabled', 'true');
    }
}

/* ---------- п.10: Показ / скрытие пароля по чекбоксу ---------- */
const showPasswordBtn = document.getElementById('showPassword');

function showPassword() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

/* ---------- п.11: Слушатели событий ---------- */
// Проверяем поля при любом изменении их содержимого
passwordInput.addEventListener('change', checkInputs);
emailInput.addEventListener('change', checkInputs);
passwordInput.addEventListener('input', checkInputs);
emailInput.addEventListener('input', checkInputs);

// Показ / скрытие пароля по клику на чекбокс
showPasswordBtn.addEventListener('click', showPassword);

/* ---------- Дополнительно: проверка формы перед отправкой ---------- */
const practiceForm = document.getElementById('practiceForm');
if (practiceForm) {
    practiceForm.addEventListener('submit', function (event) {
        // Если кнопка disabled — не отправляем форму
        if (submitBtn.hasAttribute('disabled')) {
            event.preventDefault();
            alert('Заполните корректно поля Почта и Пароль');
        }
    });
}