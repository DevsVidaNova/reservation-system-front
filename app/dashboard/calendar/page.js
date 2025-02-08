'use client';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction" 
import resourceTimelinePlugin from '@fullcalendar/resource-timeline' // a plugin!

export default function Calendar() {

    const handleDateClick = (arg) => {
        alert(arg.dateStr)
      }
    return (
        <FullCalendar
            plugins={[resourceTimelinePlugin]}
            initialView="dayGridMonth"
            weekends={false}
            dateClick={handleDateClick}
            events={[
                { title: 'event 1', date: '2019-04-01' },
                { title: 'event 2', date: '2019-04-02' }
            ]}
            schedulerLicenseKey="XXX" 
        />
    )
}