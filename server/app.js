'use strict';

const readReportFile = require('./lib/readReportFile');
const replaceInlineImagesWithPaths = require('./lib/replaceInlineImagesWithPaths');

module.exports = function createAppRouteHandler(reportFile) {
    return function (req, res, next) {
        readReportFile(reportFile)
            .then((results) => {
                const serializedResults = JSON.stringify(replaceInlineImagesWithPaths(results));

                const html = '<meta charset="utf-8" />' +
                    '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">' +
                    '<title>Gemini CI GUI</title>' +
                    '<body style="margin: 0; padding: 0">' +
                    '<div id="application"></div>' +
                    `<script>window.geminiTestResults = ${serializedResults};</script>` +
                    '<script src="/bundle.js"></script>' +
                    '</body>';

                res.type('html');
                res.send(html);
            })
            .catch(next);
    };
};
