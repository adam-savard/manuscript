#!/usr/bin/env node
import getPassage from './gateway-scraper.mjs';
import packagePassage from './output-wrapper.mjs';

const getArgValue = (flag) => {
    const index = process.argv.indexOf(flag);
    return (index !== -1 && process.argv.length > index + 1) ? process.argv[index + 1] : null;
};

const flagIsPresent = (flag) => {
    return process.argv.includes(flag);
}

const printHelp = () => {
    console.log(`
    Usage: manuscript [options]

    Options:
        -p, --passage       The passage to generate a PDF for (default: Revelation 5)
        -v, --version       The version of the Bible to use (default: ESV)
        -t, --add-title     Add the verse to the top of the PDF (default: false)
        -f, --font          The font to use (default: Times New Roman)
        -s, --size          The font size to use (default: 12)
        -ts, --title-size   The font size to use for the title (default: 16)
        -o, --output        The output file path (default: ./output.pdf)
                            (This can take either a .html or .pdf extension)
        -h, --help, ?       Display this help message
    `);
    process.exit(0);
}

const main = async () => {
    //check for args
    if(flagIsPresent('-h') || flagIsPresent('--help') || flagIsPresent('?')){
        printHelp();
        process.exit(0);
    }
    const parsedPassage = getArgValue('-p') || getArgValue('--passage') || 'Revelation 5';
    const version = getArgValue('-v') || getArgValue('--version') || 'ESV';
    const title = !!flagIsPresent('-t') || !!flagIsPresent('--add-title') || false;
    const font = getArgValue('-f') || getArgValue('--font') || 'Times New Roman';
    const size = getArgValue('-s') || getArgValue('--size') || 12;
    const titleSize = getArgValue('-ts') || getArgValue('--title-size') || 16;
    const output = getArgValue('-o') || getArgValue('--output') || './output.pdf';

    //if the output doesn't have .html or .pdf extension, exit the program and display an error message
    if (!output.endsWith('.html') && !output.endsWith('.pdf')) {
        console.error('The output file must have either a .html or .pdf extension');
        process.exit(1);
    }

    const { passage, verse } = await getPassage(parsedPassage, version);
    await packagePassage(passage, title ? verse : '', font, size, titleSize, output);
    process.exit(0);
}


main();