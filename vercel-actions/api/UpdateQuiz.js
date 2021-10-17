const fetch = require("node-fetch")

const vercelFn = async (request, response) => {
  const { error: bodyDataError, input, userRole } = retrieveBodyData(request.body)
  if (bodyDataError) return response.json(error)

  const { error: oldQuizError, data: oldQuizData } = await getOldQuiz(userRole, input.id)
  if (oldQuizError) return response.json(error)

  const changes = getChanges(oldQuizData.quiz_by_pk, input)
  if (changes.length > 0) {
    const gqlQuery = convertToGqlQuery(changes)
    await updateQuiz(userRole, gqlQuery)
  }

  return response.json({ hello: "world" })
}

function retrieveBodyData (body) {
  if (body && body.input && body.session_variables)
    return { input: body.input.object, userRole: body.session_variables["x-hasura-role"] }

  return { error: { status: 400, message: "Invalid input provided." } }
}

function getOldQuiz (role, quizId) {
  return new Promise(resolve => {
    fetch(process.env.HASURA_ENDPOINT, {
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

function getChanges (oldQuiz, newQuiz) {
  const quizChanges = changesForQuizInformation(oldQuiz, newQuiz)
  const questionChanges = changesForQuestion(oldQuiz.questions, newQuiz.questions.data)

  return quizChanges.concat(questionChanges)
}

function changesForQuizInformation (oldQuiz, newQuiz) {
  const mutations = []

  const { id, title: oldTitle, time_limit: oldTimeLimit, section_id: oldSectionId } = oldQuiz
  const { title: newTitle, time_limit: newTimeLimit, section_id: newSectionId } = newQuiz

  if (oldTitle !== newTitle || oldTimeLimit !== newTimeLimit || oldSectionId !== newSectionId) {
    mutations.push(`update_quiz_by_pk(pk_columns: {id: ${id}}, _set: {section_id: ${newSectionId}, time_limit: ${newTimeLimit}, title: "${newTitle}"}) {
      id
    }`)
  }

  return mutations
}

function changesForQuestion (oldQuestions, newQuestions) {
  const mutations = []
  const getNewAndUpdatedQuestions = () => {
    for (const newQuestion of newQuestions) {
      const oldQuestion = oldQuestions.find(oldQuestion => oldQuestion.id === newQuestion.id)
      if (!oldQuestion) {
        // TOOD: Handle insert
        return
      }

      const { id, title: oldTitle, question_type_id: oldQuestionTypeId } = oldQuestion
      const { title: newTitle, question_type_id: newQuestionTypeId } = newQuestion

      if (oldTitle !== newTitle || oldQuestionTypeId !== newQuestionTypeId) {
        mutations.push(`update_question_by_pk(pk_columns: {id: ${id}}, _set: {title: "${newTitle}", question_type_id: ${newQuestionTypeId}}) {
      id
    }`)
      }

      changesForOptions(oldQuestion.question_options, newQuestion.question_options.data)
        .forEach(option => mutations.push(option))
    }
  }

  const getDeletedQuestions = () => {
    // TODO: Handle questions which are deleted
  }

  getNewAndUpdatedQuestions()
  getDeletedQuestions()
  return mutations
}

function changesForOptions (oldOptions, newOptions) {
  const mutations = []
  const getNewAndUpdatedOptions = () => {
    for (const newOption of newOptions) {
      const oldOption = oldOptions.find(oldOption => oldOption.id === newOption.id)
      if (!oldOption) {
        // TODO: Handle insert
        return
      }

      const { id, is_answer: oldAnswer, title: oldTitle } = oldOption
      const { is_answer: newAnswer, title: newTitle } = newOption

      if (oldTitle !== newTitle || oldAnswer !== newAnswer) {
        mutations.push(`update_question_option_by_pk(pk_columns: {id: ${id}}, _set: {is_answer: ${newAnswer}, title: "${newTitle}"}) {
      id
    }`)
      }
    }
  }

  const getDeletedOptions = () => {
    // TODO: Handle options which are deleted
  }

  getNewAndUpdatedOptions()
  getDeletedOptions()
  return mutations
}

function convertToGqlQuery (changes) {
  let consolidatedQuery = ""
  changes.forEach((change, index) => {
    consolidatedQuery += `  _${index}: ${change}
`
  })

  if (changes.length === 0)
    return ""

  return `mutation {
${consolidatedQuery}}`
}

function updateQuiz (role, gqlQuery) {
  return new Promise(resolve => {
    fetch(process.env.HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        "x-hasura-role": role
      },
      body: JSON.stringify({ query: gqlQuery })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(() => {
        resolve({ error: { status: 500, message: "Internal server error." } })
      })
  })
}

module.exports = {
  retrieveBodyData,
  getOldQuiz,
  getChanges,
  convertToGqlQuery,
  default: vercelFn
}
