document.addEventListener('DOMContentLoaded', function() {
  const promptInput = document.getElementById('promptInput');
  const analyzeButton = document.getElementById('analyzeButton');
  const suggestions = document.getElementById('suggestions');
  const suggestionsList = document.getElementById('suggestionsList');
  const improvedPrompt = document.getElementById('improvedPrompt');
  const improvedPromptText = document.getElementById('improvedPromptText');

  analyzeButton.addEventListener('click', function() {
    const prompt = promptInput.value.trim();
    if (prompt) {
      // In a real-world scenario, you'd send this to your backend or directly to OpenAI API
      // For demonstration, we'll use a mock response
      const mockAnalysis = analyzeMock(prompt);
      displayAnalysis(mockAnalysis);
    } else {
      alert('Please enter a prompt to analyze.');
    }
  });

  function analyzeMock(prompt) {
    return {
      suggestions: [
        "Be more specific about the context.",
        "Use clearer language to avoid ambiguity.",
        "Consider adding relevant examples to illustrate your point."
      ],
      improvedPrompt: "Provide a detailed explanation of [topic] with specific examples, focusing on [aspect 1] and [aspect 2]."
    };
  }

  function displayAnalysis(analysis) {
    suggestionsList.innerHTML = '';
    analysis.suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.textContent = suggestion;
      suggestionsList.appendChild(li);
    });
    
    improvedPromptText.textContent = analysis.improvedPrompt;
    
    suggestions.classList.remove('hidden');
    improvedPrompt.classList.remove('hidden');
  }
});
