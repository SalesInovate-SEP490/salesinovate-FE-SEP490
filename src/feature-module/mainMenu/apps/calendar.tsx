/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Link } from "react-router-dom";
import { deleteEventById, getEventInCalendar, patchEvent } from "../../../services/event";
import { toast, ToastContainer } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import './calendar.scss'
import EventModal from "./EventModal";
import DeleteModal from "../../support/deleteModal";
import Swal from "sweetalert2";
import { data } from '../../../core/data/authen/role';
import { useTranslation } from "react-i18next";

interface Event {
  eventId: string;
  content: string;
  startTime: string;
  endTime: string;
}


const Calendar = () => {
  const
    [startDate, setStartDate] = useState<Date>(new Date()),
    [addneweventobj, setaddneweventobj] = useState(null),
    [isnewevent, setisnewevent] = useState(false),
    [weekendsVisible, setweekendsVisible] = useState(true),
    [selectedEvent, setSelectedEvent] = useState<any | null>(null),
    [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null),
    [isTooltipHovered, setIsTooltipHovered] = useState(false),
    [isEventHover, setIsEventHover] = useState(false),
    [openModal, setOpenModal] = useState(false),
    [openEditModal, setOpenEditModal] = useState(false),
    [id, setId] = useState<any>(0),
    [events, setEvent] = useState([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
    getListEvent();
  }, []);

  const getCurrentMonthRange = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      startOfMonth: startOfMonth.toISOString().replace("Z", ""),
      endOfMonth: endOfMonth.toISOString().replace("Z", ""),
    };
  };

  const getListEvent = (startDate?: any, endDate?: any) => {
    if (!startDate || !endDate) {
      const { startOfMonth, endOfMonth } = getCurrentMonthRange();
      startDate = startOfMonth;
      endDate = endOfMonth;
    }
    const params = {
      startTime: startDate,
      endTime: endDate
    }
    Swal.showLoading();
    getEventInCalendar(params)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          const events = response.data.map((item: any) => {
            return {
              id: item.eventId,
              title: item.content,
              start: item.startTime,
              end: item.endTime,
              className: "bg-success",
            };
          });
          setEvent(events);
        }
      })
      .catch(error => {
        Swal.close();
        console.log(error);
      });
  }

  const handleEventClick = (clickInfo: any) => {
    if (isEventHover) {
      setSelectedEvent(clickInfo.event);
      const rect = clickInfo.el.getBoundingClientRect();
      setTooltipPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    setisnewevent(true);
    setaddneweventobj(selectInfo);
  };

  const handleEventReceive = (eventDropInfo: any) => {
    // Handle event drop logic here
    const { event } = eventDropInfo;
    const range = event?._instance.range;
    const id = event?._def.publicId;
    // Extract the new start and end times from the event object
    const newStart = range.start;
    const newEnd = range.end;
    const body = {
      startTime: newStart,
      endTime: newEnd,
    }
    patchEvent(id, body)
      .then(response => {
        if (response.code === 1) {
          toast.success("Update event success");
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDateChange = (date: Date) => {
    setStartDate(date);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date); // Jump to the selected date
    }
  };


  const handleDatesSet = (info: any) => {
    const { start, end } = info;
    if (start === null || end === null)
      getListEvent(start.replace("Z", ""), end.replace("Z", ""));
  };

  const handleEditEvent = () => {
    // Open edit modal
    setOpenEditModal(true);
    setId(selectedEvent?._def.publicId);
    setSelectedEvent(null);
    setTooltipPosition(null);
  };

  const handleDeleteEvent = () => {
    setId(selectedEvent?._def.publicId);
    setSelectedEvent(null);
    setTooltipPosition(null);
  };

  const handleTooltipClose = () => {
    if (!isTooltipHovered) {
      setSelectedEvent(null);
      setTooltipPosition(null);
    }
  };

  const handleTooltipMouseEnter = () => {
    setIsTooltipHovered(true);
  };

  const handleTooltipMouseLeave = () => {
    setIsTooltipHovered(false);
    handleTooltipClose();
  };

  const closeTooltip = () => {
    setSelectedEvent(null);
    setTooltipPosition(null);
    setIsEventHover(false);
  }

  const removeEvent = () => {
    deleteEventById(selectedEvent?._def.publicId)
      .then(response => {
        if (response.code === 1) {
          toast.success("Delete event success");
          getListEvent();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row align-items-center w-100">
              <div className="col-lg-10 col-sm-12">
                <h3 className="page-title">{t("EVENT.EVENT")}</h3>
              </div>
              <div className="col-lg-2 col-sm-12">
                <Link
                  to="#"
                  className="btn custom-btn-blue-black add-btn-permission"
                  onClick={() => setOpenModal(true)}
                >
                  Create Event
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <h4 className="card-title">Select Date</h4>
              <ReactDatePicker
                selected={startDate}
                onChange={handleDateChange}
                inline
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
              />
            </div>
            <div className="col-lg-9 col-md-8">
              <div className="card bg-white">
                <div className="card-body">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={weekendsVisible}
                    events={events} // alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                    eventMouseEnter={() => setIsEventHover(true)}
                    eventClick={handleEventClick}
                    eventMouseLeave={handleTooltipClose}
                    eventDrop={handleEventReceive} // Handle event drop
                    datesSet={handleDatesSet}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedEvent && tooltipPosition && (
        <div
          className="event-tooltip"
          style={{
            top: tooltipPosition.top + 20, // Add some offset for positioning
            left: tooltipPosition.left,
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div className="tooltip-header">
            <h5>{selectedEvent.title}</h5>
            <button className="close-button" onClick={closeTooltip}>
              &times;
            </button>
          </div>
          <div className="tooltip-body">
            <p>
              Start: {selectedEvent.start?.toLocaleString()} <br />
              End: {selectedEvent.end?.toLocaleString()}
            </p>
            <div className="space-between">
              <Link to={`/event-details/${selectedEvent?._def?.publicId}`} className="link">
                More Details
              </Link>
              <div>
                <button className="btn custom-btn-blue-black" onClick={handleEditEvent}>
                  Edit
                </button>
                <Link className="btn custom-btn-blue-black"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-event"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
      <ToastContainer />
      <EventModal closeModal={() => { setOpenModal(false) }} isOpen={openModal} getList={getListEvent} />
      <EventModal closeModal={() => { setOpenEditModal(false) }} isOpen={openEditModal} getList={getListEvent} isEdit={true} id={id} />
      <DeleteModal closeBtn="close-btn-de" deleteId={"delete-event"} handleDelete={removeEvent} />
    </>
  );
};

export default Calendar;
