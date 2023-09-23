import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

console.log(rightGuessString);

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === 'green' || oldColor === 'yellow') {
                return;
            }
            elem.style.backgroundColor = color;
            break;
        }
    }
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = document.getElementById("word-input").value.toLowerCase();
    let rightGuess = Array.from(rightGuessString);

    if (guessString.length != 5) {
        toastr.error("Not enough letters!");
        return;
    }

    /*
    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!");
        return;
    }
    */

    for (let i = 0; i < 5; i++) {
        let letterColor = '';
        let box = row.children[i];
        let letter = guessString[i];

        let letterPosition = rightGuess.indexOf(guessString[i]);

        if (letterPosition === -1) {
            letterColor = 'grey';
        } else {
            if (guessString[i] === rightGuess[i]) {
                letterColor = 'green';
            } else {
                letterColor = 'yellow';
            }

            rightGuess[letterPosition] = "#";
        }

        let delay = 250 * i;
        setTimeout(() => {
            animateCSS(box, 'flipInX');
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor);
        }, delay);
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!");
        guessesRemaining = 0;
        return;
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!");
            toastr.info(`The right word was: "${rightGuessString}"`);
        }
    }
}

function updateGuess() {
    let guess = document.getElementById("word-input").value.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    
    for (let box of row.children) {
        box.textContent = "";
        box.classList.remove("filled-box");
    }

    for (let i = 0; i < guess.length; i++) {
        let box = row.children[i];
        box.textContent = guess[i];
        box.classList.add("filled-box");
    }

    currentGuess = Array.from(guess);
}

const animateCSS = (element, animation, prefix = 'animate__') => {
    const animationName = `${prefix}${animation}`;
    const node = element;

    node.style.setProperty('--animate-duration', '0.3s');
    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
};

const collapsibleBtn = document.querySelector('.collapsible-btn');
const collapsibleContent = document.querySelector('.collapsible-content');

collapsibleBtn.addEventListener('click', function() {
    if (collapsibleContent.style.maxHeight) {
        collapsibleContent.style.maxHeight = null;
        collapsibleContent.style.opacity = '0';
        collapsibleBtn.innerText = "Show Hints";
    } else {
        collapsibleContent.style.maxHeight = collapsibleContent.scrollHeight + "px";
        collapsibleContent.style.opacity = '1';
        collapsibleBtn.innerText = "Hide Hints";
    }
});


document.getElementById("word-input").addEventListener("keyup", (e) => {
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    
    if (pressedKey === "Enter") {
        checkGuess();
        document.getElementById("word-input").value = "";  // Clear the input after submitting
        return;
    }

    updateGuess();
});

document.getElementById("submit-guess").addEventListener("click", () => {
    checkGuess();
    document.getElementById("word-input").value = "";  // Clear the input after submitting
});

initBoard();
