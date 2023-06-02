const { Product, Component } = require('../models');

module.exports = {
	index: async (req, res, next) => {
		try {
			const products = await Product.findAll();

			return res.status(200).json({
				status: true,
				message: 'Success get list of products!',
				data: products,
			});
		} catch (error) {
			next(error);
		}
	},

	store: async (req, res, next) => {
		try {
			const { name, quantity } = req.body;

			if (!name || !quantity) {
				return res.status(400).json({
					status: false,
					message: 'Name and quantity is required!',
					data: null,
				});
			}

			const product = await Product.create({
				name: name,
				quantity: quantity,
			});

			return res.status(200).json({
				status: true,
				message: 'Success create new product!',
				data: product,
			});
		} catch (error) {
			next(error);
		}
	},

	show: async (req, res, next) => {
		try {
			const { id } = req.params;

			const product = await Product.findOne({
				where: { id: id },
				include: [
					{
						model: Component,
						as: 'components_used',
					},
				],
			});

			if (!product) {
				return res.status(404).json({
					status: false,
					message: `Product with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success get details of product with id ${id}!`,
				data: product,
			});
		} catch (error) {
			next(error);
		}
	},

	update: async (req, res, next) => {
		try {
			const { id } = req.params;

			const updated = await Product.update(req.body, { where: { id: id } });

			if (!updated[0]) {
				return res.status(404).json({
					status: false,
					message: `Product with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success update product with id ${id}!`,
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},

	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;

			const deleted = await Product.destroy({ where: { id: id } });

			if (!deleted) {
				return res.status(404).json({
					status: false,
					message: `Product with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success delete product with id ${id}!`,
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
