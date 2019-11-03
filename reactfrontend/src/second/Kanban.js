import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
class Kanban extends React.Component {
  removecard = () => {
    console.log("ddd");
  };
  render() {
    return (
      <div className="Column">
        <div className="Column_title">{this.props.column.title}</div>
        <Droppable
          key={this.props.column.id}
          droppableId={this.props.column.id}
        >
          {(provided, snapshot) => (
            <div className="Column_body" ref={provided.innerRef}>
              {this.props.actions.map((card, index) => (
                <Draggable key={card._id} draggableId={card._id} index={index}>
                  {(provided, snapshot) => (
                    <div>
                      <div
                        className="Card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="row">
                          <div
                            className="col-sm-8"
                            onClick={() =>
                              this.props.openCardModal(
                                card._id,
                                this.props.columnid,
                                card.name
                              )
                            }
                          >
                            {card.name}
                          </div>
                          <span
                            className="close float-right remove"
                            onClick={() => this.props.removecard(card._id)}
                          >
                            x
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}
export default Kanban;
