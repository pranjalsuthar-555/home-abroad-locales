export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const TOKEN   = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appcs0bWtVB0OBrnb';
  const TABLE   = 'tblJnyFGU3HBSgBNn';

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
        return res.status(500).json({ error: 'Airtable fetch failed', detail: err });
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

    console.log(`Fetched ${allRecords.length} destinations`);
    return res.status(200).json({ destinations: allRecords });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
