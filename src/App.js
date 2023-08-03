import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Modal, Form, Segment } from "semantic-ui-react";
import { Select, Message } from "semantic-ui-react";

import "./App.css";

const URL = "http://localhost:3001";

function App() {
  const [data, setData] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "",
  });

  const [error, setError] = useState(false);

  const [id, setId] = useState(null);

  const [addModalState, setAddModalState] = useState(false);

  const [updateModalState, setUpdateModalState] = useState(false);

  const [deleteModalState, setDeleteModalState] = useState(false);

  const options = [
    { key: 1, text: "Pending", value: 1 },
    { key: 2, text: "Work in Progress", value: 2 },
    { key: 3, text: "Completed", value: 3 },
    { key: 4, text: "Missed", value: 4 },
  ];

  useEffect(() => {
    axios.get(`${URL}/`).then((response) => {
      setData(response.data);
    });
  }, [data]);

  const openAddModal = () => {
    setAddModalState(true);
  };

  const closeAddModal = () => {
    setNewTask({
      title: "",
      description: "",
      status: "",
    });
    setAddModalState(false);
    setError(false);
  };

  const openUpdateModal = (taskId) => {
    setId(taskId);
    var tempTask;
    data.forEach((item) => {
      if(item._id === taskId) {
        tempTask = item;
      }
    });
    setNewTask({
      title: tempTask.title,
      description: tempTask.description,
      status: tempTask.status,
    });
    setUpdateModalState(true);
  };

  const closeUpdateModal = () => {
    setNewTask({
      title: "",
      description: "",
      status: "",
    });
    setId(null);
    setUpdateModalState(false);
    setError(false);
  };

  const openDeleteModal = (taskId) => {
    setId(taskId);
    setDeleteModalState(true);
  };

  const closeDeleteModal = () => {
    setNewTask({
      title: "",
      description: "",
      status: "",
    });
    setId(null);
    setDeleteModalState(false);
  };

  const addTask = async () => {
    if (validTitle() && validDiscription() && validStatus()) {
      await axios.post(`${URL}/new-task`, newTask);
      setNewTask({
        title: "",
        description: "",
        status: "",
      });
      closeAddModal();
    } else {
      setError(true);
    }
  };

  const updateTask = async () => {
    if (validTitle() && validDiscription() && validStatus()) {
      await axios.put(`${URL}/${id}`, newTask);
      setNewTask({
        title: "",
        description: "",
        status: "",
      });
      closeUpdateModal();
    } else {
      console.log("Hi");
      setError(true);
    }
  };

  const deleteTask = async () => {
    await axios.delete(`${URL}/${id}`);
    closeDeleteModal();
  };

  const validTitle = () => {
    var valid = true;
    data.forEach((item) => {
      if(item.title === newTask.title) {
        valid = false;
      }
    });
    return newTask.title.length > 3 && valid;
  };

  const validDiscription = () => {
    return newTask.description.length > 5;
  };

  const validStatus = () => {
    return newTask.status.length !== 0;
  };

  return (
    <div className="home">
      <h1 className="heading">Your Daily Tasks!</h1>
      <Button className="add" color="purple" onClick={openAddModal}>
        Add +
      </Button>
      <Card.Group
        className="card-section"
        style={data.length === 0 ? { justifyContent: "center" } : null}
      >
        {data.length !== 0 ? (
          data.map((task) => {
            return (
              <Card key={task._id}>
                <Card.Content>
                  <Card.Header>{task.title}</Card.Header>
                  <Card.Meta><strong>Status: </strong> {task.status}</Card.Meta>
                  <Card.Description>{task.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Button color="green" onClick={() => openUpdateModal(task._id)}>
                      Update
                    </Button>
                    <Button color="red" onClick={() => openDeleteModal(task._id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Content>
                <Modal
                  open={updateModalState}
                  onClose={closeUpdateModal}
                  className="update-modal"
                >
                  <Modal.Header>Update Task</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Segment>
                        <Form.Input
                          name="title"
                          value={newTask.title}
                          type="text"
                          placeholder={newTask.title}
                          onChange={(e) => {
                            setNewTask((prevTask) => {
                              return { ...prevTask, title: e.target.value };
                            });
                          }}
                        />
                        <Form.Input
                          name="description"
                          value={newTask.description}
                          type="text"
                          placeholder={newTask.description}
                          onChange={(e) => {
                            setNewTask((prevTask) => {
                              return {
                                ...prevTask,
                                description: e.target.value,
                              };
                            });
                          }}
                        />
                        Status:
                        <Select
                          style={{ marginLeft: "1%" }}
                          placeholder={newTask.status}
                          options={options}
                          onChange={(e) => {
                            setNewTask((prevTask) => {
                              return {
                                ...prevTask,
                                status: e.target.textContent,
                              };
                            });
                          }}
                        />
                      </Segment>
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color="green" onClick={updateTask}>
                      Update
                    </Button>
                    <Button color="grey" onClick={closeUpdateModal}>
                      Cancel
                    </Button>
                  </Modal.Actions>
                  {error && <Message error>
                    <h3>Rules to be followed:- </h3>
                      <ul>
                        <li>Title must be unique.</li>
                        <li>Title must be changed while updating.</li>
                        <li>Title must include more than 3 Characters.</li>
                        <li>Description must include more than 5 Characters.</li>
                        <li>Status must be selected.</li>
                      </ul>
                    </Message>}
                </Modal>
                <Modal
                  open={deleteModalState}
                  onClose={closeDeleteModal}
                  className="delete-modal"
                >
                  <Modal.Header>Create Task</Modal.Header>
                  <Modal.Content>
                    <Segment>
                      <h3>Are You Sure?</h3>
                    </Segment>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color="red" onClick={deleteTask}>
                      Delete
                    </Button>
                    <Button color="grey" onClick={closeDeleteModal}>
                      Cancel
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Card>
            );
          })
        ) : (
          <h2>Start Adding Tasks...</h2>
        )}
        <Modal open={addModalState} onClose={closeAddModal} className="add-modal">
          <Modal.Header>Create Task</Modal.Header>
          <Modal.Content>
            <Form>
              <Segment>
                <Form.Input
                  name="title"
                  value={newTask.title}
                  type="text"
                  placeholder="Title"
                  onChange={(e) => {
                    setNewTask((prevTask) => {
                      return { ...prevTask, title: e.target.value };
                    });
                  }}
                />
                <Form.Input
                  name="description"
                  value={newTask.description}
                  type="text"
                  placeholder="Description"
                  onChange={(e) => {
                    setNewTask((prevTask) => {
                      return { ...prevTask, description: e.target.value };
                    });
                  }}
                />
                Status:
                <Select
                  style={{ marginLeft: "1%" }}
                  placeholder={"Choose"}
                  options={options}
                  onChange={(e) => {
                    setNewTask((prevTask) => {
                      return { ...prevTask, status: e.target.textContent };
                    });
                  }}
                />
              </Segment>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={addTask}>
              Add
            </Button>
            <Button color="grey" onClick={closeAddModal}>
              Cancel
            </Button>
          </Modal.Actions>
          {error && <Message error>
            <h3>Rules to be followed:- </h3>
              <ul>
                <li>Title must be unique.</li>
                <li>Title must be changed while updating.</li>
                <li>Title must include more than 3 Characters.</li>
                <li>Description must include more than 5 Characters.</li>
                <li>Status must be selected.</li>
              </ul>
            </Message>}
        </Modal>
      </Card.Group>
    </div>
  );
}

export default App;
