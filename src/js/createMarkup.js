import ImageApiService from "./apiService.js";
import photoCardMarkup from '../templates/photo-card-markup.hbs';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
defaults.closerHover = false;
import * as basicLightbox from 'basiclightbox';



const galleryRef = document.querySelector('.gallery')
const searchFormRef = document.querySelector('.search-form');
// const loadBtnRef = document.querySelector('.load-button');
const sentinelRef = document.querySelector('.sentinel')


// loadBtnRef.setAttribute('disabled', true);

searchFormRef.addEventListener('submit', imageInputHandler);


const imageApiService = new ImageApiService;
const observer = new IntersectionObserver(onEntry, {
    rootMargin: '100px',
  });


function imageInputHandler(event) {
    event.preventDefault();
    imageApiService.searchQuery = event.currentTarget.elements.query.value;
    imageApiService.resetPage();
    deleteMarkup();
    
    
    if (imageApiService.searchQuery === '') {
        deleteMarkup();
        createError('Please enter something!');
         
        // loadBtnRef.setAttribute('disabled', true);
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
        // loadBtnRef.removeAttribute('disabled');
        // loadBtnRef.addEventListener('click', onLoadMore);
        galleryRef.addEventListener('click', openModal);
        observer.observe(sentinelRef);
    })

};


function openModal(event) {
    if (event.target.localName === 'img') {
        basicLightbox.create(`<img src=${event.target.dataset.source} alt=${event.target.alt}>`).show();
        return;
    }
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
    galleryRef.innerHTML += markup;
}


function deleteMarkup() {
    galleryRef.innerHTML = '';
}

function onEntry(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && imageApiService.searchQuery !== '') {
            imageApiService.fetchImages()
            .then(images => {
        
                createMarkup(photoCardMarkup, images);
                // loadBtnRef.removeAttribute('disabled');
                // loadBtnRef.addEventListener('click', onLoadMore);
                galleryRef.addEventListener('click', openModal);

            })
        }
    })  
}


// function onLoadMore() {
    
//     imageApiService.fetchImages()
//     .then(images => {
//         if(images.length === 0) {
//             createError('Sorry! No more pictures. :(');
//             return;
//         }
        
//         createMarkup(photoCardMarkup, images);
//         scroll();
//     })
// }


// function scroll() {
//     let scrollHeight = Math.max(
//         galleryRef.scrollHeight, document.documentElement.scrollHeight,
//         galleryRef.offsetHeight, document.documentElement.offsetHeight,
//         galleryRef.clientHeight, document.documentElement.clientHeight
//       );
//       window.scrollTo({
//         top: scrollHeight,
//         behavior: 'smooth',
//       });
// }




