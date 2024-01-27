// Go to top button
window.addEventListener('scroll', function () {
    var heroHeight = document.getElementById('hero').offsetHeight;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var goTopButton = document.getElementById('go-top');

    if (scrollTop > heroHeight) {
        goTopButton.style.display = 'block';
    } else {
        goTopButton.style.display = 'none';
    }
});

document.getElementById('go-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Set the year automatically
document.getElementById('year').innerHTML = new Date().getFullYear();

// Menu button
document.getElementById('menu-button').addEventListener('click', function () {
    const menu = document.getElementById('menu');
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
    } else {
        menu.classList.add('open');
    }
});

// Dark mode
document.getElementById('dark-mode-toggle').addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});