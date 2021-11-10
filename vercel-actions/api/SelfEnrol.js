//Main function which will be triggered when the browser requests for http://localhost:3001/api/self_enrol
const fetch = require("node-fetch")

const vercelFn = async (request, response) => {
    return response.json({ hello: "world" })
}

function checkEnrolmentEndDate (enrolment_end_date, role) {
    //TODO: Processing
    var checkQuery = `query {
            course(where: {enrolment_end_date: {_gte: "${enrolment_end_date}"}}) {
            enrolment_end_date
            id
            }
        }`
    // console.log(checkQuery)
    return new Promise(resolve => {
        fetch("http://localhost:8080/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-admin-secret": "myadminsecretkey",
                "x-hasura-role": role
            },
            body: JSON.stringify({
                query: checkQuery
            })
        })
            .then(response => response.json())
            .then(({ errors, data }) => {
                // console.log(errors, data)
                if (errors)
                    return resolve({ error: { status: 500, message: "Internal server error." } })

                // if (!data.quiz_by_pk)
                //   resolve({ error: { status: 404, message: "Course not found." } })

                return resolve({ data: { ...data, status: 200 } })
            })
            .catch(() => {
                // console.log("errors")
                return resolve({ error: { status: 500, message: "Internal server error." } })
            })
    })
}

function checkClassSize (class_size, role) {
    //TODO: Processing
    var checkQuery = `query {
            course(where: {class_size: {_gte: "${class_size}"}}) {
            class_size
            id
            }
        }`
    // console.log(checkQuery)
    return new Promise(resolve => {
        fetch("http://localhost:8080/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-admin-secret": "myadminsecretkey",
                "x-hasura-role": role
            },
            body: JSON.stringify({
                query: checkQuery
            })
        })
            .then(response => response.json())
            .then(({ errors, data }) => {
                // console.log(errors, data)
                if (errors)
                    return resolve({ error: { status: 500, message: "Internal server error." } })

                // if (!data.quiz_by_pk)
                //   resolve({ error: { status: 404, message: "Course not found." } })

                return resolve({ data: { ...data, status: 200 } })
            })
            .catch(() => {
                // console.log("errors")
                return resolve({ error: { status: 500, message: "Internal server error." } })
            })
    })
}

function checkPrerequisite (learner_id, badge_id, course_id, course_completion_date) {
    //TODO: Processing
    var checkQuery = `query {
            course(where: {class_size: {_gte: "${class_size}"}}) {
            class_size
            id
            }
        }`
    // console.log(checkQuery)
    return new Promise(resolve => {
        fetch("http://localhost:8080/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-admin-secret": "myadminsecretkey",
                "x-hasura-role": role
            },
            body: JSON.stringify({
                query: checkQuery
            })
        })
            .then(response => response.json())
            .then(({ errors, data }) => {
                if (errors)
                    return resolve({ error: { status: 500, message: "Internal server error." } })

                return resolve({ data: { data1, status: 200 } })
            })
            .catch(() => {
                return resolve({ error: { status: 500, message: "Internal server error." } })
            })
    })
}

module.exports = {
    checkEnrolmentEndDate,
    checkClassSize,
    default: vercelFn
}