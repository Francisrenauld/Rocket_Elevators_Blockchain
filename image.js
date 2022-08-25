const mergeImages = require("merge-images");
const {
    Canvas,
    Image
} = require("canvas");
let backgroundArray = new Array("images/background/1.png");
let earsArray = new Array("images/ears/1.png", "images/ears/2.png", "images/ears/3.png", "images/ears/4.png");
let eyesArray = new Array("images/eyes/1.png", "images/eyes/2.png", "images/eyes/3.png", "images/eyes/4.png");
let headArray = new Array("images/head/1.png", "images/head/2.png", "images/head/3.png");
let mouthArray = new Array("images/mouth/1.png", "images/mouth/2.png", "images/mouth/3.png", "images/mouth/4.png");
let mustacheArray = new Array("images/mustache/1.png", "images/mustache/2.png", "images/mustache/3.png", "images/mustache/4.png");
let noseArray = new Array("images/nose/1.png", "images/nose/2.png", "images/nose/3.png", "images/nose/4.png");
let pupilArray = new Array("images/pupil/1.png", "images/pupil/2.png", "images/pupil/3.png", "images/pupil/4.png");
const generateImage = async () => {
    //generate a random backgroud
    var randomNum = Math.floor(Math.random() * backgroundArray.length);
    randomBackground = backgroundArray[randomNum];
    //generate random ears
    var randomNum = Math.floor(Math.random() * earsArray.length);
    randomEars = earsArray[randomNum];
    //generate random eyes
    var randomNum = Math.floor(Math.random() * eyesArray.length);
    randomEyes = eyesArray[randomNum];
    //generate random head
    var randomNum = Math.floor(Math.random() * headArray.length);
    randomHead = headArray[randomNum];
    //generate random mouth
    var randomNum = Math.floor(Math.random() * mouthArray.length);
    randomMouth = mouthArray[randomNum];
    //generate random mustache
    var randomNum = Math.floor(Math.random() * mustacheArray.length);
    randomMustache = mustacheArray[randomNum];
    //generate random nose
    var randomNum = Math.floor(Math.random() * noseArray.length);
    randomNose = noseArray[randomNum];
    //generate random pupil
    var randomNum = Math.floor(Math.random() * pupilArray.length);
    randomPupil = pupilArray[randomNum];
    let b64 = await mergeImages([randomBackground, randomHead, randomEars, randomEyes, randomMouth, randomMustache, randomNose, randomPupil], {
        Canvas: Canvas,
        Image: Image,
    });
    console.log(b64);
};
generateImage();