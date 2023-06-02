const request = require('supertest');
const app = require('../app.js');
const truncate = require('../utils/truncate');

// reset table
truncate.product();
truncate.component();

const product = {
	id: '',
	name: 'Product 1',
	quantity: 10,
};

const component = {
	id: '',
	name: 'Component 1',
	description: 'Component 1 description',
};

const correctRequestBody = {
	product_id: 1,
	component_id: 1,
};

const wrongRequestBody = {
	product_id: 1000,
	component_id: 1000,
};

// create new product
describe('[POST] /products', () => {
	test('Success create new product!', async () => {
		try {
			const res = await request(app).post('/products').send(product);

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

			product.id = res.body.data.id;

			const list = await request(app).get('/products');
			expect(list.body.data).toHaveLength(1);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// create new component
describe('[POST] /components', () => {
	test('Success create new component!', async () => {
		try {
			const res = await request(app).post('/components').send(component);

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

			component.id = res.body.data.id;

			const list = await request(app).get('/components');
			expect(list.body.data).toHaveLength(1);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// store
describe('[POST] /productComponents', () => {
	test('Success create relation product and component', async () => {
		try {
			const res = await request(app).post('/productComponents').send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success create relation product and component!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test('Product_id and component_id is required!', async () => {
		try {
			const res = await request(app).post('/productComponents');

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe('Product_id and Component_id is required!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test('Relation product and component already exist', async () => {
		try {
			const res = await request(app).post('/productComponents').send(correctRequestBody);

			expect(res.statusCode).toBe(403);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe('Relation product and component already exist!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

  test(`Product with id ${wrongRequestBody.product_id} not found!`, async () => {
		try {
			const res = await request(app).post('/productComponents').send({
				product_id: wrongRequestBody.product_id,
				component_id: correctRequestBody.component_id,
			});

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Product with id ${wrongRequestBody.product_id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Component with id ${wrongRequestBody.component_id} not found!`, async () => {
		try {
			const res = await request(app).post('/productComponents').send({
				product_id: correctRequestBody.product_id,
				component_id: wrongRequestBody.component_id,
			});

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Component with id ${wrongRequestBody.component_id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// delete
describe('[DELETE] /productComponents', () => {
	test('Success delete relation product and component', async () => {
		try {
			const res = await request(app).delete('/productComponents').send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success delete relation product and component!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test('Product_id and component_id is required!', async () => {
		try {
			const res = await request(app).delete('/productComponents');

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe('Product_id and Component_id is required!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Relation product and component not found!`, async () => {
		try {
			const res = await request(app).delete('/productComponents').send(wrongRequestBody);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Relation product and component not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});
