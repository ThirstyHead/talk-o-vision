'use strict';

window.onload = slideshowInit();

function slideshowInit(){
  let slides = document.querySelectorAll(".slideshow li");

  //number slides for #x url fragment navigation
  for(let i=0; i<slides.length; i++){
    slides[i].id = `${i + 1}`;
  }
}
