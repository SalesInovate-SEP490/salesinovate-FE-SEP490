import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import { getListStage, getOpportunity, patchOpportunity } from '../../../services/opportunities';
import { ToastContainer, toast } from 'react-toastify';

interface Item {
  id: string;
  name: string;
  amount?: string;
  probability?: string;
  stageId?: number;
  opportunityId?: number;
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

const App: React.FC = () => {
  const [columns, setColumns] = useState<Columns>(initialColumns);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);
    const [removed] = sourceItems.splice(source.index, 1);
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
    item.stageId = parseInt(destination.droppableId);
    const body = {
      id: item.id.replace("item", ""),
      stage: item.stageId
    }
    patchOpportunity(body)
      .then(response => {
        console.log("Response: ", response);
        toast.success("Update successfully");
      })
      .catch(err => {
        console.log(err)
      })
  };

  useEffect(() => {
    getListStage()
      .then(response => {
        if (response.code === 1) {
          const data = response.data;
          // I want set columns object by item.id of this above
          // data.map((item: any) => {
          //   item.id = 'column' + item.id;
          //   item.title = item.stageName;
          //   item.items = [];
          //   return item;
          // })
          setColumns(data.reduce((acc: Columns, item: any) => {
            item.title = item.stageName;
            item.items = [];
            item.totalMoney = 0;
            acc[item.id] = item;
            return acc;
          }, {}));
          console.log(columns, "columns")
          getListKanbaOpp();
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, []);

  const getListKanbaOpp = () => {
    const param = {
      currentPage: 0,
      perPage: 10000
    }
    getOpportunity(param)
      .then(response => {
        console.log(response, "opp");
        setColumns(columns => {
          const newColumns = { ...columns };
          response.data.items.map((item: any, index: number) => {
            const newItem: Item = {
              id: "item" + item.opportunityId,
              opportunityId: item.opportunityId,
              name: item.opportunityName,
              amount: item?.amount ? item.amount : 0,
              probability: item.probability,
              stageId: item.stage.stageId
            }
            const columnId = item.stage.stageId;
            if (newColumns[columnId]) {
              if (!newColumns[columnId].items.find((i: Item) => i.id === newItem.id)) {
                newColumns[columnId].items.push(newItem);
                newColumns[columnId].totalMoney += parseInt(item?.amount ? item.amount : 0);
              }
            }
          })
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
                            {/* I want format clumn.totalMoney like money: 1.000 or 1.000.000 */}
                            <span>{column.items.length} Opportunity - {column.totalMoney.toLocaleString()}VNĐ</span>
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
                                        <Link to={`/opportunities-details/${item.opportunityId}`}>{item.name}</Link>
                                      </h6>
                                    </div>
                                  </div>
                                  <div className="kanban-card-body">
                                    <ul>
                                      <li>
                                        <i className="ti ti-report-money" />
                                        {item.amount}
                                      </li>
                                      <li>
                                        <i className="ti ti-mail" />
                                        {item.probability}
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

export default App;
