import { destinations, regions, tags } from '../models/philippines_data';

export const getAllDestinations = (req, res) => {
  let { region, tags: queryTags, page = 1, per_page = 5, sort = 'popularity' } = req.query;
  let p = parseInt(page) || 1;
  let pp = parseInt(per_page) || 5;

  let results = [...destinations];

  if (region) {
    const regionQuery = region.toLowerCase().replace(/\s/g, '');
    results = results.filter(d => 
      d.region.toLowerCase().replace(/\s/g, '') === regionQuery || 
      d.region.toLowerCase().includes(region.toLowerCase())
    );
  }

  if (queryTags) {
    const filterTags = queryTags.split(',').map(t => t.trim().toLowerCase());
    results = results.filter(d => 
      filterTags.some(tag => d.tags.map(t => t.toLowerCase()).includes(tag))
    );
  }

  if (sort === 'name') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    results.sort((a, b) => b.popularity - a.popularity);
  }

  const total = results.length;
  const totalPages = Math.ceil(total / pp);
  const start = (p - 1) * pp;
  const paginatedResults = results.slice(start, start + pp);

  res.json({
    data: paginatedResults,
    pagination: {
      total,
      page: p,
      per_page: pp,
      total_pages: totalPages,
    }
  });
};

export const getDestinationById = (req, res) => {
  const id = parseInt(req.params.id);
  const destination = destinations.find(d => d.id === id);
  if (!destination) {
    return res.status(404).json({ message: "Destination not found" });
  }
  res.json(destination);
};

export const getAllRegions = (req, res) => {
  res.json(regions);
};

export const getAllTags = (req, res) => {
  res.json(tags);
};

export const getRecommendations = (req, res) => {
  const { region, city, duration = '1day', interests, max_destinations = 3 } = req.query;
  const max = parseInt(max_destinations) || 3;
  const days = parseInt(duration) || 1;

  let filtered = [...destinations];

  if (region) {
    filtered = filtered.filter(d => d.region.toLowerCase().includes(region.toLowerCase()));
  }

  if (interests) {
    const interestList = interests.split(',').map(t => t.trim().toLowerCase());
    filtered = filtered.filter(d => 
      interestList.some(tag => d.tags.map(t => t.toLowerCase()).includes(tag))
    );
  }

  filtered.sort((a, b) => b.popularity - a.popularity);
  const selected = filtered.slice(0, max);

  const itinerary: any[] = [];
  for (let i = 1; i <= days; i++) {
    const dayDest = selected[(i - 1) % selected.length];
    if (!dayDest) break;

    itinerary.push({
      day: i,
      activities: [
        { time: "09:00 AM", activity: "Arrival and Breakfast", location: dayDest.city },
        { time: "10:30 AM", activity: "Explore " + dayDest.name, location: dayDest.name },
        { time: "12:30 PM", activity: "Lunch at Local Eatery", location: dayDest.city },
        { time: "02:00 PM", activity: dayDest.activities[0] || "Sightseeing", location: dayDest.name },
        { time: "05:00 PM", activity: "Sunset Viewing", location: dayDest.city },
      ]
    });
  }

  res.json({
    itinerary,
    destinations: selected,
    totalCostEstimate: (1500 * days) + " - " + (3000 * days) + " PHP",
    matchScore: selected.length > 0 ? 95 : 60,
  });
};
