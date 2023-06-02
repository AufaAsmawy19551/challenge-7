const { Component, Supplier } = require('../models');

module.exports = {
	index: async (req, res, next) => {
		try {
			const components = await Component.findAll();

			return res.status(200).json({
				status: true,
				message: 'Success get list of components!',
				data: components,
			});
		} catch (error) {
			next(error);
		}
	},

	store: async (req, res, next) => {
		try {
			const { name, description } = req.body;

			if (!name || !description) {
				return res.status(400).json({
					status: false,
					message: 'Name and description is required!',
					data: null,
				});
			}

			const component = await Component.create({
				name: name,
				description: description,
			});

			return res.status(200).json({
				status: true,
				message: 'Success create new component!',
				data: component,
			});
		} catch (error) {
			next(error);
		}
	},

	show: async (req, res, next) => {
		try {
			const { id } = req.params;

			const component = await Component.findOne({
				where: { id: id },
				include: [
					{
						model: Supplier,
						as: 'suppliers',
					},
				],
			});

			if (!component) {
				return res.status(404).json({
					status: false,
					message: `Component with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success get details of component with id ${id}!`,
				data: component,
			});
		} catch (error) {
			next(error);
		}
	},

	update: async (req, res, next) => {
		try {
			const { id } = req.params;

			const updated = await Component.update(req.body, { where: { id: id } });

			if (!updated[0]) {
				return res.status(404).json({
					status: false,
					message: `Component with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success update component with id ${id}!`,
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},

	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;

			const deleted = await Component.destroy({ where: { id: id } });

			if (!deleted) {
				return res.status(404).json({
					status: false,
					message: `Component with id ${id} not found!`,
					data: null,
				});
			}

			return res.status(200).json({
				status: true,
				message: `Success delete component with id ${id}!`,
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
