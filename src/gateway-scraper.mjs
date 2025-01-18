import { BibleGatewayAPI } from "bible-gateway-api";

const getPassage = async (reference = 'revelation 5:1', version = 'ESV') => {
    try{
        const bgw = new BibleGatewayAPI();
        const {verse, content } = await bgw.search(reference, version);
    
        //loop through all the verse, from index 6 to the second last index, and remove the first verse numbers
        content.forEach((verse, index) => {
            if (index >= 6 && index < content.length - 2) {
                content[index] = verse.replace(/^\d+\s*/, '');
            }
        });
    
        // the raw content is any part of the array that's greater or equal to 6 and omitting the last two elements
        const rawContent = content.slice(6, content.length - 2).join(' ');
    
        /**
         * For the formatted content, we want to remove the verse number at the start of each line.
         * We also want to remove any footnotes (in the format (A), etc.) and
         * any other cross-references (in the format [a], etc.).
         */
        const formattedContent = rawContent
            .replace(/\([A-Z]{1,5}\)/g, '')  // Remove footnotes in the format (A), (B), ..., (AA), (AB), ..., up to (ZZZZZ)
            .replace(/\[\w+\]/g, ''); // Remove cross-references in the format [a], [b], etc.
        
        const formattedWithoutDoubleSpaces = formattedContent.replace(/\s{2,}/g, ' ');
        return {passage : formattedWithoutDoubleSpaces, verse};
    }
    catch(e){
        console.error('Something went wrong with the request');
        console.error(e);
        process.exit(1);
    }
}

export default getPassage;