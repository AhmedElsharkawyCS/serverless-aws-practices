const getResponseHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }
}
getUserId = (body) => {
  const { userId } = JSON.parse(body)
  return userId
}

module.exports = {
  getUserId,
  getResponseHeaders
}
