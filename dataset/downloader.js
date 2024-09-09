const getProblems = async (tags) => {
  const url = "https://codeforces.com/api/problemset.problems"
  // const encoded_url = new URL(url)
  // encoded_url.searchParams.append('tags', tags.join(';'))
  // console.log(encoded_url)
  const res = await fetch(url)
  const data = await res.json()
  const filteredData = data.result.problems.filter(problem => problem.tags.some(tag => tags.includes(tag)))
  return filteredData
}

const downloadProblem = async (problem) => {
  const url = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
  const res = await fetch(url)
  const text = await res.text()
  return text
}

module.exports = { getProblems, downloadProblem }