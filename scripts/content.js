const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}

// content.js

let prompts = [];
const API_KEY = 'your_openai_api_key_here'; // Replace with your actual OpenAI API key
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// Function to listen for new prompts
function listenForPrompts() {
  const textareaSelector = 'textarea[data-id="root"]';
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const textarea = document.querySelector(textareaSelector);
        if (textarea && textarea.value) {
          const promptText = textarea.value.trim();
          if (promptText && !prompts.includes(promptText)) {
            prompts.push(promptText);
            console.log('New prompt detected:', promptText);
            if (prompts.length % 5 === 0) { // Analyze after every 5 prompts
              analyzePrompts();
            }
          }
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to analyze prompts using GPT
async function analyzePrompts() {
  const recentPrompts = prompts.slice(-5).join('\n');
  const messages = [
    { role: 'system', content: 'You are an AI assistant that helps improve user prompts for language models.' },
    { role: 'user', content: `Here are the last 5 prompts a user has given to ChatGPT:\n\n${recentPrompts}\n\nAnalyze these prompts and provide tips on how the user could have improved them. Also, suggest a single, more effective prompt that could replace these multiple prompts.` }
  ];

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages
      })
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    displayAnalysis(analysis);
  } catch (error) {
    console.error('Error analyzing prompts:', error);
  }
}

// Function to display the analysis
function displayAnalysis(analysis) {
  const analysisContainer = document.createElement('div');
  analysisContainer.id = 'prmptly-analysis';
  analysisContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    padding: 15px;
    background-color: #f0f4f8;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 9999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    max-height: 80vh;
    overflow-y: auto;
  `;

  const title = document.createElement('h3');
  title.textContent = 'PRMPTLY Analysis';
  title.style.marginTop = '0';

  const content = document.createElement('p');
  content.textContent = analysis;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = `
    display: block;
    width: 100%;
    padding: 8px;
    margin-top: 15px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  closeButton.onclick = () => analysisContainer.remove();

  analysisContainer.appendChild(title);
  analysisContainer.appendChild(content);
  analysisContainer.appendChild(closeButton);

  document.body.appendChild(analysisContainer);
}

// Start listening for prompts when the script loads
listenForPrompts();
