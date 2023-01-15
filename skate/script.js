const botaoMenu= document.querySelector('.cabecalho_menu');
const menu = document.querySelector('.menu-lateral');

botaoMenu.addEventListener('click', () =>{
    menu.classList.toggle('menu-lateral-ativo')
})