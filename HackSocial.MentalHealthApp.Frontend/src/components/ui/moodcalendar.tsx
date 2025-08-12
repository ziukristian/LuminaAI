"use client"

import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth, startOfWeek, endOfWeek } from "date-fns"
import { Calendar, Smile, Meh, Frown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "./card"

const MoodCalendar = () => {
  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const loggedDays = [
    { date: new Date(2025, 7, 1), mood: "happy" },
    { date: new Date(2025, 7, 3), mood: "okay" },
    { date: new Date(2025, 7, 5), mood: "sad" },
    { date: new Date(2025, 7, 8), mood: "happy" },
    { date: new Date(2025, 7, 12), mood: "okay" },
    { date: new Date(2025, 7, 15), mood: "happy" },
    { date: new Date(2025, 7, 20), mood: "sad" },
    { date: new Date(2025, 7, 25), mood: "happy" },
    { date: new Date(2025, 7, 28), mood: "okay" },
  ]

  const getMoodForDate = (date: Date) => {
    return loggedDays.find(day => isSameDay(day.date, date))?.mood
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-sage-900 flex items-center">
          <Calendar className="w-5 h-5 text-sage-600 mr-2" />
          Mood Calendar
        </CardTitle>
        <p className="text-sm text-sage-500">{format(currentDate, 'MMMM yyyy')}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-sage-500 py-1">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {daysInMonth.map((day) => {
            const mood = getMoodForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
              <div
                key={day.toISOString()}
                className={`aspect-square p-1 ${isCurrentMonth ? '' : 'text-sage-300'}`}
              >
                <div
                  className={`h-full rounded-lg flex flex-col items-center justify-start ${mood ? 'bg-sage-50' : ''}`}
                >
                  <span className={`text-xs mt-1 ${isCurrentMonth ? 'text-sage-700' : 'text-sage-300'}`}>
                    {format(day, 'd')}
                  </span>
                  {mood && (
                    <div className="mt-1">
                      {mood === "happy" && <Smile className="w-4 h-4 text-green-500" />}
                      {mood === "okay" && <Meh className="w-4 h-4 text-yellow-500" />}
                      {mood === "sad" && <Frown className="w-4 h-4 text-red-500" />}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default MoodCalendar
