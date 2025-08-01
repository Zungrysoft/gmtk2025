import json
import os
import wave
import audioop
import pyttsx3
import multiprocessing

SPEAKER_VOICE_MAP = {
    "alfonso": "Microsoft Sean - English (Ireland)",
    "taylor": "Microsoft Richard - English (Canada)",
    "sam": "Microsoft James - English (Australia)",
    "jimmy": "Microsoft David Desktop - English (United States)",
    "zoe": "Microsoft Hazel Desktop - English (Great Britain)",
    "laura": "Microsoft Zira Desktop - English (United States)"
}

OUTPUT_RATE = 11025
OUTPUT_CHANNELS = 1  # mono
OUTPUT_SAMPWIDTH = 2  # 16-bit
OUTPUT_DIR = "sounds/conversations"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_voice_id_by_name(target_name):
    engine = pyttsx3.init()
    for voice in engine.getProperty('voices'):
        if target_name.lower() in voice.name.lower():
            return voice.id
    return None


def synthesize_clip(text, output_path, voice_name):
    voice_id = get_voice_id_by_name(voice_name)
    if voice_id is None:
        print(f"Voice '{voice_name}' not found. Skipping.")
        return

    temp_path = output_path + "_temp.wav"

    engine = pyttsx3.init()
    engine.setProperty('voice', voice_id)
    engine.save_to_file(text, temp_path)
    engine.runAndWait()

    with wave.open(temp_path, 'rb') as in_wav:
        params = in_wav.getparams()
        raw_data = in_wav.readframes(params.nframes)

        if params.nchannels != OUTPUT_CHANNELS:
            raw_data = audioop.tomono(raw_data, params.sampwidth, 1, 1)

        if params.sampwidth != OUTPUT_SAMPWIDTH:
            raise ValueError("Only 16-bit samples are supported.")

        if params.framerate != OUTPUT_RATE:
            raw_data, _ = audioop.ratecv(raw_data, OUTPUT_SAMPWIDTH, OUTPUT_CHANNELS,
                                         params.framerate, OUTPUT_RATE, None)

    with wave.open(output_path, 'wb') as out_wav:
        out_wav.setnchannels(OUTPUT_CHANNELS)
        out_wav.setsampwidth(OUTPUT_SAMPWIDTH)
        out_wav.setframerate(OUTPUT_RATE)
        out_wav.writeframes(raw_data)

    os.remove(temp_path)


def process_audio_line(args):
    speaker, text, sound = args
    voice_name = SPEAKER_VOICE_MAP.get(speaker)
    output_path = os.path.join(OUTPUT_DIR, f"{sound}.wav")
    synthesize_clip(text, output_path, voice_name)


if __name__ == "__main__":
    with open("data/conversations.json", "r", encoding="utf-8") as f:
        dialogues = json.load(f)

    jobs = []
    for entry in dialogues:
        for line in entry["audio"]:
            jobs.append((line["speaker"], line["text"], line["sound"]))

    with multiprocessing.Pool(processes=1) as pool:
        pool.map(process_audio_line, jobs)

    print("done")
