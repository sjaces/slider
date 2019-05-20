let counter = 1;
let preventDoubleCount = false;

window.onload = function() {
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

  // Fourth we write the first category title
  let activeSlide = document.getElementsByClassName("swiper-slide-active");
  let category = activeSlide[0].getAttribute("category");
  let categoryURL = activeSlide[0].getAttribute("url");
  changeCategory(category, categoryURL);

  // And last we activate the slideChange listener
  mySlider.on("slideChange", function() {
    console.log("slide changed");
    sliderChanged();
  });
};

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
