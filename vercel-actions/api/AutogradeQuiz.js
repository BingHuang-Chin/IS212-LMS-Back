const fetch = require("node-fetch")

const vercelFn = async (request, response) => {
  const { error: bodyDataError, input } = retrieveBodyData(request.body)
  if (bodyDataError) return response.json(bodyDataError)

  const { learner_id, quiz_id, attempt } = input
  const { error: quizRetrievalError, data: quizInfo } = await retrieveQuizInformation(quiz_id, learner_id, attempt)
  if (quizRetrievalError) return response.json(bodyDataError)

  const { quiz_by_pk, completed_quiz_by_pk } = quizInfo
  const score = getScore(quiz_by_pk, completed_quiz_by_pk)

  return response.json({ status: 200, message: "Hello world!" })
}

function retrieveBodyData (body) {
  if (body && body.input && body.session_variables)
    return { input: body.input.object, userRole: body.session_variables["x-hasura-role"] }

  return { error: { status: 400, message: "Invalid input provided." } }
}

function retrieveQuizInformation (quizId, learnerId, attempt) {
  return new Promise((resolve, reject) => {
    fetch(process.env.HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: `
          query {
            quiz_by_pk(id: ${quizId}) {
              questions {
                question_options(where: {is_answer: {_eq: true}}) {
                  id
                  is_answer
                }
              }
            }
  
            completed_quiz_by_pk(quiz_id: ${quizId}, learner_id: ${learnerId}, attempt: ${attempt}) {
              selected_options {
                option_id
              }
            }
          }
        `
      })
    })
      .then(response => response.json())
      .then(({ errors, data }) => {
        if (errors)
          return resolve({ error: { status: 500, message: "Internal server error." } })

        if (!data.quiz_by_pk)
          resolve({ error: { status: 404, message: "Quiz not found." } })

        resolve({ data: { ...data, status: 200 } })
      })
      .catch(() => {
        resolve({ error: { status: 500, message: "Internal server error." } })
      })
  })
}

function getScore (answers, selectedOptions) {
  const mappedAnswers = [].concat(...answers.questions.map(question => question.question_options.map(option => option.id)))
  const mappedSelectedOptions = selectedOptions.selected_options.map(option => option.option_id)

  let score = 0
  for (const selectedOption of mappedSelectedOptions) {
    if (mappedAnswers.includes(selectedOption))
      score += 1
  }

  return score
}

module.exports = {
  retrieveBodyData,
  retrieveQuizInformation,
  getScore,
  default: vercelFn
}
