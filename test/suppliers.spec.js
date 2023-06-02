const request = require('supertest');
const app = require('../app.js');
const truncate = require('../utils/truncate');

// reset table
truncate.supplier();

const correctRequestBody = {
	id: '',
	name: 'Company 1',
	address: 'Jakarta',
};

const wrongRequestBody = {
	id: '1000',
};

// index
describe('[GET] /suppliers', () => {
	test('Success get list of suppliers!', async () => {
		try {
			const res = await request(app).get('/suppliers');

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success get list of suppliers!');
			expect(res.body.data).toBeInstanceOf(Array);
			res.body.data.forEach((item) => {
				expect(item).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String),
					address: expect.any(String),
				});
			});
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// store
describe('[POST] /suppliers', () => {
	test('Success create new supplier!', async () => {
		try {
			const res = await request(app).post('/suppliers').send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success create new supplier!');
			expect(res.body.data).toBeInstanceOf(Object);
			expect(res.body.data).toMatchObject({
				id: expect.any(Number),
				name: expect.any(String),
				address: expect.any(String),
			});

			correctRequestBody.id = res.body.data.id;

			const list = await request(app).get('/suppliers');
			expect(list.body.data).toHaveLength(1);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Name and address is required!`, async () => {
		try {
			const res = await request(app).post(`/suppliers`).send(wrongRequestBody);

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Name and address is required!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// show
describe(`[GET] /suppliers/${correctRequestBody.id}`, () => {
	test(`Success get details of supplier with id ${correctRequestBody.id}!`, async () => {
		try {
			const res = await request(app).get(`/suppliers/${correctRequestBody.id}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success get details of supplier with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBeInstanceOf(Object);
			expect(res.body.data).toMatchObject({
				id: expect.any(Number),
				name: expect.any(String),
				address: expect.any(String),
			});
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Supplier with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).get(`/suppliers/${wrongRequestBody.id}`);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Supplier with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// update
describe(`[PUT] /suppliers/${correctRequestBody.id}`, () => {
	test(`Success update supplier with id ${correctRequestBody.id}!`, async () => {
		try {
			correctRequestBody.name = 'Company 1';
			correctRequestBody.address = 'Surabaya';

			const res = await request(app).put(`/suppliers/${correctRequestBody.id}`).send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success update supplier with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Supplier with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).put(`/suppliers/${wrongRequestBody.id}`).send(wrongRequestBody);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Supplier with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// delete
describe(`[DELETE] /suppliers/${correctRequestBody.id}`, () => {
	test(`Success delete supplier with id ${correctRequestBody.id}!`, async () => {
		try {
			const res = await request(app).delete(`/suppliers/${correctRequestBody.id}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success delete supplier with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBe(null);

			const list = await request(app).get('/suppliers');
			expect(list.body.data).toHaveLength(0);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Supplier with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).delete(`/suppliers/${wrongRequestBody.id}`);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Supplier with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});
