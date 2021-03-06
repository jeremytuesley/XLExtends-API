const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const validator = require('validator');

const { v4: uuidv4 } = require('uuid');

const {
  TooManyAttachments,
  BadUserInputError,
} = require('../../errors/CustomErrors');
const {
  fsAccessPromise,
  fsMakeDirPromise,
  fsReadPromise,
  fsUnlinkPromise,
  writeStreamToFile,
} = require('../../utils/fsPromises');

const contact = async (
  _,
  { contactData: { comments, contact, files = [], name } }
) => {
  const errors = [];
  console.log(contactData, comments, contact, name);

  if (validator.isEmpty(contact))
    errors.push({ message: 'Contact details are required.' });

  if (validator.isEmpty(name)) errors.push({ message: 'Name is required.' });

  if (errors.length > 0) throw new BadUserInputError(errors);

  const resolvedFiles = await Promise.all(files);

  if (resolvedFiles.length > 1) throw new TooManyAttachments();

  try {
    await fsAccessPromise(path.join(__dirname, 'attachments'));
  } catch {
    await fsMakeDirPromise(path.join(__dirname, 'attachments'));
  }

  const uniqueFilename = uuidv4();

  await Promise.all(
    resolvedFiles.map(({ createReadStream }) =>
      writeStreamToFile(
        createReadStream,
        path.join(__dirname, 'attachments', uniqueFilename)
      )
    )
  );

  const readFiles = await Promise.all(
    resolvedFiles.map(() =>
      fsReadPromise(path.join(__dirname, 'attachments', uniqueFilename))
    )
  );

  if (process.env.NODE_ENV === 'test') {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: 'xlextendsmanage@gmail.com',
        to: 'tuesleyjeremy@gmail.com',
        subject: `Hello from ${name}`,
        attachments: readFiles.map(({ filename }, index) => ({
          content: readFiles[index],
          filename,
          encoding: 'base64',
        })),
        text: 'Hello world.',
        html: `<div>
        <h1>${name} is trying to get in touch</h1>
        <div>${comments}</div>
        </div>`,
      });
      await Promise.all(
        resolvedFiles.map(({ filename }) =>
          fsUnlinkPromise(path.join(__dirname, 'attachments', filename))
        )
      );
      fs.rmdir(path.join(__dirname, 'attachments'), () => {});
      return true;
    } catch {
      return false;
    }
  } else {
    const message = {
      to: process.env.ADMIN_RECIPIENT_EMAIL_ADDRESS,
      from: process.env.ADMIN_SENDER_EMAIL_ADDRESS,
      subject: `${name} left you a message.`,
      attachments: resolvedFiles.map(({ mimetype }, index) => ({
        content: readFiles[index].toString('base64'),
        filename: uniqueFilename,
        type: mimetype,
        disposition: 'attachment',
      })),
      html: `<div>
      <h1>${name} is trying to get in touch.</h1>
      <h2>Comments</h2>
      <div>
      ${comments || ''}
      </div>
      <h2>Contact</h2>
      <div>
      ${contact}
  </div>
      </div>`,
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    try {
      await Promise.all([
        await sgMail.send(message),
        await Promise.all(
          resolvedFiles.map(() =>
            fsUnlinkPromise(path.join(__dirname, 'attachments', uniqueFilename))
          )
        ),
      ]);
      fs.rmdir(path.join(__dirname, 'attachments'), () => {});
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};

module.exports = { contact };
