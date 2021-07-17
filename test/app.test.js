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
});
