import React from "react";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface DragAndDropListProps {
  transfersOrder: { [orbit: string]: number };
  deleteFromCart: (orbitName?: string) => (() => void) | undefined;
  onDragEnd: (result: any) => void;
}

const CartTable: React.FC<DragAndDropListProps> = ({
  transfersOrder,
  deleteFromCart,
  onDragEnd,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="transfersOrder">
        {(provided) => (
          <ListGroup style={{ width: "500px" }} ref={provided.innerRef} {...provided.droppableProps}>
            {Object.entries(transfersOrder).map(([orbitName], index) => (
              <Draggable key={orbitName} draggableId={orbitName} index={index}>
                {(provided) => (
                  <ListGroupItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {orbitName}
                    <span className="delete-button">
                      <Button variant="danger" onClick={deleteFromCart(orbitName)}>
                        Удалить
                      </Button>

                    </span>
                  </ListGroupItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ListGroup>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CartTable;
