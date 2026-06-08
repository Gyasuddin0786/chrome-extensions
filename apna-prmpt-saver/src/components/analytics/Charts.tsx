import React from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { Stats } from '../../types'
import { MODEL_COLORS } from '../../utils'

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#22c55e', '#f97316', '#eab308', '#06b6d4']

// Reads CSS variables so tooltip matches current theme
function getTooltipStyle() {
  const style = getComputedStyle(document.documentElement)
  return {
    backgroundColor: style.getPropertyValue('--tooltip-bg').trim() || '#1e293b',
    border: `1px solid ${style.getPropertyValue('--tooltip-border').trim() || 'rgba(255,255,255,0.15)'}`,
    borderRadius: '8px',
    color: style.getPropertyValue('--tooltip-text').trim() || '#f1f5f9',
    fontSize: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  }
}

function getAxisTickColor() {
  const style = getComputedStyle(document.documentElement)
  return style.getPropertyValue('--chart-text').trim() || 'rgba(255,255,255,0.5)'
}

interface AnalyticsChartsProps {
  stats: Stats
}

export function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }))
  const modelData = Object.entries(stats.byModel).map(([name, value]) => ({
    name, value, color: MODEL_COLORS[name] ?? '#6366f1',
  }))

  const tooltipStyle = getTooltipStyle()
  const axisColor = getAxisTickColor()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bar chart — by category */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
          Prompts by Category
        </h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryData} barSize={16}>
              <XAxis
                dataKey="name"
                tick={{ fill: axisColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: 'rgba(99,102,241,0.08)' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No data yet
          </div>
        )}
      </div>

      {/* Pie chart — by model */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
          Prompts by Model
        </h3>
        {modelData.length > 0 ? (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={160}>
              <PieChart>
                <Pie
                  data={modelData}
                  cx="50%" cy="50%"
                  innerRadius={38} outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {modelData.map((entry, i) => (
                    <Cell key={i} fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              {modelData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color ?? CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {d.name}:{' '}
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No data yet
          </div>
        )}
      </div>
    </div>
  )
}

export function StatCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Total Prompts', value: stats.total,      color: '#6366f1' },
    { label: 'Favorites',     value: stats.favorites,  color: '#eab308' },
    { label: 'Archived',      value: stats.archived,   color: '#6b7280' },
    { label: 'Total Uses',    value: stats.totalUsage, color: '#22c55e' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(card => (
        <div
          key={card.label}
          className="rounded-xl p-4"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{card.label}</div>
        </div>
      ))}
    </div>
  )
}
