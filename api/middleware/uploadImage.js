const multer = require("multer");
const path = require("path");
const { mkdirSync, existsSync } = require("fs");

const imageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];

const createProfileUploadImage = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!existsSync("uploads/Users_imgs")) {
        mkdirSync("uploads/Users_imgs", { recursive: true });
      }
      cb(null, "uploads/Users_imgs");
    },
    filename: (req, file, cb) => {
      cb(null, "ProfilePic_" + Date.now() + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("The File Must Be An Image"), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
    "image"
  );
  upload(req, res, function (err) {
    if (err) {
      return res.json({
        msg: err.message,
        status: 500,
      });
    }
    next();
  });
};

const updateProfileUploadImage = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!existsSync("uploads/Users_imgs")) {
        mkdirSync("uploads/Users_imgs", { recursive: true });
      }
      cb(null, "uploads/Users_imgs");
    },
    filename: (req, file, cb) => {
      cb(null, "ProfilePic_" + Date.now() + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("The File Must Be An Image"), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
    "image"
  );
  upload(req, res, function (err) {
    if (err) {
      return res.json({
        msg: err.message,
        status: 500,
      });
    }
    next();
  });
};

const createServiceUpload = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!existsSync("uploads/UsersServices")) {
        mkdirSync("uploads/UsersServices", { recursive: true });
      }
      cb(null, "uploads/UsersServices");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        "Service_" +
          Date.now() +
          (Math.floor(Math.random() * (100 - 1 + 1)) + 1) +
          path.extname(file.originalname)
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("The File Must Be An Image"), false);
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { files: 6, fileSize: 4 * 1024 * 1024 },
  }).array("images");

  upload(req, res, function (err) {
    if (err) {
      if (
        err instanceof multer.MulterError &&
        err.code === "LIMIT_FILE_COUNT"
      ) {
        return res
          .status(400)
          .json({ msg: "You can't select more than 6 images", status: 400 });
      } else if (
        err instanceof multer.MulterError &&
        err.code === "LIMIT_FILE_SIZE"
      ) {
        return res.json({
          msg: "Each image size must be maximum 4MB",
          status: 400,
        });
      } else
        return res.json({
          msg: err.message,
          status: 500,
        });
    }
    next();
  });
};

module.exports = {
  createProfileUploadImage,
  updateProfileUploadImage,
  createServiceUpload,
};
