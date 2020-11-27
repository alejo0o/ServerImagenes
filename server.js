const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(fileUpload());
app.use(cors());

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const name = req.query.usuario;

  const file = req.files.file;

  //const name = file.name;

  file.mv(`${__dirname}/uploads/${name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: name, filePath: `/uploads/${name}` });
  });
});
//get de la imagen
app.get(`/getImagen`, (req, res) => {
  try {
    const name = req.query.imagen;
    let path = '';

    path = `uploads/${name}`;

    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'image/*',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'image/*',
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(err);
  }
});
app.listen(3001, () => console.log('Server Started...'));
/*if (!/^[A-Z._-][A-Z0-9._-]{0,254}$/i.test(file.name)) {
    res.status(500).send('Evitar el uso de caracteres especiales');
  } else { */
