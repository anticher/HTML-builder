const fs = require('fs')
const path = require('path')

fs.stat(path.join(__dirname, 'project-dist'), function (err) {
    if (!err) {
        fs.promises.rm(path.join(__dirname, 'project-dist'), { recursive: true }).then(function () {
            createDistWithInner()
        })
    }
    else if (err.code === 'ENOENT') {
        createDistWithInner()
    }
})


async function createDistWithInner() {
    function copyCallback(err) {
        if (err) throw err
    }


    fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }).then(function () {

    }).catch(function () {
        console.log('failed to create directory')
    })


    fs.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'), copyCallback)







    // make html dist

    readHtmlFolder('components')
        .then((files) => {
            return new Promise(function (resolve, reject) {
                let obj = {}
                let arrIgnore = []
                files.forEach(file => {
                    let ext = file.slice(file.lastIndexOf('.') + 1)
                    fs.readFile(path.join(__dirname, 'components', file), 'utf8', (err, data) => {
                        if (err) {
                            console.error(err)
                            return
                        } else {
                            if (ext === 'html') {
                                obj[file] = data
                            } else {
                                arrIgnore.push(data)
                            }
                            if (files.length === Object.keys(obj).length + arrIgnore.length) {
                                resolve(obj)
                            }
                        }
                    })
                })
            })
        })
        .then((obj) => {
            return new Promise(function (resolve, reject) {
                fs.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf8', (err, data) => {
                    if (err) {
                        console.error(err)
                        return
                    } else {
                        Object.keys(obj).forEach(key => {
                            let name = key.split('.')[0]
                            data = data.replace('{{' + name + '}}', obj[key])
                            if (obj[key] === obj[Object.keys(obj)[Object.keys(obj).length - 1]]) {
                                resolve(data)
                            }
                        })
                    }
                })
            })
        })
        .then((data) => {
            fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), data, err => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        })


    async function readHtmlFolder(folder) {
        return new Promise(function (resolve, reject) {
            fs.readdir(path.join(__dirname, folder), (err, files) => {
                if (err) {
                    console.log(err)
                } else {
                    resolve(files)
                }
            })
        })
    }



    // make css dist

    readStyleFolder()
        .then(files => {
            return makeStylePushArray(files)
        })
        .then(arr => {
            pushStylesToDist(arr)
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

    function pushStylesToDist(arr) {
        firstStyleAdd(arr)
        otherStylesAdd(arr)
    }

    function firstStyleAdd(arr) {
        if (arr.length > 0) {
            fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), arr[0], err => {
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
                fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), element, err => {
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


    // make assets dist

    copyFoldersWithInner('assets', 'project-dist/assets')

    function copyFoldersWithInner(folder, dist, inner = undefined) {
        let currentPath = inner ? folder + '/' + inner : folder
        let currentDist = inner ? dist + '/' + inner : dist
        fs.readdir(path.join(__dirname, currentPath), (err, files) => {
            if (err) {
                console.log(err)
            } else {
                const pathsToCheck = [...files]
                for (let i = 0; i < pathsToCheck.length; i++) {
                    fs.stat(path.join(__dirname, path.normalize(currentPath), pathsToCheck[i]), (err, stats) => {
                        if (stats.isDirectory()) {
                            fs.promises.mkdir(path.join(__dirname, path.normalize(currentDist), pathsToCheck[i]), { recursive: true }).then(function () {
                            }).catch(function () {
                                console.log('failed to create directory')
                            })
                            copyFoldersWithInner(folder, dist, pathsToCheck[i])
                        } else {
                            // fs.promises.readFile(path.join(__dirname, path.normalize(currentPath), pathsToCheck[i]))
                            // .then(function(result) {
                            //     console.log("da"+result);
                            //   })
                            //   .catch(function(error) {
                            //      console.log(error);
                            //   })
                            fs.readFile(path.join(__dirname, path.normalize(currentPath), pathsToCheck[i]), (err, data) => {
                                if (err) {
                                    console.error(err)
                                    return
                                } else {
                                    fs.writeFile(path.join(__dirname, path.normalize(currentDist), pathsToCheck[i]), data, err => {
                                        if (err) {
                                            console.error(err)
                                            return
                                        }
                                    })
                                }

                            })
                        }
                    })
                }
            }
        })
    }
}


