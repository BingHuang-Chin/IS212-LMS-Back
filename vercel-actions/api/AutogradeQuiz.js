const fetch = require("node-fetch")

const vercelFn = async (request, response) => {
  const { error: bodyDataError, input, userRole } = retrieveBodyData(request.body)
  return response.json({ status: 200, message: "Hello world!" })
}

function retrieveBodyData (body) {
  if (body && body.input && body.session_variables)
    return { input: body.input.object, userRole: body.session_variables["x-hasura-role"] }

  return { error: { status: 400, message: "Invalid input provided." } }
}

module.exports = {
  retrieveBodyData,
  default: vercelFn
}
