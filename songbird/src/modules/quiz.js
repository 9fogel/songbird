import birdsDataEn from './birdsEn';
import birdsDataRu from './birdsRu';

import { birds } from './lang';
import { getRandomArr } from './random';
import { addResultsNav, setResultsPageActive, restartGame } from './nav';

export let score;

let randomArr = getRandomArr();
let level = 0;
score = 0;
let maxScore = 30;
let points = 5;
let scoreWrap = document.querySelector('.score');
let levelNavItems = document.querySelectorAll('.level-item');
let nextBtn = document.querySelector('.next-button');
let playAgainBtn = document.querySelector('.results-button');

// let birds;
let birdNames = document.querySelectorAll('.bird-name');
let birdNameLatin = document.querySelector('.bird-name-latin');
let players = document.querySelectorAll('.player');
let birdDesc = document.querySelector('.bird-desc');
let birdImgs = document.querySelectorAll('.bird-image');

let answers = document.querySelectorAll('.answer-text');
let answerIcons = document.querySelectorAll('.answer-circle');
let correctAnswer = birds[level][randomArr[level]].name;

let resultsText = document.querySelector('.results-text');

let answerState = false;
let gameFinished = false

export function loadGame(score) {
  console.log(randomArr);
  console.log('score2', score);
  setDefaultState(score);
  createAnswersList(level);
  setCorrectAnswer();
}

function createAnswersList(level) {
  answers.forEach((answer, index) => {
    answer.textContent = birds[level][index].name;
  });
}

function setDefaultState(score) {
  correctAnswer = birds[level][randomArr[level]].name;
  scoreWrap.textContent = `Ваши очки: ${score}`;
  nextBtn.setAttribute('disabled', 'disabled');
  setDefaultBird();
  levelNavItems.forEach((levelItem) => {
    levelItem.classList.remove('level-active');
  });
  levelNavItems[level].classList.add('level-active');
  answerIcons.forEach((answerIcon) => {
    answerIcon.classList.remove('wrong-answer');
    answerIcon.classList.remove('correct-answer');
  });
  answerState = false;
}

function setDefaultBird() {
  birdImgs[0].style.backgroundImage = `url("../assets/images/guess-bird-bg.jpg")`;
  birdNames[0].textContent = '**********';
  birdNames[1].style.display = 'none';
  birdNameLatin.style.display = 'none';
  birdDesc.innerHTML = '<p>Послушайте плеер.</p><p>Выберите птицу из списка.</p></br><p>За правильный ответ с первой попытки начисляется 6 баллов.</p><p>За каждую последующую попытку на 1 балл меньше.</p>';
  //TODO: add audio for players[0] - birds[level][randomArr[level]].audio;
  players[1].style.display = 'none';
  birdImgs[1].style.display = 'none';
}

function createCorrectBirdCard(level) {
  birdNames.forEach((birdName) => {
    birdName.textContent = birds[level][randomArr[level]].name;
  });
  birdNameLatin.textContent = birds[level][randomArr[level]].species;
  birdDesc.textContent = birds[level][randomArr[level]].description;
  //TODO: add audio - birds[level][randomArr[level]].audio;
  birdImgs.forEach((img) => {
    img.style.backgroundImage = `url(${birds[level][randomArr[level]].image})`;
  });
  birdNames[1].style.display = 'block';
  birdNameLatin.style.display = 'block';
  players[1].style.display = 'block';
  birdImgs[1].style.display = 'block';
}

function setCorrectAnswer() {
  answers.forEach((answer) => {
    if(answer.textContent === correctAnswer) {
      console.log('correct', answer.textContent);
      answer.classList.add('correct');
    } else {
      answer.classList.add('wrong');
    }
  });
}

export function handleClick() {
  let answerItems = document.querySelectorAll('.answer-item');

  answerItems.forEach((answerItem, index) => {
    answerItem.addEventListener('mouseover', () => {
      answerItem.classList.add('item-hovered');
      answerItem.style.cursor = 'pointer';
    });
    answerItem.addEventListener('mouseout', () => {
      answerItem.classList.remove('item-hovered');
      answerItem.style.cursor = 'default';
    });

    answerItem.addEventListener('click', () => {
      if(answers[index].textContent === correctAnswer) {
        console.log('correct!', level);
        //TODO: добавить звук правильного ответа
        answerIcons[index].classList.add('correct-answer');
        answerItems[index].classList.remove('item-hovered');
        answerItems[index].style.cursor = 'default';
        createCorrectBirdCard(level);
        setCorrectGameState();
        if (level === 5) {
          finishGame();
        }
      } else {
        console.log('wrong!');
        if (!answerState) {
          answerIcons[index].classList.add('wrong-answer');
          //TODO: добавить звук неправильного ответа
          points--;
        }
        answerItems[index].classList.remove('item-hovered');
        answerItems[index].style.cursor = 'default';
      }
      showBirdInfo(index);
    });
  });
}

function showBirdInfo(index) {
  birdImgs[1].style.backgroundImage = `url(${birds[level][index].image})`;
  birdNames[1].textContent = birds[level][index].name;
  birdNameLatin.textContent = birds[level][index].species;
  birdDesc.textContent = birds[level][index].description;
  //TODO: add audio - birds[level][index].audio;
  birdNames[1].style.display = 'block';
  birdNameLatin.style.display = 'block';
  players[1].style.display = 'block';
  birdImgs[1].style.display = 'block';
}

function setCorrectGameState() {
  nextBtn.removeAttribute('disabled');
  if (!answerState) {
    console.log('score3', score);
    score += points;
    scoreWrap.textContent = `Ваши очки: ${score}`;
    points = 5;
  }
  answerState = true;
}

function handleNext() {
  level++;
  loadGame(score);
}

nextBtn.addEventListener('click', handleNext);

function showResults() {
  console.log('go to results page');
  addResultsNav();
  setResultsPageActive();
}

function finishGame() {
  gameFinished = true;
  nextBtn.textContent = 'Посмотреть результаты';
  nextBtn.removeEventListener('click', handleNext);
  nextBtn.addEventListener('click', showResults);
  resultsText.textContent = `Вы прошли игру и набрали ${score} из 30 возможных баллов`;
  playAgainBtn.classList.remove('hidden');
  if (score === maxScore) {
    playAgainBtn.classList.add('hidden');
  }
}

function playAgain() {
  restartGame();
  console.log('restart game');
  score = 0;
  level = 0;
  nextBtn.removeEventListener('click', showResults);
  nextBtn.addEventListener('click', handleNext);
  gameFinished = false;
  randomArr.length = 0;
  randomArr = getRandomArr();
  nextBtn.textContent = 'Следующий уровень';
  loadGame(score);
}

playAgainBtn.addEventListener('click', playAgain);


