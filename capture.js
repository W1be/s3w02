/* =========================================================
   S3W03 JS — capture.js
   Работа с камерой: запрос доступа, захват кадра,
   обработка ползунков (width, brightness, opacity, contrast, saturate)
   Написано по пунктам 18–24 методички.
   ========================================================= */

(function () {
    /* ---------- п.19: Объявление переменных ---------- */
    let width       = 320;    // итоговая ширина изображения
    let height      = 0;      // вычисляется по пропорциям видеопотока
    let streaming   = false;  // активен ли видеопоток
    let video       = null;   // ссылка на <video>
    let canvas      = null;   // ссылка на <canvas>
    let photo       = null;   // ссылка на <img> (создаём, если нет)
    let startbutton = null;   // ссылка на кнопку "Take photo"

    /* ---------- п.20: Запуск камеры, инициализация ---------- */
    function startup() {
        console.log('[capture.js] startup() запущен');

        // Получаем ссылки на элементы
        video       = document.getElementById('video');
        canvas      = document.getElementById('canvas');
        startbutton = document.getElementById('startbutton');
        photo       = document.getElementById('photo');

        // Если <img id="photo"> нет в разметке — создаём динамически
        if (!photo && canvas && canvas.parentNode) {
            photo = document.createElement('img');
            photo.id  = 'photo';
            photo.alt = 'Captured photo';
            canvas.parentNode.insertBefore(photo, canvas.nextSibling);
        }

        // Проверяем, все ли элементы найдены
        if (!video || !canvas || !startbutton || !photo) {
            console.error('[capture.js] ОШИБКА: не найдены элементы:', {
                video, canvas, startbutton, photo
            });
            return;
        }

        console.log('[capture.js] Все элементы найдены. Запрашиваем камеру...');

        // Запрос доступа к камере
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                console.log('[capture.js] Камера получена:', stream);
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.error('[capture.js] Ошибка getUserMedia:', err.name, err.message);
            });

        // Событие canplay — когда видео готово к воспроизведению
        video.addEventListener(
            'canplay',
            function () {
                console.log('[capture.js] canplay, размеры:', video.videoWidth, 'x', video.videoHeight);

                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    // Если не удалось вычислить высоту — берём пропорцию 4:3
                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }

                    video.setAttribute('width', width);
                    video.setAttribute('height', height);
                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);

                    streaming = true;
                }
            },
            false
        );

        // Клик по кнопке "Take photo"
        startbutton.addEventListener(
            'click',
            function (ev) {
                console.log('[capture.js] Кнопка Take photo нажата');
                takepicture();
                ev.preventDefault();
            },
            false
        );

        // Очищаем canvas и ставим заглушку в photo
        clearphoto();
    }

    /* ---------- п.21: Очистка canvas и заглушка ---------- */
    function clearphoto() {
        const context = canvas.getContext('2d');
        context.fillStyle = '#AAA';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    /* ---------- п.22: Захват кадра из видеопотока ---------- */
    function takepicture() {
        const context = canvas.getContext('2d');

        if (width && height) {
            canvas.width  = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
            photo.style.display = 'block';

            console.log('[capture.js] Кадр захвачен, фото сохранено');
        } else {
            clearphoto();
        }
    }

    /* ---------- п.23: Обработка ползунков ---------- */

    // --- width: ширина видео и canvas ---
    const currentWidth = document.getElementById('range_width');
    if (currentWidth) {
        currentWidth.addEventListener('change', function () {
            width = parseInt(currentWidth.value, 10);
            height = video.videoHeight / (video.videoWidth / width);
            video.width  = width;
            video.height = height;
        });
    }

    // --- brightness: яркость ---
    const brightness = document.getElementById('range_brightness');
    if (brightness) {
        brightness.addEventListener('input', function () {
            const value = brightness.value / 100;
            video.style.filter  = `brightness(${value})`;
            canvas.style.filter = `brightness(${value})`;
        });
    }

    // --- opacity: прозрачность ---
    const opacity = document.getElementById('range_opacity');
    if (opacity) {
        opacity.addEventListener('input', function () {
            const value = opacity.value / 100;
            video.style.opacity  = value;
            canvas.style.opacity = value;
        });
    }

    // --- contrast: контраст ---
    const contrast = document.getElementById('range_contrast');
    if (contrast) {
        contrast.addEventListener('input', function () {
            const value = contrast.value / 100;
            video.style.filter  = `contrast(${value})`;
            canvas.style.filter = `contrast(${value})`;
        });
    }

    // --- saturate: насыщенность ---
    const saturate = document.getElementById('range_saturate');
    if (saturate) {
        saturate.addEventListener('input', function () {
            const value = saturate.value / 100;
            video.style.filter  = `saturate(${value})`;
            canvas.style.filter = `saturate(${value})`;
        });
    }

    /* ---------- п.24: Запуск при загрузке страницы ---------- */
    window.addEventListener('load', startup, false);
})();