import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

class Platte extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  platte = () => {
    if (!this.props.plattedata) return;
    return this.props.plattedata.map((object, index) => {
      return (
        <Draggable key={object._id} draggableId={object._id} index={index}>
          {(provided, snapshot) => (
            <React.Fragment>
              <div
                className="platte"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                // style={provided.draggableProps.style}
              >
                {object.name}
              </div>
              {snapshot.isDragging && (
                <div className="platte1">{object.name}</div>
              )} 
            </React.Fragment>
          )}
        </Draggable>
      );
    });
  };
  render() {
    return (
      <Droppable droppableId="Item" isDropDisabled={true}>
        {provided => (
          <div className="sidenav col-2" ref={provided.innerRef}>
            {this.platte()}
          </div>
        )}
      </Droppable>
    );
  }
}
export default Platte;
