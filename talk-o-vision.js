'use strict';

window.addEventListener('load', slideshowInit);

/**
  * Slideshow initialization
  */
function slideshowInit(){
  numberSlides();
  augmentSlides();
  window.addEventListener('keydown', keyHandler);
}

/**
  * Adds an "id" attribute to each slide containing the slide number.
  * This enables hash / fragment navigation (http://foo.com/#12).
  */
function numberSlides(){
  let slides = document.querySelectorAll(".slideshow > li");
  window.sessionStorage.slideCount = slides.length;
  for(let i=0; i<slides.length; i++){
    slides[i].id = `${i + 1}`;
  }
}

/**
  * Adds slideshow-specific styling + behavior to external slides.
  */
function augmentSlides(){
  let cssLink = document.createElement("link");
  cssLink.href = "../../talk-o-vision.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let slides = document.querySelectorAll(".slideshow li iframe");
  console.dir(slides);
  for(let i=0; i<slides.length; i++){
    slides[i].contentDocument.head.appendChild(cssLink);
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
  }
}

/**
  * Advances slideshow to next slide
  */
function nextSlide(){
  let current = window.location.hash.replace("#", "") * 1;
  let next = current + 1;
  if(next >= window.sessionStorage.slideCount){
    next = window.sessionStorage.slideCount;
  }
  window.location.hash = next;
}

/**
  * Moves slideshow to previous slide
  */
function previousSlide(){
  let current = window.location.hash.replace("#", "") * 1;
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
