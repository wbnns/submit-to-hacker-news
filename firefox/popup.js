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

  // Ultra-fast duplicate check for 1000+ stories
  const checkForDuplicate = async (url) => {
    try {
      const normalizedUrl = url.replace(/\/$/, '').toLowerCase();
      
      // Get all story lists in parallel immediately
      const [topResponse, newResponse, bestResponse] = await Promise.all([
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json'),
        fetch('https://hacker-news.firebaseio.com/v0/newstories.json'), 
        fetch('https://hacker-news.firebaseio.com/v0/beststories.json')
      ]);
      
      // Combine all story IDs (remove duplicates)
      const allIds = new Set();
      
      if (topResponse.ok) {
        const topIds = await topResponse.json();
        topIds.slice(0, 400).forEach(id => allIds.add(id)); // Top 400
      }
      
      if (newResponse.ok) {
        const newIds = await newResponse.json();
        newIds.slice(0, 400).forEach(id => allIds.add(id)); // Latest 400
      }
      
      if (bestResponse.ok) {
        const bestIds = await bestResponse.json();
        bestIds.slice(0, 300).forEach(id => allIds.add(id)); // Best 300
      }
      
      const uniqueIds = Array.from(allIds);
      console.log(`Checking ${uniqueIds.length} unique stories for duplicates`);
      
      // Use aggressive parallel processing
      return await checkBatchUltraFast(uniqueIds, normalizedUrl);
      
    } catch (error) {
      console.error('Duplicate check failed:', error);
      return null;
    }
  };
  
  // Ultra-fast batch checking with massive parallelization - finds highest scoring match
  const checkBatchUltraFast = async (ids, normalizedUrl) => {
    const chunkSize = 50; // Much larger chunks
    const maxConcurrency = 10; // Maximum concurrent chunk processing
    const allMatches = [];
    
    for (let i = 0; i < ids.length; i += chunkSize * maxConcurrency) {
      // Create up to 10 concurrent chunks
      const chunkPromises = [];
      
      for (let j = 0; j < maxConcurrency && i + j * chunkSize < ids.length; j++) {
        const chunkStart = i + j * chunkSize;
        const chunkEnd = Math.min(chunkStart + chunkSize, ids.length);
        const chunkIds = ids.slice(chunkStart, chunkEnd);
        
        chunkPromises.push(processChunk(chunkIds, normalizedUrl));
      }
      
      // Wait for all chunks in this batch to complete
      const results = await Promise.all(chunkPromises);
      
      // Collect all matches from this batch
      results.forEach(chunkMatches => {
        if (chunkMatches && chunkMatches.length > 0) {
          allMatches.push(...chunkMatches);
        }
      });
      
      // Tiny delay between batches to be API-friendly
      if (i + chunkSize * maxConcurrency < ids.length) {
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    }
    
    // Return the highest-scoring match
    if (allMatches.length === 0) return null;
    
    return allMatches.reduce((best, current) => 
      current.score > best.score ? current : best
    );
  };
  
  // Process a single chunk of story IDs and collect all matches
  const processChunk = async (chunkIds, normalizedUrl) => {
    const promises = chunkIds.map(async id => {
      try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!response.ok) return null;
        
        const story = await response.json();
        if (!story?.url) return null;
        
        const storyUrl = story.url.replace(/\/$/, '').toLowerCase();
        if (storyUrl === normalizedUrl) {
          return {
            id: story.id,
            title: story.title,
            score: story.score || 0,
            descendants: story.descendants || 0,
            time: story.time
          };
        }
        return null;
      } catch {
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    return results.filter(r => r); // Return all matches, not just first
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
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
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
        chrome.tabs.create({ url: discussionUrl });
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
      chrome.tabs.create({ url: hackerNewsUrl });
      
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