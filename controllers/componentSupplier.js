const { Component, Supplier, ComponentSupplier } = require('../models');

module.exports = {
	store: async (req, res, next) => {
		try {
			const { component_id, supplier_id } = req.body;

			if (!component_id || !supplier_id) {
				return res.status(400).json({
					status: false,
					message: 'Component_id and Supplier_id is required!',
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

      const supplier = await Supplier.findOne({
				where: {
					id: supplier_id,
				},
			});

			if (!supplier) {
				return res.status(404).json({
					status: false,
					message: `Supplier with id ${supplier_id} not found!`,
					data: null,
				});
			}

			const exist = await ComponentSupplier.findOne({
				where: {
					component_id: component_id,
					supplier_id: supplier_id,
				},
			});

			if (exist) {
				return res.status(403).json({
					status: false,
					message: `Relation component and supplier already exist!`,
					data: null,
				});
			}

			const productSupplier = await ComponentSupplier.create({
				component_id: component_id,
				supplier_id: supplier_id,
			});

			return res.status(200).json({
				status: true,
				message: 'Success create relation component and supplier!',
				data: null ,
			});
		} catch (error) {
			next(error);
		}
	},

	destroy: async (req, res, next) => {
		try {
			const { component_id, supplier_id } = req.body;

			if (!component_id || !supplier_id) {
				return res.status(400).json({
					status: false,
					message: 'Component_id and Supplier_id is required!',
					data: null,
				});
			}

			const deleted = await ComponentSupplier.destroy({
				where: {
					component_id: component_id,
					supplier_id: supplier_id,
				},
			});

			if (!deleted) {
				return res.status(404).json({
					status: false,
					message: `Relation component and supplier not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success delete relation component and supplier!`,
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
