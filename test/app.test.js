require('dotenv').config();
const chai = require('chai');
const request = require('supertest');

// TODO: Create test database
const { createDatabaseConnection } = require('../src/database/createDatabaseConnection');
const { initializeServer } = require('../src/server');

let app;

(async () => {
  const { app: rApp } = await initializeServer();

  app = rApp;
})();

(async () => {
  await createDatabaseConnection();
})();

const expect = chai.expect;

describe('Fetch All', () => {
  it('fetches all ', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
        query GetAllProducts {
            getAllProducts {
                _id
            }
        }
      `,
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.data.getAllProducts[0]._id).to.have.string('60ed73cbac30625165d5dbd5');
        done();
      });
  });
});

describe('Fetch product', () => {
  it('fetches a single product by id', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
            query GetProduct($productId: ID!) {
                getProduct(getProductData: {
                    productId: $productId
                }) {
                    _id
                }
            }
            `,
        variables: { productId: '60ed73cbac30625165d5dbd5' },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.getProduct._id).to.have.string('60ed73cbac30625165d5dbd5');
        done();
      });
  });

  it('return error when no product id provided', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
          query GetProduct($productId: ID!) {
            getProduct(getProductData: {
                productId: $productId
            }) {
                _id
            }
        }
          `,
        variables: { productId: '' },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].data.message).to.have.string('Product ID is required.');
        done();
      });
  });

  it('returns error when product not found', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
          query GetProduct($productId: ID!) {
            getProduct(getProductData: {
                productId: $productId
            }) {
                _id
            }
        }
          `,
        variables: { productId: '60ed73cbac30625165d5dbd2' },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].data.message).to.have.string('Invalid product ID.');
        done();
      });
  });
});

describe('Sign request', () => {
  it('signs an image upload request', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
                  query SignRequest {
                      signRequest {
                          signature
                          timestamp
                      }
                  }
              `,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.data).not.to.be.empty;
        done();
      });
  });
});

describe('Login', () => {
  it('logs in with valid credentials', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
        query Login($email: String!, $password: String!) {
            login(loginData:{email: $email,
                password: $password}) {
                authToken
            }
        }
      `,
        variables: { email: 'user@email.com', password: 'password' },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.login).to.have.own.property('authToken');
        done();
      });
  });

  it('returns error when no email', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
        query Login($email: String!, $password: String!) {
            login(loginData:{email: $email,
                password: $password}) {
                authToken
            }
        }
      `,
        variables: { email: '', password: 'password' },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].data[0].message).to.have.string('Email is required.');
        done();
      });
  });

  it('returns error when no password', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
        query Login($email: String!, $password: String!) {
            login(loginData:{email: $email,
                password: $password}) {
                authToken
            }
        }
      `,
        variables: { email: 'user@email.com', password: '' },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].data[0].message).to.have.string('Password is required.');
        done();
      });
  });

  it('returns an error when user email does not exist', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
      query Login($email: String!, $password: String!) {
          login(loginData:{email: $email,
              password: $password}) {
              authToken
          }
      }
    `,
        variables: { email: 'user1@email.com', password: 'password' },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].code).to.have.string('BAD_USER_INPUT');
        done();
      });
  });

  it('returns an error when passwords do not match', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
      query Login($email: String!, $password: String!) {
          login(loginData:{email: $email,
              password: $password}) {
              authToken
          }
      }
    `,
        variables: { email: 'user@email.com', password: 'passwordsss' },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].code).to.have.string('BAD_USER_INPUT');
        done();
      });
  });
});

describe('Contact', () => {
  it('send email when all values provided', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
        mutation Contact(
          $comments: String!,
          $contact: String!,
          $files: [Upload!]!,
          $name: String!
        ) {
          contact(contactData: {
            comments: $comments,
            contact: $contact, 
            files: $files,
            name: $name
          })
        }
        `,
        variables: {
          comments: 'These are comments',
          contact: 'these are contact details',
          files: [],
          name: 'This is a name',
        },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        console.log(res.body.data.contact);
        expect(res.body.data.contact).to.be.true;
        done();
      });
  });

  it('returns an error when contact is not present', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
        mutation Contact(
          $comments: String!,
          $contact: String!,
          $files: [Upload!]!,
          $name: String!
        ) {
          contact(contactData: {
            comments: $comments,
            contact: $contact, 
            files: $files,
            name: $name
          })
        }
        `,
        variables: {
          comments: 'These are comments',
          contact: '',
          files: [],
          name: 'This is a name',
        },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].data[0].message).to.have.string('Contact details are required.');
        done();
      });
  });

  it('returns an error when name is not present', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
        mutation Contact(
          $comments: String!,
          $contact: String!,
          $files: [Upload!]!,
          $name: String!
        ) {
          contact(contactData: {
            comments: $comments,
            contact: $contact, 
            files: $files,
            name: $name
          })
        }
        `,
        variables: {
          comments: 'These are comments',
          contact: 'These are the contact details',
          files: [],
          name: '',
        },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].data[0].message).to.have.string('Name is required.');
        done();
      });
  });

  it('returns an error when too many files are added', (done) => {
    request(app)
      .post('/v1/graphql')
      .send({
        query: `
      mutation Contact(
        $comments: String!,
        $contact: String!,
        $files: [Upload!]!,
        $name: String!
      ) {
        contact(contactData: {
          comments: $comments,
          contact: $contact, 
          files: $files,
          name: $name
        })
      }
      `,
        variables: {
          comments: 'These are comments',
          contact: 'These are the contact details',
          files: [
            { filename: 'yes' },
            { filename: 'yes' },
            { filename: 'yes' },
            { filename: 'yes' },
            { filename: 'yes' },
            { filename: 'yes' },
          ],
          name: 'This is the name',
        },
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});
