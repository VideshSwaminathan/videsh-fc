import { getAdminClient } from '../../../lib/supabaseServer'
import { isAdminAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  const supabase = getAdminClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    if (!isAdminAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const {
      date, opponent, competition, venue,
      our_score, opponent_score, result,
      goals, assists, key_passes, rating,
      minutes_played, player_of_match, notes, season,
    } = req.body

    if (!date || !opponent || !result) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase.from('matches').insert([{
      date, opponent, competition, venue,
      our_score: Number(our_score) || 0,
      opponent_score: Number(opponent_score) || 0,
      result,
      goals: Number(goals) || 0,
      assists: Number(assists) || 0,
      key_passes: Number(key_passes) || 0,
      rating: rating ? Number(rating) : null,
      minutes_played: Number(minutes_played) || 90,
      player_of_match: Boolean(player_of_match),
      notes, season,
    }]).select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  return res.status(405).end()
}
