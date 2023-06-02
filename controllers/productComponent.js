const { Product, Component, ProductComponent } = require('../models');

module.exports = {
	store: async (req, res, next) => {
		try {
			const { product_id, component_id } = req.body;

			if (!product_id || !component_id) {
				return res.status(400).json({
					status: false,
					message: 'Product_id and Component_id is required!',
					data: null,
				});
			}

			const product = await Product.findOne({
				where: {
					id: product_id,
				},
			});

			if (!product) {
				return res.status(404).json({
					status: false,
					message: `Product with id ${product_id} not found!`,
					data: null,
				});
			}

			const component = await Component.findOne({
				where: {
					id: component_id,
				},
			});

			if (!component) {
				return res.status(404).json({
					status: false,
					message: `Component with id ${component_id} not found!`,
					data: null,
				});
			}

			const exist = await ProductComponent.findOne({
				where: {
					product_id: product_id,
					component_id: component_id,
				},
			});

			if (exist) {
				return res.status(403).json({
					status: false,
					message: `Relation product and component already exist!`,
					data: null,
				});
			}

			const productComponent = await ProductComponent.create({
				product_id: product_id,
				component_id: component_id,
			});

			return res.status(200).json({
				status: true,
				message: 'Success create relation product and component!',
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},

	destroy: async (req, res, next) => {
		try {
			const { product_id, component_id } = req.body;

			if (!product_id || !component_id) {
				return res.status(400).json({
					status: false,
					message: 'Product_id and Component_id is required!',
					data: null,
				});
			}

			const deleted = await ProductComponent.destroy({
				where: {
					product_id: product_id,
					component_id: component_id,
				},
			});

			if (!deleted) {
				return res.status(404).json({
					status: false,
					message: `Relation product and component not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success delete relation product and component!`,
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
