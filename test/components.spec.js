const request = require('supertest');
const app = require('../app.js');
const truncate = require('../utils/truncate');

// reset table
truncate.component();

const correctRequestBody = {
	id: '',
	name: 'Component 1',
	description: 'Component 1 description',
};

const wrongRequestBody = {
	id: '1000',
};

// index
describe('[GET] /components', () => {
	test('Success get list of components!', async () => {
		try {
			const res = await request(app).get('/components');

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success get list of components!');
			expect(res.body.data).toBeInstanceOf(Array);
			res.body.data.forEach((item) => {
				expect(item).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String),
					description: expect.any(String),
				});
			});
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// store
describe('[POST] /components', () => {
	test('Success create new component!', async () => {
		try {
			const res = await request(app).post('/components').send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success create new component!');
			expect(res.body.data).toBeInstanceOf(Object);
			expect(res.body.data).toMatchObject({
				id: expect.any(Number),
				name: expect.any(String),
				description: expect.any(String),
			});

			correctRequestBody.id = res.body.data.id;

			const list = await request(app).get('/components');
			expect(list.body.data).toHaveLength(1);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Name and description is required!`, async () => {
		try {
			const res = await request(app).post(`/components`).send(wrongRequestBody);

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Name and description is required!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// show
describe(`[GET] /components/${correctRequestBody.id}`, () => {
	test(`Success get details of component with id ${correctRequestBody.id}!`, async () => {
		try {
			const res = await request(app).get(`/components/${correctRequestBody.id}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success get details of component with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBeInstanceOf(Object);
			expect(res.body.data).toMatchObject({
				id: expect.any(Number),
				name: expect.any(String),
				description: expect.any(String),
			});
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Component with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).get(`/components/${wrongRequestBody.id}`);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Component with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// update
describe(`[PUT] /components/${correctRequestBody.id}`, () => {
	test(`Success update component with id ${correctRequestBody.id}!`, async () => {
		try {
			correctRequestBody.name = 'Company 1';
			correctRequestBody.description = 'Surabaya';

			const res = await request(app).put(`/components/${correctRequestBody.id}`).send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success update component with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Component with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).put(`/components/${wrongRequestBody.id}`).send(wrongRequestBody);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Component with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// delete
describe(`[DELETE] /components/${correctRequestBody.id}`, () => {
	test(`Success delete component with id ${correctRequestBody.id}!`, async () => {
		try {
			const res = await request(app).delete(`/components/${correctRequestBody.id}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success delete component with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBe(null);

			const list = await request(app).get('/components');
			expect(list.body.data).toHaveLength(0);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Component with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).delete(`/components/${wrongRequestBody.id}`);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Component with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});
