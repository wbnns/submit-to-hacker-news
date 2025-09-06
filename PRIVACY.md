# Privacy Policy - Submit to Hacker News Extension

*Last updated: January 2025*

## Overview

The Submit to Hacker News browser extension is designed with privacy as a core principle. This policy explains what data is accessed, how it's used, and what safeguards are in place.

## Data Collection

### What We Access
- **Current tab URL** - Only when you actively use the extension
- **Current tab title** - Only when you actively use the extension

### What We DON'T Collect
- ❌ **No personal information** (name, email, etc.)
- ❌ **No browsing history** beyond the current active tab
- ❌ **No stored data** or cookies
- ❌ **No analytics or tracking**
- ❌ **No user accounts** or authentication

## How Data Is Used

### Local Processing Only
- **Title optimization** happens entirely in your browser
- **No data sent to our servers** - we don't have any servers
- **No data stored locally** beyond the current session

### Hacker News API Usage
When checking for duplicate submissions:
- **Your current tab URL** is sent to `hacker-news.firebaseio.com` (Hacker News' official API)
- **Purpose**: To search for existing submissions of the same URL
- **No personal identification** attached to these requests
- **This is the same data** that would be sent when you submit to HN manually

## Third Party Services

### Hacker News API (Firebase)
- **Service**: `hacker-news.firebaseio.com`
- **Data sent**: Current page URL (for duplicate checking only)
- **Governed by**: [Firebase Privacy Policy](https://firebase.google.com/support/privacy)
- **Official HN API**: Same service used by Hacker News itself

### No Other Third Parties
- **No analytics services**
- **No advertising networks**
- **No data brokers**
- **No social media tracking**

## Permissions Explained

### activeTab Permission
- **What it does**: Allows access to the current active tab's URL and title
- **When it's used**: Only when you click the extension icon or use the keyboard shortcut
- **Scope**: Limited to the one tab you're viewing
- **Cannot access**: Other tabs, browsing history, bookmarks, or stored data

### Why These Permissions
- **URL access**: Required to pre-fill the HN submission form
- **Title access**: Required for title optimization and submission
- **Minimal scope**: We request the smallest possible permissions needed

## Data Security

### Technical Safeguards
- **HTTPS only**: All network requests use encrypted connections
- **No data storage**: Nothing persists after you close the extension
- **No background processing**: Extension only runs when actively used
- **Open source**: All code is publicly auditable

### Mozilla Security Review
This extension has been reviewed by Mozilla's security team as part of the add-on approval process.

## Your Rights

### You Control Your Data
- **No opt-out needed**: We don't collect personal data to begin with
- **Uninstall anytime**: Removes all extension functionality immediately
- **No data retention**: Nothing to delete since nothing is stored

### Transparency
- **Open source code**: View exactly what the extension does at [GitHub](https://github.com/wbnns/submit-to-hacker-news)
- **No hidden functionality**: All features are visible in the interface

## Changes to This Policy

### Notification of Changes
- **Major changes**: Will be announced in extension updates
- **User choice**: Continued use constitutes acceptance of changes
- **Version tracking**: Policy version is dated and tracked

### No Surprise Changes
We will never:
- Add tracking without notice
- Expand data collection without clear communication
- Change the fundamental privacy-first approach

## Contact

### Questions or Concerns
- **GitHub Issues**: [Privacy-related questions](https://github.com/wbnns/submit-to-hacker-news/issues)
- **Direct contact**: Create an issue with the "privacy" label

### Data Requests
Since we don't collect or store personal data, there's no personal data to request, modify, or delete.

## Technical Details

### What Happens When You Use the Extension

1. **You click the extension** or press `Ctrl+Shift+H`
2. **Extension reads** current tab URL and title (using activeTab permission)
3. **Title optimization** happens locally in your browser
4. **Optional duplicate check**: URL is sent to HN's official API (if you're on a public webpage)
5. **You edit title** (if desired) and submit
6. **HN submission page opens** with your URL and title pre-filled
7. **Extension closes** and retains no information

### Network Requests
The only network requests made are:
- **To Hacker News API**: For duplicate detection (optional background check)
- **To Hacker News website**: When you click submit (opens hn submission page)

Both are the same requests you'd make manually when using Hacker News.

---

**This privacy policy reflects our commitment to user privacy and transparency. The extension is designed to enhance your HN experience without compromising your privacy.**