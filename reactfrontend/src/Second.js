import React from "react";
import Platte from "./second/Platte";
import Kanban from "./second/Kanban";
import Navside from "./Navside";
import { DragDropContext } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import Modal from "react-modal";
import { FaRegWindowMinimize } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const initialData = {
  columns: {
    steady: {
      id: "steady",
      title: "Steady Status",
      actions: []
    },
    attack: {
      id: "attack",
      title: "Attack Status",
      actions: []
    },
    revert: {
      id: "revert",
      title: "Revert Status",
      actions: []
    }
  },
  columnOrder: ["steady", "attack", "revert"]
};

const initexperiment = {
  name: "",
  steadyState: {
    componentList: []
  },
  attackState: {
    componentList: []
  },
  revertState: {
    componentList: []
  }
};

class Second extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plattedata: [],
      kanbandata: initialData,
      CardModalIsOpen: false,
      commanddata: [{ id: 1, commandname: "" }],
      savecheck: [],
      cardstatus: null,
      cardname: null,
      cardid: null,
      statusarray: [],
      removecardid: null,
      delmodalIsOpen: false,
      allcommands: [],
      experimentname: "",
      experimentdata: initexperiment
    };
  }

  componentDidMount() {
    this.refresh();
  }
  refresh = () => {
    fetch("http://localhost:8080/getdata")
      .then(response => response.json())
      .then(data => {
        this.setState({ plattedata: data });
      });
  };

  onDragEnd = result => {
    const { source, destination } = result;
    console.log(result);
    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        break;
      case "Item":
        {
          const finish = this.state.kanbandata.columns[destination.droppableId];
          const finishactions = Array.from(finish.actions);
          const sourceClone = Array.from(this.state.plattedata);
          const item = sourceClone[source.index];
          console.log(item);
          var flag = 0;
          for (var i = 0; i < finishactions.length; i++) {
            if (item.id === finishactions[i].id) {
              flag = 1;
              break;
            }
          }
          if (flag === 1) break;
          var uid = uuid();
          finishactions.splice(destination.index, 0, {
            ...item,
            _id: uid,
            flag: 0
          });
          const status = {
            id: uid,
            status: destination.droppableId
          };
          this.state.statusarray.push(status);
          console.log(this.state.statusarray);
          const newFinish = {
            ...finish,
            actions: finishactions
          };
          console.log(newFinish);
          const newState = {
            ...this.state.kanbandata,
            columns: {
              ...this.state.kanbandata.columns,
              [newFinish.id]: newFinish
            }
          };
          console.log(item.base_commands);
          var commands = [];
          Object.keys(item.base_commands).map(i => {
            var array = { index: item.base_commands[i] };
            var temp = JSON.stringify(array);
            temp = temp.replace("index", i);
            array = JSON.parse(temp);
            commands.push(array);
          });
          console.log(commands);
          var carddata = {
            indexTemp: {
              name: item.name,
              commands: commands
            },
            commandid: uid
          };
          var temp1 = JSON.stringify(carddata);
          // temp = temp.replace("commandname", this.state.name);
          temp1 = temp1.replace("indexTemp", item.name);
          carddata = JSON.parse(temp1);
          console.log(carddata);
          this.state.allcommands.push(carddata);
          this.setState({ kanbandata: newState });
        }
        break;
      default:
        {
          const start = this.state.kanbandata.columns[source.droppableId];
          const finish = this.state.kanbandata.columns[destination.droppableId];
          const startactions = Array.from(start.actions);
          const [removed] = startactions.splice(source.index, 1);
          const newStart = {
            ...start,
            actions: startactions
          };
          console.log(removed);
          const finishactions = Array.from(finish.actions);
          var flag1 = 0;
          for (var i1 = 0; i1 < finishactions.length; i1++) {
            if (removed.id === finishactions[i1].id) {
              flag1 = 1;
              break;
            }
          }
          if (flag1 === 1) break;
          finishactions.splice(destination.index, 0, removed);
          this.state.statusarray.map(data => {
            if (data.id === removed._id) data.status = destination.droppableId;
          });
          console.log(this.state.statusarray);
          const newFinish = {
            ...finish,
            actions: finishactions
          };
          const newState = {
            ...this.state.kanbandata,
            columns: {
              ...this.state.kanbandata.columns,
              [newStart.id]: newStart,
              [newFinish.id]: newFinish
            }
          };
          this.setState({ kanbandata: newState });
        }
        break;
    }
  };

  openCardModal = (src, status, name) => {
    if (this.state.savecheck[src]) {
      alert("you have already inputed");
    } else {
      this.setState({ cardid: src, cardstatus: status, cardname: name });
      this.setState({ src: src, CardModalIsOpen: true });
    }
  };
  closeCardModal = () => {
    this.setState({
      cardstatus: null,
      cardname: null,
      cardid: null,
      commanddata: [{ id: 1, commandname: "" }]
    });
    this.setState({ CardModalIsOpen: false });
  };

  savecard = src => {
    if (!this.state.commanddata) {
      alert("please enter values");
    } else {
      var commands = [];
      this.state.commanddata.map(data => {
        var item = { commandname: data.commandvalue };
        var temp = JSON.stringify(item);
        temp = temp.replace("commandname", data.commandname);
        item = JSON.parse(temp);
        commands.push(item);
      });
      console.log(commands);
      var carddata = {
        indexTemp: {
          name: this.state.cardname,
          commands: commands
        },
        commandid: this.state.cardid
      };
      var temp = JSON.stringify(carddata);
      // temp = temp.replace("commandname", this.state.name);
      temp = temp.replace("indexTemp", this.state.cardname);
      carddata = JSON.parse(temp);
      this.state.allcommands.map((command, index) => {
        if (command.commandid === this.state.cardid) {
         this.state.allcommands[index] = carddata;
        }
      });
      console.log(this.state.allcommands);
      this.state.savecheck[src] = true;
      console.log(this.state.savecheck);
      this.setState({
        cardstatus: null,
        cardname: null,
        cardid: null,
        commanddata: [{ id: 1, commandname: "" }]
      });
      this.setState({ CardModalIsOpen: false });
    }
  };

  onChangeValueInput = (evt, idx) => {
    let nextcommanddata = this.state.commanddata.slice();
    nextcommanddata[idx].commandvalue = evt.target.value;
    this.setState({ commanddata: nextcommanddata });
  };

  onChangeNameInput = (evt, idx) => {
    let nextcommanddata = this.state.commanddata.slice();
    nextcommanddata[idx].commandname = evt.target.value;
    this.setState({ commanddata: nextcommanddata });
  };

  addcommandrow = () => {
    let array = this.state.commanddata;
    array.push({ id: array.length + 1, commandname: "" });
    this.setState({ commanddata: array });
  };

  removecommandrow = idx => {
    let somearray = this.state.commanddata;
    somearray.splice(idx, 1);
    this.setState({ commanddata: somearray });
  };
  removecardModalopen = _id => {
    this.setState({ removecardid: _id, delmodalIsOpen: true });
  };
  closedelModal = () => {
    this.setState({ removecardid: null, delmodalIsOpen: false });
  };
  delete = () => {
    {
      this.state.kanbandata.columnOrder.map(columnId => {
        const column = this.state.kanbandata.columns[columnId];
        const actions = column.actions;
        for (var i = 0; i < actions.length; i++) {
          if (actions[i]._id === this.state.removecardid) actions.splice(i, 1);
        }
      });
    }
    var array = this.state.statusarray;
    for (var j = 0; j < array.length; j++) {
      if (array[j].id === this.state.removecardid) array.splice(j, 1);
    }
    console.log(array);
    var commands = this.state.allcommands;
    for (var k = 0; k < commands.length; k++) {
      if (commands[k].commandid === this.state.removecardid)
        commands.splice(k, 1);
    }
    console.log(commands);
    this.setState({ delmodalIsOpen: false });
  };
  onChangeExperimentNameInput = event => {
    var name = event.target.value;
    this.setState({ experimentname: name });
  };

  experiment = () => {
    if (!this.state.experimentname == "" && this.state.allcommands.length > 0) {
      this.state.experimentdata.name = this.state.experimentname;
      this.state.allcommands.map(command => {
        var commandstatus = "";
        this.state.statusarray.map(status => {
          if (command.commandid === status.id) {
            commandstatus = status.status;
          }
        });
        delete command["commandid"];
        if (commandstatus === "steady") {
          this.state.experimentdata.steadyState.componentList.push(command);
        } else if (commandstatus === "attack") {
          this.state.experimentdata.attackState.componentList.push(command);
        } else if (commandstatus === "revert") {
          this.state.experimentdata.revertState.componentList.push(command);
        }
      });
      console.log(this.state.experimentdata);
      var data = this.state.experimentdata;
      axios
        .post("http://localhost:8080/insertexperimentdata", data)
        .then(res => {
          // then print response status
          alert("insert data successfully");
          window.location.reload();
        })
        .catch(err => {
          // then print response status
          alert("failed");
        });
      // alert("save experiemnt json");
      // window.location.reload();
    } else alert("input commands or input experiment name");
  };
  render() {
    return (
      <div className="container h-100 inside">
        <Navside />
        <div className="row custom-height">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Platte plattedata={this.state.plattedata} />
            <div className="col-10">
              <div className="Board1">
                <label className="col-sm-2 col-form-label">
                  Experiment Name:
                </label>
                <div className="col-sm-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={this.state.experimentname}
                    onChange={evt => this.onChangeExperimentNameInput(evt)}
                  />
                </div>
              </div>
              <div className="Board">
                {this.state.kanbandata.columnOrder.map(columnId => {
                  const column = this.state.kanbandata.columns[columnId];
                  const actions = column.actions;
                  return (
                    <Kanban
                      key={column.id}
                      column={column}
                      actions={actions}
                      columnid={columnId}
                      openCardModal={this.openCardModal}
                      removecard={this.removecardModalopen}
                    />
                  );
                })}
              </div>
              <div className="Board1">
                <button className="btn btn-warning" onClick={this.experiment}>
                  Create Experiment
                </button>
              </div>
            </div>
          </DragDropContext>
        </div>
        <Modal
          isOpen={this.state.CardModalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <h5>{this.state.cardstatus}</h5>
          <p>Command</p>
          <hr />
          {this.state.commanddata.map((commandrow, idx) => (
            <div key={idx} className="form-group row">
              <label className="col-sm-1 col-form-label">Name:</label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={commandrow.commandname}
                  onChange={evt => this.onChangeNameInput(evt, idx)}
                />
              </div>
              <label className="col-sm-1 col-form-label">Value:</label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Value"
                  value={commandrow.commandvalue}
                  onChange={evt => this.onChangeValueInput(evt, idx)}
                />
              </div>
              <div className="col-sm-2">
                <FaRegWindowMinimize
                  onClick={() => this.removecommandrow(idx)}
                ></FaRegWindowMinimize>
              </div>
            </div>
          ))}
          <div className="text-center">
            <FaPlus onClick={this.addcommandrow}></FaPlus>
          </div>
          <hr></hr>
          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => this.savecard(this.state.src)}
            >
              save
            </button>
            &nbsp;
            <button
              className="btn btn-primary"
              onClick={() => this.closeCardModal()}
            >
              close
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.delmodalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <h4>Delete</h4>
          <p>Do you want to delete your component?</p>
          <hr></hr>
          <button className="btn" onClick={() => this.delete()}>
            Ok
          </button>
          <button className="btn" onClick={() => this.closedelModal()}>
            Close
          </button>
        </Modal>
      </div>
    );
  }
}

export default Second;
