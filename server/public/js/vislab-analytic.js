Parse.initialize("vis_exercise_app", "vis_exercise_app");

Parse.serverURL = 'http://127.0.0.1:1337/parse'

var list = [new Parse.Object("Test", { "text": "testing1" }), new Parse.Object("Test", { "text": "testing2" }), new Parse.Object("Test", { "text": "testing3" })]

// Parse.Object.saveAll(list)
//     .then(function(obj) {
//         console.log("Success", obj);
//     })
//     .catch(function(e) {
//         alert("Error saving test object!" + e.message);
//     });

var student_id;

function check_student_id() {
    student_id = document.getElementById('student_id').value;
    console.log(student_id)
    console.log(isNaN(student_id))
        // if (!isNaN(student_id) && student_id.length==8){
    if (!isNaN(student_id)) {
        // Further we can check if the student_id is enrolled in this course.
        var first_page_objects = document.getElementsByClassName("first_page");
        var i;
        for (i = 0; i < first_page_objects.length; i++) {
            first_page_objects[i].style.display = "none"
        }
        $(function() {
            $("#exercise").load("exercises/exercise_1.html");
        });
    } else {
        alert("Please input valid student id.")
    }
    // Here to add other alerts
}

function go_to_submission_page(href) {
    window.open(href, "_blank")
}