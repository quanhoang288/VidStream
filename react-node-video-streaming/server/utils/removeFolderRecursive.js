const fs = require('fs');

const removeFolderRecursive = path => {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { 
                // recursive
                removeFolderRecursive(curPath);
            } else { 
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = removeFolderRecursive;