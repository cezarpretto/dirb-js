#!/usr/bin/env node
const axios = require('axios')
const fs = require('fs')
const queue = require('queue')
const commander = require('commander')
const version = require('./package.json').version
const chalk = require('chalk')
const log = require('chalk-log')
const ora = require('ora')

const spinner = ora('Work in progress')

commander
  .version(version)
  .option('-u, --url <url>', 'Base URL')
  .option('-r, --recursive', 'Set recursive mode')
  .option('-c, --concurrency <number>', 'Number of proccess at the same time. Default: 1')
  .parse(process.argv)

if (commander.url) {
  const URL = commander.url.replace(/\/(?=[^\,/]*$)?$/, '')
  let q = queue({concurrency: commander.concurrency || 1})

  let found = []
  const wordsList = fs.readdirSync(`${__dirname}/wordlists`)
  .map(x => `./wordlists/${x}`)
  .map(x => fs.readFileSync(x, 'utf8').split('\n'))
  .reduce((prev, curr) => [...prev, ...curr], [])

  const pushWords = (url) => {
    for(let word of wordsList) {
      q.push(() => fetch(url, word))
    }
  }

  spinner.start()

  const fetch = (url, word) => {
    return new Promise(async (resolve, reject) => {
      const urlFetch = `${url}/${word}`
      try {
        log.progress(urlFetch)
        const response = await axios({
          url: urlFetch,
          method: 'get',
          maxRedirects: 0,
          validateStatus: (status) => {
            return status >= 200 && status < 300
          }
        })
        if (!!commander.recursive) {
          pushWords(urlFetch)
        }
        log.clear()
        console.log(chalk.green(`${urlFetch} - ${chalk.white.bgGreen.bold(`STATUS [${response.status}]`)}`))
      } catch (e) {
        log.clear()
      } finally {
        resolve()
      }
    })
  }

  pushWords(URL)

  console.log('Starting Queue');
  q.start()
  q.on('end', (result, job) => {
    spinner.succeed('Finished')
  })
}
