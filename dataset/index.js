const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');

const { getProblems, downloadProblem } = require('./downloader.js')
const { parseHTML, getProblemData, cleanData } = require('./html-parser.js')

const outputFolder = '../data'
const tags = require('./tags.js')

const testProblems = 10

const main = async () => {
  console.log('Starting download...')
  let problems = await getProblems(tags);

  console.log('Total problems:', problems.length)
  if (testProblems > 0) {
    const randomIndex = Math.floor(Math.random() * (problems.length - testProblems))
    problems = problems.slice(randomIndex, randomIndex + testProblems)
  }

  console.log(`Downloading ${problems.length} problems`)
  if (!existsSync(outputFolder)) await fs.mkdir(outputFolder)

  let successCount = 0
  const problemsArray = []

  for (const problem of problems) {
    try {
      const rawHtml = await downloadProblem(problem)
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

      // fs.writeFile(`${outputFolder}/${problem.contestId}-${problem.index}.json`, JSON.stringify(problemData))
    } catch (err) {
      console.error(`Error parsing problem ${problem.contestId}/${problem.index}`, err)
      continue
    }
    console.log(`Problem ${problem.contestId}/${problem.index} downloaded successfully`)
    successCount++
  }
  
  console.log(`Downloaded ${successCount} problems from ${problems.length}, saved to ${outputFolder}/output.json`)
  fs.writeFile(`${outputFolder}/output.json`, JSON.stringify(problemsArray))
}

main()