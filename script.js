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

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});