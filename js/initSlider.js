let counter = 1;
let preventDoubleCount = false;
let data;

// this is the skeleton of the slider model
const swiperModel =
  '<div class="swiper-container swiper-container-h" id="slider01"><div class="swiper-wrapper" id="slidesContainer">   </div><div class="swiper-pagination swiper-pagination-h"></div>  <div class="swiper-button-prev swiper-button-prev-h"></div>  <div class="swiper-button-next swiper-button-next-h"></div>  <div class="swiper-scrollbar swiper-scrollbar-h"></div></div><div id="counter">1</div> <a id="categoryURL" href="" target="_blank">  <span id="displayCategory"></span> <svg id="link" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16"> <path d="M14.9 1.1c-1.4-1.4-3.7-1.4-5.1 0l-4.4 4.3c-1.4 1.5-1.4 3.7 0 5.2 0.1 0.1 0.3 0.2 0.4 0.3l1.5-1.5c-0.1-0.1-0.3-0.2-0.4-0.3-0.6-0.6-0.6-1.6 0-2.2l4.4-4.4c0.6-0.6 1.6-0.6 2.2 0s0.6 1.6 0 2.2l-1.3 1.3c0.4 0.8 0.5 1.7 0.4 2.5l2.3-2.3c1.5-1.4 1.5-3.7 0-5.1z"></path> <path d="M10.2 5.1l-1.5 1.5c0 0 0.3 0.2 0.4 0.3 0.6 0.6 0.6 1.6 0 2.2l-4.4 4.4c-0.6 0.6-1.6 0.6-2.2 0s-0.6-1.6 0-2.2l1.3-1.3c-0.4-0.8-0.1-1.3-0.4-2.5l-2.3 2.3c-1.4 1.4-1.4 3.7 0 5.1s3.7 1.4 5.1 0l4.4-4.4c1.4-1.4 1.4-3.7 0-5.1-0.2-0.1-0.4-0.3-0.4-0.3z" ></path></svg></a>';

// Now we retrieve the data from the JSON file dataSlider.json
fetch("./js/dataSlider.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    data = myJson;
    // First I start with the skeleton model stored in swiperModel and where I am going to place it
    setUpSwiper(swiperModel, "root");
    // Second I write the first category label
    changeCategory(data.slides[0].category, data.slides[0].url);
    // Then I iterate the whole slider
    data.slides.map(item => {
      writeItem(item);
    });
    // And the last step is initialize the swiper library
    init();
  });

// Write the skeleton model where is indicated
function setUpSwiper(swiperModel, idDom) {
  document.getElementById(idDom).innerHTML = swiperModel;
}

// Write each slide of the slider
function writeItem(item) {
  let node = document.createElement("div");
  node.setAttribute("class", "swiper-slide");
  node.setAttribute("category", item.category);
  node.setAttribute("url", item.url);
  let img = document.createElement("img");
  img.src = item.imgSrc;
  node.appendChild(img);
  document.getElementById("slidesContainer").appendChild(node);
}

function init() {
  // First calculate window height
  const windowHeight = window.innerHeight - 18;

  // Second resize the slider container
  let slider01 = document.getElementById("slider01");
  slider01.style.height = "" + windowHeight + "px";

  // Third Swiper class make the slider object
  let mySlider = new Swiper(".swiper-container-h", {
    spaceBetween: 50,
    loop: true,
    pagination: {
      el: ".swiper-pagination-h",
      clickable: true,
      nested: true
    },
    navigation: {
      nextEl: ".swiper-button-next-h",
      prevEl: ".swiper-button-prev-h"
    },
    mousewheel: {
      invert: false,
      enabled: true
    },
    keyboard: {
      enabled: true
    }
  });

  // And last we activate the slideChange listener
  mySlider.on("slideChange", function() {
    console.log("slide changed");
    sliderChanged();
  });
}

function sliderChanged() {
  // In order to wait the CSS transitions, I wait 0.1s
  setTimeout(() => {
    let activeSlide = document.getElementsByClassName("swiper-slide-active");
    let category = document.getElementsByClassName("swiper-slide-active")[0].getAttribute("category");
    let categoryURL = document.getElementsByClassName("swiper-slide-active")[0].getAttribute("url");
    changeCategory(category, categoryURL);
    if (activeSlide[0].children[0].src) {
      console.log("activeSlide", activeSlide[0].children[0].src);
      !preventDoubleCount ? visitCount() : (preventDoubleCount = false);
      preventDoubleCountVisits();
    } else {
      console.log("activeSlide", activeSlide[1].children[0].src);
      !preventDoubleCount ? visitCount() : (preventDoubleCount = false);
      preventDoubleCountVisits();
    }
  }, 100);
}

function changeCategory(categoryName, url) {
  let isCategory = false;
  let isURL = false;
  let categoryText = document.getElementById("displayCategory");
  let categoryURLALink = document.getElementById("categoryURL");
  let link = document.getElementById("link");

  console.log("category", categoryName);
  console.log("categoryURL", url);

  if (categoryName) isCategory = true;
  if (url) isURL = true;

  if (isCategory) {
    categoryURLALink.style.display = "inline-block";
    categoryText.innerHTML = categoryName;
    if (isURL) {
      categoryURLALink.setAttribute("disabled", false);
      categoryURLALink.setAttribute("href", url);
      link.style.display = "inline-block";
    } else {
      categoryURLALink.setAttribute("disabled", true);
      categoryURLALink.removeAttribute("href");
      link.style.display = "none";
    }
  } else {
    categoryText.innerHTML = "";
    categoryURLALink.style.display = "none";
  }
}

function preventDoubleCountVisits() {
  // When the slider is setup as loop, I prevent double counts
  if (document.getElementsByClassName("swiper-slide swiper-slide-duplicate swiper-slide-active").length) preventDoubleCount = true;
}

function visitCount() {
  counter++;
  document.getElementById("counter").innerHTML = counter;
  console.log("counter: " + counter);
}
