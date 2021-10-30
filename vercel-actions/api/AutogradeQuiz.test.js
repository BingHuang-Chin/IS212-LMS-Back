const { retrieveBodyData } = require("./AutogradeQuiz")

const validMockData = {
  session_variables: { 'x-hasura-role': 'learner' },
  input: { object: { learner_id: 1, quiz_id: 1, attempt: 1 } },
  action: { name: 'gradeQuiz' }
}

test("[retrieveBodyData] Empty input", () => {
  const mockQuizChanges = {}
  const retrievedData = retrieveBodyData(mockQuizChanges)
  expect(retrievedData).toEqual({ error: { status: 400, message: "Invalid input provided." } })
})

test("[retrieveBodyData] Populated input", () => {
  const retrievedData = retrieveBodyData(validMockData)
  expect(retrievedData).toEqual({ input: validMockData.input.object, userRole: validMockData.session_variables["x-hasura-role"] })
})

