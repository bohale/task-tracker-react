import Header from "./components/Header";
import { Tasks } from "./components/Tasks";
import { AddTask } from "./components/AddTask";
import { Footer } from "./components/Footer";
import { About } from "./components/About";

import React from "react";
import { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Route } from "react-router-dom";


/* class App extends React.Component {
  render() {
    return <h1>Hello from a class</h1>
  }
} */

function App() {

  const [ showAddTask, setShowAddTask] = useState(false); 
  const [ tasks, setTasks ] = useState([ ]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks(); 
      setTasks(tasksFromServer);
    }
    getTasks();           // get data via HTTP
  }, []);


  // fetch Tasks
  const fetchTasks = async () => {
      const res = await fetch("http://localhost:5000/tasks");
      const data = await res.json(); 

      return data; 
  }

    // fetch a Task
    const fetchTask = async (id) => {
      const res = await fetch(`http://localhost:5000/tasks/${id}`);
      const data = await res.json(); 

      return data; 
  }

  // Add Task
  const addTask = async (task) => {
    /* const id = Math.floor(Math.random() * 10000) + 1;
    const newTask = { id, ...task };   // newTask with id and text, day and reminder from UI
    setTasks([...tasks, newTask]);     //add newTask to existing Tasks
    */

    const res = await fetch('http://localhost:5000/tasks/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    }); 

    const data = await res.json(); 
    setTasks( [ ...tasks, data ] ); 
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    });
    // show tasks not matching this ID in UI
    // filter out
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedTask)
    }); 

    const data = await res.json(); 
    setTasks(
      tasks.map((task) =>   // change reminder else use current reminder 
        task.id === id ? { ...task, reminder: data.reminder } : 
                         task
      )
    )
  }


  return (
    <Router>
      <div className="container">
      <Header 
      onAdd={ () => setShowAddTask (!showAddTask) } showAdd={showAddTask}/> 
        <Route path="/" exact render={ (props) => (
          <>
            { showAddTask && <AddTask onAdd={ addTask }/> }
            { 
               tasks.length > 0 ?  ( <Tasks tasks={ tasks } 
                                        onDelete={ deleteTask }
                                        onToggle={ toggleReminder }/> ) :  ( 'No Tasks to show' )
           }
          </>
         ) 
        } />
        <Route path="/about" component={ About } />
        <Footer />
    </div>
    </Router>
  );
}

export default App;
