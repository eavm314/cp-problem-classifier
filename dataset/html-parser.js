const HTMLParser = require('node-html-parser');

const parseHTML = (html) => {
  const root = HTMLParser.parse(html);
  return root;
}

const getProblemData = (root, querySelector = '.problem-statement') => {
  const mainElement = root.querySelector(querySelector);
  const timeLimit = mainElement.querySelector('.time-limit').structuredText;
  const memoryLimit = mainElement.querySelector('.memory-limit').structuredText;
  const textStatements = mainElement.getElementsByTagName('p');
  const combinedText = textStatements.map(statement => statement.structuredText).join(' ');

  return {
    timeLimit,
    memoryLimit,
    combinedText,
  };
}

const cleanData = (data) => {
  const { timeLimit, memoryLimit, combinedText } = data;

  const timeLimitValue = timeLimit.match(/\d+/)[0];
  const memoryLimitValue = memoryLimit.match(/\d+/)[0];

  const cleanText = combinedText.replace(/\\\$+/g, '') // Remove LaTeX notation
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Remove extra whitespace

  return {
    timeLimit: parseFloat(timeLimitValue),
    memoryLimit: parseFloat(memoryLimitValue),
    combinedText: cleanText,
  }
}

module.exports = { parseHTML, getProblemData, cleanData }