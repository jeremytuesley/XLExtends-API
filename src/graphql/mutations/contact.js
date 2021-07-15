const sgMail = require('@sendgrid/mail');

const contact = async (_, { contactData: { comments, contact, name } }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // TODO: validate input.
  // TODO: Will need to know data types for all three - most likely string for all.

  const message = {
    to: 'o.zahnitko@gmail.com',
    from: 'js.t3a2@gmail.com',
    subject: `${name} left you a message.`,
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

  try {
    await sgMail.send(message);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { contact };
