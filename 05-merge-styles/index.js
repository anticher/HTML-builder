const fs = require('fs')
const path = require('path')


readStyleFolder()
    .then(files => {
        return makeStylePushArray(files)
    })
    .then(arr => {
        pushStylesToBundle(arr) 
    })





async function readStyleFolder() {
    return new Promise(function (resolve, reject) {
        fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
            if (err) {
                console.log(err)
            } else {
                resolve(files)
            }
        })
    })
}

async function makeStylePushArray(files) {
    return new Promise(function (resolve, reject) {
        let arr = []
        let arrIgnore = []
        files.forEach((file, index) => {
            let ext = file.slice(file.lastIndexOf('.') + 1)
            fs.readFile(path.join(__dirname, 'styles', file), 'utf8', (err, data) => {
                if (err) {
                    console.error(err)
                    return
                } else {
                    if (ext === 'css') {
                        arr.push(data)
                    } else {
                        arrIgnore.push(data)
                    }
                    if (files.length === arr.length + arrIgnore.length) {
                        resolve(arr)
                    }
                }
            })
        })
    })
}


function pushStylesToBundle(arr) {
    firstStyleAdd(arr)
    otherStylesAdd(arr)
}





function firstStyleAdd(arr) {
        if (arr.length > 0) {
            fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), arr[0], err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else {
            console.log('array is empty')
        }
}

function otherStylesAdd(arr) { 
    if (arr.length > 1) {
        appendArr = arr.slice(1)
        appendArr.forEach(element => {
            fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), element, err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }) 
    } else {
        return
    }
}