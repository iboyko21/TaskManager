var isItImportant = false;
var serverUrl = "http://fsdi.azurewebsites.net/api";

function toggleImportant() {
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
  // clear the inputs
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
  var important = task.important ? `<i class="fa fa-star"></i>` : "";
  var taskDate = new Date(task.dueDate);
  var date = taskDate.toDateString();
  var time = taskDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

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
    <i id="iDelete" onclick="deleteTask(${task.id})" class="far fa-times-circle"></i>
    </div>
    
    <div class="sec-2">
      <div class="sec-description">
        <p>${task.description}</p>
      </div>

      <div class="sec-location">
        <label><i class="fas fa-map-marker-alt"></i> ${task.location}</label>
      </div>

      <div class="sec-date">
        <label><i class="far fa-calendar-alt"></i> ${date} ${time}</label>
      </div>

      <div id="important-div">${important}
      </div>

      </div>

  </div>`;

  $("#tasksContainer").append(syntax);

// function showImportant() {
//   if (task.important = true) {
//      $("#important-div").show();
//    } else if (task.important = false) {
//     $("#important-div").hide();
//   }
// }
  
// showImportant();

}

function deleteTask(id) {
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