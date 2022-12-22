import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Input } from "./Style";
import { EditForm } from "./Style";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

export default function Index() {
  const [task, settask] = useState("");
  const [listTask, setlist] = useState([]);
  let [editTask, seteditTask] = useState("");
  const url = "https://jsonplaceholder.typicode.com/todos";
  // adding tooltip using tippy libarary 
  tippy("#edit", {
    content: "edit",
  });
  tippy("#delete", {
    content: "delete",
  });
  tippy("#back", {
    content: "cancel",
  });
  tippy("#check", {
    content: "mark as complete",
  });
// getting all task using get request 
  useEffect(() => {
    fetch(url)
      .then((response) => {
        let data = response.json();
        return data;
      })
      .then((data) => {
        let result = data;
        let updatedData = result.map((item) => {
          item.flag = true;
          return item;
        });
        setlist(updatedData);
      });
  }, []);
// handling post request 
  function handleSubmit(e) {
    e.preventDefault();
    fetch(url, {
      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify({
        userId: 1,
        id: Date.now(),
        title: task,
        completed: false,
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      // Converting to JSON
      .then((response) => response.json())

      // Displaying results to console
      .then((json) => {
        let newTask = json;
        newTask.flag = true;
        setlist([newTask, ...listTask]);
      });
    settask("");
  }
  // delete request using fetch api 
  function handleDelete(item) {
    let index = listTask.indexOf(item);
    listTask.splice(index, 1);
    setlist([...listTask]);
    fetch(`https://jsonplaceholder.typicode.com/todos/${item.id}`, {
      method: "DELETE",
    });
  }
  // edit task functionality 
  function handleEdit(item) {
    item.flag = false;
    setlist([...listTask]);
  }

  function handleCancel(item) {
    item.flag = true;
    setlist([...listTask]);
  }
  // put request handled when user request to update task 
  function handleToEditTask(e, item) {
    e.preventDefault();
    let index = listTask.indexOf(item);
    item.title = editTask;
    item.flag = true;
    fetch(`https://jsonplaceholder.typicode.com/todos/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((data) => {
        let result = data;
        listTask[index] = result;
        setlist([...listTask]);
      });

    seteditTask("");
  }
  // marking check and check 
  function handleCheck(e) {
    e.target.parentElement.parentElement.parentElement.firstElementChild.classList.toggle(
      "line_through"
    );
  }
  return (
    <Input>
      <form onSubmit={handleSubmit} className="addTaskForm">
        <div>
          <input
            type="text"
            placeholder="Add your task"
            value={task}
            onChange={(e) => settask(e.target.value)}
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/889/889648.png"
            alt="error"
          />
        </div>
        <button>
          Add
          <img
            src="https://cdn-icons-png.flaticon.com/512/4903/4903809.png"
            alt="error"
          />
        </button>
      </form>
      <div>
        <ul>
          {listTask.map((item) => (
            <li key={item.id}>
              {item.flag ? (
                <>
                  <span>{item.title}</span>

                  <div className="Icon_button">
                    <span>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
                        alt="error"
                        id="edit"
                        onClick={() => handleEdit(item)}
                      />
                    </span>
                    <span>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/484/484662.png"
                        alt="error"
                        id="delete"
                        onClick={() => handleDelete(item)}
                      />
                    </span>
                    <span>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/70/70227.png"
                        alt="error"
                        onClick={(e) => handleCheck(e)}
                        id="check"
                      />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <EditForm onSubmit={(e) => handleToEditTask(e, item)}>
                    <input
                      type="text"
                      placeholder="edit your task"
                      className="editInput"
                      value={editTask}
                      onChange={(e) => seteditTask(e.target.value)}
                      required
                    ></input>
                    <div className="buttonWrapper">
                      <button className="editButton">Done</button>
                      <span className="editCancelButton" id="back">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/2874/2874787.png"
                          alt="error"
                          onClick={() => handleCancel(item)}
                          
                        />
                      </span>
                    </div>
                  </EditForm>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Input>
  );
}
