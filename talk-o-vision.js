'use strict';

window.addEventListener('load', slideshowInit);

/**
  * Slideshow initialization
  */
function slideshowInit(){
  let slides = new Slides();
}


/**
  * Represents the slide deck
  */
class Slides{
  constructor(){
    this.list = document.querySelectorAll(".slideshow > section");
    this.addNumberToSlides();
    window.addEventListener('keydown', evt => this.keyHandler(evt));
  }

  /** 
    * @returns the current slide number
    */
  get current(){
    return window.location.hash.replace("#", "") * 1 || 1;
  }

  /**
    * Adds an "id" attribute to each slide containing the slide number.
    * This enables hash fragment navigation (e.g. http://foo.com/#12).
    */
  addNumberToSlides(){
    for(let i=0; i<this.list.length; i++){
      this.list[i].id = `${i + 1}`;
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
    if(next >= this.list.length){
      next = this.list.length;
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
