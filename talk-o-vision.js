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
  /**
    * Creates a new Slides object
    * @constructor
    */
  constructor(){
    this.list = document.querySelectorAll(".slideshow > section");
    this.addNumberToSlides();
    window.addEventListener('keydown', evt => this.keyHandler(evt));
    window.addEventListener('hashchange', evt => this.hashchangeHandler(evt));
  }

  /**
    * @returns the current slide number
    */
  get currentId(){
    return window.location.hash.replace("#", "") * 1 || 1;
  }

  /**
    * Are speaker notes being displayed?
    * @returns showNotes
    */
  get showNotes(){
    return window.localStorage.getItem('showNotes') === 'true';
  }

  /**
    * @param {boolean} value
    */
  set showNotes(value){
    window.localStorage.setItem('showNotes', (value === true) );
  }


  /**
    * Toggles the state of showNotes
    */
  toggleNotes(){
    window.localStorage.setItem('showNotes', !(this.showNotes));
  }



  /**
    * @returns select data from the current slide
    */
  slideInfo(slideId = this.currentId){
    let rawSlide = document.getElementById(slideId);
    let title = rawSlide.querySelector('h2') ? rawSlide.querySelector('h2').innerText : `Slide ${this.currentId}`;
    let notes = rawSlide.querySelector('figcaption') ? rawSlide.querySelector('figcaption').innerHTML : 'No notes provided';

    let currentSlide = {
      'id': this.currentId,
      'title': title,
      'notes': notes
    };

    if(rawSlide.classList.contains('section-title')){
      currentSlide.sectionTitle = true;
    }

    return currentSlide;
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
    let previous = this.currentId - 1;
    if(previous <= 1){
      previous = 1;
    }
    window.location.hash = previous;
  }

  /**
    * Advances slideshow to next slide
    */
  next(){
    let next = this.currentId + 1;
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
        this.toggleNotes();
        break;
    }
  }

  /**
    * Handles event based on slide change
    * For example: next, previous
    */
  hashchangeHandler(e){
    window.localStorage.setItem('currentSlide', JSON.stringify(this.slideInfo()));
  }
}
