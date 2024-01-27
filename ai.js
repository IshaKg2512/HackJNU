const openAiKey = "ENTER YOUR OPEN API KEY"

async function OpenAIFetchAPI(prompt) {
  console.log("Connecting to Open AI...");
  var chatUrl = "https://api.openai.com/v1/chat/completions";
  var bearer =`Bearer ${openAiKey}`;
  try {
    const response = await fetch(chatUrl, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content:
              "Take this following text and make it easier to read for dyslexic people by not changing words, but by bolding the b's and d's in the word. Like in bald, the letter b and the letter d is in bold Here is the prompt - " +
              prompt,
          },
        ],
        temperature: 0.8,
      }),
    });
    const data = response.json();
    const { message } = data.choices[0];
    console.log(data);
    console.log(message);
    return message;
  } catch (error) {
    console.log("Some error has occurred, please refresh " + error);
  }
}

function DallEFetchAPI(prompt) {
  console.log("Connecting to OpenAi Dall-E");
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
      prompt: prompt,
      n: 1,
      size: "256x256",
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(typeof data);
      console.log(Object.keys(data));
      console.log(data["choices"][0].message);
    })
    .catch((error) => {
      console.log("Some error has occurred, please refresh " + error);
    });
}

module.exports = { OpenAIFetchAPI, DallEFetchAPI };


