import fs from 'fs';
import htmlPdf from 'html-pdf-node';
import path from 'path';
const __dirname = process.cwd();

/**
 * Packs the passage into a PDF or HTML file
 * @param {String} text The passage to package
 * @param {String} title The title of the passage (blank by default)
 * @param {String} font The font to use (Times New Roman by default)
 * @param {Number} bodySize The font size to use (12 by default)
 * @param {Number} titleSize The font size to use for the title (16 by default)
 * @param {String} output The output file path (./output.pdf by default)
 */
const packagePassage = async (text, title = '', font = 'Times New Roman', bodySize = 12, titleSize = 16, output = './output.pdf') => {
    const words = text.split(' ');
    let lineCount = 0;
    let currentLine = '';
    const lines = [];

    words.forEach(word => {
        if (currentLine.length + word.length + 1 > 80) { // Assuming 80 characters per line
            lines.push(currentLine);
            currentLine = word;
            lineCount++;
        } else {
            currentLine += (currentLine ? ' ' : '') + word;
        }
    });
    if (currentLine) {
        lines.push(currentLine);
        lineCount++;
    }

    const htmlContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: "${font}";
                        font-size: ${bodySize}pt;
                        line-height: 3;
                        position: relative;
                    }
                    .title {
                        font-size: ${titleSize}pt;
                        margin-bottom: 20px;
                        padding-left: 0.6in; /* Center relative to the text */
                    }
                    .line-number {
                        position: absolute;
                        left: 0;
                        width: 0.5in;
                        text-align: right;
                    }
                    .line {
                        padding-left: 0.6in; /* Ensure text is consistently offset from the left */
                    }
                </style>
            </head>
            <body>
                ${title ? `<div class="title">${title}</div>` : ''}
                ${lines.map((line, index) => {
                    const lineNumber = (index + 1) % 5 === 0 ? `<span class="line-number">${index + 1}</span>` : '';
                    return `<div class="line">${lineNumber}<span>${line}</span></div>`;
                }).join('')}
            </body>
        </html>
    `;

    if(output.endsWith('.html')){
        try{
            fs.writeFileSync(path.resolve(__dirname, output), htmlContent);
        }
        catch(e){
            console.error('Something went wrong while writing the file');
            console.error(e);
            process.exit(1);
        }
    }

    if(output.endsWith('.pdf')){
        const originalConsoleLog = console.log;
        const originalConsoleWarn = console.warn;
        const originalConsoleError = console.error;

        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
        try {
            const options = { format: 'A4', margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' } };
            const file = { content: htmlContent };
            const buffer = await htmlPdf.generatePdf(file, options);
            fs.writeFileSync(path.resolve(__dirname, output), buffer);
        }
        catch(e){
            console.log = originalConsoleLog;
            console.warn = originalConsoleWarn;
            console.error = originalConsoleError;
            console.error('Something went wrong while writing the file');
            console.error(e);
            process.exit(1);
        }
        finally {
            console.log = originalConsoleLog;
            console.warn = originalConsoleWarn;
            console.error = originalConsoleError;
        } 
    }
};

export default packagePassage;