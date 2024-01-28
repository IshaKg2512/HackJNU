// content.js (Text Summarizer)

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === "summarizeText") {
      const paragraphs = document.querySelectorAll("p");
      
      let textToSummarize = "";
      paragraphs.forEach((paragraph) => {
          textToSummarize += paragraph.textContent + " ";
      });

      // Make an OpenAI API request to summarize the text
      const apiKey = 'your-openai-api-key';
      const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
              prompt: textToSummarize,
              max_tokens: 150,  // Adjust max_tokens based on your desired summary length
              temperature: 0.7  // Adjust temperature for creativity
          })
      });

      const result = await response.json();
      const summarizedText = result.choices[0].text;

      // Create a div element to display the summarized text
      const summaryBox = document.createElement('div');
      summaryBox.style.border = '1px solid #000';
      summaryBox.style.padding = '10px';
      summaryBox.style.margin = '10px';
      summaryBox.textContent = `Summarized Text: ${summarizedText}`;

      // Append the div to the body of the document
      document.body.appendChild(summaryBox);
  }
});

// Summarization code ends here

$(document).ready(function () {
    console.log("--- HelpLexia Extension Loaded ---");
    chrome.storage.sync.get(null, (items) => {
      var styles = `
          @font-face {
            font-family: 'font-regular';
            src: url('${chrome.runtime.getURL(
              "fonts/regular.woff"
            )}') format('woff');
          }
  
          .text-dialog {
              position: absolute;
              background-color: #333;
              color: #fff;
              border: 1px solid #555;
              padding: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              z-index: 9999;
              max-width: 500px;
            }
        `;
  
      // Append style to the head of the current document
      $("head").append("<style>" + styles + "</style>");
      if (items?.font) {
        $("body").attr(
          "style",
          "font-family: 'font-regular', sans-serif !important;"
        );
      }
      chrome.storage.sync.onChanged.addListener(function (item) {
        // Used to connect settings changes with page
      });
    });
  });
  
  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    console.log(request);
    if (request.action === "helplexia") {
      await helplexia();
    }
  });
  
