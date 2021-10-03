const vercelFn = (request, response) => {
  const { error, input } = retrieveBodyData(request.body)
  if (error)
    return response.json(error)

  return response.json(handleProcess(input))
}

function handleProcess (quizChanges) {
  console.log(quizChanges.questions.data.map(question => question.title))
  return { hello: "bye" }
}

function retrieveBodyData (body) {
  if (body && body.input)
    return body.input.object

  return { error: { status: 400, message: "Invalid input provided." } }
}

module.exports = {
  handleProcess,
  retrieveBodyData,
  default: vercelFn
}
