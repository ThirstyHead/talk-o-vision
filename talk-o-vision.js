'use strict';

window.addEventListener('load', slideshowInit);

/**
  * Slideshow initialization
  */
function slideshowInit(){
  numberSlides();
  window.addEventListener('keydown', keyHandler);
}

/**
  * Adds an "id" attribute to each slide containing the slide number.
  * This enables hash / fragment navigation (e.g. http://foo.com/#12).
  */
function numberSlides(){
  let s = new Slides();
  let slideList = s.all;
  for(let i=0; i<slideList.length; i++){
    slideList[i].id = `${i + 1}`;
  }
}

/**
  * Enables keyboard shortcuts
  * For example: next, previous, fullscreen
  */
function keyHandler(e){
  switch(e.which){
    case 33: // pgup
    case 37: // left
      e.preventDefault();
      previousSlide()
      break;

    case 32: // spacebar
    case 34: // pgdn
    case 39: // right
      e.preventDefault();
      nextSlide()
      break;

    case 70: // f
      e.preventDefault();
      fullscreen();
      break;

    case 78: // n
      //toggle showNotes
      // let showNotes = ( window.localStorage.getItem('showNotes') === 'true' );
      // window.localStorage.setItem('showNotes', !showNotes);
      break;
  }
}


/**
  * returns the current slide number
  */
function currentSlideNumber(){
  let currentSlideNumber = window.location.hash.replace("#", "") * 1 || 1;
  return currentSlideNumber;
}






/**
  * Advances slideshow to next slide
  */
function nextSlide(){
  let current = currentSlideNumber();
  let next = current + 1;
  let slideCount = new Slides().list.length;
  if(next >= slideCount){
    next = slideCount;
  }
  window.location.hash = next;
}

/**
  * Moves slideshow to previous slide
  */
function previousSlide(){
  let current = currentSlideNumber();
  let previous = current - 1;
  if(previous <= 1){
    previous = 1;
  }
  window.location.hash = previous;
}

/**
  * Enables fullscreen
  */
function fullscreen(){
  let html = document.querySelector("html");
  let requestFullscreen = html.requestFullscreen ||
                          html.requestFullScreen ||
                          html.webkitRequestFullscreen ||
                          html.mozRequestFullScreen ||
                          html.msRequestFullscreen;

  if (requestFullscreen) {
    requestFullscreen.apply(html);
  }
}


class Slides{
  constructor(){
    this.list = this.all;
  }

  /**
    * returns an array of slides
    */
  get all(){
    let all = document.querySelectorAll(".slideshow > section");
    return all;
  }
}
