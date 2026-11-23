"""Make the original score and time the effects against the 34-second cut."""
import subprocess
import wave

import numpy as np

RATE = 48000
DURATION = 34


def build_soundtrack(ffmpeg, reference, target):
    music = np.zeros((DURATION * RATE, 2))
    effects = np.zeros_like(music)
    rng = np.random.default_rng(25)

    def timeline(seconds):
        return np.arange(round(seconds * RATE)) / RATE

    def place(track, seconds, sound, gain, pan=0):
        start = round(seconds * RATE)
        count = min(len(sound), len(track) - start)
        track[start:start + count] += sound[:count, None] * gain * np.sqrt([1 - pan, 1 + pan])

    def pluck(note, length, decay, color=.24):
        time = timeline(length)
        phase = 2 * np.pi * (440 * 2 ** ((note - 69) / 12)) * time
        tone = np.sin(phase) + color * np.sin(2 * phase) + .08 * np.sin(3 * phase)
        return tone * np.minimum(time / .007, 1) * np.exp(-decay * time) * np.clip((length - time) / .03, 0, 1)

    def drum(kind):
        time = timeline(.20 if kind == 'kick' else .12)
        if kind == 'kick':
            phase = 2 * np.pi * (48 * time + 2.2 * (1 - np.exp(-time * 36)))
            tone, decay = np.sin(phase), 24
        else:
            noise = rng.standard_normal(len(time))
            tone, decay = np.diff(noise, prepend=0) * .32, 46 if kind == 'snare' else 92
        return tone * np.minimum(time / .002, 1) * np.exp(-decay * time)

    def speech_pulse(frequency, length):
        time = timeline(length)
        phase = 2 * np.pi * frequency * time
        # Approximate a console pulse channel with a band-limited 25% duty cycle.
        pulse = sum(np.sin(np.pi * harmonic / 4) / harmonic * np.cos(harmonic * phase)
                    for harmonic in range(1, int(6500 / frequency) + 1))
        edge = np.minimum(time / .005, 1) * np.clip((length - time) / .018, 0, 1)
        return pulse * edge * np.exp(-7 * time) / np.max(np.abs(pulse))

    # 120 BPM, a short staccato motif over a changing minor-key bass line.
    chords = ((45, (69, 72, 76, 79)), (41, (69, 72, 76, 77)),
              (48, (67, 72, 74, 76)), (43, (67, 71, 74, 79)))
    for bar in range(15):
        downbeat = 4 + 2 * bar
        bass, chord = chords[bar % len(chords)]
        gameplay = 16 <= downbeat < 30
        for beat, offset in ((0, 0), (.75, 12), (1, 0), (1.5, 7)):
            place(music, downbeat + beat, pluck(bass + offset, .38, 12, .12), .14)
        for offset, degree, pan in ((0, 0, -.24), (.375, 2, .2), (.75, 1, -.2),
                                    (1.125, 3, .26), (1.5, 2, -.16), (1.75, 1, .15)):
            if gameplay or offset not in (.75, 1.75):
                place(music, downbeat + offset, pluck(chord[degree], .35, 15), .092, pan)
        for beat in range(8):
            if gameplay or beat % 2 == 0:
                place(music, downbeat + beat * .25, drum('hat'), .060 if gameplay else .041, .22)
        for beat in (0, 1):
            place(music, downbeat + beat, drum('kick'), .19 if gameplay else .13)
        for beat in (.5, 1.5):
            place(music, downbeat + beat, drum('snare'), .108 if gameplay else .075, -.12)

    # Use only two short, isolated effects from the report trailer's opening.
    raw = subprocess.check_output([str(ffmpeg), '-v', 'error', '-i', str(reference),
                                   '-vn', '-ac', '1', '-ar', str(RATE), '-f', 'f32le', '-'])
    reference_audio = np.frombuffer(raw, '<f4')

    def extract(start, end):
        clip = reference_audio[round(start * RATE):round(end * RATE)].copy()
        fade = round(.008 * RATE)
        clip[:fade] *= np.linspace(0, 1, fade)
        clip[-fade:] *= np.linspace(1, 0, fade)
        return clip / np.max(np.abs(clip))

    click = extract(.52, .63)
    transition = extract(3.64, 3.82)
    for index, time in enumerate((.32, .47, .63, .80, .95, 1.11, 1.25, 1.41, 1.55, 1.69, 1.82, 1.98, 2.13)):
        place(effects, time, click, .19 if index % 3 == 0 else .14, (-1) ** index * .13)
    for time, gain in ((4, .25), (16.5, .28), (20.5, .14), (29.5, .22)):
        place(effects, time, transition, gain)
    for time in (17.44, 19.39):
        place(effects, time, pluck(49, .20, 15, .65), .24, -.15)
    for time in (24.43, 26.56):
        place(effects, time, pluck(81, .27, 12), .22, .16)
    for offset, note in enumerate((72, 76, 79, 84)):
        place(effects, 28 + offset * .086, pluck(note, .68, 6), .22, -.2 + offset * .13)

    # Each phrase is timed by ear against the subtitle cut, with space at punctuation.
    # Event 01-02.intro, lines 2–5: Saeki, Makabe, the player, then Makabe again.
    speech_phrases = (
        (740, .10, -.14, ((4.14, 5.34), (5.50, 7.28), (7.49, 8.60))),
        (455, .115, .10, ((9.08, 10.43), (10.60, 11.19))),
        (390, .102, -.05, ((11.58, 12.17), (12.28, 13.52))),
        (455, .115, .10, ((14.08, 14.42), (14.57, 15.66))),
    )
    for base, spacing, pan, phrases in speech_phrases:
        for start, end in phrases:
            for index, onset in enumerate(np.arange(start, end - .07, spacing)):
                semitones = (0, 1, -1, 0, 2, -1)[index % 6]
                pitch = base * 2 ** (semitones / 12)
                duration = .049 if index % 3 == 1 else .068
                place(effects, onset, speech_pulse(pitch, duration), .026, pan)

    # Give the clear cue and title some space, then fade before the video ends.
    time = timeline(DURATION)
    music *= np.interp(time, [0, 4, 4.25, 27.8, 28, 29.15, 29.6, 32.8, 34],
                      [0, 0, 1, 1, .4, .4, .85, .85, 0])[:, None]
    mix = music + effects
    peak = np.max(np.abs(mix))
    assert peak > 0
    mix *= .83 / peak
    with wave.open(str(target), 'wb') as output:
        output.setparams((2, 2, RATE, 0, 'NONE', 'not compressed'))
        output.writeframes(np.round(mix * 32767).astype('<i2').tobytes())
