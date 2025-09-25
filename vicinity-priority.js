/**
 * Vicinity Priority System for Swachh Sathi
 * This module calculates the priority of waste complaints based on their vicinity to:
 * - Schools and educational institutions
 * - Hospitals and healthcare facilities
 * - Public parks and recreational areas
 * - Residential areas with high population density
 * - Commercial districts
 */

// Priority weights for different vicinity types
const VICINITY_WEIGHTS = {
    'school': 5,      // Highest priority due to children's presence
    'hospital': 4.5,  // Critical for health reasons
    'park': 3.5,      // Important for public recreation
    'residential': 3, // Populated areas 
    'commercial': 2,  // Business districts
    'default': 1      // Default priority
};

// Maximum distance in meters for vicinity consideration
const MAX_VICINITY_DISTANCE = 500;

/**
 * Calculate priority score for a complaint based on nearby important facilities
 * @param {Object} complaintLocation - The location {lat, lng} of the complaint
 * @param {Array} nearbyFacilities - Array of facilities with type and location
 * @returns {Object} Priority data with score and affecting factors
 */
function calculateVicinityPriority(complaintLocation, nearbyFacilities = []) {
    // Default priority if no facilities are provided
    if (!nearbyFacilities || nearbyFacilities.length === 0) {
        return {
            priorityScore: VICINITY_WEIGHTS.default,
            affectingFactors: []
        };
    }

    let highestPriority = VICINITY_WEIGHTS.default;
    let affectingFactors = [];

    // Calculate distance and determine the highest priority factor
    nearbyFacilities.forEach(facility => {
        const distance = calculateDistance(
            complaintLocation.lat, 
            complaintLocation.lng,
            facility.location.lat,
            facility.location.lng
        );

        // Only consider facilities within the maximum distance
        if (distance <= MAX_VICINITY_DISTANCE) {
            // Adjust weight based on distance (closer = higher weight)
            const distanceFactor = 1 - (distance / MAX_VICINITY_DISTANCE);
            const weight = VICINITY_WEIGHTS[facility.type] || VICINITY_WEIGHTS.default;
            const adjustedWeight = weight * distanceFactor;

            // Track the facility if it contributes to priority
            if (adjustedWeight > VICINITY_WEIGHTS.default) {
                affectingFactors.push({
                    type: facility.type,
                    name: facility.name,
                    distance: Math.round(distance),
                    weight: adjustedWeight
                });
            }

            // Update highest priority if this is higher
            if (adjustedWeight > highestPriority) {
                highestPriority = adjustedWeight;
            }
        }
    });

    // Sort affecting factors by weight (highest first)
    affectingFactors.sort((a, b) => b.weight - a.weight);

    return {
        priorityScore: parseFloat(highestPriority.toFixed(1)),
        affectingFactors: affectingFactors
    };
}

/**
 * Calculate distance between two lat/lng points in meters using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // Distance in meters
}

/**
 * Get color based on priority score for visual representation
 * @param {Number} score - Priority score
 * @returns {String} Hex color code
 */
function getPriorityColor(score) {
    if (score >= 4.5) return "#ff0000"; // Critical - Red
    if (score >= 3.5) return "#ff6600"; // High - Orange
    if (score >= 2.5) return "#ffcc00"; // Medium - Yellow
    if (score >= 1.5) return "#66cc00"; // Low - Light Green
    return "#009900"; // Very Low - Green
}

/**
 * Get text description of priority level
 * @param {Number} score - Priority score
 * @returns {String} Priority level description
 */
function getPriorityLevel(score) {
    if (score >= 4.5) return "Critical";
    if (score >= 3.5) return "High";
    if (score >= 2.5) return "Medium";
    if (score >= 1.5) return "Low";
    return "Very Low";
}

/**
 * Sample facilities for testing or demonstration
 * In a real application, these would come from a database or API
 */
const SAMPLE_FACILITIES = [
    { 
        id: "school1", 
        name: "City Public School", 
        type: "school",
        location: { lat: 18.5210, lng: 73.8560 }
    },
    { 
        id: "hospital1", 
        name: "General Hospital", 
        type: "hospital",
        location: { lat: 18.5300, lng: 73.8470 }
    },
    { 
        id: "park1", 
        name: "Central Park", 
        type: "park",
        location: { lat: 18.5350, lng: 73.8820 }
    },
    { 
        id: "residential1", 
        name: "Riverside Housing Complex", 
        type: "residential",
        location: { lat: 18.5680, lng: 73.9150 }
    },
    { 
        id: "commercial1", 
        name: "Downtown Shopping Center", 
        type: "commercial",
        location: { lat: 18.5200, lng: 73.8570 }
    }
];

/**
 * Search for nearby facilities within a certain radius of a location
 * @param {Object} location - Location {lat, lng} to search around
 * @param {Array} facilitiesList - List of facilities to search through
 * @param {Number} radius - Search radius in meters (default: 1000)
 * @returns {Array} Nearby facilities
 */
function findNearbyFacilities(location, facilitiesList = SAMPLE_FACILITIES, radius = 1000) {
    return facilitiesList.filter(facility => {
        const distance = calculateDistance(
            location.lat, 
            location.lng,
            facility.location.lat,
            facility.location.lng
        );
        return distance <= radius;
    });
}

// Export functions for use in other modules
export {
    calculateVicinityPriority,
    getPriorityColor,
    getPriorityLevel,
    findNearbyFacilities,
    SAMPLE_FACILITIES
};
