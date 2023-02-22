import SimpleLightbox from "simplelightbox";
import fetchImages from "./js/getImages"; 
import 'simplelightbox/dist/simple-lightbox.min.css';
import { debounce } from "lodash";


const gallery = document.querySelector('.gallery');
const formSear = document.querySelector('.search-form');

let page=1;
let query = "";
let curAmount = 0;
let total = 0;
let lb = null;




// --------------------------------render gallery------------------------
function clearGallery(){
    gallery.innerHTML='';
}

function renderIMG(arr){
    
    const liEl = arr.result
    .map(item => `
    <div class="photo-card">
        <a href="${item.largeImageURL}">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
        </a>
        <div class="info">
        <p class="info-item">
            <b>Likes ${item.likes}</b>
        </p>
        <p class="info-item">
            <b>Views ${item.views}</b>
        </p>
        <p class="info-item">
            <b>Comments ${item.comments}</b>
        </p>
        <p class="info-item">
            <b>Downloads ${item.downloads}</b>
        </p>
        </div>
  </div>`).join('');
  gallery.insertAdjacentHTML('beforeend',liEl);
}

async function formHandler(event){
    
    event.preventDefault();
    curAmount=0;
    clearGallery();
    const {
        elements:{searchQuery}
    } = event.currentTarget;

    if (!searchQuery.value) {
        alert("Type to search")
        return;
    }
    page = 1;
    query = searchQuery.value;
    try {
        const images = await fetchImages(query,page);
        total = images.total;
        curAmount += images.currentAmount;
        renderIMG(images);
    
        lb = new SimpleLightbox('.photo-card a', {
            captions: true,
            captionsData: 'alt',
            captionDelay: 250,
        });
    } catch (error) {
        console.log(error);
    }
    
    
}

formSear.addEventListener('submit',formHandler)
// -------------------------------------------------------------------------



//--------------------------------infinity-scroll----------------------------
async function loadMore(){
    const items = await fetchImages(query,page);
    curAmount += items.currentAmount;
    renderIMG(items);
    lb.refresh();
}
function infinityScrollHandler(){
    // console.log("total pictures",total);
    console.log("current counter",curAmount);
    let docRect = document.documentElement.getBoundingClientRect().bottom;
    if(docRect<document.documentElement.clientHeight+150 && curAmount<total){
        page++;
        loadMore();
    }
}
window.addEventListener('scroll',debounce(infinityScrollHandler,300))
// -------------------------------------------------------------------------



// --------------------------------Scroll up--------------------------------
const scrlButton = document.querySelector(".scroll-up");

window.addEventListener('scroll',scrollUpHandler);

scrlButton.addEventListener('click',scrollOnTop);

function scrollUpHandler(){
    if(document.documentElement.scrollTop > 0 ){
        scrlButton.style.display = "block";
    }else{
        scrlButton.style.display = "none";
    }
}

function scrollOnTop(){
    document.documentElement.scrollTop -=800;
}
// -------------------------------------------------------------------------

