'use strict';

window.addEventListener('load', init);

/**
  * Slideshow initialization
  */
function init(){
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
    window.addEventListener('message', evt => this.messageHandler(evt));
    this.playAudio = false;
    this.playSpeech = true;
    this.autoPlay = true;
  }

  /**
    * @returns the current slide number
    */
  get currentId(){
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
    * Displays Transcript / Table of Contents
    */
  displayTranscript(){
    if(this.showTranscript){
      const windowFeatures = "width=400, height=600, resizable=yes, scrollbars=yes, menubar=no, toolbar=no, location=no, personalbar=no, status=no";
      this.transcriptWindow = window.open("windows/transcript.html", "Transcript", windowFeatures);
    }else{
      this.transcriptWindow && this.transcriptWindow.close();
    }
  }

  /**
    * Enables fullscreen
    */
  fullscreen(){
    // normalize fullscreen behavior across browsers
    let html = document.querySelector("html");
    let requestFullscreen = html.requestFullscreen ||
                            html.requestFullScreen ||
                            html.webkitRequestFullscreen ||
                            html.mozRequestFullScreen ||
                            html.msRequestFullscreen;

    let isFullScreen = document.webkitIsFullScreen ||
                       document.mozFullScreen;

    let exitFullScreen = document.exitFullscreen ||
                         document.webkitExitFullscreen ||
                         document.mozCancelFullScreen;

    // toggle fullscreen
    if(isFullScreen){
      exitFullScreen.apply(document);
    }else{
      if(requestFullscreen){
        requestFullscreen.apply(html);
      }
    }

  }

  /**
    * Generates Table of Contents
    */
  generateToc(){
    // if toc exists, remove it
    let storedToc = window.sessionStorage.getItem('toc');
    if(storedToc){
      window.sessionStorage.removeItem('toc');
    }

    let tocList = [];
    for(let i=0; i<this.list.length; i++){
      let slideId = i+1;
      tocList.push(this.slideInfo(slideId));
    }

    window.sessionStorage.setItem('toc', JSON.stringify(tocList));
  }

  /**
    * Displays a slide based on slideId
    */
  goto(slideId){
    window.location.hash = slideId;
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
    * Plays audio for the current slide
    */
  playAudioForCurrentSlide(){
    const audio = document.querySelector(`section[id="${this.currentId}"] audio`);
    if(audio){
      audio.play();
      if(this.autoPlay){
        audio.addEventListener('ended', evt => this.audioEndedHandler(evt));
      }
    }
  }

  /**
    * Plays speech for the current slide
    */
  playSpeechForCurrentSlide(){
    const figcaption = document.querySelector(`section[id="${this.currentId}"] figcaption`);
    const text = figcaption.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
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
    * @returns slide information as JSON for a given slideId
    */
  slideInfo(slideId){
    const rawSlide = document.getElementById(slideId);
    const title = rawSlide.querySelector('h2') ?
                  rawSlide.querySelector('h2').innerText :
                  `Slide ${slideId}`;
    const transcript = rawSlide.querySelector('figcaption') ?
                       rawSlide.querySelector('figcaption').innerHTML :
                       'No notes provided';

    let slide = {
      'id': slideId,
      'title': title,
      'transcript': transcript
    };

    if(rawSlide.classList.contains('main-title')){
      slide.mainTitle = true;
    }

    if(rawSlide.classList.contains('section-title')){
      slide.sectionTitle = true;
    }

    return slide;
  }

  /**
    * If audio is currently playing, it will be stopped
    */
  stopAllAudio(){
    const audioList = document.querySelectorAll('audio');
    for(let i=0; i<audioList.length; i++){
      audioList[i].pause();
      audioList[i].currentTime = 0;
    }
  }

  /**
    * Toggles Transcript / Table of Contents
    */
  toggleTranscript(){
    this.showTranscript = !this.showTranscript;
    this.generateToc();
    this.displayTranscript();
  }



  /**
    * Enables keyboard shortcuts
    * For example: next, previous, fullscreen
    */
  keyHandler(event){
    switch(event.which){
      // previous slide
      case 33: // pgup
      case 37: // left
        event.preventDefault();
        this.previous();
        break;

      // next slide
      case 32: // spacebar
      case 34: // pgdn
      case 39: // right
        event.preventDefault();
        this.next()
        break;

      // fullscreen
      case 70: // f
        event.preventDefault();
        this.fullscreen();
        break;

      // goto home slide
      case 72: // h
        event.preventDefault();
        this.goto(1);
        break;

      // play / pause audio
      case 80: // p
        event.preventDefault();
        const audio = document.querySelector(`section[id="${this.currentId}"] audio`);
        if(audio && audio.paused){
          audio.play();
        }else{
          audio.pause();
        }
        break;

      // speak / pause speech
      case 83: // s
        event.preventDefault();
        this.playSpeechForCurrentSlide();
        break;

      // transcript / table of contents
      case 84: // t
        event.preventDefault();
        this.toggleTranscript();
        break;

    }
  }

  /**
    * Handles event based on slide change
    * For example: next, previous
    */
  hashchangeHandler(event){
    window.localStorage.setItem('currentSlide', JSON.stringify(this.slideInfo(this.currentId)));
    if(this.playAudio){
      this.stopAllAudio();
      this.playAudioForCurrentSlide();
    }

    if(this.playSpeech){
      window.speechSynthesis.cancel();
      this.playSpeechForCurrentSlide();
    }
  }

  /**
    * Handles event based on postMessage() calls from child windows.
    * For example: transcript.html
    */
  messageHandler(event){
    const message = event.data;
    switch(message.method){
      case 'goto':
        this.goto(message.args);
        break;
    }
  }

  /**
    * Handles event based on the end of audio playback
    */
  audioEndedHandler(event){
    this.goto(this.currentId + 1);
  }


}
