const request = require('supertest');
const app = require('../app.js');
const truncate = require('../utils/truncate');

// reset table
truncate.component();
truncate.supplier();

const component = {
	id: '',
	name: 'Component 1',
	description: 'Component 1 description',
};

const supplier = {
	id: '',
	name: 'Supplier 1',
	address: 'Jakarta',
};

const correctRequestBody = {
	component_id: 1,
	supplier_id: 1,
};

const wrongRequestBody = {
	component_id: 1000,
	supplier_id: 1000,
};

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

// create new supplier
describe('[POST] /suppliers', () => {
	test('Success create new supplier!', async () => {
		try {
			const res = await request(app).post('/suppliers').send(supplier);

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

			supplier.id = res.body.data.id;

			const list = await request(app).get('/suppliers');
			expect(list.body.data).toHaveLength(1);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// store
describe('[POST] /componentSuppliers', () => {
	test('Success create relation component and supplier', async () => {
		try {
			const res = await request(app).post('/componentSuppliers').send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success create relation component and supplier!');
			expect(res.body.data).toBe(null)
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test('Component_id and Supplier_id is required!', async () => {
		try {
			const res = await request(app).post('/componentSuppliers');

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe('Component_id and Supplier_id is required!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test('Relation component and supplier already exist', async () => {
		try {
			const res = await request(app).post('/componentSuppliers').send(correctRequestBody);

			expect(res.statusCode).toBe(403);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe('Relation component and supplier already exist!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Component with id ${wrongRequestBody.component_id} not found!`, async () => {
		try {
			const res = await request(app).post('/componentSuppliers').send({
				component_id: wrongRequestBody.component_id,
				supplier_id: correctRequestBody.supplier_id,
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

	test(`Supplier with id ${wrongRequestBody.supplier_id} not found!`, async () => {
		try {
			const res = await request(app).post('/componentSuppliers').send({
				component_id: correctRequestBody.component_id,
				supplier_id: wrongRequestBody.supplier_id,
			});

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Supplier with id ${wrongRequestBody.supplier_id} not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// delete
describe('[DELETE] /componentSuppliers', () => {
	test('Success delete relation component and supplier', async () => {
		try {
			const res = await request(app).delete('/componentSuppliers').send(correctRequestBody);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('Success delete relation component and supplier!');
			expect(res.body.data).toBe(null)
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test('Component_id and Supplier_id is required!', async () => {
		try {
			const res = await request(app).delete('/componentSuppliers');

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe('Component_id and Supplier_id is required!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test(`Relation component and supplier not found!`, async () => {
		try {
			const res = await request(app).delete('/componentSuppliers').send(wrongRequestBody);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe(`Relation component and supplier not found!`);
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});