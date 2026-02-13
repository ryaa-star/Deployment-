const typingElement = document.getElementById('typing-text');
const textToType = "I create beautiful web experiences ";
let charIndex = 0;
function typeEffect() {
  if (charIndex < textToType.length) {
    typingElement.textContent += textToType.charAt(charIndex);
    charIndex++;
    setTimeout(typeEffect, 100); 
  }
}

typeEffect();