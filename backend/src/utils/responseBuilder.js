function buildSuccessResponse(message, data) {
  return {
    success: true,
    message,
    data,
  };
}

module.exports = { buildSuccessResponse };
