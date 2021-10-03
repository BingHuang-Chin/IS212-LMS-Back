const { handleProcess, retrieveBodyData } = require("./UpdateQuiz")

const validMockData = {
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
  expect(retrievedData).toEqual({ input: validMockData.input.object })
})

test("[handleProcess] Return results to hasura", () => {
  const { input } = retrieveBodyData(validMockData)
  const result = handleProcess(input)
  expect(result).toEqual({ hello: "bye" })
})
