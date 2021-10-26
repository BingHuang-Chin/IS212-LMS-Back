//Main function which will be triggered when the browser requests for http://localhost:3001/api/self_enrol
const vercelFn = async (request, response) => {
    return response.json({ hello : "world" })
}

const selfEnrol = (learnerId, courseId) => {
    //TODO: Processing
    return true
}

const checkEnrolmentEndDate = (enrolment_end_date) => {
    //TODO: Processing
    var checkQuery = `query {
            course(where: {enrolment_end_date: {_gte: "${enrolment_end_date}"}}) {
            enrolment_end_date
            id
            }
        }`  
}

module.exports = {
    selfEnrol,
    default : vercelFn
}