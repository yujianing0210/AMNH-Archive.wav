可以。我先把你的两个核心诉求提炼清楚，再把它们分别转成：
# COPILOT INSTRUCTIONS — Rebalance Sound Layers and Add AI Artifact Record Inference

## Project context

The current app already supports:

* image upload
* database matching
* AI fallback
* three-layer sound generation
* scanline playback
* Sensor / Params / Library mobile-style UI

The current prototype is working, but two major issues need to be addressed:

1. The scan-driven 64-step middle layer has become too dominant, making the sound feel more choppy and less musically interesting.
2. When an uploaded image is not found in the database, the app shows `AI INFERRED RECORD` but does not generate a meaningful inferred artifact summary before generating sound.

This update should improve both the **sound hierarchy** and the **AI artifact inference pipeline**.

Do not rewrite the entire app.
Make incremental changes around the current working structure.

---

# MAIN GOALS

## Goal 1 — Rebalance the three-layer sound system

Refactor the sound engine so that:

* Bottom layer becomes the dominant musical layer
* Middle layer becomes a secondary image-driven modulation layer
* Surface layer remains sparse and textural

The system should sound less step-choppy and more like:

* a stable artifact-specific sonic bed
* gently modulated by image traversal
* accented by sparse material detail

---

## Goal 2 — Add layer weight controls in Params screen

Add 3 sliders to the Params screen so the user can control the relative contribution of:

* Bottom Layer
* Middle Layer
* Surface Layer

These sliders should influence playback in real time or near-real time.

They are not user genre controls.
They are system balance controls.

---

## Goal 3 — Improve artifact-specific sonic differentiation

Strengthen the sonic mapping so that different artifact classes sound much more distinct.

The sound generator should more strongly reflect:

* era
* material
* category
* function
* visual character

For example:

* gemstone → bright / shimmering / crystalline
* butterfly → light / agile / fluttering
* leather boot → dry / grounded / rustic
* fossil → ancient / rough / slow
* tool → structured / sharper / harder
* textile / garment → soft / flowing / fibrous

The result should not feel like the same engine with only small numeric changes.

---

## Goal 4 — Add a two-stage AI inference pipeline

When no database match is found, the system must:

### Stage 1

Generate an inferred artifact record first

### Stage 2

Generate the sonic profile from that inferred artifact record

Do not directly jump from unmatched image to sonic parameters.

The inferred record must exist before sound generation.

---

# PART 1 — REBALANCE THE THREE-LAYER SOUND ENGINE

## Current issue

The middle layer currently dominates because scanline / 64-step sequencing is too prominent.

## Required design change

Make the bottom layer the default anchor of the sound system.

### Bottom layer should now do more of the following

* carry the main atmospheric identity
* define tonal center and sustained mood
* contribute more audible continuity
* reflect metadata and inferred artifact character

### Middle layer should now do less of the following

* do not dominate rhythm or melody at every step
* do not feel like the main voice of the piece
* act more like a modulation / traversal layer

### Surface layer

* remain sparse
* support materiality and texture
* never overpower the bottom or middle layers

---

## Required implementation direction

Please refactor playback so that:

* the drone / bottom layer is more audible and more continuous
* the scan-driven layer triggers fewer dominant note events
* the middle layer may modulate:

  * filter
  * note probability
  * brightness of timbre
  * pitch motion
  * pan
* the surface layer becomes subtle accents only

### Important

Do not remove scanline logic.
Keep it, but make it less dominant in the final sound.

---

# PART 2 — ADD LAYER WEIGHT CONTROLS

## UI requirement

In the Params screen, add a new section named something like:

* `LAYER WEIGHT CONTROLS`
* or `THREE-LAYER BALANCE`

## Add 3 sliders

* Bottom Layer Weight
* Middle Layer Weight
* Surface Layer Weight

### Suggested default values

Use defaults that emphasize bottom layer, for example:

* Bottom: 0.6
* Middle: 0.25
* Surface: 0.15

These can be tuned.

---

## Behavior requirements

Adjusting these sliders should update playback behavior meaningfully.

### Bottom weight should affect things like

* drone gain / prominence
* sustained harmonic presence
* atmospheric continuity

### Middle weight should affect things like

* scan-driven note layer loudness
* filter motion depth
* image-driven event strength

### Surface weight should affect things like

* texture gain
* accent frequency
* accent sharpness or presence

If real-time updates are hard, rebuild or refresh audio engine safely after changes.

---

## State requirement

Store the layer weights in app state.

Suggested structure:

```js
layerWeights = {
  bottom: 0.6,
  middle: 0.25,
  surface: 0.15
}
```

These weights should be accessible by the audio engine and Params UI.

---

# PART 3 — STRENGTHEN ARTIFACT-SPECIFIC SONIC ARCHETYPES

## Current issue

Generated sounds are not yet differentiated enough by artifact class.

## Required change

Strengthen the semantic mapping from artifact identity to sonic character.

### Please create or improve an internal mapping layer such as

```js
getArtifactSonicArchetype(record)
```

This helper should inspect inferred or database metadata such as:

* era
* material
* category
* function
* description
* title keywords

and return high-level sonic tendencies.

---

## Example archetype directions

### Ancient / fossil / archaeological object

* slower
* darker
* rougher
* deeper reverb
* heavier drone
* lower register
* more sedimented / sparse surface accents

### Gem / jewel / crystal object

* brighter
* shimmering
* high register
* metallic or glass-like accents
* more sparkle in surface layer

### Butterfly / insect specimen

* lighter
* agile
* flutter-like melodic behavior
* softer but lively surface detail
* less heavy drone

### Leather footwear / rustic utilitarian object

* dry
* grounded
* muted
* earthy
* lower-mid register
* restrained surface layer

### Tool / instrument / mechanical object

* clearer attacks
* stronger structure
* more articulated middle layer
* tighter rhythmic feel

### Textile / garment / feather / woven object

* softer
* airy or flowing
* fibrous texture accents
* gentle movement

---

## Implementation note

Do not hardcode only a few exact objects.

Use broad category/material archetypes that can generalize.

---

# PART 4 — ADD A REAL AI ARTIFACT RECORD INFERENCE STAGE

## Current issue

When no database match exists, artifact summary values stay blank or incomplete.

## New required pipeline

### Step 1 — AI record inference

When database match fails:

* call a dedicated inference step first
* generate a structured artifact record

### Step 2 — sonic generation

Only after that record exists:

* generate sonic profile from inferred record + image features

---

## Required inferred record structure

Please generate and normalize a record object with fields like:

```js
{
  title,
  era,
  origin,
  culture,
  material,
  category,
  function,
  description,
  sourceType: "ai_inferred",
  sourceConfidence,
  inferenceSummary
}
```

### Notes

* fields can contain estimated labels
* do not leave them blank unless absolutely necessary
* if uncertain, use values like:

  * “Estimated modern specimen board”
  * “Estimated North American leather footwear”
  * “Estimated decorative mineral object”

The goal is to always produce a usable summary for UI and sound generation.

---

## API / pipeline design requirement

If the current code has only one AI generation request, split it logically into two stages:

### A. record inference request

image → inferred artifact record

### B. sonic profile request

artifact record + image stats → sonic profile

If needed, these can still happen in the same backend endpoint internally, but the frontend data model must clearly reflect the two-stage logic.

---

# PART 5 — UPDATE SENSOR SCREEN TO SHOW REAL AI RECORDS

## Required change

The `ArtifactSummaryCard` on the Sensor screen must display inferred values for unmatched images.

Do not show empty summary fields when source is AI inferred.

### Required fields to show

* title
* era
* origin / culture
* source badge

Optional:

* material
* category
* confidence

### Source badge values

* `DATABASE ARCHIVE`
* `AI INFERRED RECORD`

---

# PART 6 — UPDATE PARAMS SCREEN TO SHOW RECORD BASIS

## Required change

The Params screen should clearly indicate the record basis used for sound generation.

Update the `RecordSourceCard` so that it can display:

* matched database record
* AI inferred record
* optional confidence / note that it is estimated

This gives proper curatorial context for the generated sound.

---

# PART 7 — UI ADDITION FOR LAYER WEIGHT CONTROLS

## Place this section in Params screen

Preferably above or below the three layer cards.

Suggested order:

1. RecordSourceCard
2. Layer Weight Controls
3. BottomLayerCard
4. MiddleLayerCard
5. SurfaceLayerCard
6. TranslationSummaryCard

---

## Slider UI requirements

Each slider should show:

* layer label
* current numeric value or percentage
* immediate visual update

Suggested labels:

* `BOTTOM / HISTORICAL ATMOSPHERE`
* `MIDDLE / IMAGE TRAVERSAL`
* `SURFACE / MATERIAL TEXTURE`

---

# PART 8 — ACCEPTANCE CRITERIA

## Audio

* bottom layer is more perceptually dominant by default
* scanline layer no longer makes the whole piece feel overly choppy
* surface layer remains subtle
* overall sound feels more coherent and artifact-driven

## UI

* Params screen includes 3 working layer-weight sliders
* Sensor screen shows complete inferred artifact summaries for unmatched images
* RecordSourceCard clearly distinguishes database vs AI inferred

## Data / logic

* unmatched images go through record inference before sonic generation
* inferred records are stored in a structured object
* sound generation uses that record as input

## Differentiation

* butterfly, gem, fossil, leather object, textile, tool, etc. sound meaningfully different

---

# IMPLEMENTATION ORDER

Please implement in this order.

## Step 1

Add structured AI record inference stage for unmatched images.

## Step 2

Update current artifact state so inferred records populate ArtifactSummaryCard.

## Step 3

Refactor sonic generation to consume the inferred record more strongly.

## Step 4

Add or improve artifact sonic archetype mapping.

## Step 5

Rebalance bottom / middle / surface layer defaults.

## Step 6

Add layer weight controls to Params screen.

## Step 7

Connect sliders to playback behavior safely.

Do not skip ahead if earlier steps are incomplete.

---

# IMPORTANT SAFETY RULES

* do not break current save / replay / library logic
* do not remove scanline playback
* do not remove three-layer model
* do not turn Params into a genre-selection page
* do not leave AI inferred artifact summaries blank
* do not rewrite the app into a different framework

---

# FINAL EXPECTED RESULT

After this update:

* unmatched images produce meaningful inferred artifact records
* those records appear in the Sensor and Params screens
* sonic generation is more strongly grounded in artifact identity
* the bottom layer provides the main character of the piece
* middle and surface layers act as modulation/detail layers
* the Params screen allows balancing the three layers interactively


**Focus first on the data pipeline for AI inferred artifact records, then on layer rebalance, then on the UI sliders. Do not start by tweaking CSS only.**
