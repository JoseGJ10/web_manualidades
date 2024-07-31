const menu = document.querySelector('.menu');
const openMenuButton = document.querySelector('.open-menu');
const closeMenuButton = document.querySelector('.close-menu');

function toggleMenu() {
    menu.classList.toggle('menu_opened')
}

openMenuButton.addEventListener('click', toggleMenu);
closeMenuButton.addEventListener('click', toggleMenu);

const menuLinks = document.querySelectorAll('.menu a[href^="#"]');

const observer = new IntersectionObserver((entries) =>{
    entries.forEach((entry) => {
        const id = entry.target.getAttribute('id')
        const menuLink = document.querySelector(`.menu a[href="#${id}"]`)

        if(entry.isIntersecting) {
            document.querySelector('.menu a.selected').classList.remove('selected')
            menuLink.classList.add('selected');

        }
    })
},{rootMargin: "-50% 0px -50% 0px"});

menuLinks.forEach(menuLink => {
    menuLink.addEventListener('click', function () {
        menu.classList.remove('menu_opened');
    });

    const hash = menuLink.getAttribute("href");
    const target = document.querySelector(hash);
    if(target){
        observer.observe(target);
    }
});

