window.onload = function() {

    const showOrRemoveButton = document.querySelectorAll('.show-or-remove-form'),
        addPostForm = document.querySelector('.add-post__form'),
        addPostFormOverlay = document.querySelector('.add-post__overlay'),
        addPostButton = document.querySelector('.add-post'),
        containerPost = document.querySelector('.post__wrapper'),
        deleteAllButton = document.querySelector('.delete-all');
    for (let i = 0; i < showOrRemoveButton.length; i++) { //Кнопок несколько(2), поэтому вешаем событие на каждую
        showOrRemoveButton[i].addEventListener('click', showOrRemoveForm);
    }

    function showOrRemoveForm() { //Отображение\сокрытие формы добавления поста
        addPostForm.classList.toggle('d-none');
        addPostFormOverlay.classList.toggle('d-none');
    }

    addPostButton.addEventListener('click', addPost)
    if (localStorage.getItem('countPost') === null) { // проверка на наличие постов, если нет ключа количества, то он устанавливается
        localStorage.setItem('countPost', 0); // используется для идентификаторов постов
    }
    if (localStorage.getItem('countPost') !== null) { //Если какие-то посты уже есть в хранилище, их надо отрисовать на странице
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (localStorage.key(i) !== 'countPost') { //Исключаем ключ с количеством постов
                let currentPost = JSON.parse(localStorage.getItem(key)); //Преобразование строки JSON в объект 
                containerPost.insertAdjacentHTML('beforeend', `
                    <div class="post" data-postId="${currentPost.id}">
                        <div class="post__title">${currentPost.title}</div>
                        <div class="post__time">Время создания: <span>${currentPost.time}</span></div>
                        <div class="post__time redact">Время редактирования:  <span>${currentPost.redactTime}</span></div>
                        <button class="redact-post button">Отредактировать пост</button>
                        <button class="show-window-post button">Отобразить пост</button>
                    </div>`);
            }
        }
    }
    deleteAllButton.addEventListener('click', () => {
        localStorage.clear();
        containerPost.innerHTML = '';
    });

    function addPost() {
        localStorage.countPost = Number(localStorage.countPost) + 1; //Изменение количества постов 
        let postName = "post" + localStorage.countPost; //Создание уникального ключа для каждого поста 
        let titlePost = document.querySelector('input[name="title"]').value;
        let textPost = document.querySelector('textarea[name="main-text"]').value;
        let timePost = new Date().toLocaleTimeString() + "  " + new Date().toLocaleDateString();
        let timeRadactPost = ''; //Изначально дата редактирования пустая
        localStorage.setItem(postName, JSON.stringify({ id: localStorage.countPost, title: titlePost, text: textPost, time: timePost, redactTime: timeRadactPost }));
        let currentPost = JSON.parse(localStorage[postName]); //Получение данных текущего поста
        containerPost.insertAdjacentHTML('beforeend', `
                    <div class="post" data-postId="${currentPost.id}">
                        <div class="post__title">${currentPost.title}</div>
                        <div class="post__time">Время создания: <span>${currentPost.time}</span></div>
                        <div class="post__time redact">Время редактирования:  <span>${currentPost.redactTime}</span></div>
                        <button class="redact-post button">Отредактировать пост</button>
                        <button class="show-window-post button">Отобразить пост</button>
                    </div>
        `); //Отрисовка только созданного поста
        addPostFormOverlay.classList.add('d-none');
        addPostForm.classList.add('d-none');
    }

    containerPost.addEventListener('click', (e) => {
        if (e.target.classList.contains('redact-post')) { //Делегирование событий. Необходимо, так как изначально кнопки "редактировать" не существует
            let postName = "post" + e.target.parentNode.dataset.postid; //Получение конкретного поста, который будет редактироваться
            let currentPost = JSON.parse(localStorage[postName]);
            containerPost.insertAdjacentHTML('beforeend', `
            <div class="add-post__overlay redact">
            </div>
            <form class="add-post__form redact" action="" method="post">
                        <input class="form__input" value="${currentPost.title}" name="redact-title" type="text" placeholder="Введите новый заголовок поста" >
                        <textarea class="form__textarea" name="redact-main-text" type="text" placeholder="Введите новый основной текст поста">${currentPost.text}</textarea>
                        <button class="button redact-post-button" type="button">Отредактировать пост</button>
                        <button class="button remove-redact-form" type="button">Отмена</button>
            </form>`);
            let removeButton = document.querySelector('.remove-redact-form'),
                redactForm = document.querySelector('.add-post__form.redact'),
                redactFormOverlay = document.querySelector('.add-post__overlay.redact'),
                redactButton = document.querySelector('.redact-post-button');
            removeButton.addEventListener('click', () => {
                containerPost.removeChild(redactForm);
                containerPost.removeChild(redactFormOverlay);
            });
            redactButton.addEventListener('click', () => {
                currentPost.title = document.querySelector('input[name="redact-title"]').value;
                currentPost.text = document.querySelector('textarea[name="redact-main-text"]').value;
                currentPost.redactTime = new Date().toLocaleTimeString() + "  " + new Date().toLocaleDateString();; //Добавление времени регистрации
                localStorage[postName] = JSON.stringify(currentPost); //Обновление данных поста внутри хранилища
                e.target.parentNode.innerHTML = `
                <div class="post__title">${currentPost.title}</div>
                <div class="post__time">Время создания: <span>${currentPost.time}</span></div>
                <div class="post__time redact">Время редактирования: <span>${currentPost.redactTime}</span></div>
                <button class="redact-post button">Отредактировать пост</button>
                <button class="show-window-post button">Отобразить пост</button>`; //Обновление поста в соответсвии с новыми данными на странице
                containerPost.removeChild(redactForm); //После успешного редактирования, форма убирается
                containerPost.removeChild(redactFormOverlay);
            });
        }
        if (e.target.classList.contains('show-window-post')) { //Делегирование событий. Необходимо, так как изначально постов не существует
            let postid = e.target.parentNode.dataset.postid;
            let postName = 'post' + postid;
            let currentPost = JSON.parse(localStorage[postName]);
            containerPost.insertAdjacentHTML('beforeend', `
            <div class="add-post__overlay window-post__overlay"></div>
            <div class="post__window">
                <h1 class="post__title">${currentPost.title}</h1>
                <p class="post__main-text">${currentPost.text}</p>
                <div class="post__time">Время создания: <span>${currentPost.time}</span></div>
                <div class="post__time redact">Время редактирования: <span>${currentPost.time}</span></div>
                <button class="remove-post-window button">Закрыть окно</button>
            </div>
            `);
            document.querySelector('.remove-post-window').addEventListener('click', () => {
                containerPost.removeChild(document.querySelector('.window-post__overlay'));
                containerPost.removeChild(document.querySelector('.post__window'))
            })
        }
    });

}