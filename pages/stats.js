import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler,
)

export async function getServerSideProps() {
  const [{ data: matches }, { data: training }] = await Promise.all([
    supabase.from('matches').select('*').order('date', { ascending: true }),
    supabase.from('training_sessions').select('*').order('date', { ascending: false }),
  ])

  return { props: { matches: matches || [], training: training || [] } }
}

const GOLD = '#C9A84C'
const GOLD_LIGHT = '#E8C96B'
const GOLD_PALE = 'rgba(201,168,76,0.15)'

export default function Stats({ matches, training }) {
  const totalGoals = matches.reduce((s, m) => s + (m.goals || 0), 0)
  const totalAssists = matches.reduce((s, m) => s + (m.assists || 0), 0)
  const totalKeyPasses = matches.reduce((s, m) => s + (m.key_passes || 0), 0)
  const wins = matches.filter(m => m.result === 'W').length
  const draws = matches.filter(m => m.result === 'D').length
  const losses = matches.filter(m => m.result === 'L').length
  const winRate = matches.length > 0 ? Math.round((wins / matches.length) * 100) : 0
  const avgRating = matches.filter(m => m.rating).length > 0
    ? (matches.reduce((s, m) => s + (m.rating || 0), 0) / matches.filter(m => m.rating).length).toFixed(1)
    : '—'
  const totalTrainingHours = Math.round(training.reduce((s, t) => s + (t.duration_minutes || 0), 0) / 60)
  const potm = matches.filter(m => m.player_of_match).length

  // Goals & assists per month
  const monthMap = {}
  matches.forEach(m => {
    const month = m.date.slice(0, 7)
    if (!monthMap[month]) monthMap[month] = { goals: 0, assists: 0 }
    monthMap[month].goals += m.goals || 0
    monthMap[month].assists += m.assists || 0
  })
  const months = Object.keys(monthMap).sort()
  const monthLabels = months.map(m => {
    const [y, mo] = m.split('-')
    return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(mo)-1]} ${y}`
  })

  const lineData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Goals',
        data: months.map(m => monthMap[m].goals),
        borderColor: GOLD,
        backgroundColor: GOLD_PALE,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: GOLD,
        pointRadius: 5,
      },
      {
        label: 'Assists',
        data: months.map(m => monthMap[m].assists),
        borderColor: '#E8E0D0',
        backgroundColor: 'rgba(232,224,208,0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#E8E0D0',
        pointRadius: 5,
      },
    ],
  }

  const doughnutData = {
    labels: ['Wins', 'Draws', 'Losses'],
    datasets: [{
      data: [wins, draws, losses],
      backgroundColor: [GOLD_LIGHT, '#E8E0D0', '#F8D7DA'],
      borderColor: ['#C9A84C', '#B0A898', '#E57373'],
      borderWidth: 1.5,
    }],
  }

  // Focus areas from training
  const focusMap = {}
  training.forEach(t => {
    if (!focusMap[t.focus_area]) focusMap[t.focus_area] = 0
    focusMap[t.focus_area] += t.duration_minutes || 0
  })
  const focusLabels = Object.keys(focusMap)
  const focusData = {
    labels: focusLabels,
    datasets: [{
      label: 'Minutes',
      data: focusLabels.map(f => focusMap[f]),
      backgroundColor: GOLD_PALE,
      borderColor: GOLD,
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 } } },
    },
  }

  const doughnutOptions = {
    responsive: true,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 12 }, padding: 16 } },
    },
  }

  return (
    <Layout title="Stats" description="Player statistics and performance analysis">
      <div style={{ padding: '3rem 1.5rem 2rem', borderBottom: '1px solid #E8E0D0', background: '#FAFAF8' }}>
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow">By the Numbers</p>
          <h1 className="section-title">Statistics</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto" style={{ padding: '2rem 1.5rem' }}>
        {/* Big stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: '3rem' }}>
          {[
            { value: matches.length, label: 'Matches Played' },
            { value: totalGoals, label: 'Total Goals' },
            { value: totalAssists, label: 'Total Assists' },
            { value: totalKeyPasses, label: 'Key Passes' },
            { value: `${winRate}%`, label: 'Win Rate' },
            { value: avgRating, label: 'Avg Rating' },
            { value: potm, label: 'Player of Match' },
            { value: `${totalTrainingHours}h`, label: 'Training Hours' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-number" style={{ fontSize: '2.2rem' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: '2rem' }}>
          {/* Goals & Assists Line */}
          <div style={{ background: 'white', border: '1px solid #E8E0D0', borderRadius: 12, padding: '1.5rem' }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#C9A84C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Monthly Performance</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>Goals & Assists</p>
            </div>
            {months.length > 0
              ? <Line data={lineData} options={{ ...chartOptions, plugins: { legend: { display: true, position: 'top' } } }} />
              : <EmptyChart />
            }
          </div>

          {/* W/D/L Doughnut */}
          <div style={{ background: 'white', border: '1px solid #E8E0D0', borderRadius: 12, padding: '1.5rem' }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#C9A84C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Results Breakdown</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>Win / Draw / Loss</p>
            </div>
            {matches.length > 0
              ? <Doughnut data={doughnutData} options={doughnutOptions} />
              : <EmptyChart />
            }
          </div>
        </div>

        {/* Training focus */}
        {focusLabels.length > 0 && (
          <div style={{ background: 'white', border: '1px solid #E8E0D0', borderRadius: 12, padding: '1.5rem' }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#C9A84C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Training Analysis</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>Focus Areas (Minutes)</p>
            </div>
            <Bar data={focusData} options={chartOptions} />
          </div>
        )}
      </div>
    </Layout>
  )
}

function EmptyChart() {
  return <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6B6B', fontSize: 13 }}>No data yet</div>
}
