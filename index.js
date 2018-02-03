#!/usr/bin/env node
const axios = require('axios')
const fs = require('fs')
const queue = require('queue')
const questions = require('./Questions')

questions.ask().then(answers => {
  const URL = answers.url
  let q = queue({concurrency: answers.numberOfThreads})

  let found = []
  const wordsList = fs.readdirSync('./wordlists')
  .map(x => `./wordlists/${x}`)
  .map(x => fs.readFileSync(x, 'utf8').split('\n'))
  .reduce((prev, curr) => [...prev, ...curr], [])

  const pushWords = (url) => {
    for(let word of wordsList) {
      q.push(() => fetch(url, word))
    }
  }

  const fetch = (url, word) => {
    return new Promise((resolve, reject) => {
      const urlFetch = `${url}/${word}`
      axios({
        url: urlFetch,
        method: 'get',
        maxRedirects: 0,
        validateStatus: (status) => {
          return status >= 200 && status < 300
        }
      }).then(response => {
        console.log(urlFetch)
        if (answers.recursive) {
          pushWords(urlFetch)
        }
        resolve()
      }).catch(() => {
        resolve()
      })
    })
  }

  pushWords(URL)

  console.log('Starting Queue');
  q.start()
  q.on('end', (result, job) => {
    console.log('END')
  })
}).catch(err => {
  console.error(err)
})
