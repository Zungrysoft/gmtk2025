import sys
import json
from pathlib import Path

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_speakers(audio_entries):
    return set(entry['speaker'].lower() for entry in audio_entries)

def match_speakers(audio_entries, speaker1, speaker2):
    speakers = extract_speakers(audio_entries)
    return speakers == {speaker1.lower(), speaker2.lower()}

def filter_conversations(data, speaker1, speaker2):
    return [entry for entry in data if match_speakers(entry.get('audio', []), speaker1, speaker2)]

def main():
    if len(sys.argv) != 4:
        print("Usage: python script.py data.json speaker1 speaker2")
        sys.exit(1)

    json_file, speaker1, speaker2 = sys.argv[1], sys.argv[2], sys.argv[3]

    if not Path(json_file).exists():
        print(f"File not found: {json_file}")
        sys.exit(1)

    data = load_json(json_file)
    matches = filter_conversations(data, speaker1, speaker2)

    if not matches:
        print(f"No conversations found with exactly these speakers: {speaker1}, {speaker2}")
    else:
        print(json.dumps(matches, indent=4))

if __name__ == "__main__":
    main()

'''
11. (taylor, jimmy)
'''