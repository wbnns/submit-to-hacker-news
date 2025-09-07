# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-09-06

### Fixed
- 🐛 **Firefox API compatibility** - Fixed "Failed to load page information" error on Firefox
- 🔧 **Cross-browser support** - Added automatic API detection (browser.* vs chrome.*)
- 🦊 **Firefox functionality** - All features now work properly on Firefox

### Technical
- **API detection** - Uses `browser.*` API on Firefox, `chrome.*` on Chromium browsers
- **Better error handling** - Improved cross-browser compatibility
- **No functional changes** - Same features, just better browser support

## [1.2.0] - 2025-09-06

### Added
- 🧠 **Smart title optimization** following HN guidelines automatically
- 🔍 **Ultra-fast duplicate detection** across 1000+ recent stories  
- 📖 **Built-in HN guidelines** with helpful modal tooltip
- ⚡ **Keyboard shortcuts** (`Ctrl+Shift+H` / `Cmd+Shift+H`) for quick access
- 🎨 **Professional v0-style UI** with modern design system
- 🏆 **Highest-scoring duplicate selection** when multiple submissions exist
- 📱 **Responsive duplicate status** with checking indicators
- ✏️ **Smart title editing** with placeholder behavior and auto-focus

### Enhanced  
- **Duplicate warnings** now show actual HN submission titles and stats
- **Button behavior** changes to "View Discussion" for found duplicates
- **Background processing** for API calls without blocking UI
- **Error handling** with graceful fallbacks
- **Cross-browser support** (Chrome Manifest V3 + Firefox Manifest V2)

### Technical
- **Title cleanup engine** removes site names, clickbait numbers, excessive punctuation
- **Parallel API processing** with smart batching and rate limiting  
- **Secure implementation** with minimal permissions (`activeTab` only)
- **No external dependencies** - pure vanilla JavaScript
- **Optimized performance** with early exit strategies

## [1.1.0] - 2025-01-XX

### Added
- Basic extension functionality
- Simple popup interface  
- Direct submission to Hacker News
- Icon and manifest setup

## [1.0.0] - 2025-01-XX

### Added
- Initial release
- Basic bookmarklet functionality converted to browser extension
- Chrome and Firefox support

---

## Upcoming Features

See our [roadmap in README.md](README.md#-roadmap) for planned features:
- Chrome Web Store and Firefox Add-ons publication
- Custom submission templates
- Submission history and analytics  
- Dark mode support
- Multi-language title optimization
- Advanced duplicate detection with URL variants