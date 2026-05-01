import { getAdminClient } from '../../../lib/supabaseServer'
import { isAdminAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  const supabase = getAdminClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .order('date', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    if (!isAdminAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })

    const { title, description, type, url, thumbnail_url, date, featured } = req.body

    if (!title || !url || !date) return res.status(400).json({ error: 'Missing required fields' })

    const { data, error } = await supabase.from('highlights').insert([{
      title, description, type: type || 'video', url, thumbnail_url, date, featured: Boolean(featured),
    }]).select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  if (req.method === 'PUT') {
    if (!isAdminAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { id, ...fields } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { data, error } = await supabase.from('highlights').update({ ...fields, featured: Boolean(fields.featured) }).eq('id', id).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  if (req.method === 'DELETE') {
    if (!isAdminAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await supabase.from('highlights').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
