const fetch = require("node-fetch")
const { retrieveBodyData, getOldQuiz, getChanges, convertToGqlQuery } = require("./UpdateQuiz")

jest.mock("node-fetch", () => jest.fn())

const validMockData = {
  session_variables: {
    'x-hasura-role': 'trainer',
    'x-hasura-user-id': 'auth0|614dfc64c69eb200704771b8'
  },
  input: {
    "object": {
      "title": "Updated Quiz 3",
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
            "title": "New question 1",
            "question_type_id": 2,
            "question_options": {
              "data": [
                {
                  "is_answer": false,
                  "title": "False",
                  "id": 3
                },
                {
                  "is_answer": true,
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

const quizResponseFromHasura = {
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

const validNewQuestionMockInput = {
  session_variables: {
    'x-hasura-role': 'trainer',
    'x-hasura-user-id': 'auth0|614dfc64c69eb200704771b8'
  },
  input: {
    "object": {
      "title": "Updated Quiz 3",
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
            "title": "New question 1",
            "question_type_id": 2,
            "question_options": {
              "data": [
                {
                  "is_answer": false,
                  "title": "False",
                  "id": 3
                },
                {
                  "is_answer": true,
                  "title": "True",
                  "id": 15
                }
              ]
            },
            "id": 4
          },
          {
            "title": "New question 4",
            "question_type_id": 2,
            "question_options": {
              "data": [
                {
                  "is_answer": false,
                  "title": "False"
                },
                {
                  "is_answer": true,
                  "title": "True"
                }
              ]
            }
          }
        ]
      },
      "id": 8
    }
  }
}

const validNewQuestionOptionMockInput = {
  session_variables: {
    'x-hasura-role': 'trainer',
    'x-hasura-user-id': 'auth0|614dfc64c69eb200704771b8'
  },
  input: {
    "object": {
      "title": "Updated Quiz 3",
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
                },
                {
                  "is_answer": false,
                  "title": "This is new"
                }
              ]
            },
            "id": 10
          },
          {
            "title": "New question 1",
            "question_type_id": 2,
            "question_options": {
              "data": [
                {
                  "is_answer": false,
                  "title": "False",
                  "id": 3
                },
                {
                  "is_answer": true,
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

const validRemovedQuestionMockInput = {
  session_variables: {
    'x-hasura-role': 'trainer',
    'x-hasura-user-id': 'auth0|614dfc64c69eb200704771b8'
  },
  input: {
    "object": {
      "title": "Updated Quiz 3",
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
  expect(retrievedData).toEqual({ input: validMockData.input.object, userRole: validMockData.session_variables["x-hasura-role"] })
})

test("[getOldQuiz] Retrieve valid old quiz from Hausra", async () => {
  const expectedResponse = quizResponseFromHasura

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

test("[getChanges] Retieve update mutations for quiz changes", async () => {
  const oldQuizResponse = quizResponseFromHasura
  const expectedResponse = [
    `update_quiz_by_pk(pk_columns: {id: 8}, _set: {section_id: 1, time_limit: 1, title: "Updated Quiz 3"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_by_pk(pk_columns: {id: 4}, _set: {title: "New question 1", question_type_id: 2}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_option_by_pk(pk_columns: {id: 3}, _set: {is_answer: false, title: "False"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_option_by_pk(pk_columns: {id: 15}, _set: {is_answer: true, title: "True"}) {
      id
    }`.replace(/(\n|\s)/g, '')
  ]

  fetch.mockImplementation(() => Promise.resolve({ json: () => oldQuizResponse }))

  const { input: newQuiz, userRole } = retrieveBodyData(validMockData)
  const { data: { quiz_by_pk: oldQuiz } } = await getOldQuiz(userRole, 8)

  const changes = getChanges(oldQuiz, newQuiz)
    .map(change => change.replace(/(\n|\s)/g, ''))
  expect(changes).toStrictEqual(expectedResponse)
})

test("[getChanges] Retieve update mutations for new quiz question", async () => {
  const oldQuizResponse = quizResponseFromHasura
  const expectedResponse = [
    `update_quiz_by_pk(pk_columns: {id: 8}, _set: {section_id: 1, time_limit: 1, title: "Updated Quiz 3"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_by_pk(pk_columns: {id: 4}, _set: {title: "New question 1", question_type_id: 2}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_option_by_pk(pk_columns: {id: 3}, _set: {is_answer: false, title: "False"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_option_by_pk(pk_columns: {id: 15}, _set: {is_answer: true, title: "True"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `insert_question_one(object: {title: "New question 4", quiz_id: 8, question_type_id: 2, question_options: {data: [{is_answer: false, title: "False"},{is_answer: true, title: "True"}]}}) {
      id
    }`.replace(/(\n|\s)/g, '')
  ]

  fetch.mockImplementation(() => Promise.resolve({ json: () => oldQuizResponse }))

  const { input: newQuiz, userRole } = retrieveBodyData(validNewQuestionMockInput)
  const { data: { quiz_by_pk: oldQuiz } } = await getOldQuiz(userRole, 8)

  const changes = getChanges(oldQuiz, newQuiz)
    .map(change => change.replace(/(\n|\s)/g, ''))
  expect(changes).toStrictEqual(expectedResponse)
})

test("[getChanges] Retieve update mutations for new question option", async () => {
  const oldQuizResponse = quizResponseFromHasura
  const expectedResponse = [
    `update_quiz_by_pk(pk_columns: {id: 8}, _set: {section_id: 1, time_limit: 1, title: "Updated Quiz 3"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `insert_question_option_one(object: {is_answer: false, question_id: 10, title: "This is new"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_by_pk(pk_columns: {id: 4}, _set: {title: "New question 1", question_type_id: 2}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_option_by_pk(pk_columns: {id: 3}, _set: {is_answer: false, title: "False"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `update_question_option_by_pk(pk_columns: {id: 15}, _set: {is_answer: true, title: "True"}) {
      id
    }`.replace(/(\n|\s)/g, '')
  ]

  fetch.mockImplementation(() => Promise.resolve({ json: () => oldQuizResponse }))

  const { input: newQuiz, userRole } = retrieveBodyData(validNewQuestionOptionMockInput)
  const { data: { quiz_by_pk: oldQuiz } } = await getOldQuiz(userRole, 8)

  const changes = getChanges(oldQuiz, newQuiz)
    .map(change => change.replace(/(\n|\s)/g, ''))
  expect(changes).toStrictEqual(expectedResponse)
})

test("[getChanges] Retieve update mutations for removed question", async () => {
  const oldQuizResponse = quizResponseFromHasura
  const expectedResponse = [
    `update_quiz_by_pk(pk_columns: {id: 8}, _set: {section_id: 1, time_limit: 1, title: "Updated Quiz 3"}) {
      id
    }`.replace(/(\n|\s)/g, ''),
    `delete_question_by_pk(id: 4) {
      id
    }`.replace(/(\n|\s)/g, '')
  ]

  fetch.mockImplementation(() => Promise.resolve({ json: () => oldQuizResponse }))

  const { input: newQuiz, userRole } = retrieveBodyData(validRemovedQuestionMockInput)
  const { data: { quiz_by_pk: oldQuiz } } = await getOldQuiz(userRole, 8)

  const changes = getChanges(oldQuiz, newQuiz)
    .map(change => change.replace(/(\n|\s)/g, ''))
  expect(changes).toStrictEqual(expectedResponse)
})

test("[convertToGqlQuery] Converts changes to hasura mutation query", async () => {
  const expectedResponse =
    `mutation {
      _0: update_quiz_by_pk(pk_columns: {id: 8}, _set: {section_id: 1, time_limit: 1, title: "Updated Quiz 3"}) {
          id
        }
      _1: update_question_by_pk(pk_columns: {id: 4}, _set: {title: "New question 1", question_type_id: 2}) {
          id
        }
      _2: update_question_option_by_pk(pk_columns: {id: 3}, _set: {is_answer: false, title: "False"}) {
          id
        }
      _3: update_question_option_by_pk(pk_columns: {id: 15}, _set: {is_answer: true, title: "True"}) {
          id
        }
    }`.replace(/(\n|\s)/g, '')

  const oldQuizResponse = quizResponseFromHasura
  fetch.mockImplementation(() => Promise.resolve({ json: () => oldQuizResponse }))

  const { input: newQuiz, userRole } = retrieveBodyData(validMockData)
  const { data: { quiz_by_pk: oldQuiz } } = await getOldQuiz(userRole, 8)

  const changes = getChanges(oldQuiz, newQuiz)
  const hasuraQuery = convertToGqlQuery(changes).replace(/(\n|\s)/g, '')
  expect(hasuraQuery).toEqual(expectedResponse)
})
