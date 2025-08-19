"use client"

import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth, startOfWeek, endOfWeek } from "date-fns"
import { Calendar, Smile, Meh, Frown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "./card"
import { useEffect, useState } from "react"
import apiHandler, {IJournalEntry} from "@/src/data/api/apiHandler"

const MoodCalendar = () => {
  const [journalEntries, setJournalEntries] = useState<IJournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const entries = await apiHandler.journalEntries.list()
        setJournalEntries(entries)
      } catch (error) {
        console.error("Failed to fetch journal entries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJournalEntries()
  }, [])

  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

 const getMoodsForDate = (date: Date) => {
  const entries = journalEntries.filter(entry =>
    isSameDay(new Date(entry.timestamp), date)
  )

  if (entries.length === 0) return []

  return entries.map(e => {
    if (e.feelingScore >= 7) return "happy"
    if (e.feelingScore >= 4) return "okay"
    return "sad"
  })
}

  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-sage-900 flex items-center">
            <Calendar className="w-5 h-5 text-sage-600 mr-2" />
            Mood Calendar
          </CardTitle>
          <p className="text-sm text-sage-500">{format(currentDate, 'MMMM yyyy')}</p>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
        </CardContent>
      </Card>
    )
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-sage-500 py-1">
              {day}
            </div>
          ))}

          {daysInMonth.map((day) => {
           const moods = getMoodsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
             <div
  key={day.toISOString()}
  className={`aspect-square p-1 ${isCurrentMonth ? '' : 'text-sage-300'}`}
>
  <div
    className={`h-full rounded-lg flex flex-col items-center justify-start relative group transition hover:bg-sage-100 ${
      moods.length > 0 ? 'bg-sage-50' : ''
    }`}
  >
    {/* Date */}
    <span
      className={`text-xs mt-1 font-bold ${
        isCurrentMonth ? 'text-sage-800' : 'text-sage-300'
      }`}
    >
      {format(day, 'd')}
    </span>

    {/* Mood Icons */}
    {moods.length > 0 && (
      <div className="mt-1 flex flex-col justify-center items-center gap-1 max-w-[32px]">
        {moods.map((mood, idx) => (
          <div key={idx} className="flex-shrink-0">
            {mood === "happy" && <Smile className="w-4 h-4 text-green-600 font-bold" />}
            {mood === "okay" && <Meh className="w-4 h-4 text-yellow-600 font-bold" />}
            {mood === "sad" && <Frown className="w-4 h-4 text-red-600 font-bold" />}
          </div>
        ))}
      </div>
    )}

    {/* Tooltip with entry info */}
    {journalEntries
      .filter(entry => isSameDay(new Date(entry.timestamp), day))
      .map((entry, idx) => (
        <div
          key={idx}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                     hidden group-hover:block bg-sage-900 text-white 
                     text-xs rounded-lg px-2 py-1 shadow-md w-40 z-10"
        >
          <p className="font-semibold">Entry</p>
          <p className="truncate">{entry.content || "No content"}</p>
        </div>
      ))}
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