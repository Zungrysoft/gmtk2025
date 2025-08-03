import os
import sys
import json
import shutil

def collect_sound_keys(json_data):
    sound_keys = set()
    for entry in json_data:
        audio_entries = entry.get("audio", [])
        for audio in audio_entries:
            sound = audio.get("sound")
            if sound:
                sound_keys.add(sound)
    return sound_keys

def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py path_to_json_file")
        sys.exit(1)

    json_path = sys.argv[1]

    if not os.path.isfile(json_path):
        print(f"Error: JSON file '{json_path}' not found.")
        sys.exit(1)

    with open(json_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error: Failed to parse JSON - {e}")
            sys.exit(1)

    valid_sounds = collect_sound_keys(data)

    unused_dir = os.path.join('.', 'unused')
    os.makedirs(unused_dir, exist_ok=True)

    for filename in os.listdir('.'):
        if filename.endswith('.wav'):
            sound_id = os.path.splitext(filename)[0]
            if sound_id not in valid_sounds:
                src_path = os.path.join('.', filename)
                dst_path = os.path.join(unused_dir, filename)
                print(f"Moving: {filename} → unused/")
                shutil.move(src_path, dst_path)

if __name__ == "__main__":
    main()
