var isItImportant = false;
var serverUrl = "http://fsdi.azurewebsites.net/api";

function toggleImportant() {
  console.log("Icon clicked!");

  if (isItImportant) {
    // change to non important
    isItImportant = false;
    $("#iImportant").removeClass("fas").addClass("far");
  } else {
    // change to important
    isItImportant = true;
    $("#iImportant").removeClass("far").addClass("fas");
  }
}

function saveTask() {
  console.log("Saving!");

  // get the values from controls
  let title = $("#txtTitle").val();
  let desc = $("#txtDesc").val();
  let location = $("#txtLocation").val();
  let dueDate = $("#txtDueDate").val();
  let alert = $("#selAlert").val();

  // data validations
  if(!title) {  // ! means not
    $("#errorTitle").removeClass('hide');

    // timer in js
    // 1param: what should do
    // 2param: how much time to wait (in milliseconds)
    setTimeout(
      function(){
        $("#errorTitle").addClass('hide');
      },
      5000
    );

    return; // get out of the function
  }

  // validate dueDate
  if(!dueDate) {
    $("#errorDuedate").removeClass('hide');
    setTimeout(
      function(){
        $("#errorDuedate").addClass('hide');
      },
      5000
    );
    return;
  }

  $("#txtTitle").val("");
  $("#txtDesc").val("");
  $("#txtLocation").val("");
  $("#txtDueDate").val("");
  
  // create an object
  let theTask = new Task(title, desc, isItImportant, dueDate, alert, location);

  // console log the object
  console.log(theTask);

  // send task to server
  $.ajax({
    url: serverUrl + "/tasks",
    type: "POST",
    data: JSON.stringify(theTask),
    contentType: "application/json",
    success: function (res) {
      console.log("Server says", res);

      displayTask(res);
    },
    error: function (error) {
      console.error("Error saving", error);
    },
  });
}

function displayTask(task) {
  let alert = "";
  switch (task.alertText) {
    case "1":
      alert = "Don't Forget to";
      break;

    case "2":
      alert = "Stop";
      break;

    case "3":
      alert = "Start";
      break;

    case "4":
      alert = "Get more coffee";
      break;
  }

  let syntax = `<div id="task${task.id}" class="task">
    <div class="sec-1">
    <h6>${alert}</h6>
    <b>${task.title}</b>
    <i id="iDelete" onclick="deleteTask(${task.id})" class="fas fa-ban"></i>
    </div>
    
    <div class="sec-2">
      <div class="sec-description">
        <p>${task.description}</p>
      </div>

      <div class="sec-location">
      <label>${task.location}</label>
     </div>

      <div class="sec-date">
        <label>${task.dueDate}</label>
      </div>

      </div>

  </div>`;

  $("#tasksContainer").append(syntax);
}

function deleteTask(id) {
  console.log("deleting the task: " + id);

  $.ajax({
    url: serverUrl + "/tasks/" + id,
    type: "DELETE",
    success: function(){
      console.log("Task removed from server");
      $("#task" + id).remove(); //Option 1
      // Option 2
      // location.reload(); // reload the page
    },
    error: function(error) {
      console.log("Error removing", error);
    }
  });

}

function retrieveTasks() {
  $.ajax({
    url: serverUrl + "/tasks",
    type: "GET",
    success: function (list) {
      console.log("Retrieved", list);

      for (let i = 0; i < list.length; i++) {
        let task = list[i];
        if (task.user === "Igor") {
          displayTask(task);
        }
      }
    },
    error: function (err) {
      console.error("Error reading", err);
    },
  });
}

function init() {
  console.log("Task Manager");

  // load data
  retrieveTasks();

  // hook events
  $("#iImportant").click(toggleImportant);
  $("#btnSave").click(saveTask);

  $("#btnDetails").click(function () {
    $("#details").toggle();
  });
}

window.onload = init;

function testRequest() {
  $.ajax({
    url: "https://restclass.azurewebsites.net/api/test",
    type: "GET",
    success: function (res) {
      console.log("Server says", res);
    },
    error: function (errorDet) {
      console.error("error on req", errorDet);
    },
  });
}

// make background as sticky notes on a board