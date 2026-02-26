import fs from 'node:fs';
import path from 'path';

const websitePath = './website';
const websiteUrl = 'https://type-editor.io';


try {
    const versions = [];
    // fs.access()
    fs.readdirSync(websitePath).map(fileName => {
        const isDirectory = fs.lstatSync(path.join(websitePath, fileName)).isDirectory();
        return isDirectory && /[0-9]\.[0-9]\.[0-9]/.test(fileName) ? fileName : null;
    }).forEach(fileName => {
        if (fileName) {
            versions.push(fileName);
        }
    });

    let versionsList = versions.sort().reverse();
    const result = [];
    for (const version of versionsList) {
        if (version.trim().length === 0) {
            continue;
        }
        result.push({ text: version, link: `${websiteUrl}/${version}/` });
    }

    const versionsFileContent = `window.versions = ${JSON.stringify(result)};`;

    fs.writeFileSync(`${path.resolve(websitePath)}/versions.js`, versionsFileContent);

} catch (err) {
    throw err;
}
