const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  console.error('-- ERROR: ', ...params)
}

module.exports = {
  info,
  error
}
