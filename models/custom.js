document.addEventListener('DOMContentLoaded', () => {

const active = document.getElementById('popup-active');
const close = document.getElementById('popup-close');
const popup_form = document.querySelector('.createSubUser-popup');
const popup_blur = document.querySelector('.subuser-section');

active.addEventListener('click', () => {
    popup_form.style.left = '50%';
    popup_blur.style.filter = 'blur(3px)'
});

close.addEventListener('click', () => {
    popup_form.style.left = '-50%'
    popup_blur.style.filter = 'none'
});

});