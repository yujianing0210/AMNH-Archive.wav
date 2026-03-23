# COPILOT INSTRUCTIONS — Extend Duration and Add Real-Time Scanline Playback

**“Do not replace the current working audio engine wholesale. Extend the existing step-analysis and playback system incrementally.”**

## Project context

The current refactor already improved the audio system substantially:

* sonic profile parameters are used more fully
* image analysis drives a 16-step melody
* playback includes drone + melody + texture
* lifecycle management is cleaner

However, two important issues remain:

1. The generated sound is still too short and repetitive.
2. The interaction does not yet feel like a real-time scan of the artifact image.

We want to improve the system so that it feels more like a museum artifact is being gradually “read” into sound over time.

Do not rewrite the full app.
Preserve the current upload, metadata, API, play, and library flow.

---

# MAIN GOALS

## Goal 1 — Make playback feel longer and less obviously looped

The current 16-step sequence is too short and repeats too quickly.

We want to:

* extend the effective musical duration
* reduce the obvious loop feeling
* keep the system lightweight and browser-friendly

## Goal 2 — Add a real-time left-to-right scanning interaction

We want the image to feel actively scanned over time, like a graphic score.

This means:

* a visible or internal playhead moves from left to right
* the sound is generated according to the current scan position
* the user perceives image → time mapping more directly

---

# DESIGN PRINCIPLE

The app should now behave more like this:

* metadata defines the long-form atmospheric behavior
* the image is treated as a time-based score
* the scanline moves across the image
* sound unfolds progressively as the scanline advances
* the loop is long enough that repetition is not immediately obvious

---

# PART 1 — EXTEND THE TIME STRUCTURE

## Current issue

The current 16-step sequence loops too quickly, which makes the repetition very obvious.

## New goal

Refactor the sequence system so that the overall playback duration becomes significantly longer, while still using image-derived data.

---

## Option to implement

Use **64 steps** instead of only 16 steps for the main melody timeline.

### Requirements

Refactor image analysis so that it supports a configurable number of slices:

```js
analyzeImageToSteps(imageElement, stepCount = 64)
```

Instead of hardcoding 16 slices, support 64 slices by default for the melody timeline.

This makes the image unfold more gradually from left to right.

---

## Why 64 steps

64 steps is long enough to reduce the obvious loop, but still lightweight enough for browser sequencing.

It also matches the reference project idea of:

* X-axis = time
* image scanned progressively

---

## Step slicing behavior

Divide the image into 64 vertical slices.

For each slice, compute at minimum:

* brightness
* contrast

Optional:

* saturation
* edge density

Return data like:

```js
[
  { brightness: 0.23, contrast: 0.41 },
  { brightness: 0.25, contrast: 0.46 },
  ...
]
```

---

## Melody mapping update

Refactor:

```js
mapStepsToMelody(stepData, notePool)
```

so that it can handle 64 steps.

Do not simply repeat the old 16-step logic four times.

Instead:

* directly map the full 64 slices to 64 time positions
* preserve rests in dark areas
* preserve velocity variation from contrast

---

## Reduce repetition further

Add slight generative variation per loop.

### Required variation rule

On each new loop cycle, introduce **subtle variation**, not full randomization.

Possible safe rules:

* slightly vary velocity by a small random amount
* occasionally shift one note up/down by one scale degree
* occasionally skip one non-critical note
* slightly vary texture event timing

This should be subtle enough that the artifact identity stays stable.

### Create helper

```js
function humanizeStepEvents(stepEvents, loopIndex)
```

This should return a lightly varied copy of the step events.

Important:

* keep the original stepEvents as the base identity
* do not destroy the image-derived structure
* do not randomize too aggressively

---

## Acceptance criteria for Part 1

After this update:

* playback should feel longer before repeating
* repetition should be less obvious
* image-to-time unfolding should feel more gradual
* the result should still feel tied to the same artifact

---

# PART 2 — ADD REAL-TIME SCANLINE / PLAYHEAD BEHAVIOR

## Current issue

The system currently generates a sequence from image data, but the user does not strongly perceive an active “scan” over the image.

## New goal

Create a real-time scanline playback model where the image acts as a graphic score.

The scanline should move from left to right over the image during playback.

---

## Implementation requirement

Please implement a playhead-based scan system.

### Core concept

At any moment during playback:

* there is a current step index
* that index corresponds to one vertical slice of the image
* that slice is the current sound source
* a visual playhead should move accordingly if possible

---

## Visual requirement

If possible within the current UI, overlay a scanline on top of the displayed image.

### Preferred implementation

* wrap the image preview in a relatively positioned container
* add an absolutely positioned thin vertical line
* update its horizontal position during playback

Example idea:

* a 2px wide glowing vertical line
* moves from left to right across the image
* resets when the loop restarts

If a full visual overlay is too invasive, at minimum implement the internal playhead logic first.

---

## Timing model

The playhead should advance one slice per step.

If the melody uses 64 steps, then the scanline should move across 64 positions.

The step timing should still follow rhythm density, but in a musically sensible way.

### Suggested mapping

* `sparse` → slower scan
* `moderate` → medium scan
* `dense` → faster scan

But keep the total scan duration long enough that the scan feels perceptible.

---

## Important structural change

Do not think of the melody anymore as a generic looped pattern.
Think of it as a **timeline traversal of the image**.

This means the playback engine should be organized around:

* `currentStepIndex`
* `totalStepCount`
* per-step event execution
* scanline position update

---

# PART 3 — CHANGE FROM SEQUENCE-AS-PATTERN TO SEQUENCE-AS-SCAN

## Goal

Make the playback engine conceptually and technically centered on scanning.

## Required refactor

Instead of only building a static `Tone.Sequence` and letting it loop invisibly, refactor so that each step is associated with scanline position and playback state.

### Create helper

```js
function buildScanSequence(stepEvents, synth, interval, onStep)
```

Where:

* `stepEvents` = the 64 image-derived events
* `synth` = main melody synth
* `interval` = timing unit
* `onStep(stepIndex, stepEvent)` = callback for UI scanline updates

Inside the sequence callback:

* trigger the sound for that step
* update the current playhead position
* call `onStep`

---

## Step callback behavior

For each step:

* if event is null, do nothing or only advance the scanline
* if event has note data, trigger synth with note + velocity
* update the current scanline position
* optionally trigger texture accents if needed

---

## Loop behavior

At loop restart:

* reset scanline position to left edge
* increment an internal loop counter
* optionally apply subtle humanization for the next pass

---

# PART 4 — SEPARATE LONG-FORM STRUCTURE FROM FAST LOCAL DETAIL

## Problem

If everything is driven only by one fixed 64-step line, it may still feel mechanically repetitive.

## Goal

Let different layers move on different timescales.

### Required behavior

#### Melody layer

* follows 64-step image scan directly

#### Drone layer

* slower cycle than melody
* changes every 1–2 bars or every large image region
* should not restart aggressively with every short loop feeling

#### Texture layer

* reacts more sparsely
* can respond to:

  * high contrast slices
  * material keywords
  * every N steps rather than every step

This creates a better museum-like unfolding rather than one rigid loop.

---

# PART 5 — OPTIONAL MACRO-SEGMENTATION OF THE IMAGE

## Optional but recommended

To make the sound feel more like a journey through the object, compute larger-scale image regions.

### Example

Divide the full 64-step scan into 4 macro-regions of 16 steps each:

* region 1 = left quarter
* region 2 = left-middle
* region 3 = right-middle
* region 4 = right quarter

For each region, compute summary values:

* average brightness
* average contrast
* average density

Create helper:

```js
function analyzeMacroRegions(stepData, regionCount = 4)
```

Use this to modulate:

* drone note choice
* texture intensity
* filter cutoff over time

This will make the scan feel more narratively structured.

This is optional, but highly desirable.

---

# PART 6 — VISUAL SCANLINE UI INTEGRATION

## Goal

Add a visible scanning line over the image preview area during playback.

## Requirements

Create a scanline DOM element if not already present.

Suggested structure:

* image container: `position: relative`
* scanline: `position: absolute`
* top: 0
* bottom: 0
* width: 2px
* pointer-events: none

### Helper function

```js
function updateScanline(stepIndex, totalSteps)
```

This should compute:

```js
const progress = stepIndex / (totalSteps - 1)
```

Then set scanline x position as a percentage of the container width.

### Also create

```js
function resetScanline()
function showScanline()
function hideScanline()
```

### Playback integration

* show scanline when playback starts
* update it every step
* reset when playback stops
* hide or fade when playback ends

---

# PART 7 — PRESERVE PERFORMANCE AND STABILITY

## Important constraints

This update must remain browser-friendly.

Do not add heavy animation frameworks or heavy CV libraries.

### Requirements

* keep Canvas analysis lightweight
* avoid recalculating the full image analysis on every note
* compute step data once after image load or when image changes
* reuse analyzed step data during playback
* reuse audio nodes where appropriate, but still dispose safely when rebuilding

---

# PART 8 — IMPLEMENTATION ORDER

Please implement in this order.

## Step 1

Refactor image analysis from fixed 16 steps to configurable 64 steps.

## Step 2

Update melody event generation to use 64-step data.

## Step 3

Refactor sequence builder into scan-based logic with step callback support.

## Step 4

Add subtle loop humanization.

## Step 5

Add scanline overlay DOM support and update logic.

## Step 6

Integrate scanline movement with playback callbacks.

## Step 7

Optionally add macro-region analysis for slower drone/textural variation.

Do not skip ahead before each step works.

---

# TESTING CHECKLIST

Please manually verify these after implementation:

## Duration / repetition

* playback takes noticeably longer before obvious repetition
* 64-step scan feels more gradual than 16-step loop
* the sound identity remains stable, not over-randomized

## Scan behavior

* scanline moves left to right during playback
* different image regions correspond to different melodic regions
* stopping playback resets scanline correctly
* replay starts scan from the left edge

## Layer behavior

* drone changes more slowly than melody
* texture remains subtle
* melody still clearly reflects image scanning

## Stability

* no extra stacked sequences after repeated play/stop
* scanline does not desync badly from playback
* switching images rebuilds correctly

---

# NON-GOALS

Do not do these in this update:

* do not add backend changes
* do not add ML-based image segmentation
* do not add full spatial audio engine yet
* do not rewrite the whole UI
* do not replace Tone.js

---

# FINAL EXPECTED RESULT

After this update, the app should feel less like a short looping pattern and more like a time-based curatorial sonification system:

* the artifact image becomes a long-form graphic score
* sound unfolds gradually from left to right
* playback duration is longer
* repetition is less obvious
* the scanline makes the interaction feel live and readable

