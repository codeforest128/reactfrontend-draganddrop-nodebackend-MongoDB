import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import Modal from "react-modal";
import ReactJson from "react-json-view";

import TableRow from "./first/TableRow";
import Navside from "./Navside";

const customStyles = {
  content: {
    top: "50%",
    left: "20%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      editModalIsOpen: false,
      delmodalIsOpen: false,
      src: undefined,
      selectedFile: null,
      tabledata: []
    };
  }
  componentDidMount() {
    this.refresh();
  }

  onChangeHandler = event => {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = event => {
      var json = JSON.parse(event.target.result);
      console.log("json:", json);
      this.setState({
        selectedFile: json
      });
      // reader.readAsText(file);
    };
    reader.readAsText(file);

    // console.log(this.validateSize(event));
    // if (this.validateSize(event)) {
    //   console.log(file);
    //   // if return true allow to setState
    //   this.setState({
    //     selectedFile: file
    //   });
    // }
  };
  fileUploadHandler = () => {
    if (this.state.selectedFile == null) {
      let err = "please pick up json file";
      alert(err);
    }
    // const data = new FormData();
    // console.log("file: ", this.state.selectedFile);
    // data.append("file", this.state.selectedFile);
    else {
      console.log(this.state.selectedFile);
      var data = this.state.selectedFile;
      axios
        .post("http://localhost:8080/upload", data)
        .then(res => {
          // then print response status
          alert("upload success");
          this.setState({ selectedFile: null });
          this.componentDidMount();
        })
        .catch(err => {
          // then print response status
          alert("upload fail");
        });
    }
  };
  validateSize = event => {
    let file = event.target.files[0];
    let size = 30000;
    let err = "";
    console.log(file.size);
    if (file.size > size) {
      err = file.type + "is too large, please pick a smaller file\n";
      alert(err);
    }
    return true;
  };

  refresh = () => {
    fetch("http://localhost:8080/getdata")
      .then(response => response.json())
      .then(data => {
        this.setState({ tabledata: data });
      });
  };
  tabRow = () => {
    return this.state.tabledata.map((object, i) => {
      return (
        <TableRow
          obj={object}
          key={i}
          openModal={src => this.openModal(object)}
          openEditModal={src => this.openEditModal(object)}
          openDelModal={src => this.openDelModal(object)}
          refresh={() => {
            this.refresh();
          }}
        />
      );
    });
  };
  openModal = src => {
    this.setState({ src: src, modalIsOpen: true });
  };

  openEditModal = src => {
    this.setState({ src: src, editModalIsOpen: true });
  };
  
  openDelModal = src => {
    this.setState({ src:src, delmodalIsOpen: true});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };
  closeEdtiModal = () => {
    this.setState({ editModalIsOpen: false });
  };
  closedelModal = () => {
    this.setState({ delmodalIsOpen: false});
  }
  saveEdtiModal = () => {
    console.log(this.state.src);
    var updatedata = this.state.src;
    axios
      .post("http://localhost:8080/tablerow/updatedata", updatedata)
      .then(res => {
        // then print response status
        alert("update data successfully");
        this.setState({ editModalIsOpen: false });
        this.refresh();
      })
      .catch(err => {
        // then print response status
        toast.error("update fail");
      });
  };
  delete = () => {
    var delid = this.state.src._id;
    axios
      .get("http://localhost:8080/tablerow/delete/" + delid)
      .then(res => {
        this.setState({ delmodalIsOpen: false });
        this.refresh();
      })
      .catch(err => console.log(err));
  };
  onEdit = edit => {
    console.log("origin json: ", edit.updated_src);
    this.setState({ src: edit.updated_src });
  };

  onDelete = e => {
    this.setState({ src: e.updated_src });
  };


  render() {
    return (
      <div className="container h-100 inside">
        <Navside />
        <div className="upload">
          <ToastContainer />
          <form method="post" action="#" id="#">
            <div className="form-group files">
              <h3>Upload Your File </h3>
              <input
                type="file"
                name="file"
                accept=".json"
                className="form-control"
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="pull-right">
              <button
                width="100%"
                type="button"
                className="btn btn-info btn-block"
                onClick={this.fileUploadHandler}
              >
                Upload File
              </button>
            </div>
          </form>
        </div>
        <br></br>
        <br></br>

        <div className="table">
          <h3>Files Grid</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>File Name</th>
                <th>View File</th>
                <th>Delete/Edit</th>
              </tr>
            </thead>
            <tbody>{this.tabRow()}</tbody>
          </table>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <h2>View</h2>
          <ReactJson src={this.state.src} />
          <button className="btn" onClick={this.closeModal}>close</button>
        </Modal>
        <Modal
          isOpen={this.state.editModalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={() => this.closeEdtiModal()}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <h2>Edit</h2>
          <ReactJson
            src={this.state.src}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
          />
          <button className="btn" onClick={() => this.saveEdtiModal()}>save</button>
          <button className="btn" onClick={() => this.closeEdtiModal()}>close</button>
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
          <p>Do you want to delete your json file?</p>
          <hr></hr>
          <button className="btn" onClick={() => this.delete()}>Ok</button>
          <button className="btn" onClick={() => this.closedelModal()}>Close</button>
        </Modal>
      </div>
    );
  }
}
export default App;
