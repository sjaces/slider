var counter = 0;

function visitCount() {
  counter++;
  document.getElementById("counter").innerHTML = counter;
  console.log("counter: " + counter);
}

function generarVisita() {
  setTimeout(() => {
    var activeSlide = document.getElementsByClassName("swiper-slide-active");
    var category = document
      .getElementsByClassName("swiper-slide-active")[0]
      .getAttribute("category");
    var categoryURL = document
      .getElementsByClassName("swiper-slide-active")[0]
      .getAttribute("url");
    changeCategory(category, categoryURL);
    if (activeSlide[0].children[0].src) {
      console.log("activeSlide", activeSlide[0].children[0].src);
      visitCount();
    } else {
      console.log("activeSlide", activeSlide[1].children[0].src);
      visitCount();
    }
  }, 100);
}

function changeCategory(categoryName, url) {
  console.log("category", categoryName);
  console.log("categoryURL", url);
  if (categoryName) document.getElementById("displayCategory").innerHTML = categoryName;
  if (url) {
    document.getElementById("categoryURL").setAttribute("disabled", false);
    document.getElementById("categoryURL").setAttribute("href", url);
    document.getElementById("link").style.display = "inline-block";
  } else {
    console.log("categoryURL desactivated", url);
    document.getElementById("categoryURL").setAttribute("disabled", true);
    document.getElementById("categoryURL").removeAttribute("href");
    document.getElementById("link").style.display = "none";
  }
}

window.onload = function () {
  var windowHeight = window.innerHeight - 18;

  var slider01 = document.getElementById("slider01");
  slider01.style.height = "" + windowHeight + "px";

  var swiperH = new Swiper(".swiper-container-h", {
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

  swiperH.on("slideChange", function () {
    console.log("slide changed");
    generarVisita();
  });
};
