

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie value by name
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let cookie of cookies) {
        const pair = cookie.split('=');
        const cookieName = pair[0].trim();
        if (cookieName === name) {
            return pair[1];
        }
    }
    return null;
}

// Function to initialize a variable from a cookie or set a default value
function initOrGetFromCookie(name, defaultValue, days) {
    let cookieValue = getCookie(name);
    if (cookieValue === null) {
        setCookie(name, defaultValue, days);
        cookieValue = defaultValue;
    }
    return cookieValue;
}

// Check if cookies exist and fetch values
let centerLetter = initOrGetFromCookie("centerLetter",'',999);
let outerLetters = initOrGetFromCookie("outerLetters",'',999);
let possibleWords = initOrGetFromCookie("possibleWords", '', 999);
let answeredWords = initOrGetFromCookie("answeredWords", null, 999);
let score = initOrGetFromCookie("score", '0', 999);

answeredWords = answeredWords ? answeredWords.split(',') : [];
score = score ? parseInt(score) : 0;

// Function to start a new game
function newGame() {
    console.log("new game")
    fetch('./wordlists/kaikkisanat.txt')
        .then(response => response.text())
        .then(wordList => {
            wordList = wordList.split('\n').map(word => word.trim()).filter(word => /^[adehijklmnoprstuvyöä]+$/.test(word) && word.length >= 4);
            return wordList;
        })
        .then(wordList => {
            fetch('./wordlists/pangrams.txt')
                .then(response => response.text())
                .then(pangramList => {
                    pangramList = pangramList.split('\n').map(word => word.trim());
                    const [newCenterLetter, newOuterLetters, newPossibleWords] = generateHive(wordList, pangramList);
                    centerLetter = newCenterLetter;
                    outerLetters = newOuterLetters;
                    possibleWords = newPossibleWords;
                    answeredWords = [];
                    score = 0;

                    setCookie("centerLetter", centerLetter, 7);
                    setCookie("outerLetters", outerLetters.join(''), 7);
                    setCookie("possibleWords", possibleWords.join(','), 7);
                    setCookie("answeredWords", answeredWords.join(','), 7);
                    setCookie("score", score, 7);

                    updateUI();
                });
        });
}

// Function to generate a hive
function generateHive(wordList, pangramList) {
    const randomPangram = pangramList[Math.floor(Math.random() * pangramList.length)];
    const letters = new Set(randomPangram);
    const centerLetter = [...letters][Math.floor(Math.random() * letters.size)];
    const outerLetters = [...letters].filter(letter => letter !== centerLetter);
    const possibleWords = wordList.filter(word => {
        const wordLetters = new Set(word);
        return wordLetters.has(centerLetter) && [...wordLetters].every(letter => letters.has(letter));
    });
    return [centerLetter, outerLetters, possibleWords];
}

// Function to update the UI
function updateUI() {
    document.getElementById("center-letter").textContent = centerLetter;
    document.getElementById("outer-letters").textContent = outerLetters.join(' ');
    document.getElementById("score-value").textContent = score;
    const foundWordsElement = document.getElementById("found-words");
    foundWordsElement.innerHTML = '';
    answeredWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        foundWordsElement.appendChild(li);
    });
}

// Function to handle word submission
function handleWordSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    document.getElementById('user-input').value = '';

    if (answeredWords.includes(userInput)) {
        showMessage("Sana on jo löydetty!");
        return;
    }

    if (!possibleWords.includes(userInput)) {
        showMessage("Arvaus ei ole sanalistalla.");
        return;
    }

    answeredWords.push(userInput);
    score += calculateScore(userInput);

    setCookie("answeredWords", answeredWords.join(','), 7);
    setCookie("score", score, 7);

    updateUI();
    showMessage("Löysit sanan!");
}

// Function to calculate score
function calculateScore(word) {
    let score = word.length;
    if (word.length === 4) {
        score = 1;
    }
    if (new Set(word) === new Set([...outerLetters, centerLetter])) {
        score += 7;
    }
    return score;
}

// Function to show a message
function showMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    setTimeout(() => messageElement.textContent = '', 3000);
}

// Event listener for word submission
document.getElementById('word-input').addEventListener('submit', handleWordSubmit);

// Event listener for new game button
document.getElementById('new-game').addEventListener('click', newGame);

// Initialize the game
if (!centerLetter || !outerLetters || !possibleWords) {
    newGame();
} else {
    updateUI();
}
