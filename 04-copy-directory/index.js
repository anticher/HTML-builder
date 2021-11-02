const fs = require('fs')
const path = require('path')

fs.promises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }).then(function () {

}).catch(function () {
    console.log('failed to create directory')
})

async function clearDir() {
    fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
        if (err)
            console.log(err)
        else {
            files.forEach(file => {
                fs.unlink(path.join(__dirname, 'files-copy', file), err => {
                    if (err) throw err
                })
            })
        }
    })
}



clearDir()
    .then((resolve) => {
        fs.readdir(path.join(__dirname, 'files'), (err, files) => {
            if (err)
                console.log(err)
            else {
                function copyCallback(err) {
                    if (err) throw err
                }
                files.forEach(file => {
                    fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), copyCallback)
                })
            }
        })
    })