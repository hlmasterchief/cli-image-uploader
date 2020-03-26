const dotenv = require('dotenv');
const yargs = require('yargs');
const fs = require('fs');
const imgur = require('imgur');
const glob = require('glob');
const cloudinary = require('cloudinary').v2;

// Config
dotenv.config();
imgur.setCredentials(process.env.IMGUR_EMAIL, process.env.IMGUR_PASSWORD, process.env.IMGUR_CLIENT_ID);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const argv = yargs
  // .scriptName('cli-image-uploader')
  .usage('Usage: $0 <command> [options]')

  .command({
    command: 'upload [folder] [output]',
    // aliases: ['$0'],
    desc: 'Upload images and save links to a file',
    builder: (yargs) => {
      yargs
        .positional('folder', {
          desc: 'Image folder',
          default: '.',
          type: 'string'
        })
        .option('output', {
          alias: 'o',
          desc: 'Output file name',
          default: `${Date.now()}.txt`,
          type: 'string'
        })
        .example('$0 img -o out.txt', 'Upload images in img/ and save links to img/out.txt')
    },
    handler: (argv) => {
      console.log(`folder: ${argv.folder} | output: ${argv.output}`);

      const dirPath = argv.folder;
      const filePath = `${argv.folder}/${argv.output}`;

      if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
        return console.log('Not a folder');
      }

      if (fs.existsSync(filePath)) {
        return console.log('File exist');
      }

      const stream = fs.createWriteStream(filePath);
      stream.on('error', console.error);

      const imgPath = `${argv.folder}/*.{jfif,jpeg,jpg,png,gif}`;
      const fileExtIndex = (argv.output.lastIndexOf('.') >= 0) ? argv.output.lastIndexOf('.') : argv.output.length;
      const fileName = argv.output.substring(0, fileExtIndex);

      imgur.createAlbum()
        .then(function(json) {

          glob(imgPath, async (err, files) => {
            if (err) return console.error(err.message);

            for (const file of files) {
              let line = '';

              await imgur.uploadFile(file, json.data.id)
                .then(function (json) {
                    line += `${json.data.link}\t`;

                    cloudinary.uploader.upload(file, { folder: fileName, use_filename: true }, (err, result) => {
                      if (err) return console.error(err.message);

                      line += `${result.secure_url}\t`;
                      line += file.substring(file.lastIndexOf('/') + 1);
                      stream.write(line + '\n');
                    })
                })
                .catch(function (err) {
                    console.error(err.message);
                    if (err.message.code === 429) {
                      console.log('Imgur limit at ' + file);
                      process.exit();
                    }
                });
            }
          });
        })
        .catch(function (err) {
          console.error(err.message);
        });
    }
  })
  .alias('help', 'h')
  .argv;
