import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { getLeads, getListStatus, patchLead } from '../../../services/lead';

interface Item {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  statusId?: number;
  leadId?: number;
  company?: string;
}

interface Column {
  id: string;
  title: string;
  totalMoney: number;
  items: Item[];
}

interface Columns {
  [key: string]: Column;
}

const initialColumns: Columns = {
};

const LeadsKanban = () => {
  const [columns, setColumns] = useState<Columns>(initialColumns);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);
    const [removed] = sourceItems.splice(source.index, 1);
    console.log(source, destination, removed, source.droppableId, destination.droppableId, "test")
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    }
    // I need change stageId of item
    const item = removed;
    item.statusId = parseInt(destination.droppableId);
    const body = {
      id: item.id.replace("item", ""),
      leadStatusId: item.statusId
    }
    patchLead(body, body.id)
      .then(response => {
        console.log("Response: ", response);
        toast.success("Update successfully");
      })
      .catch(err => {
        console.log(err)
      })
  };


  useEffect(() => {
    getListStatus()
      .then(response => {
        if (response.code === 1) {
          const data = response.data;
          setColumns(data.reduce((acc: Columns, item: any) => {
            item.title = item.leadStatusName;
            item.items = [];
            acc[item.leadStatusId] = item;
            return acc;
          }, {}));
          console.log(columns, "columns")
          getListLeads();
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, []);

  const getListLeads = () => {
    getLeads(0, 10000)
      .then(response => {
        setColumns(columns => {
          const newColumns = { ...columns };
          response.data.items.map((item: any, index: number) => {
            const newItem: Item = {
              id: "item" + item.leadId,
              leadId: item.leadId,
              name: item.firstName + " " + item.lastName,
              address: item?.address,
              phone: item?.phone,
              company: item?.company
            }
            const columnId = item?.status?.leadStatusId;
            if (newColumns[columnId]) {
              // check new Item existed in new Columns
              if (!newColumns[columnId].items.find((i: Item) => i.id === newItem.id)) {
                newColumns[columnId].items.push(newItem);
              }
            }
          })
          console.log(newColumns);
          return newColumns;
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-wrapper leads-kanban-wrapper">
              {Object.entries(columns).map(([columnId, column]) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided) => (
                    <div
                      className="kanban-list-items"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div className="kanban-list-head">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className={`kanban-title-head dot-${columnId === 'contacted' ? 'warning' : 'purple'}`}>
                            <h5>{column.title}</h5>
                            <span>{column.items.length} Leads </span>
                          </div>
                          <div className="kanban-action-btns d-flex align-items-center">
                            <Link to="#" className="plus-btn add-popup">
                              <i className="ti ti-plus" />
                            </Link>
                            <div className="dropdown table-action">
                              <Link
                                to="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fa fa-ellipsis-v" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item edit-popup" to="#">
                                  <i className="fa-solid fa-pencil text-blue" /> Edit
                                </Link>
                                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_deal">
                                  <i className="fa-regular fa-trash-can text-danger" /> Delete
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ul className="kanban-drag-wrap">
                        {column.items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging ? 'lightgreen' : 'white',
                                }}
                              >
                                <div className="kanban-card">
                                  <div className="kanban-card-head">
                                    <span className={`bar-design bg-${columnId === 'contacted' ? 'warning' : 'purple'}`} />
                                    <div className="kanban-card-title">
                                      <h6>
                                        <Link to={`/leads-details/${item?.leadId}`}>{item.name}</Link>
                                      </h6>
                                    </div>
                                  </div>
                                  <div className="kanban-card-body">
                                    <ul>
                                      <li>
                                        {item.address}
                                      </li>
                                      <li>
                                        {item.company}
                                      </li>
                                      <li>
                                        <i className="ti ti-phone" />
                                        {item.phone}
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeadsKanban;
