# logseq-preview-footnote plugin

Provides previews of footnotes.

## Overview

* When the cursor hovers over a footnote in content, it previews the content in the heading block.
* Copying and displaying content that should be displayed in another block.

## Dependencies

* Logseq plugin > [logseq-footnotes-plugin](https://github.com/gremi-jr/logseq-footnote-plugin) (form Logseq Marketplace)
   - A plugin that provides a slash command ( "`/Add Footnote`" ) for creating footnotes. Runs at the current cursor position and creates a heading in the footnote block.

## Usage

  1. Install `Preview Footnote` plugin (form Logseq Marketplace)
  1. Create a footnote in a block somewhere.
  1. Hover your mouse over a footnote to see a preview

## Demo

- From creating a footnote to displaying a preview

   ![image](https://github.com/b-yp/logseq-preview-footnote/raw/main/demo/footnote.gif)

<details>
  <summary>.mp4 movie</summary>
  <video src="https://github.com/b-yp/logseq-preview-footnote/raw/main/demo/Kapture%202023-10-22%20at%2017.47.59.mp4" controls />
</details>

## Plugin Settings

- Expand the block that starts with "## Footnotes"
  - To show the preview, the block must be expanded. Automatically expand the block.
  - `true` default
  - `false`

- Close the preview when mouse leaves it
  - If this setting is disabled, the preview will not disappear. You will need to close it manually. This setting has no effect after 4 seconds.
  - `false` default
  - `true`

- Mouse leave ms delay (The shortest time to disappear)
  - Delay before closing the preview.
  - `600`
  - `800`
  - `1000`
  - `1200` default
  - `1400`
  - `1600`
  - `1800`
  - `2000`
  - `2500`

- Limit the number of previews to one
  - `false` > You can display multiple previews.
  - `true` default
  - `false`

- Close the preview when opening another page
  - `false` > The preview will be retained even if you open another page.
  - `true` default
  - `false`

- Maximum width of the preview
  - 200px < 1200px
  - `600` default

- Enable YouTube preview optimization
  - `true` default

## Info

License > [MIT](https://choosealicense.com/licenses/mit/)

Author > [@b-yp](https://github.com/b-yp)
