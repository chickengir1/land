import Path from "./components/Path.js";
import Circle from "./components/CircleObject.js";
import AnimatedText from "./components/AnimatedText.js";
import { animations as an, SVG_DOC } from "./helpers/Helpers.js";
import Carousel from "./components/Carousel.js";

const ROOT_SVG_ID = "animated-path";
const CIRCLE_OBJECTS_GROUP_CLASS = "circles-group";
const CURVE_CONTROL = () => window.innerWidth / 9.6;

// Review CSS transition speeds
let timeControl = {
  introDelay: 3000,
  animatedTextSpeed: 500,
  animatedTextDelay: 7000,
  carouselSpeed: 1000,
  carouselSwipeDelay: 7000,
  fisrtMaskIn: 1000,
  secondMaskIn: 500,
  pathRenderIn: 2000,
  circlesRenderIn: 4000,
  circlesInterval: 7000,
  circlesFadeSpeed: 1500,
};
let animationFunctions = [];

// Animated Text
let textList = [
  {
    text: ["daejin", "university"],
    in: [an.SLIDE_RIGHT, an.SLIDE_UP],
    out: [an.SLIDE_DOWN, an.SLIDE_UP],
  },
  {
    text: ["ksae", "baja", "mobility"],
    in: [an.SLIDE_RIGHT, an.FADE_IN, an.SLIDE_LEFT],
    out: [an.SLIDE_RIGHT, an.FADE_OUT, an.SLIDE_LEFT],
  },
  {
    text: ["super", "beetle"],
    in: [an.SLIDE_UP, an.FADE_IN],
    out: [an.SLIDE_RIGHT, an.SLIDE_LEFT],
  },
];
let animatedTextContainer = document.getElementsByClassName("animated-text")[0];
let animatedText = new AnimatedText(animatedTextContainer, textList, {
  transitionSpeed: timeControl.animatedTextSpeed,
  swipeDelay: timeControl.animatedTextDelay,
});
setTimeout(
  () => animationFunctions.push(animatedText.play()),
  timeControl.introDelay
);

// Carousel
const images = [
  { src: "images/carousel/jeep.webp", alt: "Jeep" },
  { src: "images/carousel/ford.webp", alt: "Ford" },
  { src: "images/carousel/f150.webp", alt: "Ford F150" },
  { src: "images/carousel/pathfinder.webp", alt: "Toyota" },
  { src: "images/carousel/toyota.webp", alt: "Toyota" },
];
let carouselDiv = document.getElementById("carousel-div");
let carousel = new Carousel(carouselDiv, images, {
  swipeDelay: timeControl.carouselSwipeDelay,
  transitionSpeed: timeControl.carouselSpeed,
});
setTimeout(() => carousel.play(), timeControl.introDelay);

// Path Object
let pathPointsPercents = [
  [-2.5, 40],
  [22.5, 80],
  [50, 70],
  [70, 85],
  [100, 30],
];
let pathPointsPercentsTight = [
  [-2.5, 50],
  [32.5, 80],
  [65, 80],
  [100, 50],
];
let path = new Path(ROOT_SVG_ID, pathPointsPercents, {
  control: CURVE_CONTROL(),
  color: "#c9b2a3",
});
path.render();

// open modal
const openModal = (e) => {
  e.preventDefault();
  const modal = document.getElementById("modal");
  const background = document.querySelector(".background");
  modal.style.display = "block";
  background.style.display = "block";
  document.body.classList.add("modal-open");
  document.documentElement.classList.add("modal-open");
};

// URL 열기 함수 정의
const openURL = (url) => (e) => {
  e.preventDefault();
  window.open(url, "_blank");
};

// Circle Objects
let circles = [
  {
    iconCode: "",
    path: path,
    description: {
      title: "SuperBeetle",
      text: "Automobile Club",
      link: { url: "https://super-beetle.vercel.app/", label: "Home" },
    },
    clickHandler: openURL("https://super-beetle.vercel.app/"),
  },
  {
    iconCode: "",
    path: path,
    description: {
      title: "Notion",
      text: "Latest Projects",
      link: { url: "https://www.notion.so", label: "Notion" },
    },
    clickHandler: openURL("https://www.notion.so"),
  },
  {
    iconCode: "",
    path: path,
    description: {
      title: "University",
      text: "Another Experience",
      link: {
        url: "https://camde.daejin.ac.kr/camde/index.do",
        label: "University",
      },
    },
    clickHandler: openURL("https://camde.daejin.ac.kr/camde/index.do"),
  },
  {
    iconCode: "",
    path: path,
    description: {
      title: "YouTube",
      text: "Tournament Highlights",
      link: {
        url: "https://www.youtube.com/watch?v=51e-wu1z_uA",
        label: "Highlights",
      },
    },
    clickHandler: openURL("https://www.youtube.com/watch?v=51e-wu1z_uA"),
  },
  {
    iconCode: "",
    path: path,
    description: {
      title: "Contact",
      text: "Would you like to join us?",
    },
    clickHandler: openModal,
  },
];

let circlesGroup = document.createElementNS(SVG_DOC, "g");
circlesGroup.setAttribute("class", CIRCLE_OBJECTS_GROUP_CLASS);
document.getElementById(ROOT_SVG_ID).appendChild(circlesGroup);
let circleObjects = [];
circles.map((circle, index) => {
  let circleObject = new Circle(circlesGroup, {
    ...circle,
    positionIndex: index,
    fadeSpeed: timeControl.circlesFadeSpeed,
  });
  circleObject.render();
  circleObjects.push(circleObject);
});

// Initial Animations
setTimeout(() => {
  document.getElementById("animated-path").style.maskPosition =
    "0px 0px, 0px 300px";
  document.getElementById("animated-path").style.webkitMaskPosition =
    "0px 0px, 0px 300px";
  setTimeout(() => {
    document.getElementById("animated-path").style.maskPosition = "top";
    document.getElementById("animated-path").style.webkitMaskPosition = "top";
  }, timeControl.secondMaskIn);
}, timeControl.fisrtMaskIn);

// Path
setTimeout(() => {
  path.getPathElement().style.clipPath = "circle(200% at left)";
}, timeControl.pathRenderIn);

// Circles
setTimeout(() => {
  circlesGroup.style.opacity = 1;
}, timeControl.circlesRenderIn);

// Loop Animations
window.circleStep = 1;
setTimeout(
  () =>
    animationFunctions.push(
      setInterval(() => {
        circleObjects.map((circle) => circle.updatePosition(window.circleStep));
      }, timeControl.circlesInterval)
    ),
  timeControl.introDelay
);

// Carousel
setTimeout(() => {
  animationFunctions.push(carousel.playFunction);
}, 50);

// Listeners
window.addEventListener("resize", () => {
  let control = CURVE_CONTROL();
  window.innerWidth > 768
    ? path.updatePointPercents(pathPointsPercents)
    : path.updatePointPercents(pathPointsPercentsTight);
  path.updateControl(control);
  path.render();
  path.getPathElement().style.clipPath = "circle(200% at left)";
  circleObjects.map((circleObject) => circleObject.updatePosition());
});
