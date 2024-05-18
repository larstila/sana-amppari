const fs = require('fs');
const readline = require('readline');
const random = require('random');

function importDict(file_path) {
    try {
        const data = fs.readFileSync(file_path, 'utf-8');
        const lines = data.split('\n');
        const filteredLines = lines.map(line => line.trim().toLowerCase())
                                    .filter(line => /^[adehijklmnoprstuvöä]+$/.test(line) && line.length >= 4);
        return filteredLines;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return [];
    }
}

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

function checkHive(possibleWords) {
    if (possibleWords.length < 10 || possibleWords.length > 50) return false;
    const pangram = possibleWords.filter(word => new Set(word) === new Set([...outerLetters, centerLetter]));
    if (pangram.length === 0) return false;
    return true;
}

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

function playGame() {
    const file_path = 'kaikkisanat.txt';
    const wordList = importDict(file_path);

    while (true) {
        const [centerLetter, outerLetters, possibleWords] = generateHive(wordList);
        if (checkHive(possibleWords)) {
            break;
        }
    }

    let totalScore = 0;
    const foundWords = [];

    console.log("Tervetuloa pelaamaan sana-ampparia!");
    console.log(`Arvaa sana joka sisältää näitä kirjaimia, joista keskimmäistä ainakin kerran.`);
    console.log(`Center letter: ${centerLetter}`);
    console.log(`Outer letters: ${outerLetters.join(' ')}`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.prompt();

    rl.on('line', (input) => {
        const userInput = input.trim().toLowerCase();
        if (userInput === 'exit') {
            rl.close();
            return;
        } else if (userInput === 'vastaus') {
            console.log('correct words:');
            for (const word of possibleWords) {
                console.log(word);
            }
            rl.close();
            return;
        }

        if (foundWords.includes(userInput)) {
            console.log("Sana on jo löydetty!");
            rl.prompt();
            return;
        }

        if (!possibleWords.includes(userInput)) {
            console.log("Arvaus ei ole sanalistalla.");
            rl.prompt();
            return;
        }

        const wordScore = calculateScore(userInput, centerLetter, outerLetters);
        totalScore += wordScore;
        foundWords.push(userInput);

        console.log(`Löysit sanan! Pisteet: ${wordScore}. Kokonaispisteet: ${totalScore}`);
        rl.prompt();
    });

    rl.on('close', () => {
        console.log(`\nPeli päättyi. Loppupisteet: ${totalScore}`);
    });
}

if (require.main === module) {
    playGame();
}
