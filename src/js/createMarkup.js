import ImageApiService from "./apiService.js";


import photoCardMarkup from '../templates/photo-card-markup.hbs';
import modal from '../templates/modal.hbs';

import debounce from 'lodash.debounce'

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
defaults.closerHover = false;

const basicLightbox = require('basiclightbox')



const gallerryRef = document.querySelector('.gallery')
const searchFormRef = document.querySelector('.search-form');
const loadBtnRef = document.querySelector('.load-button');



searchFormRef.addEventListener('submit', imageInputHandler);
loadBtnRef.addEventListener('click', onLoadMore);

const imageApiService = new ImageApiService;

function imageInputHandler(event) {
    event.preventDefault();
    imageApiService.searchQuery = event.currentTarget.elements.query.value;

    if (imageApiService.searchQuery === '') {
        deleteMarkup();
        return;
    }

    imageApiService.fetchImages()
    .then(images => {
        if(images.length === 0) {
            deleteMarkup();
            createError('No matches found. Please try again!');
            return;
        }


        createMarkup(photoCardMarkup, images);
        images.map(image => {
            const imgRef = document.querySelector(`[data-id="${image.id}"]`)
            const imgInstance = basicLightbox.create(document.querySelector('.image-big-place'))
            imgRef.addEventListener('click', imgInstance.show)
        })
        // openModal();

        
    })

// function openModal() {
//     const imageRef = document.querySelector('.photo-card')
//         const imgInstance = basicLightbox.create(document.querySelector('.image-big-place'))
//         imageRef.addEventListener('click', imgInstance.show)
// }

};


function onLoadMore() {
    
    imageApiService.fetchImages()
    .then(images => {
        if(images.length === 0) {
            createError('Sorry! No more pictures. :(');
            return;
        }
        
        createMarkup(photoCardMarkup, images);
        scroll();
    })
}


function createError(errorMessage) {
    const myError = error({
        text: errorMessage,
        animation: 'fade',
        shadow: true,
        hide: true,
        delay: 2000
      });
    return myError;
}

function createMarkup(markupCreationFunction, requestResult) {
    const markup = markupCreationFunction(requestResult);
    gallerryRef.innerHTML += markup;
}


function deleteMarkup() {
    gallerryRef.innerHTML = '';
}


function scroll() {
    let scrollHeight = Math.max(
        gallerryRef.scrollHeight, document.documentElement.scrollHeight,
        gallerryRef.offsetHeight, document.documentElement.offsetHeight,
        gallerryRef.clientHeight, document.documentElement.clientHeight
      );
      window.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
}