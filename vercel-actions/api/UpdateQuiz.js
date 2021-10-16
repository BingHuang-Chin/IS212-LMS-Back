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
  if (body && body.input && body.session_variables)
    return { input: body.input.object, userRole: body.session_variables["x-hasura-user-id"] }

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

        changesForOptions(oldQuestion.question_options, newQuestion.question_options.data)
          .forEach(option => mutations.push(option))
      }
    }
  }

  const getDeletedQuestions = (oldOptions, newOptions) => {
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

module.exports = {
  handleProcess,
  retrieveBodyData,
  getOldQuiz,
  getChanges,
  default: vercelFn
}
