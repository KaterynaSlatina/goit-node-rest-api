import * as path from "node:path";
import * as crypto from "node:crypto";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename(req, file, cb) {
    const extname = path.extname(file.originalname); //.png
    const basename = path.basename(file.originalname, extname); //назва файлу без розширення
    const suffix = crypto.randomUUID();

    // const prefix = crypto.randomUUID();
    // cb(null, `${prefix}-${file.originalname}`);

    cb(null, `${basename}-${suffix}${extname}`);
  },
});

export default multer({ storage });
