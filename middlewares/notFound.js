const notFoundHandler = (err, req, res, next) => {
	res.status(404).json({
		status: false,
		message: 'Not Found',
		stack: err.stack,
	});
};

module.exports = notFoundHandler;
