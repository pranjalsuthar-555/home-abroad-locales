export async function onRequestGet({ env }) {
  const TOKEN   = env.AIRTABLE_TOKEN;
  const BASE_ID = 'appcs0bWtVB0OBrnb';
  const TABLE   = 'tblJnyFGU3HBSgBNn';

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Cache-Control': 's-maxage=300',
  };

  let allRecords = [];
  let offset     = null;

  try {
    do {
      const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?pageSize=100${offset ? `&offset=${offset}` : ''}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Airtable error:', err);
        return new Response(JSON.stringify({ error: 'Airtable fetch failed', detail: err }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const data = await response.json();

      const mapped = data.records
        .map(r => {
          const f = r.fields;
          if (!f['Destination']) return null;
          return {
            id:               r.id,
            destination:      f['Destination'] || '',
            country:          f['Country']     || '',
            region:           f['Region']      || '',
            lat:              f['Latitude']    != null ? parseFloat(f['Latitude'])  : null,
            lng:              f['Longitude']   != null ? parseFloat(f['Longitude']) : null,
            personalities:    (f['Destination Personality']              || []),
            languages:        (f['Language(s)']                          || []),
            religions:        (f['Religion(s)']                          || []),
            advantages:       (f['Advantages']                           || []),
            disadvantages:    (f['Disadvantages']                        || []),
            imageUrl:         f['Picture']?.[0]?.url                         || null,
            tourismWebsite:   f['Official Tourism Website']?.value            || null,
            costUSD:          f['Average Cost of Living for Family (USD)']    ?? null,
            suitabilityScore: f['Expat Suitability Score']                    ?? null,
            countryTrend:     f['Country Trend']                              || null,
            writers: (f['Substack Name (from Local Writers)'] || []).map((name, i) => ({
              name,
              link: (f['Link (from Local Writers)'] || [])[i] || null,
            })),
            lastUpdated: f['Date Last Updated'] || null,
          };
        })
        .filter(Boolean);

      allRecords = allRecords.concat(mapped);
      offset     = data.offset || null;

    } while (offset);

    return new Response(JSON.stringify({ destinations: allRecords }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
