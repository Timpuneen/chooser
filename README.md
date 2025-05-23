# Chooser

[👉 Ознакомиться с приложением](https://chooser-sepia.vercel.app/)

## Описание проекта

**Chooser** - это веб-приложение, основной задачей которого является случайный выбор одного из игроков, приложивших палец к экрану

## Подробнее: 
- В Chooser вы можете выбрать количество игроков от 2 до 5, 
- Выбрать режим игры: на выбывание и не на выбывание, 
- А так же тип игры: с заданиями и простой
 
# ![Настройки](./readme%20images/settings.jpg)
- Более того, у вас есть возможность выбрать сложность заданий 
- И воспользоваться возможностью использовать AI для генерации заданий
  
### Следующий этап: ожидание игроков, только после того как необходимое количество игроков приложат пальцы к экрану начнется загрузка и переход к следующему этапу
# ![Тач](./readme%20images/touch1.jpg)
# ![Тач](./readme%20images/touch2.jpg)
# ![Тач](./readme%20images/touch3.jpg)
### Игра: когда все игроки уже готовы состязаться в выполнении заданий или же просто выяснить кто прав благодаря счастливой случайности, мы можем нажать на кнопку и начнется игра
 
В конце же, если был выбран режим игры - на выбывание, остается один игрок - победитель, после его обнаружения игра считается законченной
# ![Игра](./readme%20images/game1.jpg)
# ![Игра](./readme%20images/game2.jpg)
# ![Игра](./readme%20images/win.jpg)
### Пару слов про дизайн: приложение выполнено в приятном минималистичном дизайне, интуитивно-понятном для любого пользователя
# 
### Хоть приложение изначально и разрабатывалось на телефон, вы так же можете использовать его и на своем компьютере, просто иммитируя нажатия на экран нажатиями специальных клавиш
#
### Так же у вас есть возможность установить это приложение как PWA, то есть вы можете установить его себе на устройство как самостоятельное приложение, без строки поиска и тд
 Пример как это сделать в мобильной версии Chrome: три точки в правом верхнем углу экрана -> установить на главный экран
 В десктопной версии Chrome у вас не заходя никуда в правом верхнем углу экрана появится кнопка для установки 
# ![PC](./readme%20images/pc.png)
## Стэк использованных технологий:
### основа основ проекта - это сочетание FastAPI для бэкенда и React для фронтенда

 Если же говорить более подробно, то для Backend использовались:
 FastAPI - в силу своей простоты и набирающей обороты популярности
 PostgreSQL - база для храненения игровых заданий
 SQLAlchemy + Pydantic — ORM и валидация данных.
 OpenAI API — для генерации AI-заданий

### Frontend:
 React с использованием TypeScript - простая и удобная связка
 Tailwind CSS — для быстрого и гибкого стилизования
 Framer Motion — для анимаций
 Vite — сборщик проекта

## Deploy:
### Frontend: Vercel
### Backend: Railway
### PostgreSQL: Railway
# ![Vercel](./readme%20images/vercel.png)
# ![Railway](./readme%20images/railway.png)
 Проектировка и создание проекта были не без трудностей, например, механизм настройки игры и реакции на прикосновения к экрану полностью перерабатывался три раза, 
 однако это не помешало достигнуть имеющегося результата
 Основную сложность для разработки представлял: браузер

### строка поиска - пришлось помучится чтобы при ее появлении и исчезании дизайн продолжал сохранять свой внешний вид
 Переход на альбомную ориентацию - было предпринято решение создать специальное модальное окно с просьбой о переходе на портретную ориентацию
 Так же не мало было проблем с регистрацией кликов по экрану, тк мобильному браузеру тяжело обрабатывать свыше 3 одновременных кликов(тапов) на небольшом расстоянии друг от друга
 Так же была проведена оптимизация анимаций касаний с помощью Framer Motion.
 Применение PWA технологий
 Использование поп-ап экранов для отображения заданий, победителя и информации с правилами игры

## Инструкция по установке:
### Шаг 1: клонирование репозитория
 (должен быть установлен GIT)
 - git clone https://github.com/Timpuneen/chooser.git
 - cd chooser
 - там нас ждут папки chooser-backend и chooser-frontend
### Шаг 2: Back
 Для установки Backend:
 (необходимо: python+pip)
 - cd backend
 - Создать виртуальное окружение:
 - python -m venv venv
 - активировать его:
 - venv\Scripts\activate
 - После чего установить необходимые зависимости:
 - pip install -r requirements.txt
 - Создайте .env файл в директории backend/
 - -Пропишите там необходимые переменные окружения:
 - DATABASE_URL=...
 - OPENAI_API_KEY=...
 - Запустить сервер из директории backend/
 - uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 - откроет сервер для локальной сети
### Шаг 3: Front
 cd frontend
 создать файл .env и прописать в нем:
 VITE_API_URL=https://...
 npm run dev - запускаем
 Вот и все, на этом процесс установки завершен

## Далее можете ознакомиться с [demo review](https://www.youtube.com/shorts/CU8v7ZN5CbQ) проекта
## [desktop review](https://youtu.be/u8WuD0pM59M)
<div align="center">
  <a href="https://www.youtube.com/shorts/CU8v7ZN5CbQ">
    <img src="/readme images/rev.png" target="_blank" alt="review" width="512"/>
  </a>
</div>

### Моя почта - timpuh_work@mail.ru