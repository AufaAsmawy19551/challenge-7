const nodemailer = require('../utils/nodemailer');
module.exports = {
	sendEmail: async (req, res, next) => {
		try {
			const { to, subject, body } = req.body;
			const html = await nodemailer.getHtml('sendEmail.ejs', { body });
			nodemailer.sendEmail(to, subject, html);

			return res.status(200).json({
				success: true,
				message: 'Success',
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
