const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
	res.status(500).json({
		status: false,
		message: 'Internal Server Error',
		stack: err.message,
	});
};

module.exports = errorHandler;
