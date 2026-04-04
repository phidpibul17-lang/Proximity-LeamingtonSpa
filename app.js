// =============================================================================
// COMMUNITY MAP – Leamington Spa Bars & Pubs
// =============================================================================

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiamluZ2xlYmFsc2giLCJhIjoiY21sNm1yY2U3MDJkMDNmcjBneG5hN2RzbSJ9.S5GEGRibVdFnLfdzZIusHw';

// Leamington Spa centre: 52.2919, -1.5358
const COVENTRY_CENTRE = { lat: 52.2919, lng: -1.5358 };

// Track which place (by index) is highlighted from sidebar tab interaction
let highlightedPlaceIndex = null;

// =============================================================================
// FIREBASE CONFIGURATION & INITIALIZATION
// =============================================================================
// Rating System:
// - User ratings are stored in Firebase Firestore in real-time
// - Each place has a collection of reviews under 'ratings/{placeName}/reviews'
// - Ratings are continuously updated from both Google and Firebase
// - The displayed rating combines Google reviews (weighted) + Firebase reviews
// - Real-time listeners update the map when anyone submits a new rating
// =============================================================================

const firebaseConfig = {
  apiKey: "AIzaSyDFpSkI3YoYE03HUL9Ki_R-o8AsYULekhM",
  authDomain: "proximity-leamingtonspa.firebaseapp.com",
  projectId: "proximity-leamingtonspa",
  storageBucket: "proximity-leamingtonspa.firebasestorage.app",
  messagingSenderId: "342370019248",
  appId: "1:342370019248:web:b73019ec57da5b2c4c9875"
};

// Initialize Firebase
let db;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  console.log('%c🔥 Firebase Initialized!', 'color: #ff9800; font-weight: bold; font-size: 14px;');
  console.log('📊 Connected to Firestore database');
  console.log('🔄 Real-time rating updates enabled');
  console.log('💾 All ratings will be saved to cloud and synced across users');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.warn('⚠️ Falling back to local storage only');
}

// -----------------------------------------------------------------------------
// BARS & PUBS IN LEAMINGTON SPA
// Categories: bar (modern bars/cocktails), pub (traditional pubs), quick_munch (food spots)
// Click on map to see coordinates in browser console for adjusting locations
// -----------------------------------------------------------------------------
let SAMPLE_PLACES = [
  // === PUBS (12) ===
  { name: 'The Fat Pug', category: 'pub', lng: -1.5483250968291211, lat: 52.292353365642995, communityRatings: [], googleRating: 4.5, googleReviewCount: 1200, description: 'Neighbourhood pub & kitchen serving craft beers and seasonal British food in a relaxed, dog-friendly setting.' },
  { name: 'The Star & Garter', category: 'pub', lng: -1.5419863867000403, lat: 52.29171471496728, communityRatings: [], googleRating: 4.3, googleReviewCount: 1456, description: 'Charming gastropub offering fresh seasonal food, quality drinks, and a warm atmosphere.' },
  { name: 'The Woodland Tavern', category: 'pub', lng: -1.5417834586726358, lat: 52.29030367225721, communityRatings: [], googleRating: 4.4, googleReviewCount: 890, description: 'Traditional British pub in the heart of Leamington Spa with real ale, cider, and cocktails.' },
  { name: 'Fizzy Moon Brewhouse & Grill', category: 'pub', lng: -1.5378148579285407, lat: 52.29028365050496, communityRatings: [], googleRating: 4.6, googleReviewCount: 2100, description: 'Award-winning craft brewery & grill with over 147 gins, microbrewery, and board games. Best Bar in Warwickshire 2018-2023.' },
  { name: 'The White Horse', category: 'pub', lng: -1.5380624571070052, lat: 52.293472963201815, communityRatings: [], googleRating: 4.4, googleReviewCount: 734, description: 'Historic pub dating back to the 1830s with courtyard beer garden, cask ales, and hearty British fare.' },
  { name: 'Copper Pot', category: 'pub', lng: -1.537273160042559, lat: 52.29198660532184, communityRatings: [], googleRating: 4.1, googleReviewCount: 677, description: 'Quaint local pub serving traditional pub food with global influences, and an extensive gin & whiskey collection.' },
  { name: 'The Benjamin Satchwell - JD Wetherspoon', category: 'pub', lng: -1.5355806474284965, lat: 52.2897581971137, communityRatings: [], googleRating: 4.1, googleReviewCount: 2345, description: 'JD Wetherspoon pub offering great value food and drink with up to 6 rotating guest ales.' },
  { name: 'The Cricketers', category: 'pub', lng: -1.5413251786332782, lat: 52.28746759003736, communityRatings: [], googleRating: 4.2, googleReviewCount: 560, description: 'Traditional sports pub showing live matches with a friendly atmosphere and classic pub menu.' },
  { name: 'The Royal Pug', category: 'pub', lng: -1.5325717850002718, lat: 52.29064916684562, communityRatings: [], googleRating: 4.3, googleReviewCount: 820, description: 'Sister venue to The Fat Pug, offering craft beers, artisan pizzas, and a welcoming community vibe.' },
  { name: 'The Somerville Arms', category: 'pub', lng: -1.5256116072833938, lat: 52.29356825508984, communityRatings: [], googleRating: 4.0, googleReviewCount: 450, description: 'Cosy neighbourhood pub with real ales, live music nights, and home-cooked traditional food.' },
  { name: 'Newbold Comyn Arms', category: 'pub', lng: -1.5176443757122406, lat: 52.29128375016172, communityRatings: [], googleRating: 4.4, googleReviewCount: 980, description: 'Country pub near Newbold Comyn park with large beer garden, family-friendly menu, and real ales.' },
  { name: 'The Micro Pug', category: 'pub', lng: -1.5313353459181338, lat: 52.282321824519315, communityRatings: [], googleRating: 4.5, googleReviewCount: 650, description: 'Intimate micropub specializing in craft beers, ciders, and continental lagers with a rotating selection.' },
  
  // === BARS (9) ===
  { name: 'The Boiler Room', category: 'bar', lng: -1.5335054731671336, lat: 52.28642522734864, communityRatings: [], googleRating: 4.7, googleReviewCount: 890, description: 'Independent ale, craft beer, wine and spirits bar with industrial-themed decor and artisan pizzas.' },
  { name: 'Nomad', category: 'bar', lng: -1.5379807464325717, lat: 52.29173042689143, communityRatings: [], googleRating: 4.2, googleReviewCount: 420, description: 'Eclectic cocktail bar with global influences, creative drinks, and a vibrant nightlife atmosphere.' },
  { name: 'HART + CO', category: 'bar', lng: -1.537597391406729, lat: 52.28932207687761, communityRatings: [], googleRating: 4.5, googleReviewCount: 1100, description: 'Quirky cocktail and dining venue with creative drinks, craft beers, and all-day breakfast & brunch.' },
  { name: 'Bedford Street Bar', category: 'bar', lng: -1.5368837660452808, lat: 52.29142834652886, communityRatings: [], googleRating: 4.6, googleReviewCount: 780, description: 'Jazz eatery and live music venue with cocktails, garden terrace, and live performances 5 days a week.' },
  { name: 'Wildes Bar & Cocktails', category: 'bar', lng: -1.5357718663290163, lat: 52.293227721200026, communityRatings: [], googleRating: 4.3, googleReviewCount: 540, description: 'Sophisticated cocktail bar specializing in craft cocktails, premium spirits, and intimate atmosphere.' },
  { name: 'The House', category: 'bar', lng: -1.5354953001787677, lat: 52.28920269548885, communityRatings: [], googleRating: 4.1, googleReviewCount: 380, description: 'Modern bar with DJ nights, extensive drinks menu, and stylish interior perfect for weekend nights out.' },
  { name: 'Grace & Vine', category: 'bar', lng: -1.5349349431810593, lat: 52.29324634036733, communityRatings: [], googleRating: 4.4, googleReviewCount: 620, description: 'Wine bar and bistro offering carefully curated wines, small plates, and elegant setting.' },
  { name: 'The Clarendon', category: 'bar', lng: -1.5330505189875396, lat: 52.293648883578804, communityRatings: [], googleRating: 4.1, googleReviewCount: 312, description: 'Traditional bar with modern touches, craft beers, cocktails, and regular events.' },
  { name: "Kelsey's Live", category: 'bar', lng: -1.533351367166442, lat: 52.28419598357414, communityRatings: [], googleRating: 4.2, googleReviewCount: 678, description: 'Live music venue and bar featuring local bands, tribute acts, and a full American-style grill menu.' },
  
  // === QUICK MUNCH (19) ===
  { name: 'Tesco Express', category: 'quick_munch', lng: -1.5364780557056392, lat: 52.29265857066673, communityRatings: [], googleRating: 3.8, googleReviewCount: 450, description: 'Convenient supermarket for quick groceries, meal deals, and essentials in the town centre.' },
  { name: 'Perifinos', category: 'quick_munch', lng: -1.5364510895675096, lat: 52.29173417453382, communityRatings: [], googleRating: 4.5, googleReviewCount: 890, description: 'Family-run Greek restaurant serving authentic Mediterranean cuisine, grilled meats, and mezze.' },
  { name: 'Oodles Wok', category: 'quick_munch', lng: -1.5328905704706728, lat: 52.29196869019011, communityRatings: [], googleRating: 4.2, googleReviewCount: 560, description: 'Fast-casual Asian eatery with customizable stir-fry bowls, noodles, and rice dishes.' },
  { name: "Domino's Pizza", category: 'quick_munch', lng: -1.5328968138769303, lat: 52.29046502439148, communityRatings: [], googleRating: 3.9, googleReviewCount: 1200, description: 'Popular pizza delivery and takeaway chain with classic favorites and new creations.' },
  { name: 'The Magic Wingdom', category: 'quick_munch', lng: -1.5356377026792154, lat: 52.28814718952832, communityRatings: [], googleRating: 4.6, googleReviewCount: 720, description: 'Chicken wing specialists offering buffalo, BBQ, Korean, and unique sauce flavours.' },
  { name: 'Viallis Fast Food', category: 'quick_munch', lng: -1.5332720606520582, lat: 52.28586559475257, communityRatings: [], googleRating: 4.0, googleReviewCount: 380, description: 'Local fast food joint serving burgers, fried chicken, wraps, and loaded fries.' },
  { name: 'Plan Burrito', category: 'quick_munch', lng: -1.5342741942203602, lat: 52.28810543465244, communityRatings: [], googleRating: 4.3, googleReviewCount: 650, description: 'Fresh Mexican food made to order with burritos, tacos, nachos, and customizable toppings.' },
  { name: 'Libertine Burger', category: 'quick_munch', lng: -1.5331020874160668, lat: 52.29228864767558, communityRatings: [], googleRating: 4.5, googleReviewCount: 980, description: 'American burger restaurant with gourmet patties, loaded fries, and craft beers.' },
  { name: 'Grounded Kitchen', category: 'quick_munch', lng: -1.5339201595428065, lat: 52.29199381450786, communityRatings: [], googleRating: 4.7, googleReviewCount: 840, description: 'Health-focused café serving fresh salads, smoothie bowls, sandwiches, and specialty coffee.' },
  { name: 'Sombrero Mexican Food', category: 'quick_munch', lng: -1.5366872733700407, lat: 52.290448962623444, communityRatings: [], googleRating: 4.2, googleReviewCount: 530, description: 'Authentic Mexican street food with tacos, quesadillas, and vibrant flavours.' },
  { name: 'Wingers Leamington', category: 'quick_munch', lng: -1.5343711217449412, lat: 52.28964317479163, communityRatings: [], googleRating: 4.4, googleReviewCount: 670, description: 'Chicken wing bar with a wide variety of sauces, sides, and combo meals.' },
  { name: 'Halikarnas Kebab Shop', category: 'quick_munch', lng: -1.5369741335640021, lat: 52.29038897602431, communityRatings: [], googleRating: 4.1, googleReviewCount: 490, description: 'Turkish kebab shop offering doner, shish, and mixed grills with fresh salads.' },
  { name: 'Otto Kitchen', category: 'quick_munch', lng: -1.5376197233544657, lat: 52.29029526751353, communityRatings: [], googleRating: 4.5, googleReviewCount: 710, description: 'Contemporary kitchen serving gourmet pizzas, pasta, and Italian street food.' },
  { name: 'Sakarya Kebab House', category: 'quick_munch', lng: -1.5315291862142169, lat: 52.28340092519625, communityRatings: [], googleRating: 4.0, googleReviewCount: 420, description: 'Traditional Turkish kebab house with authentic recipes and friendly service.' },
  { name: 'Kebab Shack', category: 'quick_munch', lng: -1.5334667687370458, lat: 52.28363138390546, communityRatings: [], googleRating: 3.9, googleReviewCount: 380, description: 'Late-night kebab spot perfect for post-pub munchies with generous portions.' },
  { name: 'Fried House', category: 'quick_munch', lng: -1.531608084727317, lat: 52.28379599055207, communityRatings: [], googleRating: 4.2, googleReviewCount: 510, description: 'Fried chicken specialists with crispy coating, spicy options, and combo meals.' },
  { name: 'Silk & Spice Indian Takeaway', category: 'quick_munch', lng: -1.5302480695146856, lat: 52.28386079808041, communityRatings: [], googleRating: 4.4, googleReviewCount: 820, description: 'Indian takeaway serving traditional curries, biryanis, and tandoori dishes with authentic spices.' },
  { name: 'Craving', category: 'quick_munch', lng: -1.5326128284124891, lat: 52.2851303895961, communityRatings: [], googleRating: 4.3, googleReviewCount: 590, description: 'Dessert café specializing in waffles, crepes, milkshakes, and indulgent sweet treats.' },
  { name: "McDonald's", category: 'quick_munch', lng: -1.5360647256819873, lat: 52.29233137934563, communityRatings: [], googleRating: 3.7, googleReviewCount: 2100, description: 'Fast food chain serving burgers, fries, breakfast, and Happy Meals with quick service.' }
];

// -----------------------------------------------------------------------------
// FIRESTORE PLACE ENRICHMENT
// Merges stored photos, reviews, and Google Place ID from Firestore into the
// local SAMPLE_PLACES array. Run seed.html once to populate the collection.
// -----------------------------------------------------------------------------
async function loadAndEnrichPlaces() {
  if (!db) {
    console.warn('⚠️ Firebase not available — using base place data only');
    return;
  }
  try {
    const snapshot = await db.collection('places').orderBy('index').get();
    if (snapshot.empty) {
      console.log('📝 Firestore "places" collection is empty — open seed.html to populate it');
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const idx  = data.index;
      if (typeof idx === 'number' && SAMPLE_PLACES[idx]) {
        SAMPLE_PLACES[idx].googlePlaceId = data.googlePlaceId || null;
        SAMPLE_PLACES[idx].photoUrls     = data.photoUrls     || [];
        SAMPLE_PLACES[idx].reviews       = data.reviews       || [];
      }
    });
    console.log(`✅ Enriched ${snapshot.size} places from Firestore (photos + reviews)`);
  } catch (err) {
    console.error('❌ Error loading places from Firestore:', err);
  }
}

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
  // First pass: calculate raw weighted ratings for every place
  const rawRatings = places.map((place) => {
    const community = place.communityRatings || [];
    const communityVoteCount = community.length;

    if (communityVoteCount > 0) {
      const communityAvg = community.reduce((acc, r) => acc + r, 0) / communityVoteCount;
      const normalizedGoogle = (place.googleRating - 3.0) * 2.0 + 1.0;
      const googleWeight = Math.max(1, 5 - communityVoteCount * 0.4);
      const totalWeight = googleWeight + communityVoteCount;
      return (normalizedGoogle * googleWeight + communityAvg * communityVoteCount) / totalWeight;
    }
    return (place.googleRating - 3.0) * 2.0 + 1.0;
  });

  // Normalize to full 1–5 scale using actual min/max across all places
  const minRating = Math.min(...rawRatings);
  const maxRating = Math.max(...rawRatings);
  const range     = maxRating - minRating;

  return {
    type: 'FeatureCollection',
    features: places.map((place, index) => {
      const colorRating = range > 0
        ? 1 + ((rawRatings[index] - minRating) / range) * 4
        : 3;
      
      // Check if this place is marked
      const markedPlaces = JSON.parse(localStorage.getItem('markedPlaces') || '[]');
      const isMarked = markedPlaces.includes(index);
      
      return {
        type: 'Feature',
        id: index,
        geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
        properties: {
          name: place.name,
          category: place.category,
          averageRating: Math.round(getWeightedAverageRating(place) * 100) / 100,
          effectiveVoteCount: Math.round(getEffectiveVoteCount(place) * 100) / 100,
          colorRating: Math.round(colorRating * 100) / 100,
          description: place.description || '',
          lat: place.lat,
          lng: place.lng,
          isMarked: isMarked,
          highlighted: index === highlightedPlaceIndex
        }
      };
    })
  };
}

// -----------------------------------------------------------------------------
// MAP INITIALIZATION
// -----------------------------------------------------------------------------
console.log('=== MAP DEBUG START ===');
console.log('1. Initializing map...');
console.log('2. Mapbox GL JS loaded:', typeof mapboxgl !== 'undefined');
console.log('3. Map centre:', COVENTRY_CENTRE);
console.log('4. Number of places:', SAMPLE_PLACES.length);

if (typeof mapboxgl === 'undefined') {
  console.error('ERROR: Mapbox GL JS library not loaded!');
  document.getElementById('map').innerHTML = '<div style="padding:20px;color:red;background:yellow;">Error: Mapbox library failed to load. Check your internet connection.</div>';
  throw new Error('Mapbox not loaded');
}

console.log('5. Setting access token...');
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
console.log('6. Access token set:', MAPBOX_ACCESS_TOKEN.substring(0, 20) + '...');

console.log('7. Creating map object...');
console.log('   Center coordinates: [' + COVENTRY_CENTRE.lng + ', ' + COVENTRY_CENTRE.lat + ']');

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [COVENTRY_CENTRE.lng, COVENTRY_CENTRE.lat],
  zoom: 13.5, // Wider zoom to see all Leamington Spa establishments
  pitch: 0,
  bearing: 0
});

console.log('8. Map object created successfully!');

// Add error handling
map.on('error', (e) => {
  console.error('❌ MAP ERROR:', e);
  alert('Map Error: ' + (e.error ? e.error.message : 'Unknown error'));
});

map.on('style.load', () => {
  console.log('9. Map style loaded!');
});

// Declare geolocateControl in outer scope so button handlers can access it
let geolocateControl;

// Module-level so proximity system and popup can both reach them
function getUserRating(placeIndex) {
  const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
  return userRatings[placeIndex] !== undefined ? userRatings[placeIndex] : null;
}

function saveUserRating(placeIndex, rating) {
  const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
  userRatings[placeIndex] = rating;
  localStorage.setItem('userRatings', JSON.stringify(userRatings));
}

// Refresh the Mapbox source after a rating change
function refreshMapSource() {
  if (map && map.getSource('places')) {
    map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
  }
}

map.on('load', async () => {
  console.log('10. ✅ Map loaded successfully!');

  // Enrich SAMPLE_PLACES with photos & reviews stored in Firestore
  await loadAndEnrichPlaces();
  
  // ============================================================================
  // FIREBASE RATING FUNCTIONS - Define before use
  // ============================================================================
  
  // Load all ratings from Firebase for a specific place
  async function loadFirebaseRatings(placeIndex) {
    if (!db) {
      console.warn('⚠️ Firebase not initialized, using local storage only');
      return [];
    }
    
    try {
      const placeName = SAMPLE_PLACES[placeIndex].name;
      const ratingsRef = db.collection('ratings').doc(placeName).collection('reviews');
      const snapshot = await ratingsRef.get();
      
      const ratings = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        ratings.push(data.rating);
      });
      
      console.log(`📊 Loaded ${ratings.length} Firebase ratings for ${placeName}`);
      return ratings;
    } catch (error) {
      console.error('❌ Error loading Firebase ratings:', error);
      return [];
    }
  }
  
  // Save a new rating to Firebase
  async function saveRatingToFirebase(placeIndex, rating, userId) {
    if (!db) {
      console.warn('⚠️ Firebase not initialized, saving to local storage only');
      return false;
    }
    
    try {
      const placeName = SAMPLE_PLACES[placeIndex].name;
      const ratingsRef = db.collection('ratings').doc(placeName).collection('reviews');
      
      // Add the rating with timestamp and user ID
      await ratingsRef.add({
        rating: rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: userId || 'anonymous',
        placeIndex: placeIndex
      });
      
      console.log(`✅ Rating ${rating} saved to Firebase for ${placeName}`);
      return true;
    } catch (error) {
      console.error('❌ Error saving rating to Firebase:', error);
      return false;
    }
  }
  
  // Load all Firebase ratings and update SAMPLE_PLACES on startup
  async function loadAllFirebaseRatings() {
    if (!db) {
      console.warn('⚠️ Firebase not initialized');
      return;
    }
    
    console.log('📥 Loading all ratings from Firebase...');
    
    for (let i = 0; i < SAMPLE_PLACES.length; i++) {
      const firebaseRatings = await loadFirebaseRatings(i);
      // Replace the empty communityRatings array with Firebase data
      SAMPLE_PLACES[i].communityRatings = firebaseRatings;
    }
    
    // Update the map with loaded ratings
    if (map.getSource('places')) {
      map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
      console.log('✅ Map updated with Firebase ratings');
    }
  }
  
  // Set up real-time listeners for rating updates
  function setupRealtimeListeners() {
    if (!db) {
      console.warn('⚠️ Firebase not initialized, real-time updates disabled');
      return;
    }
    
    console.log('👂 Setting up real-time listeners for rating updates...');
    
    // Listen to the entire ratings collection
    SAMPLE_PLACES.forEach((place, index) => {
      const placeName = place.name;
      const ratingsRef = db.collection('ratings').doc(placeName).collection('reviews');
      
      ratingsRef.onSnapshot((snapshot) => {
        const ratings = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          ratings.push(data.rating);
        });
        
        // Update the place's ratings
        SAMPLE_PLACES[index].communityRatings = ratings;
        
        // Update the map in real-time
        if (map.getSource('places')) {
          map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
          console.log(`🔄 Real-time update: ${placeName} now has ${ratings.length} ratings`);
        }
      }, (error) => {
        console.error(`❌ Error listening to ${placeName}:`, error);
      });
    });
    
    console.log('✅ Real-time listeners active for all places');
  }
  
  // ============================================================================
  // LOCAL STORAGE RATING FUNCTIONS (for user's own ratings)
  // ============================================================================

  function removeUserRating(placeIndex) {
    const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
    delete userRatings[placeIndex];
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
  }
  
  // Generate a simple user ID for Firebase (or use anonymous)
  function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  // Bookmark/Mark tracking functions
  function isPlaceMarked(placeIndex) {
    const markedPlaces = JSON.parse(localStorage.getItem('markedPlaces') || '[]');
    return markedPlaces.includes(placeIndex);
  }

  function togglePlaceMark(placeIndex) {
    const markedPlaces = JSON.parse(localStorage.getItem('markedPlaces') || '[]');
    const index = markedPlaces.indexOf(placeIndex);
    
    if (index > -1) {
      // Remove mark
      markedPlaces.splice(index, 1);
    } else {
      // Add mark
      markedPlaces.push(placeIndex);
    }
    
    localStorage.setItem('markedPlaces', JSON.stringify(markedPlaces));
    return index === -1; // Return true if now marked, false if unmarked
  }
  
  // ============================================================================
  // End of function definitions
  // ============================================================================
  
  // Apply purple theme to ALL map layers
  console.log('10a. Applying purple theme to map...');
  
  try {
    const layers = map.getStyle().layers;
    
    layers.forEach(layer => {
      const layerId = layer.id;
      
      // Background layers
      if (layer.type === 'background') {
        map.setPaintProperty(layerId, 'background-color', '#1a0d2e');
      }
      
      // Water layers - purple tones
      if (layerId.includes('water') || layerId.includes('ocean') || layerId.includes('river')) {
        if (layer.type === 'fill') {
          map.setPaintProperty(layerId, 'fill-color', '#2d1b69');
        } else if (layer.type === 'line') {
          map.setPaintProperty(layerId, 'line-color', '#4c2a9f');
        }
      }
      
      // Land/terrain layers
      if (layerId.includes('land') || layerId.includes('terrain')) {
        if (layer.type === 'fill') {
          map.setPaintProperty(layerId, 'fill-color', '#1a0d2e');
        }
      }
      
      // Building layers - deep purple
      if (layerId.includes('building')) {
        if (layer.type === 'fill') {
          map.setPaintProperty(layerId, 'fill-color', '#2d1b69');
          map.setPaintProperty(layerId, 'fill-opacity', 0.7);
          // Remove white outline
          map.setPaintProperty(layerId, 'fill-outline-color', 'rgba(0,0,0,0)');
        } else if (layer.type === 'fill-extrusion') {
          map.setPaintProperty(layerId, 'fill-extrusion-color', '#2d1b69');
          map.setPaintProperty(layerId, 'fill-extrusion-opacity', 0.7);
        } else if (layer.type === 'line') {
          // Hide building outline lines
          map.setPaintProperty(layerId, 'line-color', 'rgba(0,0,0,0)');
          map.setPaintProperty(layerId, 'line-opacity', 0);
        }
      }
      
      // Road layers - purple variants
      if (layerId.includes('road') || layerId.includes('street') || layerId.includes('highway')) {
        if (layer.type === 'line') {
          const isPrimary = layerId.includes('primary') || layerId.includes('highway') || layerId.includes('motorway');
          map.setPaintProperty(layerId, 'line-color', isPrimary ? '#7c3aed' : '#4c2a9f');
        }
      }
      
      // Park and green spaces - darker purple
      if (layerId.includes('park') || layerId.includes('wood') || layerId.includes('forest')) {
        if (layer.type === 'fill') {
          map.setPaintProperty(layerId, 'fill-color', '#1f1147');
        }
      }
      
      // Labels and text - light purple
      if (layer.type === 'symbol') {
        if (layer.layout && layer.layout['text-field']) {
          map.setPaintProperty(layerId, 'text-color', '#b8a3e8');
          map.setPaintProperty(layerId, 'text-halo-color', '#1a0d2e');
        }
        if (layer.layout && layer.layout['icon-image']) {
          map.setPaintProperty(layerId, 'icon-color', '#a855f7');
        }
      }
    });
    
    console.log('10b. ✅ Purple theme applied to', layers.length, 'map layers!');
  } catch (error) {
    console.warn('Some map layers could not be themed:', error);
  }
  console.log('11. Loading Firebase ratings before rendering map...');
  
  // Load Firebase ratings FIRST, then render the map
  loadAllFirebaseRatings().then(() => {
    console.log('✅ Firebase ratings loaded successfully');
    console.log('12. Adding', SAMPLE_PLACES.length, 'places to map with Firebase data');
    
    const geojsonData = placesToGeoJSON(SAMPLE_PLACES);
    console.log('13. GeoJSON data created:', geojsonData.features.length, 'features');
    
    map.addSource('places', {
      type: 'geojson',
      data: geojsonData,
      generateId: true  // Enable feature state and improve interaction
    });
    
    console.log('14. Source added to map with Firebase ratings');
    
    // Now continue with layer setup
    initializeMapLayers();
    
    // Set up real-time listeners after initial load
    setupRealtimeListeners();
  }).catch(error => {
    console.error('❌ Error loading Firebase ratings:', error);
    console.log('⚠️ Proceeding with local data only');
    
    // Fallback: render map without Firebase data
    const geojsonData = placesToGeoJSON(SAMPLE_PLACES);
    map.addSource('places', {
      type: 'geojson',
      data: geojsonData,
      generateId: true
    });
    
    initializeMapLayers();
  });
  
  // Function to initialize map layers after data is loaded
  function initializeMapLayers() {
    console.log('15. Source added to map');

  try {
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
          1.0, '#e53935',  // Red (lowest)
          2.0, '#fb8c00',  // Orange
          3.0, '#fdd835',  // Yellow
          4.0, '#7cb342',  // Light green
          5.0, '#2e7d32'   // Dark green (highest)
        ],
        'circle-stroke-width': [
          'case',
          ['boolean', ['get', 'highlighted'], false], 6,
          ['boolean', ['get', 'isMarked'], false], 5,
          2
        ],
        'circle-stroke-color': [
          'case',
          ['boolean', ['get', 'highlighted'], false], '#ffffff',
          '#fff'
        ],
        'circle-opacity': [
          'case',
          ['boolean', ['get', 'highlighted'], false], 1.0,
          0.65
        ]
      }
    });
    
    console.log('14. ✅ Layer added - circles should be visible and clickable!');
    console.log('15. ==> Check the map - you should see', SAMPLE_PLACES.length, 'colored circles');
    console.log('16. Verifying layer exists:', map.getLayer('place-bubbles') ? 'YES ✓' : 'NO ✗');
  } catch (error) {
    console.error('❌ Error adding layer:', error);
    alert('Error adding circles to map: ' + error.message);
  }

  // Continue with event handlers setup (these stay outside the try-catch)
  setupEventHandlers();
  } // End of initializeMapLayers function
  
  // Function to set up all event handlers for map interactions
  function setupEventHandlers() {
  console.log('17. Setting up event handlers...');

  // Track which categories are currently shown via search (null = nothing shown yet)
  let currentSearchCategories = null;
  
  // Add geolocation control to show user's current location with live tracking
  // Note: fitBoundsOptions is set to disable automatic centering
  geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 0
    },
    trackUserLocation: true,      // Enable live tracking
    showUserHeading: true,         // Show direction user is facing
    showUserLocation: true,        // Show user location
    fitBoundsOptions: {
      maxZoom: 15,
      padding: 0
    }
  });
  
  map.addControl(geolocateControl, 'top-right');
  
  console.log('📍 Geolocation control added to map - ready to be triggered');
  
  // Custom user location marker (backup if Mapbox default doesn't show)
  let userLocationMarker = null;
  let preventMapMove = false;
  
  // Store map position before geolocation updates
  let savedCenter = null;
  let savedZoom = null;
  
  // Before geolocation triggers, save the current map position
  map.on('movestart', (e) => {
    // If the move is triggered by geolocation, save position to restore it
    if (preventMapMove) {
      savedCenter = map.getCenter();
      savedZoom = map.getZoom();
    }
  });
  
  // Event listeners to track location status
  geolocateControl.on('geolocate', (position) => {
    // Persist the fact that location was granted — covers the case where the
    // user clicks the Mapbox button directly without going through our popup
    localStorage.setItem('locationChoice', 'allowed');

    // Enable map movement prevention
    preventMapMove = true;
    
    // Save current map view BEFORE any updates
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    
    console.log('📍 Live location update:', {
      lat: lat,
      lng: lng,
      accuracy: position.coords.accuracy + 'm',
      heading: position.coords.heading
    });
    
    // Create or update custom marker as backup
    if (!userLocationMarker) {
      // Create custom HTML element for user location
      const el = document.createElement('div');
      el.className = 'custom-user-location';
      el.innerHTML = '📍';
      el.style.fontSize = '32px';
      el.style.cursor = 'pointer';
      
      userLocationMarker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([lng, lat])
        .addTo(map);
      
      console.log('✅ Custom user location marker added at:', lat, lng);
      console.log('💡 Map will NOT auto-center - marker shows your location');
    } else {
      // Update existing marker position WITHOUT moving the map
      userLocationMarker.setLngLat([lng, lat]);
      console.log('📍 Marker position updated (map stays in place)');
    }
    
    // Force map to stay at current position (prevent auto-centering)
    setTimeout(() => {
      map.jumpTo({
        center: currentCenter,
        zoom: currentZoom
      });
      preventMapMove = false;
      console.log('🔒 Map position locked - staying at your chosen view');
    }, 10);
  });
  
  geolocateControl.on('trackuserlocationstart', () => {
    console.log('✅ Live location tracking STARTED - Your position will update as you move!');
    console.log('💡 Map will NEVER auto-center - you stay in full control of the map view');
  });
  
  geolocateControl.on('trackuserlocationend', () => {
    console.log('⏸️ Live location tracking STOPPED');
    // Remove custom marker when tracking stops
    if (userLocationMarker) {
      userLocationMarker.remove();
      userLocationMarker = null;
    }
  });
  
  geolocateControl.on('error', (error) => {
    console.error('❌ Geolocation error:', error.message);
    alert('Location error: ' + error.message + '\n\nPlease check:\n1. Location permissions are enabled\n2. GPS/Location services are on\n3. You have internet connection');
  });
  
  console.log('✅ Geolocation control added with live tracking enabled');

  // autoTriggerLocation is called by the window-load handler below once it
  // confirms the user has (or previously had) location permission.
  // It polls until geolocateControl is ready rather than using a fixed delay.
  window._autoTriggerLocation = function autoTriggerLocation() {
    if (geolocateControl && map.loaded()) {
      try {
        geolocateControl.trigger();
        console.log('📍 Location auto-triggered successfully');
      } catch (err) {
        console.error('❌ Auto-trigger failed:', err);
      }
    } else {
      setTimeout(window._autoTriggerLocation, 250);
    }
  };

  // Wait for the layer to be fully ready before attaching event handlers
  // This ensures the circles are fully interactive
  console.log('17. Setting up click handlers...');
  
  // Tooltip on hover
  const popup = new mapboxgl.Popup({ 
    closeButton: false, 
    className: 'place-tooltip',
    closeOnClick: false
  });
  
  map.on('mouseenter', 'place-bubbles', (e) => {
    console.log('🖱️ Mouse entered circle:', e.features[0].properties.name);
    const feat = e.features[0];
    
    // Format category name nicely
    const categoryLabel = feat.properties.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    popup.setLngLat(feat.geometry.coordinates)
      .setHTML(`<strong>${feat.properties.name}</strong> <span style="color: #b8a3e8;">(${categoryLabel})</span>`)
      .addTo(map);
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'place-bubbles', () => {
    console.log('🖱️ Mouse left circle');
    popup.remove();
    map.getCanvas().style.cursor = '';
  });

  // ── Per-place popup registry ──────────────────────────────────────────────
  // Key: placeIndex (number)  Value: mapboxgl.Popup instance
  const activePopups = new Map();

  // Returns the same colorRating value Mapbox uses for a place's bubble
  function getPlaceColorRating(placeIndex) {
    const feat = placesToGeoJSON(SAMPLE_PLACES).features[placeIndex];
    return feat ? feat.properties.colorRating : 3;
  }

  // Mirrors the Mapbox circle-color interpolation exactly
  function ratingToColor(rating) {
    const stops = [
      [1.0, [229,  57,  53]],  // #e53935  Red
      [2.0, [251, 140,   0]],  // #fb8c00  Orange
      [3.0, [253, 216,  53]],  // #fdd835  Yellow
      [4.0, [124, 179,  66]],  // #7cb342  Light green
      [5.0, [ 46, 125,  50]],  // #2e7d32  Dark green
    ];
    const v = Math.max(1, Math.min(5, rating || 3));
    for (let i = 0; i < stops.length - 1; i++) {
      const [r1, c1] = stops[i];
      const [r2, c2] = stops[i + 1];
      if (v <= r2) {
        const t = (v - r1) / (r2 - r1);
        return [0, 1, 2].map(ch => Math.round(c1[ch] + t * (c2[ch] - c1[ch])));
      }
    }
    return [183, 28, 28];
  }

  // Helper: show/hide the bookmarks sidebar based on its content.
  // Info sidebar is always visible (legend is a permanent header).
  function refreshSidebarVisibility() {
    const hasBookmarks = locationsList && locationsList.children.length > 0;
    if (locationsSidebar) locationsSidebar.classList.toggle('has-tabs', hasBookmarks);
  }

  // ── Open a floating popup beside the clicked bubble ─────────────────────
  function showVotePopup(placeIndex) {
    const place = SAMPLE_PLACES[placeIndex];

    // Same bubble clicked again → close it (toggle)
    if (activePopups.has(placeIndex)) {
      removeVotePopup(placeIndex);
      return;
    }

    // Close any other open panel — only one at a time
    [...activePopups.keys()].forEach(idx => removeVotePopup(idx));

    const googleMapsUrl   = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Leamington Spa')}`;
    const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(place.name + ' Leamington Spa')}`;
    const isMarked        = isPlaceMarked(placeIndex);
    const markButtonText  = isMarked ? '⭐ Marked' : '☆ Mark Place';
    const markButtonClass = isMarked ? 'mark-button marked' : 'mark-button';
    const avgRating       = Math.round(getWeightedAverageRating(place) * 100) / 100;
    const categoryLabel   = place.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const userRating      = getUserRating(placeIndex);

    // Bubble colour — matches the circle on the map
    const [r, g, b]  = ratingToColor(getPlaceColorRating(placeIndex));
    const bubbleColor = `rgb(${r},${g},${b})`;

    // ── Photo hero ────────────────────────────────────────────────────────
    const storedPhotos = place.photoUrls && place.photoUrls.length > 0;
    const photoHero = storedPhotos
      ? `<div class="detail-photo-hero" id="photo-gallery-${placeIndex}">
           ${place.photoUrls.map((url, i) =>
             `<img class="place-photo ${i === 0 ? 'active' : ''}" src="${url}" alt="${place.name}"
                   onerror="this.style.display='none'" />`
           ).join('')}
           ${place.photoUrls.length > 1 ? `
             <button class="photo-prev" onclick="changePhoto(${placeIndex}, -1)">&#8249;</button>
             <button class="photo-next" onclick="changePhoto(${placeIndex}, 1)">&#8250;</button>
             <div class="photo-counter">
               <span id="current-photo-${placeIndex}">1</span> / ${place.photoUrls.length}
             </div>` : ''}
         </div>`
      : `<div class="detail-photo-hero detail-photo-fallback">
           <div class="fallback-icon">📸</div>
           <a href="${googleImagesUrl}" target="_blank" class="view-photos-button">🔍 View on Google</a>
         </div>`;

    // ── Reviews ───────────────────────────────────────────────────────────
    const storedReviews = place.reviews && place.reviews.length > 0;
    const reviewsSection = storedReviews
      ? `<div class="place-reviews">
           <h4 class="reviews-title">Most Recent Reviews</h4>
           ${place.reviews.map(r => {
             const stars = Math.max(0, Math.min(5, Math.round(r.rating)));
             return `
               <div class="review-item">
                 <div class="review-header">
                   <span class="review-author">${r.author}</span>
                   <span class="review-stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span>
                   <span class="review-time">${r.time}</span>
                 </div>
                 <p class="review-text">${r.text}</p>
               </div>`;
           }).join('')}
         </div>`
      : '';

    // ── Panel HTML ────────────────────────────────────────────────────────
    const html = `
      ${photoHero}
      <div class="vote-panel" data-panel-idx="${placeIndex}">
        <button class="detail-close-btn" id="detail-close-btn" aria-label="Close">✕</button>

        <div class="detail-name-row">
          <div class="detail-bubble-wrap">
            <div class="detail-bubble-ring" style="border-color:${bubbleColor}"></div>
            <div class="detail-bubble-circle" style="background:${bubbleColor}">
              <span class="detail-bubble-score">${avgRating}</span>
            </div>
          </div>
          <div class="detail-name-text">
            <h3>${place.name}</h3>
            <span class="place-category">${categoryLabel}</span>
          </div>
        </div>

        <p class="place-description">${place.description || ''}</p>

        <div class="place-links">
          <a href="${googleMapsUrl}" target="_blank" class="google-maps-link">📍 Open in Google Maps</a>
          <button class="${markButtonClass}" data-place-idx="${placeIndex}">${markButtonText}</button>
        </div>

        <div class="rating-label">
          <span>Community rating</span>
          <span class="place-rating">⭐ ${avgRating}</span>
        </div>
        ${userRating !== null
          ? `<p class="previous-rating">Your rating: ⭐ ${userRating.toFixed(1)}</p>`
          : ''}

        ${reviewsSection}
      </div>
    `;

    // ── Inject & show panel ───────────────────────────────────────────────
    const panel   = document.getElementById('place-detail-panel');
    const overlay = document.getElementById('detail-overlay');
    panel.innerHTML = html;
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('panel-open');
    if (overlay) overlay.classList.add('overlay-visible');

    document.getElementById('detail-close-btn')
      .addEventListener('click', () => removeVotePopup(placeIndex));

    activePopups.set(placeIndex, true);

    // Pan map — offset so the bubble isn't hidden behind the panel
    map.easeTo({ center: [place.lng, place.lat], duration: 500 });
  }

  // ── Remove / hide the detail panel ───────────────────────────────────────
  function removeVotePopup(placeIndex) {
    if (!activePopups.has(placeIndex)) return;
    const panel   = document.getElementById('place-detail-panel');
    const overlay = document.getElementById('detail-overlay');
    if (panel) {
      panel.classList.remove('panel-open');
      panel.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('overlay-visible');
    activePopups.delete(placeIndex);
  }

  // ── Click a bubble: show floating popup ──────────────────────────────────
  map.on('click', 'place-bubbles', (e) => {
    console.log('🖱️ Circle clicked!', e.features[0].properties.name);
    const feat       = e.features[0];
    const placeIndex = feat.id;
    popup.remove(); // remove hover tooltip

    showVotePopup(placeIndex);
  });

  // ── Click on map background: close the detail panel ─────────────────────
  map.on('click', (e) => {
    const hit = map.queryRenderedFeatures(e.point, { layers: ['place-bubbles'] });
    if (hit.length === 0) {
      [...activePopups.keys()].forEach(idx => removeVotePopup(idx));
    }
  });

  // ── Dim overlay tap (mobile) closes the panel ────────────────────────────
  const _detailOverlay = document.getElementById('detail-overlay');
  if (_detailOverlay) {
    _detailOverlay.addEventListener('click', () => {
      [...activePopups.keys()].forEach(idx => removeVotePopup(idx));
    });
  }

  // Photo carousel navigation
  window.changePhoto = function(placeIndex, direction) {
    const gallery = document.getElementById(`photo-gallery-${placeIndex}`);
    if (!gallery) return;
    
    const photos = gallery.querySelectorAll('.place-photo');
    const counter = document.getElementById(`current-photo-${placeIndex}`);
    let currentIdx = Array.from(photos).findIndex(p => p.classList.contains('active'));
    
    photos[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + direction + photos.length) % photos.length;
    photos[currentIdx].classList.add('active');
    
    if (counter) counter.textContent = currentIdx + 1;
  };

  // Animation function for marking places
  function animateMarkCircle(placeIdx) {
    const place = SAMPLE_PLACES[placeIdx];
    const coords = [place.lng, place.lat];
    
    console.log('💫 Attempting pulse animation at:', coords);
    
    // Get the pixel position of the coordinates on the map canvas
    const point = map.project(coords);
    console.log('📍 Screen position:', point.x, point.y);
    
    // Create temporary animated pulse element
    const pulseEl = document.createElement('div');
    pulseEl.className = 'mark-pulse-animation';
    
    // Create a container div to hold the pulse
    const containerDiv = document.createElement('div');
    containerDiv.style.position = 'absolute';
    containerDiv.style.left = '0';
    containerDiv.style.top = '0';
    containerDiv.style.width = '0';
    containerDiv.style.height = '0';
    containerDiv.style.pointerEvents = 'none';
    containerDiv.appendChild(pulseEl);
    
    // Position pulse element relative to container
    pulseEl.style.position = 'absolute';
    pulseEl.style.left = point.x + 'px';
    pulseEl.style.top = point.y + 'px';
    pulseEl.style.marginLeft = '-40px';  // Half of width (80px / 2)
    pulseEl.style.marginTop = '-40px';   // Half of height (80px / 2)
    
    // Add to map canvas container (not map container)
    const canvasContainer = map.getCanvasContainer();
    canvasContainer.appendChild(containerDiv);
    
    console.log('✓ Pulse element added at pixel:', point.x, point.y);
    
    // Remove pulse after animation completes
    setTimeout(() => {
      if (containerDiv.parentNode) {
        containerDiv.parentNode.removeChild(containerDiv);
        console.log('✓ Pulse animation complete and removed');
      }
    }, 800);
  }

  // Mark/Bookmark button handler
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('mark-button')) {
      const placeIdx = parseInt(e.target.dataset.placeIdx);
      
      // Toggle mark
      const isNowMarked = togglePlaceMark(placeIdx);
      
      // Update button appearance
      if (isNowMarked) {
        e.target.classList.add('marked');
        e.target.textContent = '⭐ Marked';
        console.log(`✅ Place ${placeIdx} marked`);
        
        // Trigger pulse animation
        animateMarkCircle(placeIdx);
        
        // Briefly set justMarked for circle animation
        SAMPLE_PLACES[placeIdx].justMarked = true;
        map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
        setTimeout(() => {
          delete SAMPLE_PLACES[placeIdx].justMarked;
          map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
        }, 800);

        // ── Add a sidebar tab for this newly bookmarked place ──
        addLocationTab(placeIdx);

      } else {
        e.target.classList.remove('marked');
        e.target.textContent = '☆ Mark Place';
        console.log(`❌ Place ${placeIdx} unmarked`);
        
        map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));

        // ── Remove the sidebar tab for this unbookmarked place ──
        removeLocationTab(placeIdx);
      }
      
      console.log('🔄 Map updated with new mark status');
    }
  });


  // Handle rating submission via slider
  document.addEventListener('change', async (e) => {
    if (e.target.classList.contains('vote-slider')) {
      const idx = parseInt(e.target.dataset.idx);
      const rating = parseFloat(e.target.value);
      
      // Check if user has previously rated this place
      const previousRating = getUserRating(idx);
      const isUpdate = previousRating !== null;
      
      // If updating, remove the old rating from the local array
      if (isUpdate) {
        const ratings = SAMPLE_PLACES[idx].communityRatings;
        const oldRatingIndex = ratings.indexOf(previousRating);
        if (oldRatingIndex > -1) {
          ratings.splice(oldRatingIndex, 1);
        }
      }
      
      // Add the new rating to local array
      SAMPLE_PLACES[idx].communityRatings.push(rating);
      
      // Save user's rating to localStorage
      saveUserRating(idx, rating);
      
      // Save rating to Firebase
      const userId = getUserId();
      const firebaseSaved = await saveRatingToFirebase(idx, rating, userId);
      
      if (firebaseSaved) {
        console.log('✅ Rating saved to Firebase successfully');
      } else {
        console.warn('⚠️ Rating saved locally but not to Firebase');
      }
      
      // Update map
      map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
      
      // Show success animation
      const votePanel = e.target.closest('.vote-panel');
      
      // Hide slider, hint, and previous rating display
      e.target.style.display = 'none';
      const hint = votePanel.querySelector('.slider-hint');
      if (hint) hint.style.display = 'none';
      const prevRating = votePanel.querySelector('.previous-rating');
      if (prevRating) prevRating.style.display = 'none';
      
      // Show success message with animation
      const successMsg = document.createElement('div');
      successMsg.className = 'rating-success';
      successMsg.innerHTML = `
        <div class="success-icon">✓</div>
        <p>${isUpdate ? 'Rating updated!' : 'Rating submitted!'}</p>
        <p class="rated-value">⭐ ${rating.toFixed(1)}</p>
      `;
      votePanel.appendChild(successMsg);
      
      // Add animation class to popup
      votePanel.classList.add('rating-submitted');
      
      // Close this place's popup after 2 seconds
      setTimeout(() => removeVotePopup(idx), 2000);
    }
  });

  // ---------------------------------------------------------------------------
  // FILTER LOGIC (driven by search only — no checkboxes)
  // ---------------------------------------------------------------------------
  function updateFilters() {
    if (currentSearchCategories === null) {
      // Nothing searched yet — show all bubbles
      map.setFilter('place-bubbles', null);
      return;
    }

    const isMarked = ['boolean', ['get', 'isMarked'], false];

    if (currentSearchCategories.length === 0) {
      // No category match — still show any marked places
      map.setFilter('place-bubbles', isMarked);
      return;
    }

    // Show bubbles that match the searched category OR are marked
    map.setFilter('place-bubbles', [
      'any',
      ['in', ['get', 'category'], ['literal', currentSearchCategories]],
      isMarked
    ]);
  }

  // Apply initial filter after a small delay to ensure layer is ready
  setTimeout(() => {
    updateFilters();
    console.log('✅ Event handlers and filters ready!');
  }, 100);

  // ── SEARCH BAR ────────────────────────────────────────────────────────────
  const searchBtn   = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  function performSearch() {
    const term    = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const hintEl  = document.getElementById('search-hint');

    if (!term) {
      // Empty search — reset to show all bubbles
      currentSearchCategories = null;
      updateFilters();
      if (hintEl) {
        hintEl.textContent = 'Search a category to discover places near you';
        hintEl.classList.remove('no-results');
      }
      return;
    }

    // Category matching table — flexible keyword → category mapping
    const categoryMap = [
      { value: 'bar',         keywords: ['bar', 'bars', 'cocktail', 'cocktails', 'drinks', 'spirits'] },
      { value: 'pub',         keywords: ['pub', 'pubs', 'ale', 'ales', 'bitter', 'lager', 'tavern', 'inn'] },
      { value: 'quick_munch', keywords: ['quick', 'munch', 'food', 'eat', 'eats', 'fast', 'snack', 'kebab',
                                         'burger', 'pizza', 'chicken', 'quick munch', 'quick_munch', 'takeaway'] }
    ];

    const matchedCategories = categoryMap
      .filter(c => c.keywords.some(kw => kw.includes(term) || term.includes(kw)))
      .map(c => c.value);

    if (matchedCategories.length === 0) {
      if (hintEl) {
        hintEl.textContent = 'No match — try: bar, pub, or quick munch';
        hintEl.classList.add('no-results');
      }
      return;
    }

    if (hintEl) hintEl.classList.remove('no-results');

    currentSearchCategories = matchedCategories;
    updateFilters();

    // Fit map bounds to all matching places
    const matchingPlaces = SAMPLE_PLACES.filter(p => matchedCategories.includes(p.category));
    if (matchingPlaces.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      matchingPlaces.forEach(p => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, {
        padding: { top: 80, bottom: 130, left: 230, right: 320 },
        maxZoom: 15,
        duration: 900
      });
    }

    if (hintEl) {
      const catLabel = matchedCategories.map(c => c.replace('_', ' ')).join(' & ');
      hintEl.textContent = `${matchingPlaces.length} ${catLabel} place${matchingPlaces.length !== 1 ? 's' : ''} found — click a bubble to explore`;
    }

    console.log(`🔍 Search: "${term}" → ${matchedCategories.join(', ')} (${matchingPlaces.length} places)`);
  }

  if (searchBtn)  searchBtn.addEventListener('click', performSearch);
  if (searchInput) searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') performSearch(); });

  // ── SIDEBARS ───────────────────────────────────────────────────────────────
  const infoSidebar      = document.getElementById('info-sidebar');       // LEFT  — clicked bubble panels
  const locationsSidebar = document.getElementById('locations-sidebar');  // RIGHT — bookmarked places
  const locationsList    = document.getElementById('locations-list');

  const CATEGORY_ICONS = { bar: '🍺', pub: '🍻', quick_munch: '🍔' };

  function addLocationTab(placeIndex) {
    if (!locationsList) return;
    const place = SAMPLE_PLACES[placeIndex];

    // Move existing tab for this place to the top instead of duplicating
    const existing = locationsList.querySelector(`[data-place-idx="${placeIndex}"]`);
    if (existing) {
      locationsList.insertBefore(existing, locationsList.firstChild);
      return;
    }

    const icon          = CATEGORY_ICONS[place.category] || '📍';
    const categoryLabel = place.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const avgRating     = Math.round(getWeightedAverageRating(place) * 10) / 10;
    const mapsUrl       = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Leamington Spa')}`;

    const tab = document.createElement('div');
    tab.className        = 'location-tab';
    tab.dataset.placeIdx = placeIndex;
    tab.innerHTML = `
      <button class="tab-close-btn" title="Remove">×</button>
      <div class="tab-header">
        <span class="tab-icon">${icon}</span>
        <div class="tab-title-group">
          <span class="tab-name">${place.name}</span>
          <span class="tab-category-label">${categoryLabel}</span>
        </div>
      </div>
      <p class="tab-description">${place.description || ''}</p>
      <div class="tab-footer">
        <span class="tab-rating">⭐ ${avgRating}</span>
        <a href="${mapsUrl}" target="_blank" class="tab-maps-link">📍 Maps</a>
      </div>
      <p class="tab-hold-hint">Hold to zoom in &amp; view</p>
    `;

    locationsList.insertBefore(tab, locationsList.firstChild);
    refreshSidebarVisibility();

    // Color-code the tab to match its bubble (uses exact same colorRating as Mapbox)
    const [r, g, b] = ratingToColor(getPlaceColorRating(placeIndex));
    tab.style.borderLeftColor  = `rgb(${r}, ${g}, ${b})`;
    tab.style.borderLeftWidth  = '4px';
    tab.style.boxShadow        = `-3px 2px 16px rgba(0,0,0,0.55), 0 0 14px rgba(${r},${g},${b},0.55)`;

    setupTabInteractions(tab, placeIndex);
  }

  function removeLocationTab(placeIndex) {
    const tab = locationsList ? locationsList.querySelector(`[data-place-idx="${placeIndex}"]`) : null;
    if (!tab) return;

    tab.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    tab.style.opacity    = '0';
    tab.style.transform  = 'translateX(30px)';

    setTimeout(() => {
      tab.remove();
      refreshSidebarVisibility();
    }, 200);

    // ── Unmark the place in localStorage if it is still marked ───────────
    if (isPlaceMarked(placeIndex)) {
      togglePlaceMark(placeIndex); // sets it to unmarked

      // Reflect change on the mark button inside the open detail panel
      const panelBtn = document.querySelector(
        `.place-detail-panel .mark-button[data-place-idx="${placeIndex}"]`
      );
      if (panelBtn) {
        panelBtn.classList.remove('marked');
        panelBtn.textContent = '☆ Mark Place';
      }

      // Refresh map bubbles so any mark-specific styling is removed
      if (map.getSource('places')) {
        map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
      }
    }

    // Clear highlight if this was the highlighted place
    if (highlightedPlaceIndex === placeIndex) {
      highlightedPlaceIndex = null;
      if (map.getSource('places')) map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
    }
  }

  function setHighlight(placeIndex) {
    // Toggle: clicking already-highlighted tab un-highlights it
    highlightedPlaceIndex = (highlightedPlaceIndex === placeIndex) ? null : placeIndex;
    if (map.getSource('places')) map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));

    // Update visual highlight on all tabs
    if (locationsList) {
      locationsList.querySelectorAll('.location-tab').forEach(t => {
        const idx = parseInt(t.dataset.placeIdx);
        t.classList.toggle('tab-highlighted', idx === highlightedPlaceIndex);
      });
    }
  }

  function zoomToPlace(placeIndex) {
    const place = SAMPLE_PLACES[placeIndex];
    const coords = [place.lng, place.lat];

    // Highlight the circle
    highlightedPlaceIndex = placeIndex;
    if (map.getSource('places')) map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));

    // Highlight the tab
    if (locationsList) {
      locationsList.querySelectorAll('.location-tab').forEach(t => {
        t.classList.toggle('tab-highlighted', parseInt(t.dataset.placeIdx) === placeIndex);
      });
    }

    // Fly to the bubble
    map.flyTo({
      center: coords,
      zoom: Math.max(map.getZoom(), 15.5),
      duration: 800
    });

    // Show the popup once the fly animation has landed
    if (!activePopups.has(placeIndex)) {
      setTimeout(() => showVotePopup(placeIndex), 850);
    }
  }

  function setupTabInteractions(tab, placeIndex) {
    let holdTimer  = null;
    let didHold    = false;

    // ── Close button ──
    const closeBtn = tab.querySelector('.tab-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        removeLocationTab(placeIndex);
      });
    }

    // ── Prevent Maps link from triggering tab click/hold ──
    const mapsLink = tab.querySelector('.tab-maps-link');
    if (mapsLink) mapsLink.addEventListener('click', e => e.stopPropagation());

    // ── Click: fly to bubble and show its popup ──
    tab.addEventListener('click', () => {
      if (didHold) { didHold = false; return; }
      zoomToPlace(placeIndex);
    });

    // ── Hold helpers ──
    function startHold(e) {
      if (e.target.closest('.tab-close-btn') || e.target.closest('.tab-maps-link')) return;
      didHold   = false;
      holdTimer = setTimeout(() => {
        didHold = true;
        tab.classList.add('tab-hold-active');
        zoomToPlace(placeIndex);
        setTimeout(() => tab.classList.remove('tab-hold-active'), 700);
      }, 500);
    }

    function cancelHold() {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    }

    tab.addEventListener('mousedown',   startHold);
    tab.addEventListener('mouseup',     cancelHold);
    tab.addEventListener('mouseleave',  cancelHold);
    tab.addEventListener('touchstart',  startHold,  { passive: true });
    tab.addEventListener('touchend',    cancelHold);
    tab.addEventListener('touchcancel', cancelHold);
  }

  // ── Populate sidebar with any places already bookmarked from a previous session ──
  const previouslyMarked = JSON.parse(localStorage.getItem('markedPlaces') || '[]');
  previouslyMarked.forEach(idx => {
    if (SAMPLE_PLACES[idx]) addLocationTab(idx);
  });

  } // End of setupEventHandlers function
});

// (Legend sidebar removed — legend is now a fixed box in the bottom-right corner)

// -----------------------------------------------------------------------------
// Auto-trigger geolocation silently on load if browser permission was previously granted
window.addEventListener('load', async () => {
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      if (status.state === 'granted') {
        window._autoTriggerLocation && window._autoTriggerLocation();
      }
      status.addEventListener('change', () => {
        if (status.state === 'granted') {
          window._autoTriggerLocation && window._autoTriggerLocation();
        }
      });
    } catch (_) { /* permissions API not available */ }
  }

  // Start proximity rating watch
  window._startProximityWatch && window._startProximityWatch();
});

// Debug function: manually trigger location from console
// Type "triggerLocationManually()" in browser console to test
window.triggerLocationManually = function() {
  console.log('🔧 MANUAL TRIGGER TEST');
  console.log('   geolocateControl exists:', !!geolocateControl);
  console.log('   map.loaded():', map.loaded());
  
  if (geolocateControl) {
    console.log('✅ Calling geolocateControl.trigger()...');
    geolocateControl.trigger();
    console.log('✅ Trigger called! Check if location icon appears.');
  } else {
    console.error('❌ geolocateControl is not defined yet!');
  }
};

console.log('💡 Debug tip: Type triggerLocationManually() in console to test location trigger');

// =============================================================================
// PROXIMITY RATING SYSTEM
// Watches the user's GPS position. After 5 continuous minutes within 80 m of
// a place they haven't yet rated, a "How was X?" modal slides up for them to rate.
// =============================================================================
const PROXIMITY_RADIUS_M   = 80;
const PROXIMITY_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const _proximityTimers = {};   // placeIndex → setTimeout handle

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R  = 6371000;
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a  = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Interpolate between the same colour stops as the map bubbles
function ratingToHex(rating) {
  const stops = [
    [1, [229, 57,  53]],
    [2, [251, 140,  0]],
    [3, [253, 216, 53]],
    [4, [124, 179, 66]],
    [5, [ 46, 125, 50]]
  ];
  const v = Math.max(1, Math.min(5, rating));
  for (let i = 0; i < stops.length - 1; i++) {
    const [r1, c1] = stops[i];
    const [r2, c2] = stops[i + 1];
    if (v <= r2) {
      const t = (v - r1) / (r2 - r1);
      const ch = [0,1,2].map(j => Math.round(c1[j] + t * (c2[j] - c1[j])));
      return `#${ch.map(n => n.toString(16).padStart(2,'0')).join('')}`;
    }
  }
  return '#2e7d32';
}

function updateProximitySlider(slider) {
  const val = parseFloat(slider.value);
  const pct = ((val - 1) / 4) * 100;
  const col = ratingToHex(val);
  slider.style.background =
    `linear-gradient(to right, ${col} 0%, ${col} ${pct}%, rgba(76,42,159,0.35) ${pct}%, rgba(76,42,159,0.35) 100%)`;
  const thumb = slider.closest('.proximity-modal')?.querySelector('.prox-color-dot');
  if (thumb) thumb.style.background = col;
}

function showProximityRatingModal(placeIndex, force = false) {
  // Don't open a second modal if one is already showing
  const existing_modal = document.getElementById('proximity-modal');
  if (existing_modal) existing_modal.remove();

  const place = SAMPLE_PLACES[placeIndex];
  const existing = getUserRating(placeIndex);

  const modal = document.createElement('div');
  modal.id = 'proximity-modal';
  modal.className = 'proximity-modal';
  modal.innerHTML = `
    <div class="proximity-card">
      <button class="proximity-close" id="prox-close">✕</button>
      <div class="proximity-icon">📍</div>
      <h2 class="proximity-title">How was<br><span class="proximity-place-name">${place.name}</span>?</h2>
      <p class="proximity-sub">You've been here a while — share your experience!</p>
      <div class="proximity-slider-wrap">
        <div class="prox-color-dot"></div>
        <input type="range" min="1" max="5" step="0.1"
               value="${existing !== null ? existing : 3}"
               class="proximity-slider" id="prox-slider">
        <div class="prox-slider-labels">
          <span>Poor</span><span>Okay</span><span>Great</span>
        </div>
      </div>
      <button class="proximity-submit" id="prox-submit">Submit Rating</button>
      <button class="proximity-skip" id="prox-skip">Not now</button>
    </div>
  `;
  document.body.appendChild(modal);

  const slider = modal.querySelector('#prox-slider');
  updateProximitySlider(slider);
  slider.addEventListener('input', () => updateProximitySlider(slider));

  modal.querySelector('#prox-close').addEventListener('click', () => modal.remove());
  modal.querySelector('#prox-skip').addEventListener('click',  () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  modal.querySelector('#prox-submit').addEventListener('click', () => {
    const rating = parseFloat(slider.value);
    // Reuse the existing rating submission logic
    const event = new CustomEvent('proximityRatingSubmit', { detail: { placeIndex, rating } });
    document.dispatchEvent(event);
    modal.querySelector('.proximity-card').innerHTML = `
      <div class="proximity-icon">🎉</div>
      <h2 class="proximity-title" style="font-size:20px">Thanks for rating<br><span class="proximity-place-name">${place.name}</span>!</h2>
      <p class="proximity-sub">Your ⭐ ${rating.toFixed(1)} rating has been saved.</p>
    `;
    setTimeout(() => modal.remove(), 2200);
  });
}

// Listen for rating submission from the proximity modal
document.addEventListener('proximityRatingSubmit', (e) => {
  const { placeIndex, rating } = e.detail;
  const place = SAMPLE_PLACES[placeIndex];
  if (!place) return;

  // Persist to localStorage using the shared key format
  saveUserRating(placeIndex, rating);

  // Update the in-memory community ratings array
  if (!place.communityRatings) place.communityRatings = [];
  if (place._localRatingIndex !== undefined) {
    place.communityRatings[place._localRatingIndex] = rating;
  } else {
    place._localRatingIndex = place.communityRatings.length;
    place.communityRatings.push(rating);
  }

  // Save to Firestore
  if (db) {
    db.collection('ratings').doc(place.name).collection('reviews').add({
      rating, timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => console.warn('Rating save error:', err));
  }

  // Refresh map bubbles
  refreshMapSource();
});

function startProximityWatch() {
  function handlePosition(pos) {
    const { latitude, longitude } = pos.coords;
    SAMPLE_PLACES.forEach((place, idx) => {
      const dist = haversineDistance(latitude, longitude, place.lat, place.lng);
      if (dist <= PROXIMITY_RADIUS_M) {
        if (!_proximityTimers[idx]) {
          _proximityTimers[idx] = setTimeout(() => {
            delete _proximityTimers[idx];
            if (getUserRating(idx) === null) showProximityRatingModal(idx);
          }, PROXIMITY_DURATION_MS);
        }
      } else {
        if (_proximityTimers[idx]) {
          clearTimeout(_proximityTimers[idx]);
          delete _proximityTimers[idx];
        }
      }
    });
  }

  // Register callback so the dev panel can inject fake positions
  window._registerFakePositionCallback && window._registerFakePositionCallback(handlePosition);

  if (!navigator.geolocation) return;
  navigator.geolocation.watchPosition(
    handlePosition,
    (err) => console.warn('Proximity watch error:', err.message),
    { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 }
  );
}

// Start watching once the map is loaded (called from inside map.on('load'))
// Exposed so the map load handler can call it
window._startProximityWatch = startProximityWatch;

// =============================================================================
// DEVELOPER TESTING PANEL — drag-to-fake-location mini-map
// =============================================================================
(function () {
  const toggle    = document.getElementById('dev-toggle');
  const panel     = document.getElementById('dev-panel');
  const closeBtn  = document.getElementById('dev-close');
  const placeList = document.getElementById('dev-place-list');
  const statusEl  = document.getElementById('dev-coord-status');
  if (!toggle || !panel) return;

  // Callback registered by startProximityWatch so we can inject fake positions
  let _fakeWatchCallback = null;
  window._registerFakePositionCallback = (cb) => { _fakeWatchCallback = cb; };

  // ── Toggle open/close ───────────────────────────────────────────────────
  let minimapInited = false;

  toggle.addEventListener('click', () => {
    const isHidden = panel.classList.toggle('dev-panel-hidden');
    if (!isHidden && !minimapInited) initMinimap();
  });
  closeBtn.addEventListener('click', () => panel.classList.add('dev-panel-hidden'));

  // ── Mini-map ────────────────────────────────────────────────────────────
  function initMinimap() {
    minimapInited = true;

    const minimap = new mapboxgl.Map({
      container: 'dev-minimap',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [COVENTRY_CENTRE.lng, COVENTRY_CENTRE.lat],
      zoom: 14.5,
      accessToken: MAPBOX_ACCESS_TOKEN,
      attributionControl: false,
      logoPosition: 'bottom-left'
    });

    // Custom person marker element
    const el = document.createElement('div');
    el.className = 'dev-person-marker';
    el.innerHTML = '🚶';

    // Pulse dot (shown when within range of a place)
    const pulse = document.createElement('div');
    pulse.className = 'dev-in-range-dot';
    pulse.style.display = 'none';
    el.style.position = 'relative';
    el.appendChild(pulse);

    const marker = new mapboxgl.Marker({ element: el, draggable: true })
      .setLngLat([COVENTRY_CENTRE.lng, COVENTRY_CENTRE.lat])
      .addTo(minimap);

    function onMarkerMove() {
      const { lat, lng } = marker.getLngLat();

      // Feed position into proximity watcher
      if (_fakeWatchCallback) {
        _fakeWatchCallback({ coords: { latitude: lat, longitude: lng } });
      }

      // Find nearest place for status text
      let nearest = null, nearestDist = Infinity;
      SAMPLE_PLACES.forEach((place, idx) => {
        const d = haversineDistance(lat, lng, place.lat, place.lng);
        if (d < nearestDist) { nearestDist = d; nearest = { place, idx, d }; }
      });

      const inRange = nearest && nearest.d <= PROXIMITY_RADIUS_M;
      pulse.style.display = inRange ? 'block' : 'none';

      if (nearest) {
        const distText = nearest.d < 1000
          ? `${Math.round(nearest.d)} m`
          : `${(nearest.d / 1000).toFixed(1)} km`;
        statusEl.style.color = inRange ? '#4ade80' : '#6b4fa0';
        statusEl.textContent = inRange
          ? `✓ Within range of ${nearest.place.name} — timer running`
          : `Nearest: ${nearest.place.name} (${distText} away)`;
      }
    }

    marker.on('drag',    onMarkerMove);
    marker.on('dragend', onMarkerMove);

    // Also add small place dots on the minimap so user can see where to drag
    minimap.on('load', () => {
      minimap.addSource('dev-places', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: SAMPLE_PLACES.map((p, i) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
            properties: { name: p.name }
          }))
        }
      });
      minimap.addLayer({
        id: 'dev-place-dots',
        type: 'circle',
        source: 'dev-places',
        paint: {
          'circle-radius': 5,
          'circle-color': '#a855f7',
          'circle-opacity': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Tooltip on hover
      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 8 });
      minimap.on('mouseenter', 'dev-place-dots', (e) => {
        minimap.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.features[0].geometry.coordinates)
          .setHTML(`<span style="font-size:11px;color:#d4b8f8">${e.features[0].properties.name}</span>`)
          .addTo(minimap);
      });
      minimap.on('mouseleave', 'dev-place-dots', () => {
        minimap.getCanvas().style.cursor = '';
        popup.remove();
      });
    });
  }

  // ── Place list — instant trigger ────────────────────────────────────────
  function buildPlaceList() {
    if (!placeList) return;
    placeList.innerHTML = '';
    SAMPLE_PLACES.forEach((place, idx) => {
      const row = document.createElement('div');
      row.className = 'dev-place-row';
      row.innerHTML = `
        <span class="dev-place-name" title="${place.name}">${place.name}</span>
        <button class="dev-trigger-btn" data-idx="${idx}">▶ Trigger</button>
      `;
      row.querySelector('.dev-trigger-btn').addEventListener('click', () => {
        showProximityRatingModal(idx, true);
        panel.classList.add('dev-panel-hidden');
      });
      placeList.appendChild(row);
    });
  }
  setTimeout(buildPlaceList, 500);
})();

// =============================================================================
// WELCOME MODAL — shown once on first visit, never again
// =============================================================================
(function () {
  const SEEN_KEY = 'proximity_welcome_seen';
  const modal    = document.getElementById('welcome-modal');
  const btn      = document.getElementById('welcome-dismiss');
  if (!modal || !btn) return;

  function dismiss() {
    modal.classList.add('hidden');
    localStorage.setItem(SEEN_KEY, '1');
    setTimeout(() => { modal.style.display = 'none'; }, 420);
  }

  // Expose so dev panel can force-show it
  window._showWelcomeModal = function () {
    modal.style.display = '';
    // Force a reflow so the animation replays
    modal.classList.remove('hidden');
    void modal.offsetWidth;
  };

  // If already seen, hide immediately with no animation
  if (localStorage.getItem(SEEN_KEY)) {
    modal.style.display = 'none';
  }

  btn.addEventListener('click', dismiss);
  modal.addEventListener('click', (e) => { if (e.target === modal) dismiss(); });

  // Dev panel "Show Introduction" button
  const devIntroBtn = document.getElementById('dev-show-intro');
  if (devIntroBtn) {
    devIntroBtn.addEventListener('click', () => {
      // Close the dev panel first so it doesn't sit on top
      document.getElementById('dev-panel').classList.add('dev-panel-hidden');
      window._showWelcomeModal();
    });
  }
})();
