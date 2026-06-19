import { useState, useEffect } from 'react';
import './CricketNews.css';

const RAPIDAPI_KEY = '4ad5bf9131msh9a3a750ea82eae3p11c45ejsn0114ae8c9833';

// Real recent scores as fallback news items (from live data, May 2026)
const DEMO_NEWS = [
  { id: 1, hLine: 'CSK beat MI by 8 wickets in IPL 2026', intro: 'Chennai Super Kings chased down 155 with 8 wickets in hand. CSK 159/2 vs MI 155/7.', time: '1d ago' },
  { id: 2, hLine: 'Mumbai Indians edge RCB in IPL thriller', intro: 'MI chased 229 with 6 wickets to spare in a high-scoring IPL encounter.', time: '2d ago' },
  { id: 3, hLine: 'Pakistan Women thrash Zimbabwe by 168 runs', intro: 'Pakistan posted 330/5 then bowled Zimbabwe out for 162 in the ODI series.', time: '2d ago' },
  { id: 4, hLine: 'Nepal beat Singapore by 81 runs in WC League Two', intro: 'Nepal posted 256 all out and dismissed Singapore for 175 in Kuala Lumpur.', time: '2d ago' },
  { id: 5, hLine: 'Glamorgan Women win by 106 runs in One-Day Cup', intro: 'Glamorgan posted 238/8 then bowled out opposition for 132 in the women\'s cup.', time: '2d ago' },
  { id: 6, hLine: 'The Blaze claim 5-wicket win in Women\'s One-Day Cup', intro: 'The Blaze chased down 164 with 5 wickets to spare in a competitive match.', time: '2d ago' },
  { id: 7, hLine: 'Mis-E-Ainak Knights win thriller in T20 National Cup', intro: 'Knights sealed a 1-wicket win in a nail-biting finish in the Afghan T20 National Cup.', time: '2d ago' },
  { id: 8, hLine: 'Malaysia beat Indonesia in T20 series opener', intro: 'Malaysia chased down target with 5 wickets in hand in the T20 series.', time: '1d ago' },
];

function relativeTime(pubTime) {
  if (!pubTime) return '';
  const m = Math.floor((Date.now() - Number(pubTime)) / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
}

async function safeFetch(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
      },
    });
    const text = await res.text();
    if (!text || text.trim() === '') return { ok: false, error: `Empty response (HTTP ${res.status})` };
    const json = JSON.parse(text);
    if (json.message) return { ok: false, error: `API: ${json.message}` };
    return { ok: true, json };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export default function CricketNews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => { fetchNews(); }, []);

  async function fetchNews() {
    setLoading(true);
    setApiError(null);

    // /news/v1/index returns the freshest headlines on Cricbuzz
    const result = await safeFetch(
      'https://cricbuzz-cricket.p.rapidapi.com/news/v1/index'
    );

    if (result.ok) {
      /*
        Response: { storyList: [ { story: { storyId, hLine, intro, pubTime } }, { ad }, ... ] }
      */
      const list = (result.json.storyList || [])
        .filter(i => i.story)
        .map(i => ({
          id: i.story.storyId,
          hLine: i.story.hline || 'Cricket Update',
          intro: i.story.intro || '',
          time: relativeTime(i.story.pubTime),
        }))
        .slice(0, 12);

      if (list.length) {
        setItems(list);
      } else {
        setApiError('No stories found — showing recent results');
      }
    } else {
      setApiError(`${result.error} — showing recent results`);
    }

    setLoading(false);
  }

  const display = items.length ? items : DEMO_NEWS;

  return (
    <div className="cn-wrap">

      {/* Toolbar */}
      <div className="cn-toolbar">
        <span className="cn-count">{display.length} stories</span>
        <button className="cn-refresh" onClick={fetchNews} disabled={loading}>
          <span className={loading ? 'cn-spin' : ''}>↻</span>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Error */}
      {apiError && (
        <div className="cn-error" role="alert">
          ⚠️ {apiError}
        </div>
      )}

      {/* List */}
      <ul className="cn-list">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="cn-skeleton" aria-hidden="true">
              <div className="cn-sk-line cn-sk-line--wide" />
              <div className="cn-sk-line" />
            </li>
          ))
          : display.map((item, idx) => (
            <li key={item.id || idx} className="cn-item">
              <div className="cn-item-inner">
                <span className="cn-index">{String(idx + 1).padStart(2, '0')}</span>
                <div className="cn-content">
                  <p className="cn-headline">{item.hLine}</p>
                  {item.intro && <p className="cn-intro">{item.intro}</p>}
                  {item.time && <span className="cn-time">{item.time}</span>}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}