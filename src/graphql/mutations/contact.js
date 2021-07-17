const sgMail = require('@sendgrid/mail');
const path = require('path');
const validator = require('validator');

const { TooManyAttachments, BadUserInputError } = require('../../errors/CustomErrors');
const {
  fsAccessPromise,
  fsMakeDirPromise,
  fsReadPromise,
  fsUnlinkPromise,
  writeStreamToFile,
} = require('../../utils/fsPromises');

const contact = async (_, { contactData: { comments, contact, files, name } }) => {
  const errors = [];

  if (validator.isEmpty(contact)) errors.push({ message: 'Contact details are required.' });

  if (validator.isEmpty(name)) errors.push({ message: 'Name is required.' });

  if (errors.length > 0) throw new BadUserInputError(errors);

  const resolvedFiles = await Promise.all(files);

  if (resolvedFiles.length > 5) throw new TooManyAttachments();

  try {
    await fsAccessPromise(path.join(__dirname, 'attachments'));
  } catch {
    await fsMakeDirPromise(path.join(__dirname, 'attachments'));
  }

  await Promise.all(
    resolvedFiles.map(({ createReadStream, filename }) =>
      writeStreamToFile(createReadStream, path.join(__dirname, 'attachments', filename)),
    ),
  );

  const readFiles = await Promise.all(
    resolvedFiles.map(({ filename }) =>
      fsReadPromise(path.join(__dirname, 'attachments', filename)),
    ),
  );

  const message = {
    to: 'o.zahnitko@gmail.com',
    from: 'js.t3a2@gmail.com',
    subject: `${name} left you a message.`,
    attachments: resolvedFiles.map(({ filename, mimetype }, index) => ({
      content: readFiles[index].toString('base64'),
      filename,
      type: mimetype,
      disposition: 'attachment',
    })),
    html: `<div>
    <h1>${name} is trying to get in touch.</h1>
    <h2>Comments</h2>
    <div>
    ${comments}
    </div>
    <h2>Contact</h2>
    <div>
    ${contact}
</div>
    </div>`,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await Promise.all(
      resolvedFiles.map(({ filename }) =>
        fsUnlinkPromise(path.join(__dirname, 'attachments', filename)),
      ),
    );
    await sgMail.send(message);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { contact };
