import Experience from './Experience/Base/Experience';

const experience = new Experience(document.querySelector('.experience-canvas'));

const userInterface = document.querySelector('.interface');
const arrowWrapper = document.querySelector('.arrow');
const arrow = document.querySelector('.ui-arrow');
arrowWrapper.addEventListener('click', () => {
  arrow.classList.toggle('flip-y');
  userInterface.classList.toggle('interface-in');
});
