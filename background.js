// background.js

chrome.runtime.onInstalled.addListener(function () {
  console.log("OpenAI Summarizer Extension installed.");

  // Set up a context menu item
  chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    title: "Summarize Text",
    contexts: ["selection"],
    id: "summarizeContextMenu"
  });

  // Set up a listener for context menu item clicks
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "summarizeContextMenu") {
      // Send a message to the content script to summarize the selected text
      chrome.tabs.sendMessage(tab.id, { action: "summarizeTextContextMenu", selectedText: info.selectionText });
    }
  });
});




  // Context Menu Creation
    chrome.contextMenus.create({
      title: "Generate AI Image",
      id: "Generate",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      title: "Read Text",
      id: "Read",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      title: "Highlight b's and d's & 6's and 9's",
      id: "Read",
      contexts: ["selection"],
    });

  });


chrome.storage.sync.get(null, (items) => {
  var keys = Object.keys(items);
  if (keys.length != 4) {
    // Not setup
    chrome.storage.sync.clear();
    chrome.storage.sync.set({ font: true });
    chrome.storage.sync.set({ assist: true });
    chrome.storage.sync.set({ image: true });
    chrome.storage.sync.set({ speech: true });
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: info.menuItemId });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.action === "fetchGPT") {
    console.log("Connecting to Open AI Chat Gpt 4");
    var chatUrl = "https://api.openai.com/v1/chat/completions";
    var bearer = `Bearer ${openAiKey}`;
    fetch(chatUrl, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        //enter prompt here:
        messages: [
          {
            role: "user",
            content:
              "Take this following text and make it easier to read for dyslexic people by not changing words, but by bolding the b's and d's in the word. Like in bald, the letter b and the letter d is in bold Here is the prompt - " +
         
              request.content,
          },
        ],
        temperature: 0.8,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data["choices"][0].message);
        sendResponse(data["choices"][0].message.content);
      })
      .catch((error) => {
        console.log("Please wait, some error has occurred" + error);
      });
    return true;
  } else if (request.action === "genImage") {
    console.log("Connecting to OpenAi Dalle");
    var dalleUrl = "https://api.openai.com/v1/images/generations";
    var bearer = `Bearer ${openAiKey}`;
    fetch(dalleUrl, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-2",
        prompt: request.content,
        n: 1,
        size: "256x256",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data["data"][0].url);
        sendResponse(data["data"][0].url);
      })
      .catch((error) => {
        console.log("Please wait, some error has occurred" + error);
      });
    return true;
  }
});

