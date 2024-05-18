const fs = require('fs');
const random = require('random');

module.exports = async (req, res) => {
    const wordList = importDict('wordlist.txt');
    const [centerLetter, outerLetters, possibleWords] = generateHive(wordList);
    res.json({ centerLetter, outerLetters, possibleWords });
};

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