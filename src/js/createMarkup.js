import ImageApiService from "./apiService.js";

import photoCardMarkup from '../templates/photo-card-markup.hbs';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
defaults.closerHover = false;

import * as basicLightbox from 'basiclightbox';



const gallerryRef = document.querySelector('.gallery')
const searchFormRef = document.querySelector('.search-form');
const loadBtnRef = document.querySelector('.load-button');


loadBtnRef.setAttribute('disabled', true);
searchFormRef.addEventListener('submit', imageInputHandler);


const imageApiService = new ImageApiService;

function imageInputHandler(event) {
    event.preventDefault();
    imageApiService.searchQuery = event.currentTarget.elements.query.value;
    imageApiService.resetPage();
    deleteMarkup();

    if (imageApiService.searchQuery === '') {
        deleteMarkup();
        loadBtnRef.setAttribute('disabled', true);
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
        loadBtnRef.removeAttribute('disabled');
        loadBtnRef.addEventListener('click', onLoadMore);
        gallerryRef.addEventListener('click', openModal) 
    })
};

function openModal(event) {
    if (event.target.localName === 'img') {
        basicLightbox.create(`<img src=${event.target.id}>`).show();
        return;
    }
}

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