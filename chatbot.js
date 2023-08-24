// * .env is used to hide api key in different file.

require("dotenv").config();

const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");

// * dependencies
const { OpenAI } = require("langchain/llms/openai");
const inquirer = require("inquirer");
require("dotenv").config();

// * Creates and stores a wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-3.5-turbo",
});

console.log({ model });

// * This is an asynchronous function that takes in an input (good for fetching data from a server)
const promptFunc = async (input) => {
    // ! This array holds elements to help guide the bot. Could be a key player in prompt engineering
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        philosopher: "Name of the philosopher being discussed",
        clearList: "If asked for list, include list (1- 2- 3- 4- 5- ) to answer question",
        philosophy: "Detailed thoughts or quotes from the philosopher",
        quotes: "General response, if target is not an individual",
        quotes: "Citation of given information for research purposes"
    });
  
    const formatInstructions = parser.getFormatInstructions();
  
    const prompt = new PromptTemplate({
      template:
        "You are a philosopher phd, who loves interacting with newbies. You are wise and knowledgable, and love all flavours of philophy. You dont bring up the same philosopher twice in the same sentance. you are clear, kind, and wise. \n{format_instructions}\n{question}",
      inputVariables: ["question"],
      partialVariables: { format_instructions: formatInstructions },
    });
  
    const promptInput = await prompt.format({
      question: input,
    });
  
    try {
      const res = await model.call(promptInput); // Send the prompt to the model and wait for the response
      console.log(res); // Log the response (or handle it as needed)
    } catch (err) {
      console.error(err); // Handle any errors
    }
  };
  
  const init = async () => {
    let continueChatting = true;
  
    while (continueChatting) {
      const response = await inquirer.prompt([
        {
          type: "input",
          name: "question",
          message: "Hey, Matt. Ask a question! ('exit' for aborting bot):",
        },
      ]);

      //! This allows for program to be aborted if the input text is === 'exit'
      if (response.question.toLowerCase() === 'exit') {
        continueChatting = false;
        console.log('Goodbye. . . For now!');
      } else {
        await promptFunc(response.question);
      }
    }
  };
  
  init();
  
  //! Use exit to abort the program