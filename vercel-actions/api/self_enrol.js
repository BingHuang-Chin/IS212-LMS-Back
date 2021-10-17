//Main function which will be triggered when the browser requests for http://localhost:3001/api/self_enrol
const vercelFn = async (request, response) => {
    return response.json({ hello : "world" })
}

const selfEnrol = (learnerId, courseId) => {
    //TODO: Processing
    return true
}

module.exports = {
    selfEnrol,
    default : vercelFn
}