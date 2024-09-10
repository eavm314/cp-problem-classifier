const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');

const { getProblems, downloadProblem } = require('./downloader.js')
const { parseHTML, getProblemData, cleanData } = require('./html-parser.js')

const outputFolder = '../data'
const testFile = 'test.json'
const tags = require('./tags.js')

const testProblems = 0

const createTestDataset = async (problems) => {
  const problemsArray = []

  while (problemsArray.length < testProblems) {
    const randomIndex = Math.floor(Math.random() * problems.length);
    const problem = problems[randomIndex]
    try {
      const { success, rawHtml } = await downloadProblem(problem)
      if (!success) {
        console.error(`Rate limiter exceeded, try again later`)
        break
      }
      const rootElement = parseHTML(rawHtml)
      let problemData = getProblemData(rootElement)
      problemData = cleanData(problemData)

      const allowedTags = problem.tags.filter(tag => tags.includes(tag))
      if (allowedTags.length === 0) {
        console.log(`Problem ${problem.contestId}/${problem.index} has no allowed tags`)
        continue
      }

      problemData = {
        ...problem,
        ...problemData,
        type: undefined,
        tags: undefined,
      }

      allowedTags.forEach(tag => {
        problemData[`tags.${tag}`] = 1;
      }),

        problemsArray.push(problemData)

    } catch (err) {
      console.error(`Error parsing problem ${problem.contestId}/${problem.index}`, err)
      continue
    }
  }

  console.log(`Test problems saved to ${outputFolder}/${testFile}`)
  fs.writeFile(`${outputFolder}/${testFile}`, JSON.stringify(problemsArray))
}

const createCompleteDataset = async (problems) => {
  let files = await fs.readdir(outputFolder);
  files = files.filter(file => file !== testFile)
  let lastProblemDownloaded = files.length > 0 ? files[0] : null;
  if (lastProblemDownloaded) {
    lastProblemDownloaded = lastProblemDownloaded.replace('.json', '')
    const [contestId, index] = lastProblemDownloaded.split('-')[1].split('_')
    const lastProblemIndex = problems.findIndex(problem => problem.contestId === parseInt(contestId) && problem.index === index)
    problems = problems.slice(lastProblemIndex + 1)
    console.log(`Resuming download from problem ${contestId}/${index}`)
  }

  let successCount = 0
  const problemsArray = []

  const firstProblem = `${problems[0].contestId}_${problems[0].index}`
  let lastProblem = null

  for (const problem of problems) {
    try {
      const { success, rawHtml } = await downloadProblem(problem)
      if (!success) {
        console.error(`Rate limiter exceeded, try again later`)
        console.log(`Last problem downloaded: ${lastProblem}`)
        fs.writeFile(`${outputFolder}/${firstProblem}-${lastProblem}.json`, JSON.stringify(problemsArray))
        return
      }
      const rootElement = parseHTML(rawHtml)
      let problemData = getProblemData(rootElement)
      problemData = cleanData(problemData)

      const allowedTags = problem.tags.filter(tag => tags.includes(tag))
      if (allowedTags.length === 0) {
        console.log(`Problem ${problem.contestId}/${problem.index} has no allowed tags`)
        continue
      }

      problemData = {
        ...problem,
        ...problemData,
        type: undefined,
        tags: undefined,
      }

      allowedTags.forEach(tag => {
        problemData[`tags.${tag}`] = 1;
      }),

      problemsArray.push(problemData)

      lastProblem = `${problem.contestId}_${problem.index}`
    } catch (err) {
      console.error(`Error parsing problem ${problem.contestId}/${problem.index}`, err)
      continue
    }
    successCount++
    console.log(`${successCount} problems downloaded successfully`)
  }

  fs.writeFile(`${outputFolder}/${firstProblem}-${lastProblem}.json`, JSON.stringify(problemsArray))
}

const main = async () => {
  if (!existsSync(outputFolder)) await fs.mkdir(outputFolder)

  console.log('Starting download...')
  const problems = await getProblems(tags);

  console.log('Total available problems:', problems.length)
  if (testProblems > 0) {
    createTestDataset(problems)
  } else {
    createCompleteDataset(problems)
  }
}

main()