import { getAdminClient } from '../../../lib/supabaseServer'
import { isAdminAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  const supabase = getAdminClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .order('date', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    if (!isAdminAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })

    const { date, duration_minutes, focus_area, intensity, drills, notes, season } = req.body

    if (!date || !duration_minutes || !focus_area) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase.from('training_sessions').insert([{
      date, duration_minutes: Number(duration_minutes),
      focus_area, intensity, drills, notes, season,
    }]).select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  if (req.method === 'PUT') {
    if (!isAdminAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { id, ...fields } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { data, error } = await supabase.from('training_sessions').update({
      ...fields, duration_minutes: Number(fields.duration_minutes),
    }).eq('id', id).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  if (req.method === 'DELETE') {
    if (!isAdminAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await supabase.from('training_sessions').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
