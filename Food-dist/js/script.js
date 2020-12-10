document.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            //item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) { //i = 0, по дефолту будет присваиватся первому элементу при вызове ф-ии
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2020-12-30';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), // получаем кол во мс от текущей даты до дедлайна
            days = Math.floor(t / (1000 * 60 * 60 * 24)), // получаем кол-во дней из мс до даты math floor для округления
            hours = Math.floor((t / (1000 * 60 * 60) % 24)), //получаем часы %24 для того чтобы получить остаок от суток а не общее кол-во часов
            minutes = Math.floor((t / 1000 / 60) % 60), // получаем минуты %60 для того чтобы кол-во минут не превышало 60
            seconds = Math.floor((t / 1000) % 60); // получаем секунды %60 для того чтобы кол-во секунд не превышало 60

        return { // возвращаем объект чтоб получить наши константы извне функции
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function getZero(num) { // функция для отображения 0 если  число таймера < 10
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(tag, endtime) {
        const timer = document.querySelector(tag),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock(); //вызываем ф-ию чтобы таймер на странице запускался сразу, а не через секнду

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Модальное окно

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; //добавляем стиль на бади чтоб при открытии окна нельзя было скролить страницу, чтоб окно не уезжало
        clearInterval(modalTimerId); // если пользователь уже открыл окно, не открывать опять через таймер
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; //восстанавливаем скролл при закрытии окна
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {      // метод для делегирования событый для закрытия модального окна на крестик, чтоб закрывал динамически созданный крест
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => { // закрыть модальное окно при эскейпе
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) { // проверка что пользователь прокрутил страницу до конца
            openModal();
            window.removeEventListener('scroll', showModalByScroll); //удаляем событие, чтоб окно при скроле открывалось только один раз
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 30;
            this.changeToRub();
        }

        changeToRub() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        '.menu .container'
    ).render();

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        sucsess: 'Well Done, we call back you',
        fail: 'ERROR'
    }

    forms.forEach(item => {     // метод для передачи данных на каждую форму, их 2 на сайте
        postData(item);
    });

    function postData(form) {   // функция для формирования и передачи данных на сервер
        form.addEventListener('submit', (e) => {
            e.preventDefault();     // для отмены перезагрузки страницы при отправки, должна стоять в начале

            const statusMessage = document.createElement('img');     // добавляем картинку спиннер при загрузке отправления формы
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `     
                display: block;
                margin: 0 auto;
            `;  // добавляем стили картинке
            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            request.setRequestHeader('Content-type', 'application/json'); //это заголовки для метода POST в этом формате они не нужны!!! но нужно для формата JSON!
            const formData = new FormData(form);    // метод для формирования введеных данных на сервер(в ипуте на штмл обязательно должно быть прописано нейм!!)

            const object = {};
            formData.forEach(function(value, key){  // метод для перебора данных из form data в обычный объект для JSONа
                object[key] = value;
            });

            const json = JSON.stringify(object);

            request.send(json);     // метод для отправки данных на сервер в формате JSON

            //request.send(formData);     //метод для отправки данных на сервер в формате formData

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.sucsess);
                    form.reset();   // метод для сброса заполненной формы
                    statusMessage.remove();
                } else {
                    showThanksModal(message.fail);
                }
            });
        });
    } 

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();       // ф-ия отвечающая за открытие модальных окон

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);    // добавляем новое модальное окно на страницу

        setTimeout(() => {      // убираем новое модальное окно и заменяем его старым
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal()
        }, 4000);
    }
});