const CARD_TYPE_NARROW = 'narrow';
const CARD_TYPE_WIDE = 'wide';

/**
 * Содержит набор цветов для заливки страницы
 * @type {Object}
 */
var pageBackgroundColors;

/**
 * Скомпилированный Handlebars шаблон карточки
 * @type {Object}
 */
var cardTemplate;

$(document).ready(function() {
    // Проверяем инициализирована ли переменная cards
    if (cards === undefined) {
        throw "Переменная cards не была инициализирована";
    }

    // Компилируем шаблон карточки
    cardTemplate = Handlebars.compile($('#card-template').html());

    renderAllCards(cards, false);
    // Устанавливаем в качестве первого итема истории, текущий набор карточек
    window.history.replaceState({cards: cards} , '');

    // Получаем переменные, содержащие цвета заливки, которые объявлены в css конфиге (css/config.css)
    var bodyStyles = getComputedStyle(document.body);
    pageBackgroundColors = {
        bodyMouseOverColor: bodyStyles.getPropertyValue('--hover-page-background-color'),
        bodyMouseOutColor: bodyStyles.getPropertyValue('--page-background-color')
    };

    window.addEventListener('popstate', function(event) {
        renderAllCards(window.history.state.cards);
    });

    initAddCardsHotKeys();
});

/**
 * Добавляет карточкуна .wrapper, а так же добавляет на нее соответствующие обработчики
 *
 * @param {string} type Тип карточки, которую требуется добавить
 * @param {bool} pushToHistory Надо ли добавлять текущую карточку в историю
 */
function addCardToWrapper(type, pushToHistory = true)
{
    $('.wrapper').append(cardTemplate({type: type}));
    addListenersOnCards($('.card:last'));

    if (pushToHistory) {
        var cards = window.history.state.cards;
        cards.push({type: type});

        // Сохраняем текущее состояние в истории, для того, чтобы смогли в любой момент вернуться к нему
        window.history.pushState({cards: cards}, ''); // Так как не один браузер пока не поддерживает тайтлы состояний, опускаем его
    }
}

/**
 * Рендерит все карточки на .wrapper-е, перед этим его очищая
 */
function renderAllCards(cards)
{
    // Перерисовываем полностью, так как состояние может меняться не только на предидущее, но и на любое конкретное из истории
    $('.wrapper').empty();

    // Выводим карточки, указанные в массиве cards
    $.each(cards, function(index, card) {
        addCardToWrapper(card.type, false);
    });
}

/**
 * Добавляет обработчики событий для карточек. Для удаления верхней карточки, изменения цвета заливки страницы.
 *
 * @param {jQuery} cards Результат работы jQuery селектора, например: $('.cards')
 */
function addListenersOnCards(cards)
{
    cards.click(function(event) {
        if (!event.shiftKey && !event.altKey) {
            $('.card:last').remove();
        }
    }).mouseover(function () {
        $('body').css('background-color', pageBackgroundColors.bodyMouseOutColor);
    }).mouseout(function () {
        $('body').css('background-color', pageBackgroundColors.bodyMouseOverColor);
    });
}

/**
 * Добавляем обработчки для добавления карточек по клику (в сочетанни с нажатием клавиш)
 */
function initAddCardsHotKeys()
{
    $('html').click(function (event) {
        if (event.shiftKey && event.altKey) {
            addCardToWrapper(CARD_TYPE_WIDE);
        } else if (event.shiftKey) {
            addCardToWrapper(CARD_TYPE_NARROW);
        }
    });
}
