const request = require('supertest');
const server = require('../server');
const db = require('../data/db-config');

describe('OKTA ROUTER', () => {
  // NOTE This token will need updated in order for this test to work.
  const accessToken = process.env.TEST_ACCESS_TOKEN;
  // console.log(accessToken);

  describe('GET /users - all users', () => {
    it('should return 200', () => {
      return request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });

    it('should return 401 with no access token', () => {
      return request(server)
        .get('/api/users')
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it('returns an array of objects of users', () => {
      // NOTE expected needs to be updated as the data changes in the seeds.
      const expected = [
        {
          id: 1,
          name: 'Edward Blanciak',
          email: 'budgetblocks@gmail.com',
          onboarding_complete: false,
          state: null,
          city: null,
        },
      ];

      return request(server)
        .get('/api/users/')
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          expect(res.body.data).toEqual(expected);
        });
    });
  });

  describe('POST /users - add user', () => {
    const newUser = {
      name: 'Joe Smith',
      email: 'Joe@gmail.com',
    };

    const existingUser = {
      name: 'Edward Blanciak',
      email: 'budgetblocks@gmail.com',
    };

    const deleteUser = () => {
      return db('users').where({ name: newUser.name }).del();
    };

    afterEach(deleteUser);

    it('it should return 201', () => {
      return request(server)
        .post('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });

    it('it should return Message: User created.', () => {
      return request(server)
        .post('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          expect(res.body.message).toEqual('User created.');
        });
    });

    it('it should return 200', () => {
      return request(server)
        .post('/api/users')
        .send(existingUser)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });

    it('it should return Message: User already exists.', () => {
      return request(server)
        .post('/api/users')
        .send(existingUser)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          expect(res.body.message).toEqual('User already exists.');
        });
    });
  });

  describe('DELETE /users/:userId - delete user', () => {
    const newUser = {
      name: 'Joe Smith',
      email: 'Joe@gmail.com',
    };

    const addUser = () => {
      return request(server)
        .post('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${accessToken}`);
    };

    beforeEach(addUser);

    it('it should return 200', () => {
      return request(server)
        .delete('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });

    it('it should return Message: User successfully deleted!', () => {
      return request(server)
        .delete('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          expect(res.body.message).toEqual('User successfully deleted!');
        });
    });
  });

  describe('PUT /users/:userId - Update User', () => {});
});
