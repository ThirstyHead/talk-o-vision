'use strict';

window.addEventListener('load', slideshowInit);

/**
  * Slideshow initialization
  */
function slideshowInit(){
  numberSlides();
  window.addEventListener('keydown', keyHandler);
  window.addEventListener('touchstart', gestureStart);
  window.addEventListener('touchmove', gestureMove);
  window.addEventListener('touchend', gestureEnd);
}

/**
  * Adds an "id" attribute to each slide containing the slide number.
  * This enables hash / fragment navigation (http://foo.com/#12).
  */
function numberSlides(){
  let slides = document.querySelectorAll(".slideshow li");
  window.sessionStorage.slideCount = slides.length;
  for(let i=0; i<slides.length; i++){
    slides[i].id = `${i + 1}`;
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

/**
  * Handles start of a swipe on a touch-enabled device
  * Adapted from https://patrickhlauke.github.io/touch/swipe/
  */
function gestureStart(e) {
  if (e.touches.length > 1) {
    window.sessionStorage.tracking = false;
    return;
  } else {
    window.sessionStorage.tracking = true;
    window.sessionStorage.thresholdTime = 500;
    window.sessionStorage.thresholdDistance = 100;

    /* Hack - would normally use e.timeStamp but it's whack in Fx/Android */
    window.sessionStorage.startTime = new Date().getTime();
    window.sessionStorage.startX = e.targetTouches[0].clientX;
    window.sessionStorage.startY = e.targetTouches[0].clientY;
  }
};

/**
  * Handles middle of a swipe on a touch-enabled device
  * Adapted from https://patrickhlauke.github.io/touch/swipe/
  */
function gestureMove(e) {
  if (window.sessionStorage.tracking) {
    e.preventDefault();
    window.sessionStorage.endX = e.targetTouches[0].clientX;
    window.sessionStorage.endY = e.targetTouches[0].clientY;
  }
}

/**
  * Handles end of a swipe on a touch-enabled device
  * Adapted from https://patrickhlauke.github.io/touch/swipe/
  */
function gestureEnd(e) {
  window.sessionStorage.tracking = false;
  let now = new Date().getTime();
  let deltaTime = now - window.sessionStorage.startTime;
  let deltaX = window.sessionStorage.endX - window.sessionStorage.startX;
  let deltaY = window.sessionStorage.endY - window.sessionStorage.startY;
  /* work out what the movement was */
  if (deltaTime > window.sessionStorage.thresholdTime) {
    /* gesture too slow */
    return;
  } else {
    if ((deltaX > window.sessionStorage.thresholdDistance) &&
        (Math.abs(deltaY) < window.sessionStorage.thresholdDistance)) {
      // swipe right
      previousSlide();
    } else if ((-deltaX > window.sessionStorage.thresholdDistance) &&
               (Math.abs(deltaY) < window.sessionStorage.thresholdDistance)) {
      // swipe left
      nextSlide();
    }
  }
}
