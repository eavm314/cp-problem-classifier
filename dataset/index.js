const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');

const { getProblems, downloadProblem } = require('./downloader.js')
const { parseHTML, getProblemData, cleanData } = require('./html-parser.js')

const outputFolder = '../data'
const tags = ['dp', 'math', 'implementation']

const main = async () => {
  console.log('Starting download...')
  const problems = await getProblems(tags);

  console.log('Total problems:', problems.length)
  const randomIndex = Math.floor(Math.random() * (problems.length - 5))
  const testProblems = problems.slice(randomIndex, randomIndex + 5)

  console.log('Downloading problems:', testProblems.map(problem => `${problem.contestId}/${problem.index}`))
  if (!existsSync(outputFolder)) await fs.mkdir(outputFolder)
  for (const problem of testProblems) {
    try {
      const rawHtml = await downloadProblem(problem)
      const rootElement = parseHTML(rawHtml)

      let problemData = getProblemData(rootElement)
      problemData = cleanData(problemData)
      problemData = { ...problem, ...problemData, tags: problem.tags.filter(tag => tags.includes(tag)) }

      fs.writeFile(`${outputFolder}/${problem.contestId}-${problem.index}.json`, JSON.stringify(problemData))
    } catch (err) {
      console.error(`Error parsing problem ${problem.contestId}/${problem.index}`, err)
      continue
    }
    console.log(`Problem ${problem.contestId}/${problem.index} downloaded successfully`)
  }
}

main()