const fs = require('fs')
const path = require('path')

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Current directory files:')
        files.forEach(file => {
            getFileInfo(file)
        })
    }
})

async function getFileInfo(file) {
    try {
        const stats = await fs.promises.stat(path.join(__dirname, 'secret-folder', file))
        if (stats.isFile() === true) {
            let name = file.slice(0, file.lastIndexOf('.'))
            let ext = file.slice(file.lastIndexOf('.') + 1)
            let size = stats.size + 'b'
            console.log(name + ' - ' + ext + ' - ' + size)
        }
    }
    catch (error) {
        console.log(error)
    }
}
