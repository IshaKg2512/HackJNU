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
    if (request.action === "dysleap") {
      await dysleap();
    }
  });
  
  async function dysLeap() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const noImage = selectedText.split(" ").length > 2;
    const loading = document.createElement("div");
    loading.className = "text-dialog";
  
    // Calculate the position for the dialog
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
  
    // Calculate the position relative to the entire document
    const documentRect = document.body.getBoundingClientRect();
    const dialogTop = rect.top - documentRect.top - loading.offsetHeight - 10;
  
    loading.style.position = "absolute";
    loading.style.top = dialogTop + "px";
    loading.style.left = rect.left + rect.width / 2 - loading.offsetWidth + "px";
  
    // Append the dialog to the body
  
    loading.innerHTML = "Loading...";
    document.body.appendChild(loading);
    // Manipulate the selected text
    const text = await chrome.runtime.sendMessage({
      action: "fetchGPT",
      content: selectedText,
    });
    let image;
    if (!noImage) {
      loading.innerHTML = "Loading AI Image..";
      image = await chrome.runtime.sendMessage({
        action: "genImage",
        content: selectedText,
      });
    }
    document.body.removeChild(loading);
    const manipulatedText = text.replace(/\*\*(.*?)\*\*/g, "<i><b>$1</b></i>");
    // Create a div for the dialog
    const dialog = document.createElement("div");
    dialog.className = "text-dialog";
    dialog.innerHTML =
      manipulatedText +
      "<br>" +
      (noImage
        ? ""
        : `<img src="${image}" alt="${selectedText}" width="256" height="256">`);
  
    dialog.style.position = "absolute";
    dialog.style.top = dialogTop + "px";
    dialog.style.left = rect.left + rect.width / 2 - dialog.offsetWidth + "px";
  
    // Append the dialog to the body
    document.body.appendChild(dialog);
  
    // Add a click event listener to remove the dialog on clicks outside of it
    document.addEventListener("click", handleClickOutside);
  
    // Function to handle click events
    function handleClickOutside(event) {
      if (!dialog.contains(event.target)) {
        // Click outside the dialog, remove the dialog and remove the event listener
        document.body.removeChild(dialog);
        document.removeEventListener("click", handleClickOutside);
      }
    }
  }
  
  async function manipulateText() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
  
    const loading = document.createElement("div");
    loading.className = "text-dialog";
    loading.innerHTML = "Loading Contents...";
  
    // Calculate the position for the dialog
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
  
    // Calculate the position relative to the entire document
    const documentRect = document.body.getBoundingClientRect();
    const dialogTop = rect.top - documentRect.top - loading.offsetHeight - 10;
  
    loading.style.position = "absolute";
    loading.style.top = dialogTop + "px";
    loading.style.left = rect.left + rect.width / 2 - loading.offsetWidth + "px";
  
    // Append the dialog to the body
    document.body.appendChild(loading);
  
    // Manipulate the selected text
    const response = await chrome.runtime.sendMessage({
      action: "fetchGPT",
      content: selectedText,
    });
    document.body.removeChild(loading);
    console.log(response);
    const manipulatedText = response.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    // Create a div for the dialog
    const dialog = document.createElement("div");
    dialog.className = "text-dialog";
    dialog.innerHTML = "Manipulated Text: " + manipulatedText;
  
    dialog.style.position = "absolute";
    dialog.style.top = dialogTop + "px";
    dialog.style.left = rect.left + rect.width / 2 - dialog.offsetWidth + "px";
  
    // Append the dialog to the body
    document.body.appendChild(dialog);
  
    // Add a click event listener to remove the dialog on clicks outside of it
    document.addEventListener("click", handleClickOutside);
  
    // Function to handle click events
    function handleClickOutside(event) {
      if (!dialog.contains(event.target)) {
        // Click outside the dialog, remove the dialog and remove the event listener
        document.body.removeChild(dialog);
        document.removeEventListener("click", handleClickOutside);
      }
    }
  }
  
  async function generateImage() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
  
    const loading = document.createElement("div");
    loading.className = "text-dialog";
    loading.innerHTML = "Loading Image...";
  
    // Calculate the position for the dialog
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
  
    // Calculate the position relative to the entire document
    const documentRect = document.body.getBoundingClientRect();
    const dialogTop = rect.top - documentRect.top - loading.offsetHeight - 10;
  
    loading.style.position = "absolute";
    loading.style.top = dialogTop + "px";
    loading.style.left = rect.left + rect.width / 2 - loading.offsetWidth + "px";
  
    // Append the dialog to the body
    document.body.appendChild(loading);
  
    // Manipulate the selected text
    const response = await chrome.runtime.sendMessage({
      action: "genImage",
      content: selectedText,
    });
    document.body.removeChild(loading);
    console.log(response);
    const image = response;
    // Create a div for the dialog
    const dialog = document.createElement("div");
    dialog.className = "text-dialog";
    dialog.innerHTML = `<img src="${image}" alt="${selectedText}" width="256" height="256">`;
  
    dialog.style.position = "absolute";
    dialog.style.top = dialogTop + "px";
    dialog.style.left = rect.left + rect.width / 2 - dialog.offsetWidth + "px";
  
    // Append the dialog to the body
    document.body.appendChild(dialog);
  
    // Add a click event listener to remove the dialog on clicks outside of it
    document.addEventListener("click", handleClickOutside);
  
    // Function to handle click events
    function handleClickOutside(event) {
      if (!dialog.contains(event.target)) {
        // Click outside the dialog, remove the dialog and remove the event listener
        document.body.removeChild(dialog);
        document.removeEventListener("click", handleClickOutside);
      }
    }
  }
  