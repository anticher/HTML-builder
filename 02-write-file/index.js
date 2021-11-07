const fs = require('fs')
const path = require('path')

process.stdout.write('hello, enter your ToDo\n')
process.stdin.on('data', (data) => {
    const text = data.toString()
    if (text.trim() === 'exit') {
        process.exit()
    }
    fs.appendFile(path.join(__dirname, 'text.txt'), text, (error, data) => {
        if(error) return console.error(error.message)
        console.log('ToDo created, enter your ToDo')
      })
})

process.on('SIGINT', function() {
    process.stdout.clearLine()
    process.exit()
})

process.on('exit', () => {
    process.stdout.write('Bye, bye\n')
})