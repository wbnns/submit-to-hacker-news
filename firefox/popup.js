document.addEventListener('DOMContentLoaded', async () => {
  const pageTitle = document.getElementById('pageTitle');
  const pageUrl = document.getElementById('pageUrl');
  const submitButton = document.getElementById('submitButton');
  const buttonText = document.getElementById('buttonText');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const errorMessage = document.getElementById('errorMessage');
  const titleInput = document.getElementById('titleInput');
  const titleToggle = document.getElementById('titleToggle');
  const toggleButton = document.getElementById('toggleButton');
  const originalTitleShow = document.getElementById('originalTitleShow');
  const cleanedTitleShow = document.getElementById('cleanedTitleShow');
  const duplicateWarning = document.getElementById('duplicateWarning');
  const duplicateTitle = document.getElementById('duplicateTitle');
  const duplicateStats = document.getElementById('duplicateStats');
  const guidelinesLink = document.getElementById('guidelinesLink');
  const guidelinesTooltip = document.getElementById('guidelinesTooltip');
  const checkingStatus = document.getElementById('checkingStatus');
  const titleSection = document.querySelector('.title-section');
  const tooltipOverlay = document.getElementById('tooltipOverlay');
  const tooltipClose = document.getElementById('tooltipClose');

  let currentTab = null;
  let isPlaceholderMode = true;
  let originalTitle = '';
  let cleanedTitle = '';
  let usingCleanedTitle = false;
  let existingSubmission = null;

  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  };

  const hideError = () => {
    errorMessage.style.display = 'none';
  };

  // Efficient duplicate check using HN's from endpoint
  const checkForDuplicate = async (url) => {
    try {
      // Extract root domain for HN's /from endpoint (HN strips subdomains)
      const domain = new URL(url).hostname.replace(/^www\./, '');
      const rootDomain = domain.split('.').slice(-2).join('.'); // Get last 2 parts (e.g., hn.wbnns.com → wbnns.com)
      
      // Use HN's efficient /from endpoint - single request instead of 1000+
      const fromUrl = `https://news.ycombinator.com/from?site=${encodeURIComponent(rootDomain)}`;
      const response = await fetch(fromUrl);
      
      if (!response.ok) return null;
      
      const html = await response.text();
      
      // Parse the HTML to find submissions matching our exact URL
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const submissions = [];
      const rows = doc.querySelectorAll('tr.athing');
      
      const normalizedUrl = url.replace(/\/$/, '').toLowerCase();
      
      for (const row of rows) {
        const titleLink = row.querySelector('.titleline > a');
        const scoreElement = row.nextElementSibling?.querySelector('.score');
        const commentsLink = row.nextElementSibling?.querySelector('a[href*="item?id="]:last-of-type');
        
        if (!titleLink) continue;
        
        const submissionUrl = titleLink.href.replace(/\/$/, '').toLowerCase();
        
        if (submissionUrl === normalizedUrl) {
          const id = row.id;
          const title = titleLink.textContent.trim();
          const scoreText = scoreElement?.textContent || '0 points';
          const score = parseInt(scoreText.match(/\d+/)?.[0] || '0');
          const commentsText = commentsLink?.textContent || '0 comments';
          const descendants = parseInt(commentsText.match(/\d+/)?.[0] || '0');
          
          submissions.push({
            id: id,
            title: title,
            score: score,
            descendants: descendants,
            time: Date.now() / 1000 // Approximate timestamp
          });
        }
      }
      
      // Return highest-scoring match if any found
      if (submissions.length === 0) return null;
      
      return submissions.reduce((best, current) => 
        current.score > best.score ? current : best
      );
      
    } catch (error) {
      console.error('Duplicate check failed:', error);
      return null;
    }
  };
  
  // Show duplicate warning with actual HN title
  const showDuplicateWarning = (submission) => {
    duplicateWarning.classList.add('show');
    
    // Show the actual HN submission title
    duplicateTitle.textContent = submission.title;
    
    const timeAgo = getTimeAgo(submission.time);
    duplicateStats.textContent = `${submission.score} points, ${submission.descendants} comments, ${timeAgo}`;
    
    // Update button to view discussion
    buttonText.textContent = 'View Discussion';
    
    // Store the submission ID for the button click
    submitButton.dataset.duplicateId = submission.id;
    
    // Keep title section hidden when duplicate found
    titleSection.classList.add('hidden');
  };
  
  // Helper to format time ago
  const getTimeAgo = (timestamp) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // Clean title according to HN guidelines
  const cleanTitleForHN = (title, url) => {
    if (!title) return '';
    
    let cleaned = title.trim();
    
    // Remove site name from title if it matches domain
    if (url) {
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        const siteName = domain.split('.')[0];
        
        // Remove common site name patterns
        const sitePatterns = [
          new RegExp(`\\s*[-–—|]\\s*${siteName}\\s*$`, 'i'),
          new RegExp(`^${siteName}\\s*[-–—|:]\\s*`, 'i'),
          new RegExp(`\\s*\\(${siteName}\\)\\s*$`, 'i')
        ];
        
        sitePatterns.forEach(pattern => {
          cleaned = cleaned.replace(pattern, '');
        });
      } catch (e) {
        // Invalid URL, continue
      }
    }
    
    // Remove gratuitous numbers and adjectives
    const numberPatterns = [
      /^\d+\s+Amazing\s+/i,
      /^\d+\s+Incredible\s+/i,
      /^\d+\s+Best\s+/i,
      /^\d+\s+Top\s+/i,
      /^\d+\s+Essential\s+/i,
      /^\d+\s+Must-Know\s+/i,
      /^\d+\s+Ways?\s+[Tt]o\s+/i,
      /^\d+\s+Tips?\s+[Ff]or\s+/i,
      /^\d+\s+Reasons?\s+[Ww]hy\s+/i,
      /^\d+\s+Things?\s+/i
    ];
    
    numberPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, (match) => {
        if (pattern.source.includes('Ways?\\s+[Tt]o')) {
          return 'How to ';
        }
        if (pattern.source.includes('Tips?\\s+[Ff]or')) {
          return 'Tips for ';
        }
        if (pattern.source.includes('Reasons?\\s+[Ww]hy')) {
          return 'Why ';
        }
        return '';
      });
    });
    
    // Remove excessive punctuation and caps
    cleaned = cleaned.replace(/!+$/, ''); // Remove trailing exclamation marks
    cleaned = cleaned.replace(/[?]+$/, ''); // Multiple question marks
    
    // Fix common all-caps words (but preserve acronyms)
    cleaned = cleaned.replace(/\b[A-Z]{4,}\b/g, (match) => {
      // Keep known acronyms
      const acronyms = ['HTML', 'CSS', 'JSON', 'HTTP', 'HTTPS', 'API', 'SDK', 'AI', 'ML', 'UI', 'UX'];
      if (acronyms.includes(match)) return match;
      return match.charAt(0) + match.slice(1).toLowerCase();
    });
    
    return cleaned.trim();
  };

  // Initialize the extension
  try {
    // Get the current active tab
    const [tab] = await (typeof browser !== 'undefined' ? browser : chrome).tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      pageTitle.textContent = 'Error: No active tab';
      pageUrl.textContent = '';
      submitButton.disabled = true;
      return;
    }

    currentTab = tab;
    
    // Store and process titles
    originalTitle = tab.title || '';
    cleanedTitle = cleanTitleForHN(originalTitle, tab.url);
    
    // Determine which title to show
    const shouldUseCleaned = cleanedTitle && cleanedTitle !== originalTitle && cleanedTitle.length > 0;
    const displayTitle = shouldUseCleaned ? cleanedTitle : originalTitle;
    usingCleanedTitle = shouldUseCleaned;
    
    // Display the page info
    pageTitle.textContent = originalTitle || 'Untitled';
    pageUrl.textContent = tab.url || '';
    
    // Show title toggle if titles are different
    if (shouldUseCleaned) {
      titleToggle.classList.add('show');
      originalTitleShow.textContent = originalTitle;
      cleanedTitleShow.textContent = cleanedTitle;
      
      toggleButton.addEventListener('click', () => {
        usingCleanedTitle = !usingCleanedTitle;
        const newTitle = usingCleanedTitle ? cleanedTitle : originalTitle;
        
        titleInput.value = newTitle;
        titleInput.classList.add('placeholder');
        isPlaceholderMode = true;
        
        toggleButton.textContent = usingCleanedTitle ? 'use original instead' : 'use cleaned version';
        
        // Update the comparison display
        if (usingCleanedTitle) {
          originalTitleShow.className = 'title-original';
          cleanedTitleShow.className = 'title-cleaned';
        } else {
          originalTitleShow.className = 'title-cleaned';
          cleanedTitleShow.className = 'title-original';
        }
      });
    }
    
    // Set up placeholder-style behavior for title input
    const defaultTitle = displayTitle || 'Enter title or leave blank to use above';
    titleInput.value = defaultTitle;
    titleInput.classList.add('placeholder');
    isPlaceholderMode = true;
    
    // Start duplicate check in background (don't block UI)
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('moz-extension://') && !tab.url.includes('localhost')) {
      // Show checking status and hide title section
      checkingStatus.classList.add('show');
      titleSection.classList.add('hidden');
      
      checkForDuplicate(tab.url).then(result => {
        // Hide checking status
        checkingStatus.classList.remove('show');
        
        if (result) {
          existingSubmission = result;
          showDuplicateWarning(result);
        } else {
          // Show title section if no duplicate found
          titleSection.classList.remove('hidden');
        }
      }).catch(error => {
        console.error('Duplicate check failed:', error);
        // Hide checking status and show title section on error
        checkingStatus.classList.remove('show');
        titleSection.classList.remove('hidden');
      });
    } else {
      // For local URLs, just show the title section immediately
      titleSection.classList.remove('hidden');
    }
    
    // Auto-focus the title input
    setTimeout(() => {
      titleInput.focus();
      titleInput.select(); // Select all text for easy replacement
    }, 100);


    // Set up the submit button click handler
    submitButton.addEventListener('click', () => {
      if (!currentTab) return;
      
      // Check if this is a "View Discussion" click for a duplicate
      if (submitButton.dataset.duplicateId) {
        const discussionUrl = `https://news.ycombinator.com/item?id=${submitButton.dataset.duplicateId}`;
        (typeof browser !== 'undefined' ? browser : chrome).tabs.create({ url: discussionUrl });
        window.close();
        return;
      }
      
      // Normal submission flow
      // Use custom title from input, fallback to cleaned or original title
      // Don't use placeholder text as the title
      let customTitle;
      if (isPlaceholderMode || titleInput.value.trim() === '') {
        customTitle = cleanedTitle || currentTab.title || 'Untitled';
      } else {
        customTitle = titleInput.value.trim();
      }
      const hackerNewsUrl = `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(currentTab.url)}&t=${encodeURIComponent(customTitle)}`;
      
      // Open Hacker News submission page in a new tab
      (typeof browser !== 'undefined' ? browser : chrome).tabs.create({ url: hackerNewsUrl });
      
      // Close the popup
      window.close();
    });
    
    // Handle placeholder behavior
    titleInput.addEventListener('focus', () => {
      if (isPlaceholderMode) {
        titleInput.value = '';
        titleInput.classList.remove('placeholder');
        isPlaceholderMode = false;
      }
    });
    
    titleInput.addEventListener('blur', () => {
      if (titleInput.value.trim() === '') {
        titleInput.value = defaultTitle;
        titleInput.classList.add('placeholder');
        isPlaceholderMode = true;
      }
    });
    
    titleInput.addEventListener('input', () => {
      // Auto-resize textarea
      titleInput.style.height = 'auto';
      titleInput.style.height = titleInput.scrollHeight + 'px';
      
      // Remove placeholder styling when typing
      if (isPlaceholderMode && titleInput.value !== defaultTitle) {
        titleInput.classList.remove('placeholder');
        isPlaceholderMode = false;
      }
    });
    
    titleInput.addEventListener('keydown', (e) => {
      // Clear placeholder text on first keypress (except special keys)
      if (isPlaceholderMode && !['Enter', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape'].includes(e.key)) {
        titleInput.value = '';
        titleInput.classList.remove('placeholder');
        isPlaceholderMode = false;
      }
      
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        // Cmd/Ctrl + Enter submits
        submitButton.click();
      }
    });
    
    // Setup guidelines modal
    const showGuidelines = () => {
      guidelinesTooltip.classList.add('show');
      tooltipOverlay.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };
    
    const hideGuidelines = () => {
      guidelinesTooltip.classList.remove('show');
      tooltipOverlay.classList.remove('show');
      document.body.style.overflow = 'auto';
    };
    
    guidelinesLink.addEventListener('click', (e) => {
      e.preventDefault();
      showGuidelines();
    });
    
    tooltipClose.addEventListener('click', hideGuidelines);
    tooltipOverlay.addEventListener('click', hideGuidelines);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && guidelinesTooltip.classList.contains('show')) {
        hideGuidelines();
      }
    });

  } catch (error) {
    console.error('Error initializing extension:', error);
    showError('Failed to load page information. Please try again.');
    pageTitle.textContent = 'Error loading page info';
    pageUrl.textContent = '';
    submitButton.disabled = true;
  }
});