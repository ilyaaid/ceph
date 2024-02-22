import canvas from './canvas.js';

var isDragging = false;
var lastPosX = 0;
var lastPosY = 0;

canvas.canvas.on('mouse:wheel', function (opt) {
    let zoom = canvas.canvas.getZoom()
    let speed = 0.06 * zoom
    zoom += (opt.e.deltaY > 0 ? -speed : speed);
    zoom = Math.max(0.5, zoom); //Minimum is 1/10
    zoom = Math.min(5, zoom); //The maximum is 3 times
    let zoomPoint = new fabric.Point(opt.e.offsetX, opt.e.offsetY); //  Center point
    canvas.canvas.zoomToPoint(zoomPoint, zoom);
})

canvas.canvas.on('mouse:down', function (options) {
    var evt = options.e;
    if (evt.button == 0) {
        isDragging = true;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
    }
});

canvas.canvas.on('mouse:move', function (options) {
    if (isDragging) {
        var evt = options.e;
        var deltaX = evt.clientX - lastPosX;
        var deltaY = evt.clientY - lastPosY;
        canvas.canvas.relativePan({ x: deltaX, y: deltaY });
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
    }
});

canvas.canvas.on('mouse:up', function (options) {
    isDragging = false;
});
