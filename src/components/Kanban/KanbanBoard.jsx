import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';

const priorityClassMap = {
  4: 'urgent',
  3: 'high',
  2: 'medium',
  1: 'low',
  0: 'none',
};

const KanbanBoard = ({ groupBy }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }


  const groupedTickets = data.tickets.reduce((acc, ticket) => {
    const key = ticket[groupBy];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(ticket);
    return acc;
  }, {});


  Object.keys(groupedTickets).forEach(key => {
    groupedTickets[key].sort((a, b) => b.priority - a.priority);
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = groupedTickets[source.droppableId];
    const destColumn = groupedTickets[destination.droppableId];
    const [movedTicket] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, movedTicket);

    setData({
      ...data,
      tickets: data.tickets.map((ticket) =>
        ticket.id === movedTicket.id ? movedTicket : ticket
      ),
    });
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          {Object.keys(groupedTickets).map((key) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{key}</h2>
                  {groupedTickets[key].map((ticket, index) => (
                    <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                      {(provided) => (
                        <div
                          className="ticket"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="ticket-header">
                            <span className="ticket-id">{ticket.id}</span>
                            <span className={`ticket-priority ${priorityClassMap[ticket.priority]}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <div className="ticket-content">
                            <h3 className="ticket-title">
                              {ticket.title}
                            </h3>
                            <p className="ticket-tag">Tag: {ticket.tag.join(', ')}</p>
                            <p className="ticket-user">
                              User: {data.users.find(user => user.id === ticket.userId)?.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
