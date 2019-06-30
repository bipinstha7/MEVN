function error(err, req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }

  res.status(err.statusCode || 500).json({ err, message: err.message })
}

module.exports = error
