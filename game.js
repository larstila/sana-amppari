// Define global variables
let centerLetter, outerLetters, possibleWords, foundWords = [];
let score = 0;


// Function to check if a word is valid
function isValidWord(word, centerLetter, outerLetters) {
    if (word.length < 4) return false;
    if (!word.includes(centerLetter)) return false;
    for (const letter of word) {
        if (!outerLetters.includes(letter) && letter !== centerLetter) {
            return false;
        }
    }
    return true;
}

// Function to calculate the score of a word
function calculateScore(word, centerLetter, outerLetters) {
    if (!isValidWord(word, centerLetter, outerLetters)) return 0;
    let score = word.length;
    if (word.length === 4) {
        score = 1;
    } else {
        score = word.length;
    }
    if (new Set(word) === new Set([...outerLetters, centerLetter])) {
        score += 7;
    }
    return score;
}

// Function to update the UI with the current game state
// Event listener for submitting a word
const btn = document.querySelector("button");
let wordInput = document.getElementById('word-input');
console.log(wordInput)
wordInput.addEventListener('submit', function(event) {
    console.log("event happened")
    event.preventDefault();
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();

    let bannerMessage = '';
    let bannerClass = ''    
    let scoreChange = 0;

    // Check if the user input is a valid word
    if (!isValidWord(userInput, centerLetter, outerLetters)) {
        bannerMessage = 'Invalid guess';
        bannerClass = 'error'
    } else if (!possibleWords.includes(userInput)) {
        bannerMessage = 'Word not in wordlist';
        bannerClass = 'error'
    } else {
        // Calculate the score if the word is valid and in the word list
        scoreChange = calculateScore(userInput, centerLetter, outerLetters);
        score += scoreChange;
        answeredWords.push(userInput);
        bannerClass = 'success'
    }

    // Update the page banner with the appropriate message and class
    const bannerElement = document.getElementById('banner');
    bannerElement.textContent = bannerMessage;
            // Add the answered word to the list
    

            // Update the list of answered words
    updateAnsweredWordsList();
    
    // Update the score display
    document.getElementById('score').textContent = `Score: ${score}`;

    // Clear the input field
    document.getElementById('word').value = '';

    // Optionally, update other UI elements based on the game state
    // For example:
    // updateUI();

    // Optionally, update the list of found words
    // For example:
    // updateFoundWordsList(userInput, scohreChange);
});

// Function to update the list of answered words in the UI
function updateAnsweredWordsList() {
    const answeredWordsListElement = document.getElementById('found-words');
    // Clear the existing list
    answeredWordsListElement.innerHTML = '';
    // Add each answered word to the list
    answeredWords.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        answeredWordsListElement.appendChild(listItem);
    });
}

// Initialize the game
fetch('wordlist/kaikkisanat.txt')
    .then(response => response.text())
    .then(wordList => {
        wordList = wordList.split('\n').map(word => word.trim().toLowerCase())
                             .filter(word => /^[adehijklmnoprstuvyöä]+$/.test(word) && word.length >= 4);
        [centerLetter, outerLetters, possibleWords] = generateHive(wordList);
        updateUI();
    })
    .catch(error => {
        console.error(`Error fetching word list: ${error}`);
    
    });


    // Function to import the word list from a file
function importDict(filePath) {
    // Your code for importing the word list
    try {
        const data = fs.readFileSync("wordlist/kaikkisanat.txt", 'utf-8');
        const lines = data.split('\n');

        // filter lines to remove words with special characters and rare finnish letters (bcfgwxz)
        const filteredLines = lines.map(line => line.trim().toLowerCase())
                                    .filter(line => /^[adehijklmnoprstuvyöä]+$/.test(line) && line.length >= 4);
        return filteredLines;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return [];
    }
}

// Function to generate the hive of letters and possible words
function generateHive(wordList) {
    const letters = [...new Set(wordList.join(''))];
    while (true) {
        random.shuffle(letters);
        const centerLetter = letters.pop();
        const outerLetters = random.sample(letters, 6);
        const possibleWords = wordList.filter(word => isValidWord(word, centerLetter, outerLetters));
        if (checkHive(possibleWords)) {
            return [centerLetter, outerLetters, possibleWords];
        }
    }
}

// TODO: make some fancier filtering to better Hives, for example etu- ja takavokaali separation.

function checkHive(possibleWords) {
    if (possibleWords.length < 10 ) return false;
    const pangram = possibleWords.filter(word => new Set(word) === new Set([...outerLetters, centerLetter]));
    if (pangram.length === 0) return false;
    return true;
}
