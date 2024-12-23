import multer from "multer";
import fs from 'fs'
import path from "path"

const uploadDir = "../public/temp";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Reached here")
      cb(null, "../public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
      console.log("Reached there")
    }
  })
  
export const upload = multer({ 
    storage, 
})