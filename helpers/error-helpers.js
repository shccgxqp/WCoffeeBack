const errorHandler = (errMessage, status = 500) => {
  const err = new Error(errMessage)
  err.status = status
  return err
}

module.exports = { errorHandler }
