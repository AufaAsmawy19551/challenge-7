const { Supplier, Component } = require('../models');

module.exports = {
	index: async (req, res, next) => {
		try {
			const suppliers = await Supplier.findAll();

			return res.status(200).json({
				status: true,
				message: 'Success get list of suppliers!',
				data: suppliers,
			});
		} catch (error) {
			next(error);
		}
	},

	store: async (req, res, next) => {
		try {
			const { name, address } = req.body;

			if (!name || !address) {
				return res.status(400).json({
					status: false,
					message: 'Name and address is required!',
					data: null,
				});
			}

			const supplier = await Supplier.create({
				name: name,
				address: address,
			});

			return res.status(200).json({
				status: true,
				message: 'Success create new supplier!',
				data: supplier,
			});
		} catch (error) {
			next(error);
		}
	},

	show: async (req, res, next) => {
		try {
			const { id } = req.params;

			const supplier = await Supplier.findOne({
				where: { id: id },
				include: [
					{
						model: Component,
						as: 'supplied_components',
					},
				],
			});

			if (!supplier) {
				return res.status(404).json({
					status: false,
					message: `Supplier with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success get details of supplier with id ${id}!`,
				data: supplier,
			});
		} catch (error) {
			next(error);
		}
	},

	update: async (req, res, next) => {
		try {
			const { id } = req.params;

			const updated = await Supplier.update(req.body, { where: { id: id } });
			
			if (!updated[0]) {
				return res.status(404).json({
					status: false,
					message: `Supplier with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success update supplier with id ${id}!`,
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},

	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;
			
			const deleted = await Supplier.destroy({ where: { id: id } });
			
			if (!deleted) {
				return res.status(404).json({
					status: false,
					message: `Supplier with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success delete supplier with id ${id}!`,
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
