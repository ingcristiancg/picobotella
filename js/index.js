var prevCoords, currCoords, pivotCoords;
var bottleVector, swipeVector;
var angle = 0;
var isSwiping = false;
var bottle;

function init() {
    updatePivot();
    bottleVector = new Victor(200, 0); // establecer el estado inicial de la botella
    render();
}

$(window).on('mousedown touchstart', function(e) {
    e.stopPropagation();
    e.preventDefault();

    isSwiping = true;

    prevCoords = getCoords(e);
    currCoords = getCoords(e);
});

$(window).on('mouseup touchend', function(e) {
    e.stopPropagation();
    e.preventDefault();

    isSwiping = false;

    // calcula la fuerza en el punto en que el usuario suelta la botella, luego que la gire
    var torque = swipeVector.clone().cross(bottleVector);
    var angle = {
        prev: 0,
        target: torque * 0.075
    }

    TweenLite.from(angle, 2, {
        target: 0,
        onUpdate: function() {
            var step = angle.target - angle.prev;
            bottleVector.rotateDeg(step);
            angle.prev = angle.target;
        },
        onComplete: function() {
            // Hacer cosas cuando la botella deja de girar
        }
    })
})

$(window).on('mousemove touchmove', function(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!isSwiping) return;

    currCoords = getCoords(e);

    // Convierte todas nuestras coordenadas en vectores
    var currVector = new Victor(currCoords.x, currCoords.y);
    var prevVector = new Victor(prevCoords.x, prevCoords.y);
    var pivotVector = new Victor(pivotCoords.x, pivotCoords.y);
    swipeVector = currVector.clone().subtract(prevVector);

    // dibuja el vector de la botella
    bottleVector = currVector.clone().subtract(pivotVector);
    bottleVector.norm().multiply(new Victor(200, 100)).invert();

    prevCoords = currCoords;
})

$(window).on('resize', function(e) {
    // actualiza el pivote al centro de la pantalla
    updatePivot();
});

function render() {
    //Borre la visualización de cualquier vector
    $('body .vector').remove();

    if (swipeVector) renderVector(swipeVector, prevCoords);
    if (bottleVector) {
        renderVector(bottleVector, pivotCoords);
        rotate('#bottle', bottleVector.angleDeg() + 180);
    }

    // girar la botella
    requestAnimationFrame(render);
}

function getCoords(e) {
    var coords = {};

    switch (e.type) {
        case 'mouseup':
        case 'mousedown':
        case 'mousemove':
            coords.x = e.pageX;
            coords.y = e.pageY;
            break;
        case 'touchstart':
        case 'touchmove':
            coords.x = e.originalEvent.touches[0].pageX;
            coords.y = e.originalEvent.touches[0].pageY;
            break;
    }

    return coords;
}

function renderVector(v, translate) {
    // Esta función nos facilita dibujar vectores en la pantalla

    // Crea un nuevo vector div (esencialmente una línea)
    var line = $('<div class="vector" />');

    // Establecer la posición, el ángulo y la longitud de la línea
    line.css({
        left: translate.x,
        top: translate.y,
        height: v.length()
    });
    rotate(line, v.angleDeg());

    $('body').append(line);

    return line;
}

function rotate(el, deg) {
    var angle = deg + 90;

    $(el).css({
        '-ms-transform': 'rotate(' + (angle) + 'deg)',
        '-webkit-transform': 'rotate(' + (angle) + 'deg)',
        'transform': 'rotate(' + (angle) + 'deg)'
    });
}

function updatePivot() {
    pivotCoords = {
        x: $(window).width() / 2,
        y: $(window).height() / 1.6
    };
    $('#pivot').css({
        left: pivotCoords.x,
        top: pivotCoords.y
    })
}

init();

// perfiles

// var people = document.getElementById("people");
// var plength = people.length;
// console.log(plength);
var people = document.getElementById("people");
var persons = document.getElementsByClassName("person");

var position;

function PolygonPosition(n, x, y, r) {
    for (i = 0; i < n; i++) {

        positionX = (x + r * Math.cos(2 * Math.PI * i / n));
        positionY = (y + r * Math.sin(2 * Math.PI * i / n));
        var person = persons[i];
        person.style.background = "#fc2  no-repeat 50% 50%";
        person.style.height = "100px";
        person.style.width = "100px";
        person.style.left = "" + positionX + "px";
        person.style.top = "" + positionY + "px";
    }
}
PolygonPosition(persons.length, people.offsetWidth / 1.4, people.offsetHeight / 7.4, 200);