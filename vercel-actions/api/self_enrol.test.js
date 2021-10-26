const { selfEnrol, checkEnrolmentEndDate } = require("./self_enrol")
const fetch = require("node-fetch")
jest.mock("node-fetch", () => jest.fn())

test("Self enrol course", () => {
    const enrolled = selfEnrol(1,1)
    expect(enrolled).toBe(true)
})


test("Check Enrolment End Date", async () => {
    const expectedResponse = {
        "data": {
          "course": [
            {
              "enrolment_end_date": "2016-01-25T00:00:00+00:00",
              "id": 10
            }
          ]
        }
      }

    fetch.mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))
  
    const { data } = await checkEnrolmentEndDate("2021-10-12", "learner")
    const { status, ...remainingData } = data
  
    expect(status).toBe(200)
    expect(remainingData).toEqual(expectedResponse.data)
})