import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fadeIn } from '../../animations';

const CalendarView = ({ events, onEventClick }) => {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(currentView);
    }
  }, [currentView]);

  const handleEventClick = (info) => {
    if (onEventClick) {
      onEventClick(info.event);
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="flex items-center gap-1 p-1 text-xs">
        <span className="font-medium">{eventInfo.event.title}</span>
        {eventInfo.event.extendedProps.status && (
          <span
            className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
              eventInfo.event.extendedProps.status === 'upcoming'
                ? 'bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : eventInfo.event.extendedProps.status === 'completed'
                ? 'bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {eventInfo.event.extendedProps.status}
          </span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      variants={fadeIn('up')}
      initial="hidden"
      animate="show"
      className="glass rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Calendar View
        </h3>
        <div className="flex gap-2">
          {['dayGridMonth', 'timeGridWeek', 'timeGridDay'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                currentView === view
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {view === 'dayGridMonth'
                ? 'Month'
                : view === 'timeGridWeek'
                ? 'Week'
                : 'Day'}
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          height="auto"
          dayMaxEvents={3}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
          }}
          eventDisplay="block"
          views={{
            dayGridMonth: {
              titleFormat: { year: 'numeric', month: 'long' },
            },
            timeGridWeek: {
              titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
            },
            timeGridDay: {
              titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
            },
          }}
          buttonText={{
            today: 'Today',
          }}
          themeSystem="standard"
        />
      </div>

      <style jsx>{`
        .calendar-container :global(.fc) {
          font-family: inherit;
        }
        .calendar-container :global(.fc .fc-toolbar-title) {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        .dark .calendar-container :global(.fc .fc-toolbar-title) {
          color: #ffffff;
        }
        .calendar-container :global(.fc .fc-col-header-cell-cushion) {
          font-weight: 500;
          padding: 0.5rem;
          color: #4b5563;
        }
        .dark .calendar-container :global(.fc .fc-col-header-cell-cushion) {
          color: #9ca3af;
        }
        .calendar-container :global(.fc .fc-daygrid-day-number) {
          color: #1a1a1a;
        }
        .dark .calendar-container :global(.fc .fc-daygrid-day-number) {
          color: #ffffff;
        }
        .calendar-container :global(.fc .fc-daygrid-day) {
          background: transparent;
        }
        .calendar-container :global(.fc .fc-daygrid-day-frame) {
          min-height: 80px;
        }
        .calendar-container :global(.fc .fc-daygrid-day-events) {
          min-height: 20px;
        }
        .calendar-container :global(.fc .fc-daygrid-event) {
          border: none;
          border-radius: 6px;
          padding: 2px 6px;
          margin-bottom: 2px;
          cursor: pointer;
        }
        .calendar-container :global(.fc .fc-event-title) {
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .calendar-container :global(.fc .fc-daygrid-day.fc-day-today) {
          background: rgba(59, 130, 246, 0.05);
        }
        .dark .calendar-container :global(.fc .fc-daygrid-day.fc-day-today) {
          background: rgba(59, 130, 246, 0.1);
        }
        .calendar-container :global(.fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number) {
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .calendar-container :global(.fc .fc-popover) {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .dark .calendar-container :global(.fc .fc-popover) {
          background: #1f2937;
          border-color: #374151;
        }
        .calendar-container :global(.fc .fc-popover-header) {
          padding: 0.5rem 1rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .dark .calendar-container :global(.fc .fc-popover-header) {
          background: #111827;
          border-color: #374151;
        }
        .calendar-container :global(.fc .fc-popover-close) {
          color: #4b5563;
        }
        .dark .calendar-container :global(.fc .fc-popover-close) {
          color: #9ca3af;
        }
        .calendar-container :global(.fc .fc-dayGridMonth-view .fc-daygrid-body) {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .dark .calendar-container :global(.fc .fc-dayGridMonth-view .fc-daygrid-body) {
          border-color: #374151;
        }
      `}</style>
    </motion.div>
  );
};

export default CalendarView;