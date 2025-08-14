'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from './card'
type MoodType = 'happy' | 'okay' | 'sad'

type MoodEntry = {
  day: string
  mood: MoodType
}

const moodMap: Record<MoodType, { value: number; label: string; color: string }> = {
  happy: { value: 3, label: '😊', color: '#4ade80' },
  okay: { value: 2, label: '😐', color: '#facc15' },
  sad: { value: 1, label: '😢', color: '#f87171' },
}

const moodData: MoodEntry[] = [
  { day: '1', mood: 'happy' },
  { day: '2', mood: 'okay' },
  { day: '3', mood: 'sad' },
  { day: '4', mood: 'happy' },
  { day: '5', mood: 'okay' },
  { day: '6', mood: 'happy' },
  { day: '7', mood: 'sad' },
]

const chartData = moodData.map(entry => ({
  ...entry,
  value: moodMap[entry.mood].value,
  label: moodMap[entry.mood].label,
  color: moodMap[entry.mood].color,
}))

export const MoodGraph = () => {
  return (
    <Card className="shadow-sm border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-sage-900 text-lg">Mood Graph</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="day" stroke="#94a3a3" />
            <YAxis allowDecimals={false} domain={[0, 3]} tick={false} />
            <Tooltip
              content={({ payload }) => {
                const item = payload?.[0]?.payload
                if (!item) return null

                return (
                  <div className="px-3 py-2 bg-white border border-sage-200 rounded shadow text-sm">
                    <div className="font-medium text-sage-800">Day {item.day}</div>
                    <div className="text-xl">{item.label}</div>
                  </div>
                )
              }}
            />
            <Legend />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
export default MoodGraph