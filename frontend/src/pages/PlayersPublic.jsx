import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import api from '../api/axios'

const rColor = { batsman:'success', bowler:'danger', 'all-rounder':'primary', 'wicket-keeper':'warning' }

export default function PlayersPublic() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teams').then(async r => {
      const ts = r.data
      const withPlayers = await Promise.all(ts.map(async t => {
        const p = await api.get(`/teams/${t.id}/players`)
        return { ...t, players: p.data }
      }))
      setTeams(withPlayers)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">👥 Players</h2>
        <p className="page-sub">All registered players by team</p>
      </div>
      {loading ? <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--green)' }} /></div>
        : teams.length === 0 ? <div className="empty"><span className="empty-icon">👥</span>No players yet.</div>
        : teams.filter(t => t.players?.length > 0).map(t => (
          <div className="cc mb-3 anim-fade-up" key={t.id}>
            <div className="cc-head">🛡️ {t.name} {t.captain_name && <span style={{ color: 'var(--gold)', fontSize: '.8rem', marginLeft: '.5rem' }}>· 👑 {t.captain_name}</span>}</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table ct mb-0">
                <thead><tr><th>#</th><th>Name</th><th>Role</th><th>Captain</th></tr></thead>
                <tbody>
                  {t.players.map((p, i) => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--dim)' }}>{i + 1}</td>
                      <td><strong>{p.name}</strong></td>
                      <td><span className={`badge bg-${rColor[p.player_role]||'secondary'}`}>{p.player_role}</span></td>
                      <td>{p.is_captain ? '👑 Yes' : <span style={{ color: 'var(--dim)' }}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      }
    </>
  )
}
