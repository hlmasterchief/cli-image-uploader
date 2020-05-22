# cli-image-uploader
A simple command line program written with yargs to upload images to imgur and cloudinary.

## Status
Pre-alpha. A quick and dirty one written to learn using yargs. It works but only has limited testing.

## Installation
*Install dependencies*  
`npm install`

*Set up environment variables*  
Rename `.env.example` to `.env` and fill the details or directly add corresponding environment variables
```
IMGUR_EMAIL=            // imgur info, mandatory, for album creation
IMGUR_PASSWORD=         // same as above
IMGUR_CLIENT_ID=        // imgur app client ID, mandatory, https://api.imgur.com/oauth2/addclient
CLOUDINARY_CLOUD_NAME=  // cloudinary info, mandatory, https://cloudinary.com/console
CLOUDINARY_API_KEY=     // same as above
CLOUDINARY_API_SECRET=  // same as above
```
*Run the app*  
`node index.js -h`

## Features
```
Usage: index.js <command> [options]

Commands:
  index.js upload [folder] [output]  Upload images and save links to a file
  index.js list [folder] [output]    List images and save to a file

Options:
  --help, -h  Show help                                                [boolean]
  --version   Show version number                                      [boolean]
```