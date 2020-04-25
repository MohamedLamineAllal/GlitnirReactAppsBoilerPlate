const {
    series,
    parallel,
    src,
    dest,
    watch
} = require('gulp');

// const fs = require('fs');
const path = require('path');
const {
    execSync
} = require('child_process');
require('colors');


const GLITNIR_PROJECT_ROOT_DIR = path.resolve(__dirname, '../../../../');
const GLITNIR_SOURCE_DIR = path.join(GLITNIR_PROJECT_ROOT_DIR, "src");
const IMPORTED_DIR = path.join(__dirname, 'src/imported');
// function transEnFromFr(done) {
//     try {
//         const file = fs.readFileSync("src/i19n/locales/fr/translation.json");

//         if (file) {
//             const frObj = JSON.parse(file);

//             const engObj = Object.keys(frObj).reduce((engObj, enPhrase) => {
//                 engObj[enPhrase] = enPhrase;
//                 return engObj;
//             }, {});

//             fs.writeFileSync('src/i19n/locales/en/translation.json', JSON.stringify(engObj, null, '\t'));

//             done();
//         }
//     } catch (err) {
//         console.log('ERROR!'.red);
//         console.log(err);
//     }
// }


// function socketIOResolveImports(done) {
//     importsResolve('./src/socket.io/*/**/index.js')
//         .then(({
//             fileText,
//             imports,
//             calls
//         }) => {
//             fs.writeFile(path.resolve(__dirname, './src/socket.io/index.js'), fileText, function (err) {
//                 if (err) {
//                     console.error(err);
//                 }
//                 done();
//             });
//         });
// }



// function watchSocketIO() {
//     console.log('socketIO Watch started !'.yellow);
//     watch('src/socket.io/*/**/index.js')
//         .on('add', () => {
//             console.log('hie ===>'.yellow);
//             parallel(socketIOResolveImports)();
//         })
//         .on('unlink', () => {
//             parallel(socketIOResolveImports)();
//         });
//     watch('src/socket.io/*')
//         .on('unlink', () => {
//             parallel(socketIOResolveImports)();
//         });
// }

function gs_path(relativePath) {
    return path.join(GLITNIR_SOURCE_DIR, relativePath);
}

const import_directoriesToCopy = [
    gs_path('goldScript'),
    gs_path('technical-analitics')
];

function importOutsideSources(done) {

    for (let path of import_directoriesToCopy) {
        execSync(`cp -R ${path} ${IMPORTED_DIR}`);
    }

    done();
}

function watch_importOutsideSources() {
    watch(
        import_directoriesToCopy.map(
            (dir) => `${dir}/**/*`
        ), {
            delay: 500
        },
        series(importOutsideSources)
    );
}

function watcher(done) {
    watch_importOutsideSources();
    done();
}



// exports.socketIO = function socketIO(done) {
//     parallel(socketIOResolveImports)(done);
// }
// exports.transEnFromFr = transEnFromFr;
exports.watch = watcher;
exports.default = watcher;
exports.importOutSrcs = importOutsideSources;