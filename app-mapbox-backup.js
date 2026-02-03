// =============================================================================
// COMMUNITY MAP – Coventry City Centre (40+ Establishments)
// =============================================================================

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiamluZ2xlYmFsc2giLCJhIjoiY21sMDVkdGkzMDl1NDNmcXVhaGV6cHpreSJ9.pzbGBwyH9MwjMngHktokAw';

// Coventry city centre: actual coordinates
const COVENTRY_CENTRE = { lat: 52.4081, lng: -1.5101 };

// -----------------------------------------------------------------------------
// 40+ ESTABLISHMENTS IN COVENTRY CITY CENTRE CORE
// -----------------------------------------------------------------------------
const SAMPLE_PLACES = [
  // === RESTAURANTS (Cathedral Lanes & Broadgate) ===
  { name: 'Wagamama', category: 'restaurant', lng: -1.5101, lat: 52.4079, communityRatings: [], googleRating: 4.5, googleReviewCount: 1243, description: 'Asian cuisine chain offering Japanese noodles, rice dishes, and fresh salads in a modern setting.' },
  { name: 'Turtle Bay', category: 'restaurant', lng: -1.5102, lat: 52.4080, communityRatings: [], googleRating: 4.3, googleReviewCount: 856, description: 'Caribbean restaurant and bar serving jerk dishes, curries, and tropical cocktails.' },
  { name: 'Cosy Club', category: 'restaurant', lng: -1.5100, lat: 52.4081, communityRatings: [], googleRating: 4.1, googleReviewCount: 920, description: 'All-day dining in a stylish setting with classic British and international dishes.' },
  { name: 'Las Iguanas', category: 'restaurant', lng: -1.5104, lat: 52.4079, communityRatings: [], googleRating: 4.2, googleReviewCount: 543, description: 'Latin American chain restaurant offering tapas, fajitas, and cocktails in vibrant surroundings.' },
  { name: 'Bistrot Pierre', category: 'restaurant', lng: -1.5098, lat: 52.4082, communityRatings: [], googleRating: 4.4, googleReviewCount: 467, description: 'French bistro serving classic dishes like moules marinière and steak frites.' },
  { name: 'The Botanist', category: 'restaurant', lng: -1.5103, lat: 52.4078, communityRatings: [], googleRating: 4.2, googleReviewCount: 734, description: 'Botanical-themed bar and restaurant with hanging gardens, cocktails, and British menu.' },
  { name: 'Zizzi', category: 'restaurant', lng: -1.5099, lat: 52.4077, communityRatings: [], googleRating: 4.0, googleReviewCount: 612, description: 'Italian chain restaurant serving pizza, pasta, and traditional mains in contemporary settings.' },
  { name: 'Five Guys', category: 'restaurant', lng: -1.5095, lat: 52.4083, communityRatings: [], googleRating: 4.3, googleReviewCount: 891, description: 'Fast-food chain offering customizable burgers, hot dogs, and fries with unlimited toppings.' },
  { name: "Nando's", category: 'restaurant', lng: -1.5085, lat: 52.4095, communityRatings: [], googleRating: 4.2, googleReviewCount: 1124, description: 'Afro-Portuguese chain restaurant specializing in flame-grilled peri-peri chicken.' },
  { name: 'Greggs', category: 'restaurant', lng: -1.5093, lat: 52.4085, communityRatings: [], googleRating: 3.8, googleReviewCount: 234, description: 'Bakery chain offering fresh sandwiches, sausage rolls, cakes, and hot drinks.' },
  { name: 'Subway', category: 'restaurant', lng: -1.5115, lat: 52.4086, communityRatings: [], googleRating: 3.7, googleReviewCount: 189, description: 'Casual counter-serve chain for customizable sandwiches and salads with health-conscious options.' },
  { name: 'KFC', category: 'restaurant', lng: -1.5118, lat: 52.4090, communityRatings: [], googleRating: 3.6, googleReviewCount: 456, description: 'Fast-food chain known for fried chicken buckets, combo meals, and sides.' },
  { name: 'Turmeric Gold', category: 'restaurant', lng: -1.5183, lat: 52.4084, communityRatings: [], googleRating: 4.7, googleReviewCount: 543, description: 'Award-winning Indian restaurant offering authentic curries, tandoori dishes, and fine dining experience.' },
  { name: 'Blue Bistro', category: 'restaurant', lng: -1.5172, lat: 52.4083, communityRatings: [], googleRating: 4.6, googleReviewCount: 289, description: 'Contemporary bistro serving modern European cuisine with seasonal ingredients.' },
  { name: 'Jinseon Korean BBQ', category: 'restaurant', lng: -1.5082, lat: 52.4076, communityRatings: [], googleRating: 4.6, googleReviewCount: 412, description: 'Korean BBQ restaurant offering tabletop grilling, bibimbap, and authentic Korean dishes.' },
  { name: 'Playwrights', category: 'restaurant', lng: -1.5068, lat: 52.4075, communityRatings: [], googleRating: 4.4, googleReviewCount: 367, description: 'Modern pub and restaurant serving British classics, craft beers, and Sunday roasts.' },

  // === CAFES ===
  { name: 'Starbucks Broadgate', category: 'cafe', lng: -1.5092, lat: 52.4084, communityRatings: [], googleRating: 3.9, googleReviewCount: 412, description: 'Coffeehouse chain offering signature roasts, light bites, and WiFi availability.' },
  { name: 'Caffè Nero', category: 'cafe', lng: -1.5125, lat: 52.4078, communityRatings: [], googleRating: 4.1, googleReviewCount: 245, description: 'Italian-inspired coffee shop serving espresso drinks, pastries, and paninis.' },
  { name: 'Costa Coffee Market Way', category: 'cafe', lng: -1.5110, lat: 52.4072, communityRatings: [], googleRating: 3.8, googleReviewCount: 310, description: 'British coffee chain offering hot and cold drinks, sandwiches, and cakes.' },
  { name: 'Costa Coffee Cathedral Lanes', category: 'cafe', lng: -1.5100, lat: 52.4076, communityRatings: [], googleRating: 4.0, googleReviewCount: 280, description: 'Coffee shop chain serving a variety of coffee blends, snacks, and seasonal specials.' },
  { name: 'Esquires Coffee', category: 'cafe', lng: -1.5135, lat: 52.4088, communityRatings: [], googleRating: 4.3, googleReviewCount: 189, description: 'Fair-trade coffee house offering organic beans, breakfast items, and comfortable seating.' },
  { name: 'Rising Café', category: 'cafe', lng: -1.5075, lat: 52.4085, communityRatings: [], googleRating: 4.8, googleReviewCount: 567, description: 'Independent café known for specialty coffee, homemade cakes, and friendly atmosphere.' },
  { name: 'Pret A Manger', category: 'cafe', lng: -1.5088, lat: 52.4082, communityRatings: [], googleRating: 4.2, googleReviewCount: 390, description: 'Health-focused chain offering fresh sandwiches, salads, coffee, and organic options.' },

  // === SHOPS (Major Retailers & Shopping Centres) ===
  { name: 'West Orchards Shopping Centre', category: 'shop', lng: -1.5119, lat: 52.4089, communityRatings: [], googleRating: 4.0, googleReviewCount: 4500, description: 'Modern shopping centre featuring high-street brands, dining options, and entertainment.' },
  { name: 'Lower Precinct Shopping', category: 'shop', lng: -1.5132, lat: 52.4082, communityRatings: [], googleRating: 4.1, googleReviewCount: 3200, description: 'Shopping area with diverse retail stores, food court, and convenient city centre location.' },
  { name: 'Primark', category: 'shop', lng: -1.5098, lat: 52.4085, communityRatings: [], googleRating: 4.2, googleReviewCount: 5600, description: 'Budget-friendly fashion retailer offering clothing, accessories, and homeware for all ages.' },
  { name: 'Marks & Spencer', category: 'shop', lng: -1.5105, lat: 52.4087, communityRatings: [], googleRating: 4.3, googleReviewCount: 1200, description: 'British department store offering quality clothing, home products, and food hall.' },
  { name: 'H&M', category: 'shop', lng: -1.5128, lat: 52.4080, communityRatings: [], googleRating: 4.1, googleReviewCount: 890, description: 'Fashion retailer offering trendy clothing and accessories for men, women, and children.' },
  { name: 'New Look', category: 'shop', lng: -1.5130, lat: 52.4081, communityRatings: [], googleRating: 3.9, googleReviewCount: 520, description: 'High-street fashion chain selling on-trend clothing, shoes, and accessories.' },
  { name: 'River Island', category: 'shop', lng: -1.5126, lat: 52.4083, communityRatings: [], googleRating: 4.2, googleReviewCount: 670, description: 'Fashion brand offering contemporary clothing, footwear, and accessories.' },
  { name: 'JD Sports', category: 'shop', lng: -1.5122, lat: 52.4084, communityRatings: [], googleRating: 3.9, googleReviewCount: 450, description: 'Sports fashion retailer stocking trainers, sportswear, and accessories from top brands.' },
  { name: 'Waterstones', category: 'shop', lng: -1.5130, lat: 52.4083, communityRatings: [], googleRating: 4.6, googleReviewCount: 670, description: 'Bookshop chain offering wide selection of books, stationery, and reading events.' },
  { name: 'Lush', category: 'shop', lng: -1.5126, lat: 52.4081, communityRatings: [], googleRating: 4.7, googleReviewCount: 340, description: 'Cosmetics retailer selling handmade, cruelty-free bath products and skincare.' },
  { name: 'Superdrug', category: 'shop', lng: -1.5120, lat: 52.4079, communityRatings: [], googleRating: 4.0, googleReviewCount: 380, description: 'Health and beauty retailer offering cosmetics, toiletries, and pharmacy services.' },
  { name: 'Boots', category: 'shop', lng: -1.5108, lat: 52.4084, communityRatings: [], googleRating: 4.1, googleReviewCount: 720, description: 'Pharmacy and beauty retailer providing healthcare products, prescriptions, and optician services.' },
  { name: 'The Works', category: 'shop', lng: -1.5124, lat: 52.4082, communityRatings: [], googleRating: 4.3, googleReviewCount: 210, description: 'Discount retailer selling books, stationery, arts and crafts, and gifts.' },
  { name: 'Pandora', category: 'shop', lng: -1.5127, lat: 52.4080, communityRatings: [], googleRating: 4.5, googleReviewCount: 290, description: 'Jewelry store specializing in customizable charm bracelets, rings, and accessories.' },
  { name: 'Clarks', category: 'shop', lng: -1.5123, lat: 52.4081, communityRatings: [], googleRating: 4.2, googleReviewCount: 340, description: 'Footwear retailer offering comfortable shoes, boots, and sandals for the whole family.' },

  // === ENTERTAINMENT ===
  { name: 'Belgrade Theatre', category: 'entertainment', lng: -1.5135, lat: 52.4095, communityRatings: [], googleRating: 4.5, googleReviewCount: 1540, description: 'Historic theatre presenting plays, musicals, comedy shows, and community performances.' },
  { name: 'Odeon Cinema', category: 'entertainment', lng: -1.5165, lat: 52.4075, communityRatings: [], googleRating: 4.2, googleReviewCount: 2300, description: 'Modern cinema complex showing latest blockbusters and films in multiple screens.' },
  { name: 'Planet Ice', category: 'entertainment', lng: -1.5170, lat: 52.4070, communityRatings: [], googleRating: 4.1, googleReviewCount: 1800, description: 'Ice skating rink offering public sessions, lessons, and disco nights for all ages.' },
  { name: 'The Empire', category: 'entertainment', lng: -1.5015, lat: 52.4098, communityRatings: [], googleRating: 4.4, googleReviewCount: 950, description: 'Live music venue and nightclub hosting concerts, club nights, and special events.' },
  { name: 'Grosvenor Casino', category: 'entertainment', lng: -1.5160, lat: 52.4078, communityRatings: [], googleRating: 4.0, googleReviewCount: 740, description: 'Casino offering gaming tables, slot machines, restaurant, and bar facilities.' },
  { name: 'Flipout Trampoline Park', category: 'entertainment', lng: -1.5140, lat: 52.4077, communityRatings: [], googleRating: 4.3, googleReviewCount: 890, description: 'Indoor trampoline park with dodgeball, foam pits, and fitness classes for all ages.' },

  // === TOURIST SPOTS ===
  { name: 'Coventry Cathedral', category: 'tourist', lng: -1.5071, lat: 52.4083, communityRatings: [], googleRating: 4.7, googleReviewCount: 8900, description: 'Iconic modernist cathedral built beside ruins of medieval church, symbolizing peace and reconciliation.' },
  { name: 'Coventry Transport Museum', category: 'tourist', lng: -1.5098, lat: 52.4110, communityRatings: [], googleRating: 4.6, googleReviewCount: 6200, description: "Free museum showcasing world's largest collection of British road transport and city's motoring heritage." },
  { name: 'Herbert Art Gallery', category: 'tourist', lng: -1.5065, lat: 52.4080, communityRatings: [], googleRating: 4.5, googleReviewCount: 2300, description: 'Free museum and art gallery featuring local history, fine art collections, and temporary exhibitions.' },
  { name: "St Mary's Guildhall", category: 'tourist', lng: -1.5075, lat: 52.4080, communityRatings: [], googleRating: 4.6, googleReviewCount: 850, description: 'Medieval guildhall with stunning tapestries, stained glass, and rich history dating to 14th century.' },
  { name: 'Lady Godiva Statue', category: 'tourist', lng: -1.5093, lat: 52.4083, communityRatings: [], googleRating: 4.4, googleReviewCount: 1500, description: 'Bronze statue commemorating legendary noblewoman who rode naked through Coventry streets.' },
  { name: 'Historic Spon Street', category: 'tourist', lng: -1.5180, lat: 52.4084, communityRatings: [], googleRating: 4.5, googleReviewCount: 1100, description: 'Medieval street lined with timber-framed buildings, now home to shops, cafes, and pubs.' },
  { name: 'Holy Trinity Church', category: 'tourist', lng: -1.5085, lat: 52.4088, communityRatings: [], googleRating: 4.6, googleReviewCount: 450, description: 'Historic parish church with impressive spire, beautiful architecture, and city centre heritage.' }
];

// -----------------------------------------------------------------------------
// LOGIC HELPERS
// -----------------------------------------------------------------------------
function getWeightedAverageRating(place) {
  const community = place.communityRatings || [];
  const sumCommunity = community.reduce((acc, r) => acc + r, 0);
  const google = place.googleRating;
  
  // Dynamic Google weight - linear decay from 5 to 1 over 10 votes
  // Formula: googleWeight = max(1, 5 - communityVoteCount * 0.4)
  // At 0 votes: 5, at 10 votes: 1, stays at 1 after that
  const communityVoteCount = community.length;
  const googleWeight = Math.max(1, 5 - communityVoteCount * 0.4);
  
  const totalWeight = communityVoteCount + googleWeight;
  const weightedSum = sumCommunity + google * googleWeight;
  return weightedSum / totalWeight;
}

function getEffectiveVoteCount(place) {
  const communityCount = (place.communityRatings || []).length;
  // Scale down large Google review counts for better visual balance
  const googleContrib = Math.sqrt(place.googleReviewCount || 0) * 0.5;
  return communityCount + googleContrib;
}

function placesToGeoJSON(places) {
  // First pass: calculate all color ratings
  const colorRatings = places.map((place) => {
    const community = place.communityRatings || [];
    const communityVoteCount = community.length;
    const hasCommunityVotes = communityVoteCount > 0;
    
    let colorRating;
    if (hasCommunityVotes) {
      const communityAvg = community.reduce((acc, r) => acc + r, 0) / community.length;
      const googleRating = place.googleRating;
      const normalizedGoogle = (googleRating - 3.0) * 2.0 + 1.0;
      const googleWeight = Math.max(1, 5 - communityVoteCount * 0.4);
      const communityWeight = communityVoteCount;
      const totalWeight = googleWeight + communityWeight;
      colorRating = (normalizedGoogle * googleWeight + communityAvg * communityWeight) / totalWeight;
    } else {
      const googleRating = place.googleRating;
      colorRating = (googleRating - 3.0) * 2.0 + 1.0;
    }
    return colorRating;
  });
  
  // Calculate variance to determine if we need to stretch the scale
  const minRating = Math.min(...colorRatings);
  const maxRating = Math.max(...colorRatings);
  const range = maxRating - minRating;
  
  // If variance is low (range < 1.5), stretch the values for better visual distinction
  const needsStretching = range < 1.5 && range > 0;
  
  return {
    type: 'FeatureCollection',
    features: places.map((place, index) => {
      let colorRating = colorRatings[index];
      
      // Apply stretching if needed to increase visual variance
      if (needsStretching) {
        // Map the tight range to a wider 1-5 range
        colorRating = 1 + ((colorRating - minRating) / range) * 4;
      }
      
      return {
        type: 'Feature',
        id: index,
        geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
        properties: {
          name: place.name,
          category: place.category,
          description: place.description,
          averageRating: Math.round(getWeightedAverageRating(place) * 100) / 100,
          effectiveVoteCount: Math.round(getEffectiveVoteCount(place) * 100) / 100,
          colorRating: Math.round(colorRating * 100) / 100
        }
      };
    })
  };
}

// -----------------------------------------------------------------------------
// MAP INITIALIZATION
// -----------------------------------------------------------------------------
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [COVENTRY_CENTRE.lng, COVENTRY_CENTRE.lat],
  zoom: 15.5, // Zoomed in closer to see the tight city centre
  maxBounds: [
    [COVENTRY_CENTRE.lng - 0.05, COVENTRY_CENTRE.lat - 0.03],
    [COVENTRY_CENTRE.lng + 0.05, COVENTRY_CENTRE.lat + 0.03]
  ]
});

map.on('load', () => {
  map.addSource('places', {
    type: 'geojson',
    data: placesToGeoJSON(SAMPLE_PLACES)
  });

  map.addLayer({
    id: 'place-bubbles',
    type: 'circle',
    source: 'places',
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['get', 'effectiveVoteCount'],
        0, 8,
        10, 15,
        25, 25,
        50, 40
      ],
      'circle-color': [
        'interpolate', ['linear'], ['get', 'colorRating'],
        1.0, '#ffeb3b',  // Yellow (lowest)
        2.0, '#ffc107',  // Amber
        3.0, '#ff9800',  // Orange
        4.0, '#f44336',  // Red
        5.0, '#b71c1c'   // Dark red (highest)
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff',
      'circle-opacity': 0.6
    }
  });

  // Tooltip on hover
  const popup = new mapboxgl.Popup({ closeButton: false, className: 'place-tooltip' });
  map.on('mousemove', 'place-bubbles', (e) => {
    const feat = e.features[0];
    popup.setLngLat(feat.geometry.coordinates).setHTML(`<strong>${feat.properties.name}</strong>`).addTo(map);
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'place-bubbles', () => {
    popup.remove();
    map.getCanvas().style.cursor = '';
  });

  // Vote popup on click
  const votePopup = new mapboxgl.Popup({ closeButton: true, className: 'vote-popup' });
  map.on('click', 'place-bubbles', (e) => {
    const feat = e.features[0];
    const placeIndex = feat.id;
    popup.remove();
    votePopup.setLngLat(feat.geometry.coordinates).setHTML(`
      <div class="vote-panel">
        <h3>${feat.properties.name}</h3>
        <p class="place-description">${feat.properties.description}</p>
        <label>add to the flame:<br><input type="range" min="1" max="5" step="0.01" value="3" class="vote-slider"></label>
        <button class="vote-submit" data-idx="${placeIndex}">Add Vote</button>
      </div>
    `).addTo(map);
  });

  // Handle vote submission
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('vote-submit')) {
      const idx = e.target.dataset.idx;
      const slider = e.target.parentElement.querySelector('.vote-slider');
      SAMPLE_PLACES[idx].communityRatings.push(parseFloat(slider.value));
      map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
      votePopup.remove();
    }
  });

  // ---------------------------------------------------------------------------
  // FILTER LOGIC
  // ---------------------------------------------------------------------------
  const checkboxes = document.querySelectorAll('.category-filter');
  
  function updateFilters() {
    const activeCategories = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    map.setFilter('place-bubbles', ['in', ['get', 'category'], ['literal', activeCategories]]);
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateFilters));
  updateFilters();
});

// -----------------------------------------------------------------------------
// SIDEBAR UI LOGIC
// -----------------------------------------------------------------------------
const sidebar = document.getElementById('filter-sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? 'Filter ▶' : '◀ Filter';
});
