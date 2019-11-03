import React, { Component } from "react";
import { FaEye } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

class TableRow extends Component {
  constructor() {
    // super(props);
    super();
    this.state = {};
  }
  openModal = () => {
    this.setState({modalIsOpen:true});
  }
  render() {
    return (
        <tr>
          <td>{this.props.obj.name}.json</td>
          <td>
            <FaEye className="cursor" onClick={() => this.props.openModal()} />
          </td>
          <td>
            <FaPen
              className="cursor"
              onClick={() => this.props.openEditModal()}
            />
            /
            <FaTrashAlt className="cursor" onClick={() => this.props.openDelModal()} />
          </td>
        </tr>
    );
  }
}

export default TableRow;
