const multer = require('multer');

module.exports.excelUpload = () => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'src/public/excel_file')
        },
        filename: (req, file, cb) => {
            cb(null,Date.now()+"_"+ file.originalname)
        }
    });
    return multer({storage: storage})
}

module.exports.visitorProfile = ()=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'src/public/visitor')
        },
        filename: (req, file, cb) => {
            const guardId = req.user._id.toString()
            const toUser = req.body.toUser
            cb(null,guardId+"_"+toUser+"_"+Date.now()+"_"+ file.originalname+".jpg")
        }
    });
    return multer({storage: storage})
}

