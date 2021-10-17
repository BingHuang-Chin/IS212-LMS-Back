const { selfEnrol } = require("./self_enrol")

test("Self enrol course", () => {
    const enrolled = selfEnrol(1,1)
    expect(enrolled).toBe(false)
})