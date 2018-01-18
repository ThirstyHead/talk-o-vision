'use strict';

window.addEventListener('load', slideshowInit);

/**
  * Slideshow initialization
  */
function slideshowInit(){
  let slides = new Slides();
}


class Slides{
  constructor(){
    this.list = this.all;
    this.numberSlides();
    window.addEventListener('keydown', evt => this.keyHandler(evt));
  }

  /**
    * returns an array of slides
    */
  get all(){
    let all = document.querySelectorAll(".slideshow > section");
    return all;
  }

  /**
    * returns the current slide number
    */
  get current(){
    let currentSlideNumber = window.location.hash.replace("#", "") * 1 || 1;
    return currentSlideNumber;
  }

  /**
    * Adds an "id" attribute to each slide containing the slide number.
    * This enables hash / fragment navigation (e.g. http://foo.com/#12).
    */
  numberSlides(){
    for(let i=0; i<this.all.length; i++){
      this.all[i].id = `${i + 1}`;
    }
  }

  /**
    * Moves slideshow to previous slide
    */
  previous(){
    let previous = this.current - 1;
    if(previous <= 1){
      previous = 1;
    }
    window.location.hash = previous;
  }

  /**
    * Advances slideshow to next slide
    */
  next(){
    let next = this.current + 1;
    let slideCount = this.all.length;
    if(next >= slideCount){
      next = slideCount;
    }
    window.location.hash = next;
  }

  /**
    * Enables fullscreen
    */
  fullscreen(){
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
    * Enables keyboard shortcuts
    * For example: next, previous, fullscreen
    */
  keyHandler(e){
    switch(e.which){
      case 33: // pgup
      case 37: // left
        e.preventDefault();
        this.previous();
        break;

      case 32: // spacebar
      case 34: // pgdn
      case 39: // right
        e.preventDefault();
        this.next()
        break;

      case 70: // f
        e.preventDefault();
        this.fullscreen();
        break;

      case 78: // n
        //toggle showNotes
        // let showNotes = ( window.localStorage.getItem('showNotes') === 'true' );
        // window.localStorage.setItem('showNotes', !showNotes);
        break;
    }
  }
}
