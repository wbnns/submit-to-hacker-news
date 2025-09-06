# Submit to Hacker News

A powerful browser extension that enhances your Hacker News submission experience with smart title optimization, duplicate detection, and built-in guidelines.

![Extension Screenshot](https://img.shields.io/badge/version-1.2-orange) ![License](https://img.shields.io/badge/license-MIT-blue) ![Browser Support](https://img.shields.io/badge/browsers-Chrome%20%7C%20Firefox%20%7C%20Edge%20%7C%20Brave-green)

## ✨ Features

- **🚀 One-click submission** with keyboard shortcut (`Ctrl+Shift+H` / `Cmd+Shift+H`)
- **🧠 Smart title optimization** following HN guidelines automatically
- **🔍 Duplicate detection** across 1000+ recent stories (finds highest-scored version)
- **📖 Built-in HN guidelines** with helpful tooltip
- **✏️ Editable titles** with intelligent placeholder behavior
- **🎨 Clean, professional UI** inspired by modern design systems
- **⚡ Ultra-fast performance** with background processing

## 🎯 Perfect For

- **HN Regular Contributors** - Submit with confidence following community guidelines
- **Content Creators** - Avoid duplicate submissions and optimize titles
- **Developers & Researchers** - Quick submission workflow with keyboard shortcuts
- **HN Newcomers** - Learn submission best practices with built-in guidance

## 📸 Screenshots

### Main Interface
The extension shows your page title (optimized for HN guidelines) with an editable field:

```
🟠 Submit to Hacker News              Guidelines

Page: "10 Amazing Python Tips - TechBlog"
URL: https://techblog.com/python-tips

Title (editable): Python Tips  [optimized ✨]
                   
                   [Submit]
```

### Duplicate Detection
When duplicates are found, see the most popular existing submission:

```
Already submitted!
Show HN: My Python Learning Tool
47 points, 23 comments, 3 days ago

[View Discussion]
```

## 🚀 Installation

### Chrome
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your toolbar

### Microsoft Edge
1. Download or clone this repository
2. Open Edge and go to `edge://extensions/`
3. Enable "Developer mode" (left sidebar toggle)
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your toolbar

### Brave Browser
1. Download or clone this repository
2. Open Brave and go to `brave://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your toolbar

### Firefox
1. Download or clone this repository  
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Select the `manifest-v2.json` file from the extension folder
6. The extension will appear in your toolbar

## ⌨️ Usage

### Quick Start
1. **Navigate** to any webpage you want to submit
2. **Press** `Ctrl+Shift+H` (Windows/Linux) or `Cmd+Shift+H` (Mac)
3. **Review/edit** the optimized title
4. **Click "Submit"** or press `Ctrl+Enter`

### Features in Detail

**Title Optimization:**
- Removes site names (shown automatically by HN)
- Converts "10 Ways to..." → "How to..."
- Removes excessive punctuation and promotional language
- Shows before/after comparison when changes are made

**Duplicate Detection:**
- Scans 1000+ recent HN stories in seconds
- Finds highest-scoring version if multiple submissions exist
- Shows existing discussion stats and direct link
- Runs in background without blocking the UI

**Built-in Guidelines:**
- Click "Guidelines" for comprehensive HN submission rules
- Covers what to submit, title formatting, and community standards
- Helps newcomers learn HN culture and best practices

## 🛠️ Development

### Project Structure
```
submit-to-hacker-news/
├── manifest.json          # Chrome extension manifest (v3)
├── manifest-v2.json       # Firefox extension manifest (v2)  
├── popup.html            # Extension popup interface
├── popup.js              # Main functionality and logic
├── icons/                # Extension icons (16px to 128px)
└── README.md             # This file
```

### Key Technologies
- **Manifest V3** (Chrome) / **Manifest V2** (Firefox)
- **Vanilla JavaScript** (no dependencies)
- **HN Firebase API** for duplicate detection
- **CSS Grid/Flexbox** for responsive layout

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/submit-to-hacker-news.git
   cd submit-to-hacker-news
   ```

2. Load in browser (see Installation section above)

3. Make changes and reload the extension to test

### Testing
- Test on various websites (blogs, GitHub repos, documentation)
- Verify duplicate detection with known HN submissions
- Check title optimization with different formatting patterns
- Test keyboard shortcuts and accessibility

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Guide
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Philosophy
- **User-first design** - prioritize submission experience
- **Performance matters** - keep the extension fast and responsive  
- **Follow HN culture** - respect community guidelines and norms
- **Clean code** - maintain readable, well-documented code

## 📋 Roadmap

- [ ] **Chrome Web Store** and **Firefox Add-ons** publication
- [ ] **Custom submission templates** for different content types
- [ ] **Submission history** and analytics
- [ ] **Dark mode** support
- [ ] **Multi-language** title optimization
- [ ] **Advanced duplicate detection** with URL variants

## 🐛 Known Issues

- Duplicate detection is limited to recent stories (last ~1000 submissions)
- Some dynamic websites may not provide accurate titles initially
- Keyboard shortcuts may conflict with browser/OS shortcuts in rare cases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hacker News** for providing the public API
- **HN moderators** for maintaining the community and guidelines
- **Firebase** for hosting the HN data
- The **HN community** for inspiration and feedback
- **Contributors** who help improve this extension

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/submit-to-hacker-news/issues)
- **Features**: [Feature Requests](https://github.com/yourusername/submit-to-hacker-news/issues/new?template=feature_request.md)
- **Bugs**: [Bug Reports](https://github.com/yourusername/submit-to-hacker-news/issues/new?template=bug_report.md)

---

**Made with ❤️ by [wbnns](https://x.com/wbnns) for the Hacker News community**