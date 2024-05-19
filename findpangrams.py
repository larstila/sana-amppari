# Create pangram form desired wordlists
# CHANGE THESE TO YOUR OWN:
original_file_path = 'wordlists/kaikkisanat.txt'
pangram_file_path = 'wordlists/pangrams.txt'

import re

def unique_letters(words):
    unique_chars = set(words)
    unique_string = ''.join(unique_chars)
    return len(unique_string)


def find_pangrams(word_list):
    pangram_list = [];
    for word in word_list:
        if unique_letters(word) == 6:
            pangram_list.append(word)
    return pangram_list

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


word_list = import_dict(original_file_path)
pangram_list = find_pangrams(word_list)

with open(pangram_file_path, mode='w', encoding='utf-8') as myfile:
    for word in pangram_list:
        myfile.write(f"\n{word}")
