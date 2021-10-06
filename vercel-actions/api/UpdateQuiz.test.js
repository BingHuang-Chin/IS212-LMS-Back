const fetch = require("node-fetch")
const { handleProcess, retrieveBodyData, getOldQuiz } = require("./UpdateQuiz")

jest.mock("node-fetch", () => jest.fn())

const validMockData = {
  session_variables: {
    'x-hasura-role': 'trainer',
    'x-hasura-user-id': 'auth0|614dfc64c69eb200704771b8'
  },
  input: {
    "object": {
      "title": "Quiz 3",
      "section_id": 1,
      "time_limit": 1,
      "questions": {
        "data": [
          {
            "title": "New question 2",
            "question_type_id": 1,
            "question_options": {
              "data": [
                {
                  "is_answer": false,
                  "title": "some option 3",
                  "id": 6
                },
                {
                  "is_answer": true,
                  "title": "some option 6",
                  "id": 16
                },
                {
                  "is_answer": false,
                  "title": "some option 7",
                  "id": 17
                },
                {
                  "is_answer": false,
                  "title": "some option 8",
                  "id": 21
                }
              ]
            },
            "id": 5
          },
          {
            "title": "Question 3",
            "question_type_id": 1,
            "question_options": {
              "data": [
                {
                  "is_answer": false,
                  "title": "Goodnight",
                  "id": 20
                },
                {
                  "is_answer": true,
                  "title": "Hello world",
                  "id": 18
                },
                {
                  "is_answer": false,
                  "title": "Goodbye",
                  "id": 19
                }
              ]
            },
            "id": 10
          },
          {
            "title": "question 1",
            "question_type_id": 2,
            "question_options": {
              "data": [
                {
                  "is_answer": true,
                  "title": "False",
                  "id": 3
                },
                {
                  "is_answer": false,
                  "title": "True",
                  "id": 15
                }
              ]
            },
            "id": 4
          }
        ]
      },
      "id": 8
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
  expect(retrievedData).toEqual({ input: validMockData.input.object, userRole: validMockData.session_variables["x-hasura-user-id"] })
})

test("[handleProcess] Return results to hasura", () => {
  const { input } = retrieveBodyData(validMockData)
  const result = handleProcess(input)

  expect(result).toEqual({ hello: "bye" })
})

test("[getOldQuiz] Retrieve valid old quiz from Hausra", async () => {
  const expectedResponse = {
    "data": {
      "quiz_by_pk": {
        "id": 8,
        "title": "Quiz 3",
        "time_limit": 1,
        "section_id": 1,
        "questions": [
          {
            "id": 5,
            "title": "New question 2",
            "question_type_id": 1,
            "question_options": [
              {
                "id": 6,
                "title": "some option 3",
                "is_answer": false
              },
              {
                "id": 16,
                "title": "some option 6",
                "is_answer": true
              },
              {
                "id": 17,
                "title": "some option 7",
                "is_answer": false
              },
              {
                "id": 21,
                "title": "some option 8",
                "is_answer": false
              }
            ]
          },
          {
            "id": 10,
            "title": "Question 3",
            "question_type_id": 1,
            "question_options": [
              {
                "id": 20,
                "title": "Goodnight",
                "is_answer": false
              },
              {
                "id": 18,
                "title": "Hello world",
                "is_answer": true
              },
              {
                "id": 19,
                "title": "Goodbye",
                "is_answer": false
              }
            ]
          },
          {
            "id": 4,
            "title": "question 1",
            "question_type_id": 2,
            "question_options": [
              {
                "id": 3,
                "title": "False",
                "is_answer": true
              },
              {
                "id": 15,
                "title": "True",
                "is_answer": false
              }
            ]
          }
        ]
      }
    }
  }

  fetch.mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

  const { data } = await getOldQuiz("trainer", 1)
  const { status, ...remainingData } = data

  expect(status).toBe(200)
  expect(remainingData).toEqual(expectedResponse.data)
})

test("[getOldQuiz] Retrieve invalid old quiz from Hasura", async () => {
  const expectedResponse = {
    "data": {
      "quiz_by_pk": null
    }
  }

  fetch.mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

  const { error } = await getOldQuiz("trainer", 1)
  const { status, message } = error

  expect(status).toBe(404)
  expect(message).toEqual(expect.any(String))
})

test("[getOldQuiz] Retrieve old quiz from hasura with invalid query", async () => {
  const expectedResponse = {
    "errors": [
      {
        "extensions": {
          "path": "$.query",
          "code": "validation-failed"
        },
        "message": "not a valid graphql query"
      }
    ]
  }

  fetch.mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

  const { error } = await getOldQuiz("trainer", 1)
  const { status, message } = error

  expect(status).toBe(500)
  expect(message).toEqual(expect.any(String))
})
