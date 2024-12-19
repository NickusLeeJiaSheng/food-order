document.addEventListener('DOMContentLoaded', function () {

    const today = new Date();
    const day = today.getDate();

    const specialMenu = document.getElementById('special-menu');

    if (day < 26 && day > 5) {
        specialMenu.style.pointerEvents = 'none';
        specialMenu.style.opacity = '0.5';
    }
});