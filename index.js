const yargs = require('yargs');
const fs = require('fs');

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
      console.log(`folder: ${argv.folder}; output: ${argv.output}`);

      const dirPath = argv.folder;
      const filePath = `${argv.folder}/${argv.output}`;

      if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
        return console.log('Not a folder');
      }

      if (fs.existsSync(filePath)) {
        return console.log('File exist');
      }

      fs.writeFile(filePath, 'Hello content!', (err) => {
        if (err) throw err;
        console.log('Saved!');
      });
    }
  })
  .alias('help', 'h')
  .argv;
