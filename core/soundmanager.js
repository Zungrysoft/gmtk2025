import * as game from 'game'
import * as u from 'utils'

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

/** @module soundmanager */

let soundVolume = 1
let musicVolume = 1
let currentSounds = []
let currentMusic = []
const soundsTable = {}

/**
 * Set the sounds table that sound definitions refer back to. This
 * also gives a global listing of all sounds so that they can all be
 * managed
 */
export function setSoundsTable (sounds) {
  for (const key of Object.keys(sounds)) {
    soundsTable[key] = soundsTable[key] || sounds[key]
  }
}

let random = (low, high) => Math.random() * (high - low) + low
export function setRandom (value) {
  random = value
}

/**
 * Play a sound defined by its name in the sound table. Optionally
 * specify a volume and pitch.
 */
export function playSound (soundDef, volume = 1, pitch = [0.9, 1.1], position=[0, 0, 0]) {
  // If given an array of sounds, play the least recently played one
  if (Array.isArray(soundDef)) {
    const soundList = soundDef
    playSound(soundList.reduce((best, now) => (
      (soundsTable[best].lastPlayedTime || 0) < (soundsTable[now].lastPlayedTime || 0)
      ? best
      : now
    )), volume, pitch, position)
    return
  }

  const sound = soundsTable[soundDef]
  if (!sound) {
    console.warn(`Sound ${sound} does not exist!`)
    return;
  }
  sound.internalVolume = volume
  sound.volume = soundVolume * volume
  sound.currentTime = 0
  sound.playbackRate = (
    typeof pitch === 'number'
      ? pitch
      : random(pitch[0], pitch[1])
  )
  sound.preservesPitch = false
  sound.lastPlayedTime = (new Date()).valueOf()
  currentSounds.push(sound)
  sound.play()

  // Set positional audio position
  if (sound.isPositional) {
    try {
      sound.pannerObject.positionX.setValueAtTime(position[0], audioContext.currentTime);
      sound.pannerObject.positionY.setValueAtTime(position[2], audioContext.currentTime);
      sound.pannerObject.positionZ.setValueAtTime(position[1], audioContext.currentTime);
    }
    catch (error) {
      console.error('Error setting position of sound' + soundDef + ': ', error);
    }
  }

  return sound
}

export function playMusic (musicName, volume = 1) {
  const music = soundsTable[musicName]
  music.internalVolume = volume
  music.volume = musicVolume * volume
  music.currentTime = 0
  music.loop = true
  currentMusic.push(music)
  try {
    music.play()
  }
  catch (e) {
    return null
  }
  
  return music
}

export function setGlobalSoundVolume (volume = 1) {
  soundVolume = volume
}

export function setGlobalMusicVolume (volume = 1) {
  musicVolume = volume
}

export function getGlobalSoundVolume () {
  return soundVolume
}

export function getGlobalMusicVolume () {
  return musicVolume
}

/** Update sounds and music this frame */
export function update () {
  {
    let i = 1
    while (i < currentSounds.length) {
      if (currentSounds[i].paused) {
        currentSounds.splice(i, 1)
      } else {
        currentSounds[i].volume = soundVolume * currentSounds[i].internalVolume
        i += 1
      }
    }
  }

  {
    let i = 1
    while (i < currentMusic.length) {
      if (currentMusic[i].paused) {
        currentMusic.splice(i, 1)
      } else {
        currentMusic[i].volume = musicVolume * currentMusic[i].internalVolume
        i += 1
      }
    }
  }
}

/** Stop and reset all sounds and music. */
export function reset () {
  for (const sound of Object.values(soundsTable)) {
    sound.pause()
    sound.wasPlayingWhenPaused = false
  }
  currentSounds = []
  currentMusic = []
}

/** Pause all sounds and music, and mark them as paused. */
export function pause () {
  for (const sound of Object.values(soundsTable)) {
    sound.wasPlayingWhenPaused = !sound.paused
    sound.pause()
  }
}

/** Pause all sounds and music, and mark them as paused. */
export function stopAll () {
  for (const sound of Object.values(soundsTable)) {
    sound.pause();
  }
}

/** Unpause all previously paused sounds and music. */
export function unpause () {
  for (const sound of Object.values(soundsTable)) {
    if (sound.wasPlayingWhenPaused) {
      sound.play()
    }
  }
}

export function configurePositionalSound(soundDef = []) {
  if (Array.isArray(soundDef)) {
    for (const entry of soundDef) {
      configurePositionalSound(entry);
    }
    return;
  }

  try {
    const sound = game.assets.sounds[soundDef];

    if (!sound) {
      throw new Error("Could not find sound " + soundDef);
    }

    // If already configured, skip
    if (sound.isPositional) return;

    const soundSource = audioContext.createMediaElementSource(sound);

    const panner = audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'exponential';
    panner.refDistance = 30;
    panner.maxDistance = 2000;
    panner.rolloffFactor = 1.2;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 360;
    panner.coneOuterGain = 1.0;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;

    // Connect nodes
    try {
      soundSource.disconnect(); // May not always be needed
    } catch (e) {
      // Ignore if already disconnected
    }

    soundSource.connect(analyser);
    analyser.connect(panner);
    panner.connect(audioContext.destination);

    sound.pannerObject = panner;
    sound.isPositional = true;

    if (!game.globals.audioSources) {
      game.globals.audioSources = [];
    }

    game.globals.audioSources.push({ panner, analyser });

  } catch (error) {
    console.error('Error configuring spatial audio:', error);
  }
}

export function updateSoundPan(position, lookVector) {
  const listener = audioContext.listener;
  const t = audioContext.currentTime;

  // Check for modern AudioParam API
  const hasPositionX = 'positionX' in listener;
  const hasForwardX = 'forwardX' in listener;

  if (hasPositionX) {
    listener.positionX.setValueAtTime(position[0], t);
    listener.positionY.setValueAtTime(position[2], t); // Note the [2]
    listener.positionZ.setValueAtTime(position[1], t); // [1] is height

    if (hasForwardX) {
      listener.forwardX.setValueAtTime(lookVector[0], t);
      listener.forwardY.setValueAtTime(lookVector[2], t);
      listener.forwardZ.setValueAtTime(lookVector[1], t);

      listener.upX.setValueAtTime(0, t);
      listener.upY.setValueAtTime(1, t);
      listener.upZ.setValueAtTime(0, t);
    } else {
      // Fallback orientation
      listener.setOrientation(
        lookVector[0], lookVector[2], lookVector[1], // forward
        0, 1, 0                                       // up
      );
    }

  } else {
    // Fallback to older methods
    listener.setPosition(position[0], position[2], position[1]); // re-map Y/Z
    listener.setOrientation(
      lookVector[0], lookVector[2], lookVector[1], // forward
      0, 1, 0                                       // up
    );
  }

  // Firefox does not support dopplerFactor; ignore if unsupported
  try {
    listener.dopplerFactor = 0;
  } catch (e) {
    // Do nothing
  }
}

