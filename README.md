# manuscript
Manuscript-style Bible Study Tool for the CLI

# Known Issues

You _SHOULD NOT_ use this in its current form. The application simply isn't ready for primetime until I sort out how to fix these issues

- [ ] The passage headings are still present in the text, and this is unavoidable using the node module that's present
  - [ ] Might need to rewrite said node module from scratch to get rid of them
- [ ] The spacing is weird for any size over 12pt font due to 80 char assumptions
- [ ] Having only HTML and PDF is not ideal; docx should be added
- [ ] The PDF handler used also installs Puppeteer which is _massive_
- [ ] Error handling is at a bare minimum


# How to use

_This has only been tested on Linux_

This repo isn't ready to be uploaded to `npm`, so please clone it and run 

```shell
npm i
npm link
```

in the root directory. This will link the `manuscript` tool in your console.

Example commands:

```shell
# outputs John 3 in ESV (default) in PDF form with no title (default)
manuscript -p "John 3" -o john-3.pdf
# outputs Mark 4:1-20 in NRSV in PDF form, with a title
manuscript -p "Mark 4:1-20" -o parable-of-sower-nrsv.pdf -v NRSV -t
# outputs Mark 4:1-20 in NIV in HTML form, with a title
manuscript -p "Mark 4:1-20" -o parable-of-sower-niv.html -v NIV -t
# outputs Daniel in Young's Literal Translation in HTML form, with a title, 14pt body, 18pt title, Wingdings 3 font.
# This is known as "hard mode"
manuscript -p "Daniel 3" -o daniel-3.pdf -v YLT -t -s 14 -ts 18 -f "Wingdings 3"
```

Example help output:
```
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
        -h, --help          Display this help message
```