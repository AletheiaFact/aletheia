# Visual Editor

## Overview
The Visual Editor is a rich text editing interface built on TipTap/ProseMirror that provides a powerful, user-friendly environment for creating and editing fact-check content.

## Editor Features

### Text Formatting
- Bold, italic, underline
- Headings (H1-H6)
- Lists (ordered/unordered)
- Blockquotes
- Code blocks
- Text alignment

### Rich Content
- Hyperlink insertion
- Image embedding
- Video embedding
- Table creation
- Horizontal rules

### Advanced Features
- Slash commands
- Markdown shortcuts
- Keyboard shortcuts
- Drag and drop
- Copy/paste formatting

## UI Components

### Toolbar
- Floating toolbar
- Format buttons
- Insert menus
- Style dropdowns
- Action buttons

### Floating Menu
- Context-sensitive options
- Quick formatting
- Link insertion
- Source addition

### Editor Canvas
- WYSIWYG interface
- Live preview
- Responsive design
- Focus mode
- Distraction-free writing

## Content Extensions

### Custom Nodes
- Source references
- Claim cards
- Question blocks
- Summary sections
- Verification blocks

### Formatting Options
- Syntax highlighting
- Custom styles
- Theme support
- Font options

## Collaboration Features
- Multi-cursor display
- User presence
- Real-time updates
- Conflict resolution
- Change tracking

## Technical Details
- **Framework**: TipTap v2
- **Base**: ProseMirror
- **Components**: `Editor.tsx`, `VisualEditor.tsx`
- **Extensions**: Custom TipTap extensions
- **Styling**: Styled-components