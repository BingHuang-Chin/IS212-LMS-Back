mutation {

    insert_trainer(objects: {id: 2, name: "sha"}) {
        affected_rows
    }


    insert_learner(objects: {id: 3, name: "hi"}) {
        affected_rows
    }

    insert_course(objects: {badge_id: 10, id: 10, 
      title: "11ds", description: "test", 
      start_date: "2016-01-25", end_date: "'2016-01-28'", 
      enrolment_end_date: "'2016-01-25'", enrolment_start_date: "'2016-01-25'", created_by: "Meree", updated_by: "meme"}) {
      affected_rows
    }

    insert_badge(objects: {image: "", title: "1", id: 1}) {
        affected_rows
    }


    insert_class(objects: {course_id: 10, name: "IS", trainer_id: 1}) {
        affected_rows
    }
      
  }
