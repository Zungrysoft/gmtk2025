import sounddevice as sd
import soundfile as sf
import numpy as np
import string
import random
import time
from pynput import keyboard
import queue
from scipy.signal import resample

# Audio settings
original_samplerate = 44100
target_samplerate = 11025
channels = 2  # Stereo input
bit_depth = 'PCM_16'

# Audio data queue
q = queue.Queue()

# Replace this with your device index from previous step
def get_scarlett_device_index():
    return 9

# Generate random filename
def generate_filename(length=16):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

# Audio callback
def callback(indata, frames, time, status):
    if status:
        print(status)
    q.put(indata.copy())

class Recorder:
    def __init__(self):
        self.recording = False
        self.stream = None
        self.frames = []

    def start_recording(self):
        self.frames = []
        self.recording = True
        self.stream = sd.InputStream(
            samplerate=original_samplerate,
            channels=channels,
            callback=callback,
            device=get_scarlett_device_index()
        )
        self.stream.start()
        print("Recording started...")

    def stop_recording(self):
        self.recording = False
        self.stream.stop()
        self.stream.close()
        
        while not q.empty():
            self.frames.append(q.get())
        
        if not self.frames:
            print("No audio captured.")
            return

        audio_data = np.concatenate(self.frames)

        # Split into left and right
        left = audio_data[:, 0]
        right = audio_data[:, 1]

        # Resample both channels to 11025Hz
        num_samples = int(len(left) * target_samplerate / original_samplerate)
        left_resampled = resample(left, num_samples)
        right_resampled = resample(right, num_samples)

        # Ensure mono 16-bit output
        left_resampled = np.int16(left_resampled * 32767)
        right_resampled = np.int16(right_resampled * 32767)

        # Generate filenames
        left_filename = generate_filename()
        right_filename = generate_filename()

        # Write to mono files
        sf.write(f"sounds/conversations/{left_filename}.wav", left_resampled, target_samplerate, subtype=bit_depth)
        sf.write(f"sounds/conversations/{right_filename}.wav", right_resampled, target_samplerate, subtype=bit_depth)

        # Print file names without extensions
        print("Mic A: ", left_filename)
        print("Mic B: ", right_filename)

recorder = Recorder()

import threading

# Flag to stop the program
exit_flag = threading.Event()

def on_press(key):
    if key == keyboard.Key.space and not recorder.recording:
        recorder.start_recording()

def on_release(key):
    if key == keyboard.Key.space and recorder.recording:
        recorder.stop_recording()
    elif key == keyboard.Key.esc:
        print("\nESC pressed. Exiting.")
        exit_flag.set()
        return False

print("Press and hold space bar to record...\nPress ESC to quit.")

with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    while not exit_flag.is_set():
        time.sleep(0.1)
