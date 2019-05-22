let counter = [];
let preventDoubleCount = [];

// this is the skeleton of the slider model
const swiperModel =
  '<div class="swiper-wrapper slidesContainer">   </div><div class="counter">1</div> <a class="categoryURL" href="" target="_blank">  <span class="displayCategory"></span> <svg class="link" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16"> <path d="M14.9 1.1c-1.4-1.4-3.7-1.4-5.1 0l-4.4 4.3c-1.4 1.5-1.4 3.7 0 5.2 0.1 0.1 0.3 0.2 0.4 0.3l1.5-1.5c-0.1-0.1-0.3-0.2-0.4-0.3-0.6-0.6-0.6-1.6 0-2.2l4.4-4.4c0.6-0.6 1.6-0.6 2.2 0s0.6 1.6 0 2.2l-1.3 1.3c0.4 0.8 0.5 1.7 0.4 2.5l2.3-2.3c1.5-1.4 1.5-3.7 0-5.1z"></path> <path d="M10.2 5.1l-1.5 1.5c0 0 0.3 0.2 0.4 0.3 0.6 0.6 0.6 1.6 0 2.2l-4.4 4.4c-0.6 0.6-1.6 0.6-2.2 0s-0.6-1.6 0-2.2l1.3-1.3c-0.4-0.8-0.1-1.3-0.4-2.5l-2.3 2.3c-1.4 1.4-1.4 3.7 0 5.1s3.7 1.4 5.1 0l4.4-4.4c1.4-1.4 1.4-3.7 0-5.1-0.2-0.1-0.4-0.3-0.4-0.3z" ></path></svg></a><div class="swiper-pagination swiper-pagination-h"></div>  <div class="swiper-button-prev swiper-button-prev-h"></div>  <div class="swiper-button-next swiper-button-next-h"></div>  <div class="swiper-scrollbar swiper-scrollbar-h"></div>';

function initSlider(JSONFile, idDom) {
  fetch(`../data/${JSONFile}.json`)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      // Now we retrieve the data from the JSON file i.e. dataSlider.json
      let data = myJson;
      // First I start with the skeleton model stored in swiperModel and where I am going to place it
      setUpSwiper(idDom);
      // Then I iterate the whole slider
      data.slides.map(item => {
        writeItem(idDom, item);
      });
      // Second I write the first category label
      changeCategory(idDom, data.slides[0].category, data.slides[0].url);
      // And the last step is initialize the swiper library
      init(idDom);
    });
}

// Write the skeleton model where is indicated
function setUpSwiper(idDom) {
  document.getElementById(idDom).setAttribute("class", "swiper-container swiper-container-h");
  let mySwiperModel = swiperModel;
  mySwiperModel = mySwiperModel.replace("swiper-pagination-h", `swiper-pagination-h ${idDom}Class`);
  mySwiperModel = mySwiperModel.replace("swiper-button-next-h", `swiper-button-next-h ${idDom}Class`);
  mySwiperModel = mySwiperModel.replace("swiper-button-prev-h", `swiper-button-prev-h ${idDom}Class`);

  console.log(mySwiperModel);
  document.getElementById(idDom).innerHTML = mySwiperModel;
}

// Write each slide of the slider
function writeItem(idDom, item) {
  let node = document.createElement("div");
  node.setAttribute("class", "swiper-slide");
  node.setAttribute("category", item.category);
  node.setAttribute("url", item.url);
  let img = document.createElement("img");
  img.src = item.imgSrc;
  node.appendChild(img);
  console.log(node);
  document
    .getElementById(idDom)
    .getElementsByClassName("slidesContainer")[0]
    .appendChild(node);
}

// Function that initialize the swiper object
function init(idDom) {
  preventDoubleCount[idDom] = false;
  counter[idDom] = 1;

  // The Swiper class make the slider object
  let mySlider = new Swiper(`#${idDom}`, {
    spaceBetween: 50,
    loop: true,
    pagination: {
      el: `.swiper-pagination-h.${idDom}Class`,
      clickable: true,
      nested: true
    },
    navigation: {
      nextEl: `.swiper-button-next-h.${idDom}Class`,
      prevEl: `.swiper-button-prev-h.${idDom}Class`
    },
    mousewheel: {
      invert: false,
      enabled: true
    },
    keyboard: {
      enabled: true
    }
  });

  // And then we activate the slideChange listener
  mySlider.on("slideChange", function() {
    console.log("slide changed");
    sliderChanged(idDom, preventDoubleCount);
  });
}

function sliderChanged(idDom, preventDoubleCount) {
  // In order to wait the CSS transitions, I wait 0.1s
  setTimeout(() => {
    let activeSlide = document.getElementById(idDom).getElementsByClassName("swiper-slide-active")[0];
    let category = activeSlide.getAttribute("category");
    let categoryURL = activeSlide.getAttribute("url");

    //Change de category data
    changeCategory(idDom, category, categoryURL);
    //Count the visits if it's neccesarty
    if (!preventDoubleCount[idDom]) visitCount(idDom);

    //Here I detect if I am in the first/last slide of a loop slider and prevente double visits with a boolean object
    if (activeSlide.getAttribute("class").search("duplicate") > 0) {
      preventDoubleCount[idDom] = true;
    } else {
      preventDoubleCount[idDom] = false;
    }
    // I return if the next visit must be counted or not
    return preventDoubleCount;
  }, 100);
}

function changeCategory(idDom, categoryName, url) {
  let isCategory = false;
  let isURL = false;
  let categoryText = document.getElementById(idDom).getElementsByClassName("displayCategory")[0];
  let categoryURLALink = document.getElementById(idDom).getElementsByClassName("categoryURL")[0];
  let link = document.getElementById(idDom).getElementsByClassName("link")[0];

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

function visitCount(idDom) {
  counter[idDom]++;
  document.getElementById(idDom).getElementsByClassName("counter")[0].innerHTML = counter[idDom];
  console.log(counter);
}
