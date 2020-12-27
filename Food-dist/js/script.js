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

    const getData = async (url) => {       // асинхронная ф-ия которая получае данные из базы данных 
        const res = await fetch(url);

        if (!res.ok) {          // условие, если придет ошибка от сервера
            throw new Error(`could not fetch ${url}, status : ${res.status}`);      // trhrow чтоб выкинуть ошибку
        }

        return await res.json();
    };

    getData(`http://localhost:3000/menu`)       // получаем карточки из базы данных
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {       // получаем объект карточки из базы данных
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();        // создаем конструктор для каждой карточки
            });
        });
    
    // axios.get(`http://localhost:3000/menu`)     // используем axios вместо fetch
    //     .then(data => {
    //         data.data.forEach(({img, altimg, title, descr, price}) => {       // получаем объект карточки из базы данных
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();        // создаем конструктор для каждой карточки
    //         });
    //     });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        sucsess: 'Well Done, we call back you',
        fail: 'ERROR'
    }

    forms.forEach(item => {     // метод для передачи данных на каждую форму, их 2 на сайте
        bindPostData(item);
    });

    const postData = async (url, data) => {       // асинхронная ф-ия которая обрабатывает запрос 
        const res = await fetch(url, {      // await для того чтоб подождать ответ от сервера
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {   // функция для формирования и передачи данных на сервер
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

            // request.setRequestHeader('Content-type', 'application/json'); //это заголовки для метода POST в этом формате они не нужны!!! но нужно для формата JSON!
            const formData = new FormData(form);    // метод для формирования введеных данных на сервер(в ипуте на штмл обязательно должно быть прописано нейм!!)

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.sucsess);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.fail);
            }).finally(() => {
                form.reset();   // метод для сброса заполненной формы
            })
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

    // Fetch API

    // fetch('https://jsonplaceholder.typicode.com/posts', {     // метод который получает данные с сервера(get запрос) / отправляет данные на сервер
    //     method: "POST",         // настройка для отправки данных на сервер(POST)
    //     body: JSON.stringify({name: 'Alex'}),        // отправка объекта в формате JSON
    //     headers: {                              // прописываем заголовки для отправки
    //         'Content-type': 'application/json'
    //     }
    // })   
    // .then(response => response.json())  // метод который переводит json формат в js объект(промис)
    // .then(json => console.log(json));

    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log(res));

    // SLIDER

    const sliders = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          sliderNext = document.querySelector('.offer__slider-next'),
          sliderPrev = document.querySelector('.offer__slider-prev'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          sliderWrapper = document.querySelector('.offer__slider-wrapper'),
          sliderField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(sliderWrapper).width; // получаем ширину окна слайдов
    
    let slideIndex = 1;
    let offset = 0;

    if (sliders.length < 10) {
        total.textContent = `0${sliders.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = sliders.length;
        current.textContent = slideIndex;
    }

    sliderField.style.width = 100 * sliders.length + '%';   // помещаем все слайды на страницу и определяем их ширину 100%

    sliderField.style.display = 'flex';
    sliderField.style.transition = '0.5s all';

    sliderWrapper.style.overflow = 'hidden';

    sliders.forEach(slide => {
        slide.style.width = width;      // добавляем каждому слайду одинаковую ширину
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),    // создаем точки для слайдов
          dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < sliders.length; i++) {
        const dot = document.createElement('li');       // создаем точки для слайдов
        dot.setAttribute('data-slide-to', i + 1);       // привязываем слайды к своим точкам
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    sliderNext.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (sliders.length - 1)) {    // проверка, если долистали до конца возвращаем на первый слайд; slice - для того чтоб из строки с px превратить в число
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);     // перелистываем на следующий слайд при клике на слайдер
        }

        sliderField.style.transform = `translateX(-${offset}px)`;       // смещаем слайды при клике на слайдер влево

        if (slideIndex == sliders.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (sliders.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');      // добавляем не выбранные точки прозрачные
        dots[slideIndex - 1].style.opacity = 1;         // добавляем выбранную активную точку
    });

    sliderPrev.addEventListener('click', () => {
        if (offset == 0) {    // проверка, если долистали до начала, возвращаем на последний слайд; slice - для того чтоб из строки с px превратить в число
            offset = +width.slice(0, width.length - 2) * (sliders.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);     // перелистываем на предидущий слайд при клике на слайдер
        }

        sliderField.style.transform = `translateX(-${offset}px)`;       // смещаем слайды при клике на слайдер влево

        if (slideIndex == 1) {
            slideIndex = sliders.length;
        } else {
            slideIndex--;
        }

        if (sliders.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');      // добавляем не выбранные точки прозрачные
        dots[slideIndex - 1].style.opacity = 1;         // добавляем выбранную активную точку
    });

    dots.forEach(dot => {                           // добавляем переключение слайдов точкам
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);

            sliderField.style.transform = `translateX(-${offset}px)`;

            if (sliders.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');      
            dots[slideIndex - 1].style.opacity = 1;   
        });
    });
});