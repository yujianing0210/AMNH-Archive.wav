# COPILOT INSTRUCTIONS — UI Refactor for Museum Sonic Archive App

## Project context

We already have a working browser prototype that:

* uploads an artifact image
* matches metadata from database or falls back to AI inference
* generates a sonic profile
* plays scan-based layered audio
* supports saving generated sequences

The current UI is still desktop-like and uses a stretched horizontal layout.

We want to refactor the UI into a **phone-frame app interface** inspired by the visual language of the reference project, while keeping our own information architecture and component logic.

This refactor is primarily about **layout, screen structure, and component organization**.

Do **not** rewrite the audio engine or backend logic unless required for UI integration.

---

# TOP-LEVEL GOAL

Transform the current web page into a centered **mobile app simulation** with:

* a phone-like outer frame
* a fixed app header
* a fixed bottom tab bar with 3 tabs
* 3 main screens:

  1. Sensor
  2. Params
  3. Library

The UI style should borrow from the reference app:

* retro terminal / scanner aesthetic
* strong borders
* blue-purple accent color
* all-caps labels where appropriate
* modular panel-based layout
* feeling like an archive scanner / sonic terminal

But the actual content and structure should follow **our museum artifact logic**, not the reference app’s genre-selection logic.

---

# IMPORTANT RULES

## Preserve existing functionality

Do not break:

* image upload
* image preview
* database match / AI inference flow
* current artifact record state
* playback controls
* save functionality
* library data persistence

## Do not replace the working audio logic

The sound engine, scanline audio logic, and three-layer synthesis system should remain intact.

Only adapt UI wrappers and the way information is displayed.

## Prefer incremental refactor

Do not rewrite everything from scratch unless necessary.

Refactor existing HTML/CSS/JS into clearer app sections while preserving behavior.

---

# APP INFORMATION ARCHITECTURE

The app should have exactly 3 main tabs.

## Tab 1 — Sensor

Purpose:

* upload or capture image
* preview current artifact image
* show scanline playback
* start/stop sound generation
* show compact artifact metadata
* show whether metadata came from:

  * database
  * AI inferred record

This is the main interactive performance screen.

---

## Tab 2 — Params

Purpose:

* explain the generated sonic structure
* display the three-layer sound model:

  * Bottom Layer
  * Middle Layer
  * Surface Layer
* show the mapping between artifact/archive data and sound design

This is **not** a user genre-selection page.

Users should not manually choose music style here.

Instead, this page displays the generated parameters and layer logic.

---

## Tab 3 — Library

Purpose:

* show all saved sonic records
* show thumbnail + title + source + timestamp
* allow replay / re-open saved entries

This should feel like an archive of generated artifact-sonic records.

---

# REQUIRED APP SHELL COMPONENTS

## 1. `PhoneFrame`

Create a centered outer app frame that visually resembles a phone.

### Requirements

* centered horizontally on the page
* rounded black outer frame
* inner app area with its own background
* subtle shadow
* mobile portrait ratio
* should work responsively on desktop browser
* on smaller screens, it can fill more width but still preserve phone-like feel

### Visual goal

The web page should no longer feel like a full-width desktop dashboard.
It should feel like viewing a mobile app prototype inside a phone shell.

---

## 2. `AppHeader`

Create a fixed top header inside the phone frame.

### Content

* left: menu icon button
* center: app title
* right: settings or info icon button

### Title suggestion

Use something like:

* `[ MUSEUM_SONIC_ARCHIVE ]`
* or keep current project title if already defined

### Style

* compact
* retro-digital
* clearly separated by border
* visually consistent across all tabs

---

## 3. `BottomTabBar`

Create a fixed bottom navigation bar with 3 tabs.

### Tabs

* Sensor
* Params
* Library

### Each tab should include

* icon
* label
* active state
* tap/click interaction

### Behavior

* clicking tab switches visible screen
* active tab has stronger border/fill/highlight
* the tab bar stays fixed at bottom inside phone frame

---

# SCREEN 1 — SENSOR

This is the main screen and the most important one.

It should focus on:

* image input
* image preview
* scanning / playback
* compact metadata
* system status

It should not feel text-heavy.

---

## Required Sensor screen components

### 4. `ModeToggle`

At the top of Sensor screen, add a two-part segmented control:

* `LIVE SENSOR`
* `STATIC UPLOAD`

### Behavior

* keep both tabs visible
* static upload can be the active mode for now
* live sensor can remain placeholder if not yet implemented
* do not remove this structure because it supports future expansion

---

### 5. `ImageViewport`

This is the visual center of the Sensor screen.

It must display:

* current uploaded image
* scanline overlay during playback
* optional current scan step label
* optional active border/glow while playing

### Requirements

* use a bordered panel
* image fits cleanly inside
* scanline overlay remains visible
* if no image is loaded, show a placeholder empty state
* do not distort image badly

### Visual behavior

When playing, the image viewport should feel like the artifact is being actively scanned.

---

### 6. `SystemLogPanel`

Add a small status/log panel below the image viewport.

### Purpose

This creates the archive terminal / instrument feeling.

### Example entries

* `IMAGE_LOADED`
* `DATABASE_MATCH_FOUND`
* `AI_RECORD_GENERATED`
* `SEQUENCER_PROTOCOL_ENGAGED`
* `SYNTHESIS_HALTED`
* `RECORD_SAVED_TO_ARCHIVE`

### Requirements

* compact terminal-like styling
* monospaced font
* recent messages visible
* scroll if necessary
* use existing state/events where possible

---

### 7. `ActionButtonGroup`

Create a vertical stack of primary action buttons.

### Required buttons

* `LOAD_NEW_IMAGE`
* `ENGAGE_SEQUENCER` or `STOP_SEQUENCER`
* `SAVE_SEQUENCE`

### Behavior

* preserve existing logic
* stop button should visually differ when active
* disabled states should be supported
* loading states optional but welcome

### Style

* bold bordered buttons
* retro-digital labels
* high visibility

---

### 8. `ArtifactSummaryCard`

Add a compact metadata summary panel on Sensor screen.

### Display only essential fields

* title
* era / period
* origin / culture
* source badge

### Source badge values

* `DATABASE ARCHIVE`
* `AI INFERRED RECORD`

### Optional extra fields

* confidence label
* short note
* “view details” button

### Important

Do not dump the full long metadata block here.
Sensor screen should stay compact and action-oriented.

---

## Sensor layout priority

Within Sensor screen, organize content in this approximate order:

1. ModeToggle
2. ImageViewport
3. SystemLogPanel
4. ArtifactSummaryCard
5. ActionButtonGroup

If spacing requires swapping ArtifactSummaryCard and ActionButtonGroup, that is acceptable.

---

# SCREEN 2 — PARAMS

This screen is for explanation and inspection, not user music-style control.

The current project uses an LLM-driven and image-driven system, so the Params screen should present the generated structure rather than manual genre options.

---

## Required Params screen components

### 9. `RecordSourceCard`

At the top of Params screen, show where the current artifact record came from.

### Display

* source type: database or AI inferred
* artifact title
* short system note / reasoning
* optional confidence

### Example labels

* `SOURCE: DATABASE MATCH`
* `SOURCE: AI ARCHIVE INFERENCE`

This gives context before showing parameters.

---

### 10. `LayerSectionCard`

Create a reusable card component for displaying each of the 3 sound layers.

This component should be used three times:

* Bottom Layer
* Middle Layer
* Surface Layer

Each card should include:

* layer title
* short conceptual subtitle
* short explanation sentence
* a list of parameter rows

---

## 10A. `BottomLayerCard`

### Purpose

Represents the artifact’s historical atmosphere / ambient bed.

### Should display parameters such as

* tonal center
* register
* drone intensity
* reverb depth
* harmonic mode / scale basis
* atmospheric density

### Description text example

“Expresses the artifact’s overall historical and spatial presence.”

---

## 10B. `MiddleLayerCard`

### Purpose

Represents image traversal / scanline-driven unfolding.

### Should display parameters such as

* scan resolution
* scan speed
* melodic density
* brightness mapping
* filter movement
* note triggering logic

### Description text example

“Translates the image into a time-based reading process.”

---

## 10C. `SurfaceLayerCard`

### Purpose

Represents material texture / sparse accent logic.

### Should display parameters such as

* material class
* texture engine type
* accent sparsity
* edge/contrast trigger behavior
* surface accent mode

### Description text example

“Adds sparse tactile accents that evoke the object’s surface qualities.”

---

### 11. `ParameterRow`

Create a reusable row component for displaying one parameter.

### Format

* label on left
* value on right
* optional short explanation below or inline

### Examples

* `Reverb Depth — 0.8`
* `Scan Resolution — 64 steps`
* `Texture Engine — soft noise`

---

### 12. `TranslationSummaryCard`

At the bottom of Params screen, display a translation/explanation summary.

### Purpose

Show how the system translated the artifact into sound.

### Content

Use existing LLM/system explanation if available.

This section should explain:

* why this artifact has this sonic identity
* how metadata and image contributed to the result

This gives the Params screen a curatorial rather than purely technical tone.

---

## Params screen layout priority

Arrange content in this approximate order:

1. RecordSourceCard
2. BottomLayerCard
3. MiddleLayerCard
4. SurfaceLayerCard
5. TranslationSummaryCard

Make this screen vertically scrollable.

---

# SCREEN 3 — LIBRARY

This screen should feel like an archive view for saved sonic records.

It should not be an empty blank page with only a single line of text.

---

## Required Library screen components

### 13. `LibraryHeader`

At the top of the Library screen, show:

* title: `GENERATION_ARCHIVE`
* optional count of saved records

Example:

* `GENERATION_ARCHIVE`
* `12 RECORDS`

---

### 14. `LibraryRecordCard`

Each saved record should be shown as a clear card.

### Required fields per record

* thumbnail
* title
* source badge
* timestamp
* short summary

### Optional actions

* replay
* open details
* delete (optional, not required now)

### Suggested summary examples

* `Bottom: warm drone`
* `Middle: bright scan`
* `Surface: soft wing texture`

---

### 15. `EmptyLibraryState`

If there are no saved records, show a designed empty state.

Do not only display plain text like `NO RECORDS FOUND`.

### Instead include

* icon or archive symbol
* title such as `ARCHIVE EMPTY`
* subtext such as `Saved sonic records will appear here.`

---

### 16. `LibraryRecordDetail` (optional but recommended)

If manageable without breaking the app, add a detail view for a selected record.

This can be:

* a modal
* a drawer
* a full subpage inside the Library tab

### Show

* larger image
* metadata summary
* source badge
* 3-layer sonic summary
* replay button

If this is too much for this refactor, leave a clean hook for future implementation.

---

# STATE AND DATA MODEL REQUIREMENTS

## Use a unified current record object

The UI should be driven by a consistent artifact record structure.

Use or adapt the current state into a normalized object like:

```js
{
  id,
  imageSrc,
  title,
  era,
  origin,
  culture,
  material,
  function,
  description,
  sourceType, // "database" | "ai_inferred"
  sourceConfidence,
  sonicProfile: {
    bottomLayer: {...},
    middleLayer: {...},
    surfaceLayer: {...}
  },
  translationSummary,
  createdAt
}
```

If the current code already has similar data, do not rebuild everything unnecessarily.
Just create a consistent mapping layer for UI rendering.

---

## Screen data usage

### Sensor screen uses

* imageSrc
* playback state
* scan progress
* title
* era
* origin/culture
* sourceType

### Params screen uses

* sourceType
* artifact title
* sonicProfile.bottomLayer
* sonicProfile.middleLayer
* sonicProfile.surfaceLayer
* translationSummary

### Library screen uses

* saved records list
* thumbnail
* title
* sourceType
* createdAt
* short summary

---

# CSS / STYLE REQUIREMENTS

## Style direction

Follow the reference app’s aesthetic language without copying its content.

### Use these style traits

* strong borders
* blue-purple accent
* monospaced or pixel-like display style where appropriate
* modular rectangular panels
* dark or light retro-terminal contrast
* all-caps labels for section titles/buttons where suitable
* slightly futuristic scanner/instrument vibe

### Avoid

* modern soft glassmorphism
* generic SaaS dashboard look
* overly rounded casual mobile UI
* excessive gradients or flashy neon effects

---

## Recommended visual tokens

These are suggestions, not strict requirements:

* outer frame: black
* inner background: off-white or dark navy depending on current theme
* accent: vivid blue-violet
* text: high-contrast mono
* panels: bordered with subtle shadow offset
* active states: stronger fill or border emphasis

---

# RESPONSIVE BEHAVIOR

## Desktop browser

* the phone frame should sit centered on the page
* large empty outer margins are acceptable
* app remains visually contained

## Smaller screens

* phone frame can scale down or nearly fill width
* preserve usability
* bottom tabs should remain fixed and readable

---

# IMPLEMENTATION STRATEGY

Implement in this order.

## Step 1 — Build app shell

Create:

* PhoneFrame
* AppHeader
* BottomTabBar

and move current content into a central app container.

Do not yet redesign all internal panels at once.

---

## Step 2 — Refactor Sensor screen

Build:

* ModeToggle
* ImageViewport
* SystemLogPanel
* ArtifactSummaryCard
* ActionButtonGroup

Make Sensor the default tab.

Preserve current image upload and playback wiring.

---

## Step 3 — Refactor Params screen

Replace current parameter display with:

* RecordSourceCard
* 3 LayerSectionCards
* TranslationSummaryCard

Do not include genre selection UI.

Do not make users manually choose sound style.

---

## Step 4 — Refactor Library screen

Build:

* LibraryHeader
* LibraryRecordCard list
* EmptyLibraryState

Reuse existing saved data logic.

---

## Step 5 — Polish states and consistency

After screens work, refine:

* spacing
* active states
* source badges
* scroll areas
* empty states
* visual consistency across tabs

---

# TECHNICAL INTEGRATION RULES

## Preserve existing DOM hooks if possible

If current JS relies on existing IDs/classes, either:

* preserve them
* or update JS carefully to match new structure

Do not silently break event binding.

---

## Keep scanline integration working

The ImageViewport must still support:

* image rendering
* scanline overlay
* playback visual updates

Do not remove or obscure the scanline.

---

## Keep logs connected to actual state

The SystemLogPanel should not be static placeholder text only.
It should render actual recent system events if such events already exist.

If necessary, create a lightweight append-log helper.

---

## Keep library save behavior functional

The Library tab must render real saved entries using current persistence logic.

Do not hardcode fake records as the final solution.

Temporary placeholders are acceptable only during development.

---

# NON-GOALS

Do not do the following in this refactor:

* do not rewrite the audio synthesis system
* do not rewrite the backend or API architecture
* do not add complex authentication
* do not add full database management UI
* do not implement advanced record editing
* do not add extra tabs beyond Sensor / Params / Library
* do not bring back genre-selection as a primary UI

---

# OPTIONAL NICE-TO-HAVE IMPROVEMENTS

Only after the main refactor works:

* add source badge colors for database vs AI inferred
* add small scan progress indicator in ImageViewport
* add subtle animation for active playback state
* add detail modal for library entries
* add compact artifact thumbnail beside metadata card
* add copyable system record ID if available

Do not prioritize these over the main layout refactor.

---

# FINAL EXPECTED RESULT

At the end of this refactor, the app should feel like a **museum sonic archive mobile app prototype**, not a stretched desktop tool.

A user should be able to:

1. open the Sensor tab
2. upload an artifact image
3. see the image inside a scan viewport
4. generate and play the sonic sequence
5. view compact artifact info and whether it came from database or AI inference
6. switch to Params and inspect the 3-layer sound structure
7. switch to Library and browse saved sonic records

The final UI should feel coherent, archival, and instrument-like.


**Do not rebuild the project into a framework-heavy architecture. Keep the current HTML/CSS/JS structure if possible, and refactor incrementally around the existing working prototype.**

