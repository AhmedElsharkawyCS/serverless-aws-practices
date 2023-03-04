const getResponseHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }
}
getUserId = (headers) => {
  return headers["user-id"]
}

module.exports = {
  getUserId,
  getResponseHeaders
}
