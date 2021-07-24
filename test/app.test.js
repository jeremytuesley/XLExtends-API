require('dotenv').config();

const chai = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');

const { initializeServer } = require('../src/server');
const { createTestDatabase } = require('./test-database');

const expect = chai.expect;

describe('XLExtends-API tests:', () => {
  let app;

  let adminToken;

  before(async () => {
    const [{ app: server }] = await Promise.all([initializeServer(), createTestDatabase()]);

    app = server;
  });

  after(async () => {
    mongoose.connection.db.dropDatabase(() => {
      console.log('Test database dropped.');
    });
  });

  describe('Admin', () => {
    it('Create a new admin', (done) => {
      request(app)
        .post('/v1/graphql')
        .send({
          query: `
        mutation CreateNewAdmin(
          $createNewAdminData: CREATE_NEW_ADMIN_DATA
        ) {
          createNewAdmin(createNewAdminData: $createNewAdminData) {
            authToken
          }
        }
        `,
          variables: { createNewAdminData: { email: 'user@email.com', password: 'password' } },
        })
        .expect(200)
        .end(
          async (
            err,
            {
              body: {
                data: { createNewAdmin },
              },
            },
          ) => {
            if (err) done(err);
            expect(createNewAdmin).to.have.property('authToken');
            adminToken = createNewAdmin.authToken;
            done();
          },
        );
    });

    it('Log in with correct credentials', (done) => {
      request(app)
        .post('/v1/graphql')
        .send({
          query: `
          query Login($loginData: LOGIN_DATA) {
            login(loginData: $loginData) {
              authToken
            }
          }
          `,
          variables: { loginData: { email: 'user@email.com', password: 'password' } },
        })
        .expect(200)
        .end(
          (
            err,
            {
              body: {
                data: { login },
              },
            },
          ) => {
            if (err) done(err);

            expect(login).to.have.property('authToken');
            done();
          },
        );
    });
  });

  describe('Products', () => {
    let firstProduct;

    it('Fetch all products', (done) => {
      request(app)
        .post('/v1/graphql')
        .send({
          query: `
        query GetAllProducts {
          getAllProducts {
            _id
            name
          }
        }
        `,
        })
        .expect(200)
        .end(
          (
            err,
            {
              body: {
                data: { getAllProducts },
              },
            },
          ) => {
            if (err) done(err);
            expect(getAllProducts).to.have.length(5);
            firstProduct = getAllProducts[0];
            done();
          },
        );
    });

    it('Fetch a single product', (done) => {
      request(app)
        .post('/v1/graphql')
        .send({
          query: `
          query GetProduct(
            $getProductData: GET_PRODUCT_DATA
          ) {
            getProduct(getProductData: $getProductData) {
              _id
              name
            }
          }
          `,
          variables: {
            getProductData: {
              productId: firstProduct._id,
            },
          },
        })
        .expect(200)
        .end(
          (
            err,
            {
              body: {
                data: { getProduct },
              },
            },
          ) => {
            if (err) done(err);
            expect(getProduct.name).to.have.string(firstProduct.name);
            done();
          },
        );
    });

    it('Create a new product', (done) => {
      request(app)
        .post('/v1/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          query: `
          mutation CreateNewProduct(
            $createNewProductData: CREATE_NEW_PRODUCT_DATA
          ) {
            createNewProduct(createNewProductData: $createNewProductData) {
              _id
              name
            }
          }
          `,
          variables: {
            createNewProductData: {
              available: true,
              description: 'New Product Description - 1',
              name: 'Test Product - 1',
              price: 1.99,
            },
          },
        })
        .expect(200)
        .end(
          (
            err,
            {
              body: {
                data: { createNewProduct },
              },
            },
          ) => {
            if (err) done(err);

            expect(createNewProduct).to.have.property('_id');
            expect(createNewProduct).to.have.property('name');
            expect(createNewProduct.name).to.have.string('Test Product - 1');
            done();
          },
        );
    });

    describe('Delete product', () => {
      it('Delete a product', (done) => {
        request(app)
          .post('/v1/graphql')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            query: `
          mutation DeleteProduct($deleteProductData: DELETE_PRODUCT_DATA) {
            deleteProduct(deleteProductData: $deleteProductData)
          }
          `,
            variables: { deleteProductData: { productId: firstProduct._id } },
          })
          .expect(200)
          .end((err, { body: { data } }) => {
            if (err) done(err);
            expect(data).to.deep.equal({ deleteProduct: true });
            done();
          });
      });

      it('Database reflects deletion', (done) => {
        request(app)
          .post('/v1/graphql')
          .send({
            query: `
          query GetAllProducts {
            getAllProducts {
              _id 
              name
            }
          }
          `,
          })
          .expect(200)
          .end(
            (
              err,
              {
                body: {
                  data: { getAllProducts },
                },
              },
            ) => {
              if (err) done(err);
              expect(getAllProducts).to.have.length(5);
              done();
            },
          );
      });
    });
  });

  describe('Services', () => {
    let firstService;

    it('Fetch all services', (done) => {
      request(app)
        .post('/v1/graphql')
        .send({
          query: `
        query GetAllServices {
          getAllServices {
            _id
            name
          }
        }
        `,
        })
        .expect(200)
        .end(
          (
            err,
            {
              body: {
                data: { getAllServices },
              },
            },
          ) => {
            if (err) done(err);
            expect(getAllServices).to.have.length(5);
            firstService = getAllServices[0];
            done();
          },
        );
    });

    it('Fetch a single service', (done) => {
      request(app)
        .post('/v1/graphql')
        .send({
          query: `
        query GetService(
          $getServiceData: GET_SERVICE_DATA
        ) {
          getService(getServiceData: $getServiceData) {
            _id
            name
          }
        }
        `,
          variables: {
            getServiceData: {
              serviceId: firstService._id,
            },
          },
        })
        .expect(200)
        .end(
          (
            err,
            {
              body: {
                data: { getService },
              },
            },
          ) => {
            if (err) done(err);
            expect(getService.name).to.have.string(firstService.name);
            done();
          },
        );
    });

    it('Create a new service', (done) => {
      request(app)
        .post('/v1/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          query: `
          mutation CreateNewService(
            $createNewServiceData: CREATE_NEW_SERVICE_DATA
          ) {
            createNewService(createNewServiceData: $createNewServiceData) {
              _id
              name
            }
          }
          `,
          variables: {
            createNewServiceData: {
              available: true,
              description: 'New Service Description - 1',
              duration: 100,
              name: 'New Service Name - 1',
              price: 9.99,
            },
          },
        })
        .expect(200)
        .end(
          (
            err,
            {
              body: {
                data: { createNewService },
              },
            },
          ) => {
            if (err) done(err);
            expect(createNewService).to.have.property('_id');
            expect(createNewService).to.have.property('name');
            expect(createNewService.name).to.have.string('New Service Name - 1');
            done();
          },
        );
    });

    describe('Delete service', () => {
      it('Delete a service', (done) => {
        request(app)
          .post('/v1/graphql')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            query: `
      mutation DeleteService(
        $deleteServiceData: DELETE_SERVICE_DATA
      ) {
        deleteService(deleteServiceData: $deleteServiceData)
      }
      `,
            variables: { deleteServiceData: { serviceId: firstService._id } },
          })
          .expect(200)
          .end((err, { body: { data } }) => {
            if (err) done(err);
            expect(data).to.deep.equal({ deleteService: true });
            done();
          });
      });

      it('Database reflects the deletion', (done) => {
        request(app)
          .post('/v1/graphql')
          .send({
            query: `
          query GetAllServices {
            getAllServices {
              _id
              name
            }
          }
          `,
          })
          .expect(200)
          .end(
            (
              err,
              {
                body: {
                  data: { getAllServices },
                },
              },
            ) => {
              if (err) done(err);

              expect(getAllServices).to.have.length(5);
              done();
            },
          );
      });
    });
  });
});
