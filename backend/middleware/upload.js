const multer = require('multer');

// Store the file in memory as a Buffer
const storage = multer.memoryStorage();

// Create the multer instance. We'll expect a single file 
// with the field name 'image'
const upload = multer({ storage: storage }).single('image');

module.exports = upload;