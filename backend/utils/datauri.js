import DataUriParser from 'datauri/parser.js';
import path from 'path';

let parser = new DataUriParser()

let getDataUri = (file) => {
    let extName = path.extname(file.originalname).toString()
    // console.log(path.extname(file.originalname));
    return parser.format(extName, file.buffer).content
}

export default getDataUri

