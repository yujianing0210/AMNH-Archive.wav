# COPILOT INSTRUCTIONS — Audio Logic Refactor for Museum Sonic Archive

## Project context

This project is a browser-based prototype that turns a museum artifact image into a playable sonic identity.

The current implementation already does these things:

* user uploads an image
* app tries to match an artifact from local metadata
* app calls an API to generate a structured sonic profile JSON
* app uses Tone.js to play a simple arpeggiated sequence

Current sound generation is too simple.
It mainly uses:

* `bpm`
* `synth_type`
* `reverb_size`
* `rhythm_density` (only partially)

But it does **not yet fully use**:

* `scale`
* `register`
* image-driven sequencing
* multi-layer sound design

We want to refactor the sound generation logic in **three gradual layers**, without breaking the existing UI and API flow.

---

## High-level refactor goals

Please modify the current codebase incrementally so that the sound engine becomes more expressive and better aligned with the project concept.

### Target design principle

* **metadata / LLM output = skeleton**

  * determines overall sound character
* **image features = flesh**

  * determines step-by-step melodic and rhythmic variation

### Refactor priorities

1. Fully use existing JSON sonic parameters
2. Add image-driven 16-step sequencing
3. Upgrade from one synth layer to a 3-layer sound structure

Do not rewrite the whole app from scratch.
Preserve existing upload flow, API flow, and library logic as much as possible.

---

# PHASE 1 — Fully use existing JSON sonic parameters

## Goal

Refactor the current Tone.js playback logic so that these fields are actually used in sound generation:

* `bpm`
* `scale`
* `register`
* `synth_type`
* `reverb_size`
* `rhythm_density`

## Current issue

The current code uses a fixed note list such as:

* `["C4", "D4", "E4", "G4", "A4", "C5"]`

and does not truly use `scale` or `register`.

## Required changes

### 1. Add a scale-to-note-system mapper

Create a helper function, for example:

```js
function getScaleNotes(scale, register)
```

This function should return an array of playable note names based on:

* `scale`
* `register`

### Mapping rules

Use simple note systems first. Root note can stay fixed at `C` for now unless root is added later.

#### Supported scales

* `major`

  * `["C", "D", "E", "F", "G", "A", "B"]`
* `minor`

  * `["C", "D", "Eb", "F", "G", "Ab", "Bb"]`
* `pentatonic`

  * `["C", "D", "E", "G", "A"]`
* `chromatic`

  * all 12 semitones
* fallback default:

  * pentatonic

### Register mapping

Map `register` into octave ranges:

* `low` → octaves 2 to 4
* `mid` → octaves 3 to 5
* `high` → octaves 4 to 6
* fallback default:

  * mid

The function should generate a note array across the chosen octave range.

Example:

* `pentatonic + low` might produce:

  * `["C2","D2","E2","G2","A2","C3","D3","E3","G3","A3","C4"]`

---

### 2. Improve rhythm density mapping

Right now rhythm density is too coarse.

Create a helper:

```js
function getSequenceInterval(rhythmDensity)
```

Mapping:

* `sparse` → `"2n"` or `"4n"`
* `moderate` → `"8n"`
* `dense` → `"16n"`
* fallback default:

  * `"8n"`

Choose one consistent mapping and apply it everywhere.

---

### 3. Improve synth type mapping

Create a helper:

```js
function createMainSynth(synthType)
```

Map `synth_type` to Tone synth settings.

Example starter mapping:

* `sine` → warm and soft
* `triangle` → soft but slightly textured
* `square` → bright and hollow
* `sawtooth` → buzzy and rich

Use `Tone.Synth` first if needed, but configure oscillator type and envelope more clearly.

Also add small envelope variation if possible.

Example:

* soft synths:

  * longer attack/release
* sharp synths:

  * shorter attack/decay

---

### 4. Improve reverb mapping

Create a helper:

```js
function createReverb(reverbSize)
```

Map `reverb_size` into reasonable `Tone.Reverb` decay values.

Example:

* small → 1.5
* medium → 3
* large → 6
* or map numeric values if `reverb_size` is already numeric

Keep this simple and robust.

---

### 5. Replace the fixed Pattern note source

Refactor the melody engine so it no longer uses hardcoded notes.

Instead:

* get notes from `getScaleNotes(scale, register)`
* get interval from `getSequenceInterval(rhythm_density)`

Then use these notes in the sequence or pattern.

---

### Acceptance criteria for Phase 1

After Phase 1:

* changing `scale` actually changes the pitch system
* changing `register` actually changes octave range
* changing `rhythm_density` changes note rate clearly
* changing `synth_type` changes timbre clearly
* changing `reverb_size` changes spatial feel clearly

Do not move to later phases until this works.

---

# PHASE 2 — Add image-driven 16-step sequencing

## Goal

Make the uploaded image actually affect the melodic sequence.

Right now image influences parameter generation indirectly, but not the actual step-by-step sequence.
We want image features to drive the sequence.

## Required changes

### 1. Add hidden canvas image analysis

After an image is uploaded, draw it into a hidden canvas.

Create a helper such as:

```js
function analyzeImageToSteps(imageElement)
```

This should:

* draw image to canvas
* divide image into **16 vertical slices**
* compute basic visual stats for each slice

For each slice, calculate at minimum:

* average brightness

Optional if easy:

* local contrast
* edge density

Start simple. Brightness is enough for the first version.

---

### 2. Return a 16-step data array

The function should return an array like:

```js
[
  { brightness: 0.12 },
  { brightness: 0.35 },
  { brightness: 0.81 },
  ...
]
```

Brightness should be normalized to 0–1.

---

### 3. Map brightness to note selection

Create a helper:

```js
function mapStepsToMelody(stepData, notePool)
```

For each of the 16 steps:

* use brightness to choose a note index from `notePool`
* darker slice → lower note
* brighter slice → higher note

If useful, quantize note index into integer positions.

Example logic:

```js
const index = Math.floor(brightness * (notePool.length - 1))
```

---

### 4. Add rests for very dark regions

To create more variation, add simple rest logic:

* if brightness is below a threshold, e.g. `0.12`
* set this step to `null`

This creates silence in dark image areas.

---

### 5. Optionally map contrast to velocity

If you compute local contrast per slice, then:

* low contrast → softer velocity
* high contrast → stronger velocity

If not, use a default fixed velocity first.

---

### 6. Replace the old generic up/down pattern

Do not use only a generic `Tone.Pattern(..., "upDown")`.

Instead, create a true 16-step sequence:

```js
new Tone.Sequence(...)
```

Each step should come from the analyzed image.

Each step event can contain:

```js
{
  note: "C4",
  velocity: 0.7
}
```

or `null` for rest.

---

### Acceptance criteria for Phase 2

After Phase 2:

* uploading different images should produce noticeably different melodic contours
* bright images should sound higher on average
* darker images should sound lower / sparser
* the sequence should be 16-step and visually/logically tied to image slices

---

# PHASE 3 — Upgrade to a 3-layer sound structure

## Goal

Upgrade from a single melodic synth into three layers:

1. drone layer
2. sequencer melody layer
3. texture layer

This should still stay lightweight and browser-friendly.

---

## Layer 1 — Drone layer

### Purpose

Represents the artifact’s overall atmospheric identity.

### Requirements

Create a helper:

```js
function createDroneLayer(profile)
```

This layer should:

* play sustained or slowly repeating low/mid notes
* use long attack/release
* be routed through reverb
* reflect overall mood

Use simple Tone.js tools:

* `Tone.PolySynth`
* or `Tone.Synth`
* or `Tone.AMSynth`

Keep it simple.

### Suggested behavior

* choose 1–2 notes from the lower part of the scale
* trigger long notes every bar or every two bars
* keep volume lower than melody

---

## Layer 2 — Melody layer

### Purpose

Carries the image-derived 16-step sequencer logic.

### Requirements

This is the main step sequence from Phase 2.

It should:

* use `Tone.Sequence`
* read from the 16-step analyzed sequence
* use the synth defined by `synth_type`
* follow `rhythm_density`

This is the main detail layer.

---

## Layer 3 — Texture layer

### Purpose

Adds materiality and artifact-like tactile sound detail.

### Requirements

Create a helper:

```js
function createTextureLayer(profile, artifactMetadata)
```

Use lightweight texture synths if possible:

* `Tone.NoiseSynth`
* `Tone.MetalSynth`
* `Tone.MembraneSynth`

### Suggested mapping

Simple initial mapping by material keywords:

* metal / bronze / iron → `Tone.MetalSynth`
* bone / wood / stone → short percussive clicks or `Tone.MembraneSynth`
* textile / feather / leather → soft `Tone.NoiseSynth`

If no metadata is available:

* use a soft default texture layer or disable this layer

### Triggering

Do not make it too busy.

Use sparse events:

* once every few steps
* or triggered by high-contrast image steps
* or triggered every bar

Keep volume subtle.

---

### Acceptance criteria for Phase 3

After Phase 3:

* the sound should no longer feel like just one arpeggiator
* there should be a background drone
* there should be a sequence layer driven by image
* there should be a subtle texture layer suggesting material quality

---

# CODE STRUCTURE REFACTOR REQUIREMENTS

## Goal

Improve maintainability without rewriting the app into many files unless necessary.

If possible, refactor the current `index.html` script section into clearly separated helper functions.

## Please create or refactor into these logical sections

### A. Parameter mapping helpers

Examples:

* `getScaleNotes(scale, register)`
* `getSequenceInterval(rhythmDensity)`
* `createMainSynth(synthType)`
* `createReverb(reverbSize)`

### B. Image analysis helpers

Examples:

* `analyzeImageToSteps(imageElement)`
* `computeBrightnessForSlice(...)`
* optional: `computeContrastForSlice(...)`

### C. Sequence-building helpers

Examples:

* `mapStepsToMelody(stepData, notePool)`
* `buildMelodySequence(stepEvents, synth, interval)`

### D. Layer creation helpers

Examples:

* `createDroneLayer(profile)`
* `createTextureLayer(profile, metadata)`

### E. Playback lifecycle helpers

Examples:

* `disposeAudioEngine()`
* `buildAudioEngine(profile, imageElement, metadata)`
* `startPlayback()`
* `stopPlayback()`

---

# IMPORTANT RESOURCE MANAGEMENT FIXES

The current code likely creates new Tone nodes on repeated playback.
Please fix lifecycle management carefully.

## Requirements

### 1. Keep references to all created audio nodes

Store references for:

* main synth
* drone synth
* texture synth
* reverb
* sequences / loops / patterns

### 2. Properly dispose old nodes before rebuilding

Implement a function like:

```js
function disposeAudioEngine()
```

This should:

* stop Transport if needed
* stop and dispose all sequences
* dispose all synths
* dispose reverb
* clear references

### 3. Avoid duplicated transport scheduling

When playback is rebuilt, make sure old scheduled events do not remain active.

### 4. Separate build vs play

Please separate:

* creating the audio graph
* starting playback
* stopping playback

Do not mix all logic into one button handler.

---

# UI / INTEGRATION RULES

## Preserve existing app behavior

Do not break these existing flows:

* image upload
* metadata matching
* API request for sonic profile
* reasoning summary display
* play button
* library saving

## Safe integration rule

Only replace the internals of the sound generation logic.
Avoid changing unrelated UI structure unless necessary.

---

# IMPLEMENTATION ORDER

Please implement in this exact order.

## Step 1

Refactor parameter mapping:

* scale
* register
* synth type
* rhythm density
* reverb

## Step 2

Make melody generation use scale/register instead of fixed note list.

## Step 3

Add hidden canvas analysis and 16-step brightness-based sequence.

## Step 4

Replace generic pattern with `Tone.Sequence`.

## Step 5

Add drone layer.

## Step 6

Add texture layer.

## Step 7

Add robust audio disposal and rebuild lifecycle.

Do not jump ahead before each previous step is working.

---

# TESTING CHECKLIST

After implementing, manually verify all of these:

## Phase 1 checks

* different `scale` values produce clearly different pitch collections
* different `register` values shift overall octave range
* `sparse` / `moderate` / `dense` audibly differ
* different synth types sound noticeably different
* reverb amount changes audible spaciousness

## Phase 2 checks

* a dark image and a bright image produce different melodic shapes
* image slices influence note contour
* some steps can be silent if image is dark enough

## Phase 3 checks

* drone is audible but not overpowering
* texture is subtle
* melody is still the clearest layer
* repeated play/stop does not stack extra synths
* switching images does not leave old sequences playing

---

# NON-GOALS

Please do **not** do the following in this refactor:

* do not add a backend rewrite
* do not add external heavy CV libraries
* do not add a full music generation model
* do not add AR or spatial audio engine
* do not rewrite the whole app into a new framework
* do not remove current API-based sonic profile generation

---

# OPTIONAL NICE-TO-HAVE IMPROVEMENTS

If implementation is smooth, these are welcome but optional:

* map image contrast to note velocity
* map edge density to extra ornament notes
* use root note in the future if added to API
* visualize the 16-step sequence on screen
* save analyzed step data in library items

But do not prioritize these before the main refactor is complete.

---

# FINAL EXPECTED RESULT

At the end of this refactor, the app should behave like this:

* LLM-generated artifact metadata defines the general sound identity
* uploaded image defines the detailed 16-step melodic behavior
* Tone.js plays a layered sound world:

  * drone
  * melody sequence
  * material texture
* playback is stable and reusable
* the code is cleaner and easier to extend
