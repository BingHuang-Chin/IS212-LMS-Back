const fetch = require("node-fetch")

const vercelFn = (request, response) => {
  const { error: bodyDataError, input } = retrieveBodyData(request.body)
  if (bodyDataError) return response.json(error)

  const { error: oldQuizError, data: oldQuizData } = getOldQuiz(8)
  if (oldQuizError) return response.json(error)

  return response.json(handleProcess(input))
}

function handleProcess (quizChanges) {
  return { hello: "bye" }
}

function retrieveBodyData (body) {
  if (body && body.input)
    return { input: body.input.object }

  return { error: { status: 400, message: "Invalid input provided." } }
}

async function getOldQuiz (role, quizId) {
  const response = await fetch(process.env.HASURA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      "x-hasura-role": role
    },
    body: JSON.stringify({
      query: `
        query {
          quiz_by_pk(id: ${quizId}) {
            id
            title
            time_limit
            section_id
            questions {
              id
              title
              question_type_id
              question_options {
                id
                title
                is_answer
              }
            }
          }
        }
      `
    })
  })

  const { errors, data } = await response.json()
  if (errors)
    return { error: { status: 500, message: "Internal server error." } }

  if (!data.quiz_by_pk)
    return { error: { status: 404, message: "Quiz not found." } }

  return { data: { ...data, status: 200 } }
}

module.exports = {
  handleProcess,
  retrieveBodyData,
  getOldQuiz,
  default: vercelFn
}
