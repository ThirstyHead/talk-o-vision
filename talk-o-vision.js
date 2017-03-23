'use strict';

window.addEventListener('load', slideshowInit);
window.addEventListener('keydown', keyHandler);

function slideshowInit(){
  numberSlides();
}

function numberSlides(){
  let slides = document.querySelectorAll(".slideshow li");
  window.sessionStorage.slideCount = slides.length;

  //number slides for #x url fragment navigation
  for(let i=0; i<slides.length; i++){
    slides[i].id = `${i + 1}`;
  }
}

function keyHandler(e){
  switch(e.which){
    case 37: // left
      e.preventDefault();
      previousSlide()
      break;
    case 39: // right
      e.preventDefault();
      nextSlide()
      break;
  }
}

function nextSlide(){
  let current = window.location.hash.replace("#", "") * 1;
  let next = current + 1;
  if(next >= window.sessionStorage.slideCount){
    next = window.sessionStorage.slideCount;
  }
  window.location.hash = next;
}

function previousSlide(){
  let current = window.location.hash.replace("#", "") * 1;
  let previous = current - 1;
  if(previous <= 1){
    previous = 1;
  }
  window.location.hash = previous;
}
