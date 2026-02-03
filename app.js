// =============================================================================
// COMMUNITY MAP – Leamington Spa Bars & Pubs
// =============================================================================

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiamluZ2xlYmFsc2giLCJhIjoiY21sNm1yY2U3MDJkMDNmcjBneG5hN2RzbSJ9.S5GEGRibVdFnLfdzZIusHw';

// Google Places API Key - Get yours at: https://console.cloud.google.com/google/maps-apis
// Enable "Places API" and "Maps JavaScript API"
const GOOGLE_API_KEY = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'; // Replace with your own key for production

// Leamington Spa centre: 52.2919, -1.5358
const COVENTRY_CENTRE = { lat: 52.2919, lng: -1.5358 };

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

// =============================================================================
// PHOTO DISPLAY FUNCTIONS - OPTION A (No API Setup Required)
// =============================================================================

// Display photos using Google Images search link (no billing required)
console.log('%c🎉 Photo System: Option A (No API Setup)', 'color: #a855f7; font-weight: bold; font-size: 14px;');
console.log('✅ Photos accessible via "View Photos on Google" button');
console.log('✅ No API billing required');
console.log('✅ Click any place to view photos!');

// Function to display place information with photo search link
function displayPlacePhotos(placeName, lat, lng, callback) {
  // Return empty array to trigger the enhanced fallback display
  // This shows a nice UI with "View Photos on Google" button
  console.log(`📷 ${placeName}: Click "View Photos on Google" to see photos`);
  callback([]);
}

// -----------------------------------------------------------------------------
// BARS & PUBS IN LEAMINGTON SPA
// Categories: bar (modern bars/cocktails), pub (traditional pubs), quick_munch (food spots)
// Click on map to see coordinates in browser console for adjusting locations
// -----------------------------------------------------------------------------
const SAMPLE_PLACES = [
  // === PUBS (12) ===
  { name: 'The Fat Pug', category: 'pub', lng: -1.5483250968291211, lat: 52.292353365642995, communityRatings: [], googleRating: 4.5, googleReviewCount: 1200, description: 'Neighbourhood pub & kitchen serving craft beers and seasonal British food in a relaxed, dog-friendly setting.' },
  { name: 'The Star & Garter', category: 'pub', lng: -1.5419863867000403, lat: 52.29171471496728, communityRatings: [], googleRating: 4.3, googleReviewCount: 1456, description: 'Charming gastropub offering fresh seasonal food, quality drinks, and a warm atmosphere.' },
  { name: 'The Woodland Tavern', category: 'pub', lng: -1.5417834586726358, lat: 52.29030367225721, communityRatings: [], googleRating: 4.4, googleReviewCount: 890, description: 'Traditional British pub in the heart of Leamington Spa with real ale, cider, and cocktails.' },
  { name: 'Fizzy Moon Brewhouse & Grill', category: 'pub', lng: -1.5378148579285407, lat: 52.29028365050496, communityRatings: [], googleRating: 4.6, googleReviewCount: 2100, description: 'Award-winning craft brewery & grill with over 147 gins, microbrewery, and board games. Best Bar in Warwickshire 2018-2023.' },
  { name: 'The White Horse', category: 'pub', lng: -1.5380624571070052, lat: 52.293472963201815, communityRatings: [], googleRating: 4.4, googleReviewCount: 734, description: 'Historic pub dating back to the 1830s with courtyard beer garden, cask ales, and hearty British fare.' },
  { name: 'Copper Pot', category: 'pub', lng: -1.537273160042559, lat: 52.29198660532184, communityRatings: [], googleRating: 4.1, googleReviewCount: 677, description: 'Quaint local pub serving traditional pub food with global influences, and an extensive gin & whiskey collection.' },
  { name: 'The Benjamin Satchwell', category: 'pub', lng: -1.5355806474284965, lat: 52.2897581971137, communityRatings: [], googleRating: 4.1, googleReviewCount: 2345, description: 'JD Wetherspoon pub offering great value food and drink with up to 6 rotating guest ales.' },
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
          isMarked: isMarked
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

map.on('load', () => {
  console.log('10. ✅ Map loaded successfully!');
  
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
  
  function getUserRating(placeIndex) {
    const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
    return userRatings[placeIndex] || null;
  }

  function saveUserRating(placeIndex, rating) {
    const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
    userRatings[placeIndex] = rating;
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
  }

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
          1.0, '#ffeb3b',  // Yellow (lowest)
          2.0, '#ffc107',  // Amber
          3.0, '#ff9800',  // Orange
          4.0, '#f44336',  // Red
          5.0, '#b71c1c'   // Dark red (highest)
        ],
        'circle-stroke-width': [
          'case',
          ['get', 'isMarked'],
          5,  // Thicker outline for marked places
          2   // Normal outline for unmarked places
        ],
        'circle-stroke-color': '#fff',
        'circle-opacity': 0.6
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
  
  // Add a label to the left of the geolocation button
  const locationLabel = document.createElement('div');
  locationLabel.className = 'location-button-label';
  locationLabel.innerHTML = '📍 See your Live Location ->';
  document.body.appendChild(locationLabel);
  
  console.log('📍 Geolocation control added to map - ready to be triggered');
  console.log('✨ Location label added next to button');
  
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

  // Auto-trigger location if user previously allowed it
  // Increased delay to ensure everything is fully loaded
  setTimeout(() => {
    const locationChoice = localStorage.getItem('locationChoice');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 AUTO-TRIGGER CHECK');
    console.log('   Location choice from localStorage:', locationChoice);
    console.log('   Geolocate control exists:', !!geolocateControl);
    console.log('   Map is loaded:', map.loaded());
    
    if (locationChoice === 'allowed') {
      console.log('✅ CONDITIONS MET - AUTO-TRIGGERING LOCATION NOW!');
      console.log('📍 Calling geolocateControl.trigger()...');
      
      try {
        // Trigger the geolocation control to show live location
        geolocateControl.trigger();
        console.log('✅ ✅ ✅ SUCCESS! Trigger called successfully!');
        console.log('💡 The blue pulsing location dot should appear on the map');
        console.log('💡 Check your browser permissions if nothing appears');
      } catch (error) {
        console.error('❌ ERROR triggering geolocation:', error);
        console.error('   Error details:', error.message, error.stack);
      }
    } else {
      console.log('ℹ️ Location not previously allowed');
      console.log('💡 User needs to click "Enable Location" or the location button');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, 1500);

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
    popup.setLngLat(feat.geometry.coordinates)
      .setHTML(`<strong>${feat.properties.name}</strong>`)
      .addTo(map);
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'place-bubbles', () => {
    console.log('🖱️ Mouse left circle');
    popup.remove();
    map.getCanvas().style.cursor = '';
  });

  // Rating popup on click
  const votePopup = new mapboxgl.Popup({ 
    closeButton: true, 
    className: 'vote-popup', 
    maxWidth: '90vw',  // Max 90% of viewport width for small screens
    anchor: 'bottom',  // Anchor popup to bottom, so it appears on top of the circle
    offset: 25         // Offset from the circle center
  });
  
  map.on('click', 'place-bubbles', (e) => {
    console.log('🖱️ Circle clicked!', e.features[0].properties.name);
    const feat = e.features[0];
    const placeIndex = feat.id;
    const props = feat.properties;
    popup.remove();
    
    // Center the map on the clicked circle with smooth animation
    const coordinates = feat.geometry.coordinates.slice(); // Copy coordinates
    console.log('📍 Centering map on:', coordinates);
    
    // Get viewport size for responsive centering
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Calculate offset to position popup optimally
    // Popup appears above the circle, so we offset downward to bring circle up
    const verticalOffset = viewportHeight > 600 ? 150 : 100; // More offset on larger screens
    
    // Smoothly pan map to center on the clicked location
    map.easeTo({
      center: coordinates,
      duration: 600, // 600ms smooth animation
      offset: [0, verticalOffset] // Offset downward so circle moves up and popup has space above
    });
    
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.name + ' Leamington Spa')}`;
    const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(props.name + ' Leamington Spa')}`;
    
    // Check if user has previously rated this place
    const previousRating = getUserRating(placeIndex);
    const defaultValue = previousRating !== null ? previousRating : 3;
    const hintText = previousRating !== null ? 'Drag to update your rating' : 'Drag to rate';
    
    // Check if place is marked
    const isMarked = isPlaceMarked(placeIndex);
    const markButtonText = isMarked ? '⭐ Marked' : '☆ Mark Place';
    const markButtonClass = isMarked ? 'mark-button marked' : 'mark-button';
    
    // Show popup with loading state (after a tiny delay to let centering start)
    setTimeout(() => {
      votePopup.setLngLat(coordinates).setHTML(`
      <div class="vote-panel">
        <h3>${props.name}</h3>
        
        <!-- Photo Gallery -->
        <div class="place-photos" id="photo-gallery-${placeIndex}">
          <div class="photo-loading">
            <p>📸 Loading photos...</p>
          </div>
        </div>
        
        <p class="place-description">${props.description}</p>
        
        <div class="place-links">
          <a href="${googleMapsUrl}" target="_blank" class="google-maps-link">📍 Open in Google Maps</a>
          <button class="${markButtonClass}" data-place-idx="${placeIndex}">${markButtonText}</button>
        </div>
        
        <label class="rating-label">
          <span>How good was it?</span>
          <span class="place-rating">⭐ ${props.averageRating}</span>
        </label>
        <input type="range" min="1" max="5" step="0.01" value="${defaultValue}" class="vote-slider" data-idx="${placeIndex}">
        <p class="slider-hint">${hintText}</p>
        ${previousRating !== null ? '<p class="previous-rating">Your rating: ⭐ ' + previousRating.toFixed(1) + '</p>' : ''}
      </div>
    `).addTo(map);
      
      // Display photos with Google Images link (Option A - no API required)
      displayPlacePhotos(props.name, props.lat, props.lng, (photoUrls) => {
        const gallery = document.getElementById(`photo-gallery-${placeIndex}`);
        if (!gallery) return;
        
        // Show clean interface with photo search button
        gallery.innerHTML = `
          <div class="photo-fallback">
            <div class="fallback-icon">📸</div>
            <a href="${googleImagesUrl}" target="_blank" class="view-photos-button">
              🔍 View Photos on Google
            </a>
          </div>
        `;
      });
    }, 100); // Small delay to let map centering animation start
  });

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
        
        // Trigger multiple animation layers for marked place
        animateMarkCircle(placeIdx);
        
        // Add temporary animated property to trigger circle animation
        SAMPLE_PLACES[placeIdx].justMarked = true;
        
        // Update map immediately with animation property
        map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
        
        // Remove animation property after animation completes
        setTimeout(() => {
          delete SAMPLE_PLACES[placeIdx].justMarked;
          map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
        }, 800);
      } else {
        e.target.classList.remove('marked');
        e.target.textContent = '☆ Mark Place';
        console.log(`❌ Place ${placeIdx} unmarked`);
        
        // Update map to show normal stroke
        map.getSource('places').setData(placesToGeoJSON(SAMPLE_PLACES));
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
      
      // Close popup after 2 seconds
      setTimeout(() => {
        votePopup.remove();
      }, 2000);
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
    
    console.log('🔍 Active categories:', activeCategories);
    
    if (activeCategories.length === 0) {
      // If no categories selected, hide all circles
      map.setFilter('place-bubbles', ['==', 'category', '']);
    } else {
      // Show circles matching selected categories
      map.setFilter('place-bubbles', ['in', ['get', 'category'], ['literal', activeCategories]]);
    }
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateFilters));
  
  // Apply filters after a small delay to ensure layer is ready
  setTimeout(() => {
    updateFilters();
    console.log('✅ Event handlers and filters ready!');
    console.log('✅ Try clicking on a circle now!');
  }, 100);
  } // End of setupEventHandlers function
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

// -----------------------------------------------------------------------------
// LOCATION POPUP LOGIC
// -----------------------------------------------------------------------------
const locationPopup = document.getElementById('location-popup');
const enableLocationBtn = document.getElementById('enable-location-btn');
const skipLocationBtn = document.getElementById('skip-location-btn');

// Show popup when page loads
window.addEventListener('load', () => {
  // Check if user previously dismissed or allowed location
  const locationChoice = localStorage.getItem('locationChoice');
  
  console.log('🔍 Checking location preference...', locationChoice ? `Found: ${locationChoice}` : 'Not found (first time)');
  
  if (!locationChoice) {
    // First time visitor - show popup after a brief delay
    setTimeout(() => {
      locationPopup.classList.remove('hidden');
      console.log('📍 Location popup displayed (first time only)');
    }, 1500);
  } else {
    // User has already made a choice - keep popup hidden
    console.log('✅ Location choice already saved - popup will stay hidden');
    if (locationChoice === 'allowed') {
      console.log('💡 Live location will auto-activate once map is loaded');
    } else {
      console.log('💡 Use the location button in top-right corner to enable location tracking');
    }
  }
});

// Handle "Enable Location" button click
enableLocationBtn.addEventListener('click', () => {
  console.log('📍 User clicked Enable Location button');
  
  // Hide popup
  locationPopup.classList.add('hidden');
  
  // Save choice
  localStorage.setItem('locationChoice', 'allowed');
  console.log('✅ Choice saved: allowed - popup will never show again');
  
  console.log('🔍 Checking if browser supports geolocation...');
  
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    console.error('❌ Geolocation not supported');
    return;
  }
  
  console.log('✅ Geolocation is supported!');
  console.log('⏳ Requesting your location...');
  console.log('💡 A permission popup should appear - click "Allow"');
  
  // Trigger the Mapbox geolocation control to show the live location icon
  const triggerMapboxLocation = () => {
    if (geolocateControl && map.loaded()) {
      console.log('🎯 Activating Mapbox live location icon...');
      geolocateControl.trigger();
      console.log('✅ Live location icon enabled - tracking your position in real-time');
      console.log('💡 Blue pulsing dot shows your location on the map');
      console.log('💡 Map will NOT auto-center - you stay in control');
    } else {
      setTimeout(triggerMapboxLocation, 200);
    }
  };
  triggerMapboxLocation();
});

// Handle "Skip" button click
skipLocationBtn.addEventListener('click', () => {
  console.log('📍 User skipped location');
  
  // Hide popup
  locationPopup.classList.add('hidden');
  
  // Save choice
  localStorage.setItem('locationChoice', 'skipped');
  console.log('✅ Choice saved: skipped - popup will never show again');
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
