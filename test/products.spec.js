const request = require('supertest');
const app = require('../app.js');
const truncate = require('../utils/truncate');

// reset table
truncate.product();

const correctRequestBody = {
	id: '',
	name: 'Product 1',
	quantity: 10,
};

const wrongRequestBody = {
	id: '1000',
};

// index
describe('[GET] /products', () => {
	test('Success get list of products!', async () => {
		try {
			const res = await request(app).get('/products');

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success get list of products!');
			expect(res.body.data).toBeInstanceOf(Array);
			res.body.data.forEach((item) => {
				expect(item).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String),
					quantity: expect.any(Number),
				});
			});
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// store
describe('[POST] /products', () => {
	test('Success create new product!', async () => {
		try {
			const res = await request(app).post('/products').send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success create new product!');
			expect(res.body.data).toBeInstanceOf(Object);
			expect(res.body.data).toMatchObject({
				id: expect.any(Number),
				name: expect.any(String),
				quantity: expect.any(Number),
			});

			correctRequestBody.id = res.body.data.id;

			const list = await request(app).get('/products');
			expect(list.body.data).toHaveLength(1);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Name and quantity is required!`, async () => {
		try {
			const res = await request(app).post(`/products`).send(wrongRequestBody);

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Name and quantity is required!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// show
describe(`[GET] /products/${correctRequestBody.id}`, () => {
	test(`Success get details of product with id ${correctRequestBody.id}!`, async () => {
		try {
			const res = await request(app).get(`/products/${correctRequestBody.id}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success get details of product with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBeInstanceOf(Object);
			expect(res.body.data).toMatchObject({
				id: expect.any(Number),
				name: expect.any(String),
				quantity: expect.any(Number),
			});
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Product with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).get(`/products/${wrongRequestBody.id}`);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Product with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// update
describe(`[PUT] /products/${correctRequestBody.id}`, () => {
	test(`Success update product with id ${correctRequestBody.id}!`, async () => {
		try {
			correctRequestBody.name = 'Company 1';
			correctRequestBody.quantity = 10;

			const res = await request(app).put(`/products/${correctRequestBody.id}`).send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success update product with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Product with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).put(`/products/${wrongRequestBody.id}`).send(wrongRequestBody);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Product with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// delete
describe(`[DELETE] /products/${correctRequestBody.id}`, () => {
	test(`Success delete product with id ${correctRequestBody.id}!`, async () => {
		try {
			const res = await request(app).delete(`/products/${correctRequestBody.id}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe(`Success delete product with id ${correctRequestBody.id}!`);
			expect(res.body.data).toBe(null);

			const list = await request(app).get('/products');
			expect(list.body.data).toHaveLength(0);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Product with id ${wrongRequestBody.id} not found!`, async () => {
		try {
			const res = await request(app).delete(`/products/${wrongRequestBody.id}`);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Product with id ${wrongRequestBody.id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});
