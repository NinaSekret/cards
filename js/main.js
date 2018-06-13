const CARD_TYPE_NARROW = 'narrow';
const CARD_TYPE_WIDE = 'wide';

/**
 * Содержит набор цветов для заливки страницы
 */
var pageBackgroundColors;

$(document).ready(function() {
	// Проверяем инициализирована ли переменная cards
	if (cards === undefined) {
		throw "Переменная cards не была инициализирована";
	}

    // Компилируем шаблон карточки
	var cardTemplate = Handlebars.compile($('#card-template').html());
    var wrapper = $('.wrapper');

	// Выводим карточки, указанные в массиве cards
	$.each(cards, function(index, card) {
		wrapper.append(cardTemplate({type: card.type}));
	});
    addListenersOnCards($('.card'));

    // Получаем переменные, содержащие цвета заливки, которые объявлены в css конфиге (css/config.css)
    var bodyStyles = getComputedStyle(document.body);
    pageBackgroundColors = {
        bodyMouseOverColor: bodyStyles.getPropertyValue('--hover-page-background-color'),
        bodyMouseOutColor: bodyStyles.getPropertyValue('--page-background-color')
    };

    // Добавляем обработчки дял добавления карточек по клику (в сочетанни с нажатием клавишь)
    $('html').click(function (event) {
        if (event.shiftKey && event.altKey) {
            wrapper.append(cardTemplate({type: CARD_TYPE_WIDE}));
            addListenersOnCards($('.card:last'));
        } else if (event.shiftKey) {
            wrapper.append(cardTemplate({type: CARD_TYPE_NARROW}));
            addListenersOnCards($('.card:last'));
        }
    });
});

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
