import random
import re

def generate_hive(word_list):
    letters = list(set(''.join(word_list)))  # Unique letters from the word list
    while True:
        random.shuffle(letters)
        center_letter = letters.pop()
        outer_letters = random.sample(letters, 6)
        if count_valid_words(center_letter, outer_letters, word_list) >= 10:
            return center_letter, outer_letters


def import_dict(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            # Strip whitespace and filter lines
            filtered_lines = [line.strip().lower() for line in lines 
                              if re.match(r'^[adehijklmnoprstuvöä]+$', line.strip().lower()) 
                              and len(line.strip()) >= 4]
        return filtered_lines

    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []


def is_valid_word(word, center_letter, outer_letters):
    if len(word) < 4:
        return False
    if center_letter not in word:
        return False
    for letter in word:
        if letter not in outer_letters and letter != center_letter:
            return False
    return True

def count_valid_words(center_letter, outer_letters, word_list):
    count = 0
    for word in word_list:
        if is_valid_word(word, center_letter, outer_letters):
            count += 1
    return count



def generate_hive():
    # Create a hive with one center letter and six outer letters
    letters = list(set(''.join(word_list)))  # unique letters from the word list
    random.shuffle(letters)
    center_letter = letters.pop()
    outer_letters = random.sample(letters, 6)
    possible_words = [word for word in word_list if is_valid_word(word, center_letter, outer_letters)]
      
    return center_letter, outer_letters, possible_words

def check_hive(center_letter, outer_letters, possible_words):
    if len(possible_words) < 10 or len(possible_words) > 50:
        return False
    pangram = [word for word in possible_words if set(word) == set(outer_letters + [center_letter])]
    if len(pangram) == 0:
        return False  
    return True    
    
    


# Example usage
file_path = '../wordlists/kaikkisanat.txt'
#file_path = "short.txt"
word_list = import_dict(file_path)

def play_game():

    while (True):
        print('lol')
        center_letter, outer_letters, possible_words = generate_hive()
        if(check_hive(center_letter,outer_letters, possible_words)):
            break
    total_score = 0
    found_words = []

    print(f"Tervetuloa pelaamaan sana-ampparia!")
    print(f"Arvaa sana joka sisältää näitä kirjaimia, joista keskimmäistä ainakin kerran.")
    print(f"Center letter: {center_letter}")
    print(f"Outer letters: {' '.join(outer_letters)}")

    while True:
        user_input = input("\nArvaa sana (tai 'exit'): ").strip().lower()
        if user_input == 'exit':
            break
        elif user_input == 'vastaus':
            print('correct words:')
            for word in possible_words:
                print(word)
            break
        
        if user_input in found_words:
            print("Sana on jo löydetty!")
            continue

        if not user_input in possible_words:
            print("Arvaus ei ole sanalistalla.")
            continue
        
        word_score = calculate_score(user_input, center_letter, outer_letters)
        total_score += word_score
        found_words.append(user_input)
        
        print(f"Löysit sanan! Pisteet: {word_score}. Kokonaispisteet: {total_score}")

    print(f"\nPeli päättyi. Loppupisteet: {total_score}")

def calculate_score(word, center_letter, outer_letters):
    if not is_valid_word(word, center_letter, outer_letters):
        return 0
    score = len(word)
    if len(word) == 4:
        score = 1
    else:
        score = len(word)
    if set(word) == set(outer_letters + [center_letter]):
        score += 7  # Extra points for pangrams

    return score

if __name__ == "__main__":
    play_game()