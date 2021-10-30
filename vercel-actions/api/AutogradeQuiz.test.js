const fetch = require("node-fetch")
const { retrieveBodyData, retrieveQuizInformation } = require("./AutogradeQuiz")

jest.mock("node-fetch", () => jest.fn())

const validMockData = {
  session_variables: { 'x-hasura-role': 'learner' },
  input: { object: { learner_id: 1, quiz_id: 1, attempt: 1 } },
  action: { name: 'gradeQuiz' }
}

const quizInformationFromHasura = {
  "data": {
    "quiz_by_pk": {
      "questions": [
        {
          "question_options": [
            {
              "id": 1,
              "is_answer": true
            }
          ]
        }
      ]
    },
    "completed_quiz_by_pk": {
      "selected_options": [
        {
          "option_id": 3
        }
      ]
    }
  }
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

test("[retrieveQuizInformation] Retrieve answers and user selections from Hasura.", async () => {
  const expectedResponse = quizInformationFromHasura

  fetch.mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

  const { data } = await retrieveQuizInformation(1, 1, 1)
  const { status, ...remainingData } = data

  expect(status).toBe(200)
  expect(remainingData).toEqual(expectedResponse.data)
})

test("[retrieveQuizInformation] Retrieve invalid quiz information from Hasura.", async () => {
  const expectedResponse = {
    "data": {
      "quiz_by_pk": null,
      "completed_quiz_by_pk": null
    }
  }

  fetch.mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

  const { error } = await retrieveQuizInformation(1, 1, 1)
  const { status, message } = error

  expect(status).toBe(404)
  expect(message).toEqual(expect.any(String))
})

test("[retrieveQuizInformation] Retrieve quiz information with invalid query.", async () => {
  const expectedResponse = {
    "errors": [
      {
        "extensions": {
          "path": "$.selectionSet.completed_quiz_by_pk.selectionSet.selected_options.selectionSet.a",
          "code": "validation-failed"
        },
        "message": "field \"a\" not found in type: 'selected_options'"
      }
    ]
  }

  fetch.mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

  const { error } = await retrieveQuizInformation(1, 1, 1)
  const { status, message } = error

  expect(status).toBe(500)
  expect(message).toEqual(expect.any(String))
})
