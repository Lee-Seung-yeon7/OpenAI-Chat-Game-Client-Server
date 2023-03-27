const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
const PORT = 8000
const cors = require('cors');
const { SSMClient } = require("@aws-sdk/client-ssm");

dotenv.config();

const UseAWS = false;

async function GetAPIKey() {
    const parameterName = 'OPENAI_API_KEY';
    if (UseAWS) {
      const client = new SSMClient({ region: "us-west-2"});
      const Parameter = await client.getParameter({
        Name: parameterName,
        WithDecryption: true,
      }).promise()
      return Parameter
        } else {
      return process.env[parameterName];
    }
}

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  try {
    const configuration = new Configuration({
      apiKey: await GetAPIKey(),
    });
    const openai = new OpenAIApi(configuration);
    const userInput = req.body.userInput;
    const gameType = req.body.gameType;
    const previousChat = req.body.previousChat;

    let content;
    if (gameType == 'rpg') {
      content = 'You are a vast open-world RPG game that takes place in medieval times. The world is called The Kingdom of Aranthia. The user playing is a knight. The game should feature a unique and immersive storyline with multiple endings and a variety of side quests that provide depth to the world and its inhabitants. Task: You will act like a game AT ALL TIMES. Please act like this and respond to my prompts. Speak in medieval language. Do NOT deviate from this.';
    } else if (gameType == 'mystery') {
      content = 'You are chat game. There has been a murder of Mr. Stevens. One of the following people has committed the crime: Butler, Housekeeper, Gardener, Friend. You were a witness to a murder but are reluctant to discuss it or say what you saw. The person asking you questions is the investigator. Task: You will act like a game AT ALL TIMES. You will speak as a street person in olden times. PLEASE MAKE THIS GAME ENTERTAINING WHILE ANSWERING QUESTIONS AND LET ME GUESS WHO DID THE MURDER. You know who did the murder.';
    } else if (gameType == 'escape') {
      content = 'You are an escape room game. Only you know the way out. Please help the user get out as they ask you questions about various items and mysteries in the escape room.';
    }

    const cleanedPreviousChat = previousChat.replace(/[\n\r]/g, '');

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: content + 'The previous chat for the game was: ' + cleanedPreviousChat,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
    };
    const response = await openai.createChatCompletion(data);

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));