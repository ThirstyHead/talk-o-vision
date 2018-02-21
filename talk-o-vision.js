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
    this.notesWindow = undefined;
    this.notesOn = false;
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
    * Toggles speaker notes
    */
  toggleNotes(){
    this.notesOn = !this.notesOn;
    this.displayNotes();
  }


  /**
    * Displays speaker notes
    */
  displayNotes(){
    if(this.notesOn){
      let windowFeatures = "width=400, height=600, resizable=yes, scrollbars=yes, menubar=no, toolbar=no, location=no, personalbar=no, status=no";
      this.notesWindow = window.open("notes.html", "Speaker_Notes", windowFeatures);
    }else{
      this.notesWindow && this.notesWindow.close();
    }
  }


  /**
    * @returns slide information as JSON for a given slideId
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

    window.localStorage.setItem('slideCount', this.list.length);
  }


  /**
    * Displays a slide based on slideId
    */
  goto(slideId = 1){
    window.location.hash = slideId;
  }


  /**
    * Moves slideshow to previous slide
    */
  previous(){
    let previous = this.currentId - 1;
    if(previous <= 1){
      previous = 1;
    }
    this.goto(previous);
  }


  /**
    * Advances slideshow to next slide
    */
  next(){
    let next = this.currentId + 1;
    if(next >= this.list.length){
      next = this.list.length;
    }
    this.goto(next);
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

      case 72: // h
        e.preventDefault();
        this.goto(1);
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
