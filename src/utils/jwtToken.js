// Create and send token and save in the cookie.

const sendToken = (user, statusCode, res) => {
  // Create Jwt token
  const accessToken = user.getJwtToken()

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  const { message } = user
  delete user.message
  res
    .status(statusCode)
    .cookie('accessToken', accessToken, options)
    .json({
      status: true,
      message: message || 'Authenticated',
      data: {
        access_token: accessToken,
        user,
      },
    })
}

module.exports = sendToken
