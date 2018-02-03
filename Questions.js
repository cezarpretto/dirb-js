const inquirer = require('inquirer')

const questions = [
  {
    type: 'input',
    name: 'url',
    message: 'Type the URL:',
    validate (value) {
      const pass = value.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)
      return pass ? true : 'Invalid URL. Type a valid URL.'
    }
  },
  {
    type: 'confirm',
    name: 'recursive',
    message: 'Recursive mode?'
  },
  {
    type: 'input',
    name: 'numberOfThreads',
    message: 'Type the number of Threads:',
    default () {
      return 1
    },
    filter (value) {
      return parseInt(value)
    },
    validate (value) {
      const parsed = parseInt(value)
      return !!parsed ? true : 'Must be a valid number!'
    }
  },
]

const ask = () => inquirer.prompt(questions)

module.exports = {
  ask
}
