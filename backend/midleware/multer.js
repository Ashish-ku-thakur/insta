import multer from 'multer';

let upload = multer({
    storage: multer.memoryStorage()
})
export default upload