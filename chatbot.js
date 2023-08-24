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
  temperature: 0.9,
  model: "gpt-3.5-turbo",
  frequency_penalty: -0.5, // Adjust this value to your preference
  presence_penalty: -0.5,
  use_cache: false,
});

console.log({ model });

// * This is an asynchronous function that takes in an input (good for fetching data from a server)
const promptFunc = async (input) => {
    // ! This array holds elements to help guide the bot. Could be a key player in prompt engineering
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      question: "Hello",
      answer: "hi",
      quotes: ""
        // citation: "Citation of given information for research purposes"
    });
  
    const formatInstructions = parser.getFormatInstructions();
  
    const prompt = new PromptTemplate({
      template: "Please answer the following question in the style of the philosopher Socrates. Provide detailed thoughts or quotes from Socrates, and include any relevant quotes regarding the answer. Avoid repeating the same ideas and strive for a unique and thoughtful response each time.",
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