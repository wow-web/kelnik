let rangeCost = $('#range-cost'),
    rangeArea = $('#range-area'),
    resetButton = $('#reset');

changeRangeValues = function(e, ui) {
    let rangeValue = $(e.target).parent().find('.range__value');
    $(rangeValue[0]).text(ui.values[0].toLocaleString('ru-RU'));
    $(rangeValue[1]).text(ui.values[1].toLocaleString('ru-RU'));
};

backRangeValues = function() {
    let rangeCostValue = $(rangeCost).parent().find('.range__value');
    $(rangeCostValue[0]).text(rangeCostOptions.values[0].toLocaleString('ru-RU'));
    $(rangeCostValue[1]).text(rangeCostOptions.values[1].toLocaleString('ru-RU'));
    rangeCost.slider('values', rangeCostOptions.values);

    let rangeAreaValue = $(rangeArea).parent().find('.range__value');
    $(rangeAreaValue[0]).text(rangeAreaOptions.values[0].toLocaleString('ru-RU'));
    $(rangeAreaValue[1]).text(rangeAreaOptions.values[1].toLocaleString('ru-RU'));
    rangeArea.slider('values', rangeAreaOptions.values);
};

getRangeValues = function(range) {
    return range.slider('values');
};

let rangeCostOptions = {
    max: 40000000,
    min: 1000000,
    range: true,
    values: [5500000, 18900000],
    slide: changeRangeValues
};

let rangeAreaOptions = {
    max: 300,
    min: 10,
    range: true,
    values: [33, 123],
    slide: changeRangeValues
};
    
rangeCost.slider(rangeCostOptions);
rangeArea.slider(rangeAreaOptions);

resetButton.on('click', function(e) {
    e.preventDefault();
    backRangeValues();
});

let sort = {
    area: false,
    floor: false,
    cost: false,
    date: true
}

let reverce = false,
    visibleElements = 4;

const buttonMore = $('.catalog__btn-more');


// EventListners кнопки сортировки

$('#table-area .table__btn-top').on('click', function() {
    for (key in sort) {
        sort[key] = false;
        $('.table__th, .table__btn-top, .table__btn-bottom').removeClass('accent');
    }
    sort.area = true;
    reverce = false;
    $(this).addClass('accent');
    $(this).parents('.table__th').addClass('accent');
    changeTable();
});
$('#table-area .table__btn-bottom').on('click', function() {
    for (key in sort) {
        sort[key] = false;
        $('.table__th, .table__btn-top, .table__btn-bottom').removeClass('accent');
    }
    sort.area = true;
    reverce = true;
    $(this).addClass('accent');
    $(this).parents('.table__th').addClass('accent');
    changeTable();
});
$('#table-floor .table__btn-top').on('click', function() {
    for (key in sort) {
        sort[key] = false;
        $('.table__th, .table__btn-top, .table__btn-bottom').removeClass('accent');
    }
    sort.floor = true;
    reverce = false;
    $(this).addClass('accent');
    $(this).parents('.table__th').addClass('accent');
    changeTable();
});
$('#table-floor .table__btn-bottom').on('click', function() {
    for (key in sort) {
        sort[key] = false;
        $('.table__th, .table__btn-top, .table__btn-bottom').removeClass('accent');
    }
    sort.floor = true;
    reverce = true;
    $(this).addClass('accent');
    $(this).parents('.table__th').addClass('accent');
    changeTable();
});
$('#table-cost .table__btn-top').on('click', function() {
    for (key in sort) {
        sort[key] = false;
        $('.table__th, .table__btn-top, .table__btn-bottom').removeClass('accent');
    }
    sort.cost = true;
    reverce = false;
    $(this).addClass('accent');
    $(this).parents('.table__th').addClass('accent');
    changeTable();
});
$('#table-cost .table__btn-bottom').on('click', function() {
    for (key in sort) {
        sort[key] = false;
        $('.table__th, .table__btn-top, .table__btn-bottom').removeClass('accent');
    }
    sort.cost = true;
    reverce = true;
    $(this).addClass('accent');
    $(this).parents('.table__th').addClass('accent');
    changeTable();
});
$('#table-date .table__btn-top').on('click', function() {
    for (key in sort) {
        sort[key] = false;
        $('.table__th, .table__btn-top, .table__btn-bottom').removeClass('accent');
    }
    sort.date = true;
    reverce = false;
    $(this).addClass('accent');
    $(this).parents('.table__th').addClass('accent');
    changeTable();
});
$('#table-date .table__btn-bottom').on('click', function() {
    for (key in sort) {
        sort[key] = false;
        $('.table__th, .table__btn-top, .table__btn-bottom').removeClass('accent');
    }
    sort.date = true;
    reverce = true;
    $(this).addClass('accent');
    $(this).parents('.table__th').addClass('accent');
    changeTable();
});

// Кнопка "показать еще"

buttonMore.on('click', function(e) {
    e.preventDefault();
    changeTable(1, 1, visibleElements + 10);
});

// Сортировка массива

sortArr = function(rooms, costAt, costFor, areaAt, areaFor) {
    let newArr;
    rooms = parseInt(rooms);
    $('.filters input').prop('disabled', true);
    $('.filters button').prop('disabled', true);
    rangeCost.slider('disable');
    rangeArea.slider('disable');
    $.ajax({
        url: 'table.json',
        dataType: 'json',
        async: false,
        success: function (ARR) {
            newArr = ARR.filter(function(i) {
                if (parseInt(i.rooms) === rooms
                && parseInt(i.cost) >= costAt
                && parseInt(i.cost) <= costFor
                && parseFloat(i.area.replace(',','.').replace(' ','')) >= areaAt
                && parseFloat(i.area.replace(',','.').replace(' ','')) <= areaFor) return i;
            });
            $('.filters input').prop('disabled', false);
            $('.filters__checkbox:last-of-type input').prop('disabled', true);
            $('.filters button').prop('disabled', false);
            rangeCost.slider('enable');
            rangeArea.slider('enable');
        }
    });

    if (newArr.length) {
        if (sort.area) {
            newArr.sort(function(prev, next) {
                return parseFloat(prev.area.replace(',','.').replace(' ','')) - parseFloat(next.area.replace(',','.').replace(' ',''))
            })
        }
        else if (sort.floor) {
            newArr.sort(function(prev, next) {
                return parseInt(prev.floor) - parseInt(next.floor)
            })
        }
        else if (sort.cost) {
            newArr.sort(function(prev, next) {
                return parseInt(prev.cost) - parseInt(next.cost)
            })
        }
        else if (sort.date) {
            newArr.sort(function(prev, next) {
                if (Date.parse(prev.date) < Date.parse(next.date)) return -1
                else return 1;
            })
        }
    };

    if (reverce) {
        newArr.reverse();
    };

    if (newArr.length) return newArr
    else return 0;
};

// Вывод таблицы на страницу

printTable = function(tableArr, length) {
    if (tableArr) {
        for (let i = 0; i < length && i < tableArr.length; i++) {
            const tableRow = document.createElement('div');
            tableRow.classList.add('table__row');
            const wrapper = document.createElement('div');
            wrapper.classList.add('table__wrapper');
    
            const tableName = document.createElement('div');
            tableName.classList.add('table__th');
            tableName.innerText = `${tableArr[i].name}`;
            wrapper.append(tableName);
    
            const tableArea = document.createElement('div');
            tableArea.classList.add('table__th');
            tableArea.innerText = `${tableArr[i].area}`;

            const tableAreaHidden = document.createElement('span');
            tableAreaHidden.classList.add('hidden');
            tableAreaHidden.innerText = 'м²';
            tableArea.append(tableAreaHidden);
            wrapper.append(tableArea);
    
            const tableFloor = document.createElement('div');
            tableFloor.classList.add('table__th');
            tableFloor.innerText = `${tableArr[i].floor} `;

            const tableAllFloor = document.createElement('span');
            tableAllFloor.classList.add('gray');
            tableAllFloor.innerText = `из ${tableArr[i].allFloor}`;

            const tableFloorHidden = document.createElement('span');
            tableFloorHidden.classList.add('hidden');
            tableFloorHidden.innerText = 'этаж';
            tableAllFloor.append(tableFloorHidden);

            tableFloor.append(tableAllFloor);
            wrapper.append(tableFloor);
    
            const tableCost = document.createElement('div');
            tableCost.classList.add('table__th');
            tableCost.innerText = `${parseInt(tableArr[i].cost).toLocaleString('ru-RU')}`;
        
            const tableCostHidden = document.createElement('span');
            tableCostHidden.classList.add('hidden');
            tableCostHidden.innerText = '₽';
            tableCost.append(tableCostHidden);

            wrapper.append(tableCost);
    
            const tableImg = document.createElement('div');
            tableImg.classList.add('table__th');
            const img = document.createElement('img');
            img.src = `${tableArr[i].img}`;
            tableImg.append(img);
            tableRow.append(tableImg);
    
            tableRow.prepend(wrapper);
            $('#table').append(tableRow);
        }
        if (tableArr.length <= length) buttonMore.css('display', 'none')
        else buttonMore.css('display', '');
    }
    else {
        const errorMessage = document.createElement('p');
        errorMessage.innerText = 'Нет подходящих объектов';
        $('#table').append(errorMessage);
        buttonMore.css('display', 'none');
    }
};

changeTable = function (el, m, i = visibleElements) {
    let val1 = rangeCost.slider('values'),
        val2 = rangeArea.slider('values'),
        val3 = $('input[name="count"]:checked').val();
    
    let tableArr = sortArr(val3, val1[0], val1[1], val2[0], val2[1]);
    $('#table .table__row, #table p').remove();
    printTable(tableArr, i);
};

$(rangeCost).on('slidechange', changeTable);
$(rangeArea).on('slidechange', changeTable);
$('input[name="count"]').change(changeTable);

changeTable();

// Прокрутка страницы вверх

let scrollTopBtn = $('.catalog__scroll-top');

scrollTopBtn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: 0}, 600);
    return false;
});

$(window).on('scroll', function() {
    if ($(window).scrollTop() > 200) {
        scrollTopBtn.show();
    } else {
        scrollTopBtn.hide();
    }
});