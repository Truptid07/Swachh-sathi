import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDocs, where, query, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

setLogLevel('debug');

const firebaseConfig = {
    apiKey: "AIzaSyDqSF10F3-BLTNDXS7v4uIMVg2QbM8DO44",
    authDomain: "info-auth-3b05f.firebaseapp.com",
    projectId: "info-auth-3b05f",
    storageBucket: "info-auth-3b05f.firebasestorage.app",
    messagingSenderId: "1064210800567",
    appId: "1:1064210800567:web:1bdda4cea208e110131232",
    measurementId: "G-F9FWZNSTXG"
};

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : JSON.stringify(firebaseConfig);
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "adminpassword123";

let app, auth, db;
let user, userRole;
let complaints = [];
let tasks = [];
let map;
let mapboxMarkers = [];
let routeLayerId = 'route';
let routeSourceId = 'route';
let modalCallback;
let videoStream;
let currentRole = null;

const showModal = (message, isConfirm = false, onConfirm = null) => {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal-confirm').classList.toggle('hidden', !isConfirm);
    document.getElementById('modal-cancel').classList.toggle('hidden', !isConfirm);
    document.getElementById('modal-ok').classList.toggle('hidden', isConfirm);
    document.getElementById('modal').classList.remove('hidden');
    if (isConfirm) {
        modalCallback = onConfirm;
    }
};

const closeModal = () => {
    document.getElementById('modal').classList.add('hidden');
    modalCallback = null;
};

const showComplaintModal = (complaint) => {
    const modal = document.getElementById('complaint-modal');
    const content = document.getElementById('complaint-modal-content');
    
    let imageUrl = complaint.imageUrl || 'https://placehold.co/400x300';
    let buttonHtml = '';
    if (userRole === 'worker' && complaint.status === 'Assigned') {
        buttonHtml = `
            <div class="mt-4">
                <form id="worker-resolve-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Upload Photo of Cleaned Site</label>
                        <input type="file" name="cleaned-image" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required />
                    </div>
                    <button type="submit" data-id="${complaint.id}" class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Mark as Resolved
                    </button>
                </form>
            </div>
        `;
    }
    if (userRole === 'admin' && complaint.status === 'Pending Verification') {
        buttonHtml = `
            <div class="mt-4 flex space-x-2">
                <button id="admin-verify-btn" data-id="${complaint.id}" class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Verify</button>
                <button id="admin-reject-btn" data-id="${complaint.id}" class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Reject</button>
            </div>
        `;
    }

    content.innerHTML = `
        <img src="${imageUrl}" class="w-full h-auto rounded-md mb-4" alt="Complaint Image">
        <p><strong>Description:</strong> ${complaint.description}</p>
        <p><strong>Location:</strong> ${complaint.locationName}</p>
        <p><strong>Waste Type:</strong> ${complaint.wasteType}</p>
        <p><strong>Status:</strong> <span class="font-bold ${getComplaintStatusColor(complaint.status)}">${complaint.status}</span></p>
        ${complaint.resolvedImageUrl ? `<p class="mt-4"><strong>Cleaned Site:</strong> <img src="${complaint.resolvedImageUrl}" class="w-full h-auto rounded-md mt-2" alt="Cleaned Site Image"></p>` : ''}
        ${buttonHtml}
    `;
    
    modal.classList.remove('hidden');

    document.getElementById('close-complaint-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    if (userRole === 'worker' && complaint.status === 'Assigned') {
        document.getElementById('worker-resolve-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleMarkAsResolved(complaint.id);
            modal.classList.add('hidden');
        });
    }
    if (userRole === 'admin' && complaint.status === 'Pending Verification') {
        document.getElementById('admin-verify-btn').addEventListener('click', () => handleAdminVerification(complaint.id, 'Resolved'));
        document.getElementById('admin-reject-btn').addEventListener('click', () => handleAdminVerification(complaint.id, 'Assigned'));
    }
};

const getPinColor = (type) => {
    let color;
    switch (type) {
        case 'Hazardous Waste': color = 'red'; break;
        case 'Construction Trash': color = 'yellow'; break;
        case 'Pending Verification': color = 'orange'; break;
        case 'Resolved': color = 'green'; break;
        default: color = 'blue'; break;
    }
    const el = document.createElement('div');
    el.className = 'marker-pin';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.backgroundColor = color;
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
    return el;
};

const getComplaintStatusColor = (status) => {
    switch (status) {
        case 'Pending':
            return 'text-yellow-600';
        case 'In Progress':
            return 'text-blue-600';
        case 'Pending Verification':
            return 'text-orange-600';
        case 'Resolved':
            return 'text-green-600';
        default:
            return 'text-gray-600';
    }
};

const initFirebase = async () => {
    try {
        app = initializeApp(JSON.parse(firebaseConfigStr));
        auth = getAuth(app);
        db = getFirestore(app);
        
        onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                user = authUser;
                // Don't render content immediately, wait for role selection or if role is already known
                if (userRole) { 
                    setupFirestoreListeners();
                    if (userRole === 'citizen') renderContent('citizen', 'home');
                    if (userRole === 'worker') renderContent('worker', 'dashboard');
                    if (userRole === 'admin') renderContent('admin', 'dashboard');
                }
            } else {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    // Don't sign in anonymously right away, wait for user action
                }
            }
        });
        console.log("Firebase initialized successfully.");
    } catch (e) {
        console.error("Error initializing Firebase: ", e);
        showModal("Failed to initialize Firebase. Check console for details.");
    }
};

const dummyComplaints = [
    { id: "dummy1", description: "Large pile of household trash", locationName: "Main Street, Pune", location: { lat: 18.5204, lng: 73.8567 }, wasteType: "Household Trash", status: "Assigned", submittedAt: "2023-10-25T10:00:00Z", submittedBy: "dummy_worker_1" },
    { id: "dummy2", description: "Construction debris near a school", locationName: "Shivaji Nagar, Pune", location: { lat: 18.5309, lng: 73.8475 }, wasteType: "Construction Trash", status: "Assigned", submittedAt: "2023-10-25T10:15:00Z", submittedBy: "dummy_worker_1" },
    { id: "dummy3", description: "Bio-hazardous waste in alley", locationName: "Koregaon Park, Pune", location: { lat: 18.5391, lng: 73.8824 }, wasteType: "Hazardous Waste", status: "Assigned", submittedAt: "2023-10-25T10:30:00Z", submittedBy: "dummy_worker_1" },
    { id: "dummy4", description: "Yard waste blocking sidewalk", locationName: "Viman Nagar, Pune", location: { lat: 18.5678, lng: 73.9143 }, wasteType: "Green Waste", status: "Assigned", submittedAt: "2023-10-25T10:45:00Z", submittedBy: "dummy_worker_1" }
];

const setupFirestoreListeners = () => {
    if (!db) return; // Guard against db not being initialized
    const complaintsCollection = collection(db, `/artifacts/${appId}/public/data/complaints`);
    const tasksCollection = collection(db, `/artifacts/${appId}/public/data/tasks`);

    onSnapshot(complaintsCollection, (snapshot) => {
        complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        updateUI();
    });

    onSnapshot(tasksCollection, (snapshot) => {
        tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        updateUI();
    });
    
    dummyComplaints.forEach(async (dummy) => {
        const q = query(complaintsCollection, where("id", "==", dummy.id));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            await setDoc(doc(complaintsCollection, dummy.id), dummy);
        }
    });
};

const renderContent = (role, view) => {
    const authView = document.getElementById('auth-view');
    const roleAuthView = document.getElementById('role-auth-view');
    const contentView = document.getElementById('content-view');

    authView.classList.add('hidden');
    roleAuthView.classList.add('hidden');
    contentView.classList.remove('hidden');
    userRole = role;
    
    // Setup listeners once the user is logged in and has a role
    setupFirestoreListeners();
    
    let htmlContent = '';
    if (role === 'citizen') {
        const citizenName = user.displayName || user.email || 'Anonymous Citizen';
        htmlContent = `
            <nav class="bg-white rounded-lg shadow-md mb-6 p-4 flex flex-col md:flex-row justify-between items-center">
                <span class="text-xl font-bold text-gray-800 mb-2 md:mb-0">Hello, ${citizenName}!</span>
                <div class="flex space-x-2 md:space-x-4">
                    <button class="nav-btn px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors" data-view="home">Home</button>
                    <button class="nav-btn px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors" data-view="report">Report a Problem</button>
                    <button class="nav-btn px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors" data-view="education">Waste Management Education</button>
                    <button class="nav-btn px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors" data-view="pmc">PMC/Municipal Info</button>
                    <button class="nav-btn px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors" data-view="jobs">Worker Job Application</button>
                    <button id="logout-button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                        Logout
                    </button>
                </div>
            </nav>
            <div id="citizen-view-container" class="bg-white rounded-lg shadow-xl p-4 md:p-6 bg-waste-pattern bg-blend-multiply bg-opacity-75"></div>
        `;
        contentView.innerHTML = htmlContent;
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', (e) => renderCitizenView(e.target.dataset.view));
        });
        document.getElementById('logout-button').addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.reload(); // Easiest way to reset state
            } catch (error) {
                console.error("Logout error:", error);
                showModal("Failed to log out.");
            }
        });
        renderCitizenView(view);

    } else if (role === 'worker') {
        htmlContent = `
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Worker Tasks Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col items-center">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Map of Complaints</h3>
                    <button id="optimize-route-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mb-4">Optimize Route</button>
                    <div id="map" class="w-full h-96 rounded-md shadow-inner"></div>
                    <div class="flex space-x-2 mt-2 text-sm">
                        <span class="flex items-center"><div class="w-3 h-3 bg-red-500 rounded-full mr-1"></div>Hazardous Waste</span>
                        <span class="flex items-center"><div class="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>Construction Trash</span>
                        <span class="flex items-center"><div class="w-3 h-3 bg-green-500 rounded-full mr-1"></div>Other Waste</span>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Assigned Complaints List</h3>
                    <ul id="worker-task-list" class="space-y-4 max-h-96 overflow-y-auto"></ul>
                </div>
            </div>
            <button id="logout-button" class="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                Logout
            </button>
        `;
        contentView.innerHTML = htmlContent;
        document.getElementById('optimize-route-btn').addEventListener('click', handleOptimizeRoute);
        document.getElementById('logout-button').addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.reload();
            } catch (error) {
                console.error("Logout error:", error);
                showModal("Failed to log out.");
            }
        });
        initMapbox();
        updateUI();
    } else if (role === 'admin') {
        const totalComplaints = complaints.length;
        const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
        const pendingVerificationComplaints = complaints.filter(c => c.status === 'Pending Verification').length;
        
        const calculateAverageTime = () => {
            const resolved = complaints.filter(c => c.status === 'Resolved' && c.submittedAt && c.resolvedAt);
            if (resolved.length === 0) return 'N/A';
            const totalTime = resolved.reduce((sum, c) => {
                const submitted = new Date(c.submittedAt).getTime();
                const resolvedTime = new Date(c.resolvedAt).getTime();
                return sum + (resolvedTime - submitted);
            }, 0);
            const avgMs = totalTime / resolved.length;
            const avgDays = avgMs / (1000 * 60 * 60 * 24);
            return `${avgDays.toFixed(2)} days`;
        };

        htmlContent = `
            <nav class="bg-white rounded-lg shadow-md mb-6 p-4 flex flex-col md:flex-row justify-between items-center">
                <span style="margin-top: 80px;" class="text-xl font-bold text-gray-800 mb-2 md:mb-0">Admin Dashboard</span>
                <div class="flex space-x-2 md:space-x-4">
                    <button class="nav-btn px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors" id="logout-button">
                        Logout
                    </button>
                </div>
            </nav>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-white rounded-lg shadow p-4 text-center">
                    <p class="text-2xl font-bold text-blue-600">${totalComplaints}</p>
                    <p class="text-sm text-gray-500">Total Complaints</p>
                </div>
                <div class="bg-white rounded-lg shadow p-4 text-center">
                    <p class="text-2xl font-bold text-green-600">${resolvedComplaints}</p>
                    <p class="text-sm text-gray-500">Resolved Complaints</p>
                </div>
                <div class="bg-white rounded-lg shadow p-4 text-center">
                    <p class="text-2xl font-bold text-orange-600">${pendingVerificationComplaints}</p>
                    <p class="text-sm text-gray-500">Pending Verification</p>
                </div>
                <div class="bg-white rounded-lg shadow p-4 text-center">
                    <p class="text-2xl font-bold text-gray-600">${calculateAverageTime()}</p>
                    <p class="text-sm text-gray-500">Avg. Time to Complete</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col items-center">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Citywide Complaints Map</h3>
                    <div id="map" class="w-full h-96 rounded-md shadow-inner"></div>
                    <div class="flex space-x-2 mt-2 text-sm">
                        <span class="flex items-center"><div class="w-3 h-3 bg-red-500 rounded-full mr-1"></div>Hazardous Waste</span>
                        <span class="flex items-center"><div class="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>Construction Trash</span>
                        <span class="flex items-center"><div class="w-3 h-3 bg-green-500 rounded-full mr-1"></div>Other Waste</span>
                        <span class="flex items-center"><div class="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>Pending Verification</span>
                    </div>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Worker Management</h3>
                    <div class="flex space-x-2 mb-4">
                        <button class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Add Worker</button>
                        <button class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Remove Worker</button>
                        <button class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Edit Worker</button>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Reporting and Analytics</h3>
                    <button class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Generate Report</button>
                </div>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mt-8 mb-4">All Complaints</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white rounded-lg shadow-md">
                    <thead>
                        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left">ID</th>
                            <th class="py-3 px-6 text-left">Description</th>
                            <th class="py-3 px-6 text-left">Location</th>
                            <th class="py-3 px-6 text-left">Submitted By</th>
                            <th class="py-3 px-6 text-left">Status</th>
                            <th class="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="admin-complaint-table" class="text-gray-600 text-sm font-light"></tbody>
                </table>
            </div>
        `;
        contentView.innerHTML = htmlContent;
        document.getElementById('logout-button').addEventListener('click', async () => {
            try {
                // No sign out needed for dummy admin, just reload
                window.location.reload();
            } catch (error) {
                console.error("Logout error:", error);
                showModal("Failed to log out.");
            }
        });
        initMapbox();
        updateUI();
    }
};

const renderCitizenView = (view) => {
    const container = document.getElementById('citizen-view-container');
    let viewHtml = '';
    stopCamera();

    switch (view) {
        case 'home':
            viewHtml = `
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Your Previous Complaints</h2>
                <button id="file-new-complaint-btn" class="w-full md:w-auto px-6 py-3 rounded-md shadow-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors mb-6">
                    File New Complaint
                </button>
                <div id="citizen-complaint-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            `;
            break;
        case 'report':
            viewHtml = `
                <h2 class="text-2xl font-bold text-gray-800 mb-6">File a New Complaint</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <form id="complaint-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Upload Image</label>
                                <div class="flex space-x-4 mb-2">
                                    <button type="button" id="upload-file-btn" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Choose from File</button>
                                    <button type="button" id="capture-photo-btn" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Capture from Camera</button>
                                </div>
                                <input type="file" name="image" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                <div id="camera-container" class="mt-4 hidden flex flex-col items-center">
                                    <video id="camera-feed" class="w-full max-w-sm rounded-md shadow-inner" autoplay></video>
                                    <button type="button" id="take-photo-btn" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Take Photo</button>
                                    <canvas id="photo-canvas" class="hidden"></canvas>
                                    <img id="captured-photo" class="mt-4 hidden w-full max-w-sm rounded-md shadow-md" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Location Name</label>
                                <input type="text" id="location-name-input" name="location" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" placeholder="e.g., Park Road, Block A" required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Type of Waste</label>
                                <select name="waste-type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
                                    <option value="Household Trash">Household Trash</option>
                                    <option value="Construction Trash">Construction Trash</option>
                                    <option value="Green Waste">Green Waste</option>
                                    <option value="Hazardous Waste">Hazardous Waste</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Description (Optional)</label>
                                <textarea name="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" placeholder="Describe the issue..."></textarea>
                            </div>
                            <button type="submit" class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Submit Complaint
                            </button>
                        </form>
                    </div>
                    <div class="flex flex-col items-center">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">Current Location</h3>
                        <div id="map" class="w-full h-80 rounded-md shadow-inner"></div>
                    </div>
                </div>
            `;
            break;
        case 'education':
            viewHtml = `
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Waste Management Education</h2>
                <div class="prose max-w-none">
                    <p>Proper waste management is crucial for a clean and healthy environment. Here are some tips and guidelines:</p>
                    <h3 class="text-xl font-bold mt-4 mb-2">Segregation</h3>
                    <p>Separate your waste into different bins: **wet waste** (food scraps, garden waste), **dry waste** (plastic, paper, metal), and **hazardous waste** (batteries, light bulbs, expired medicines).</p>
                    <h3 class="text-xl font-bold mt-4 mb-2">Recycling</h3>
                    <p>Recycle materials like plastic bottles, newspapers, and aluminum cans. Look for recycling symbols on products.</p>
                    <h3 class="text-xl font-bold mt-4 mb-2">Composting</h3>
                    <p>Composting kitchen waste turns it into nutrient-rich soil for your plants.</p>
                </div>
            `;
            break;
        case 'pmc':
            viewHtml = `
                <h2 class="text-2xl font-bold text-gray-800 mb-6">PMC/Municipal Info</h2>
                <div class="prose max-w-none">
                    <p>Welcome to the official information hub for the Pune Municipal Corporation's sanitation department.</p>
                    <h3 class="text-xl font-bold mt-4 mb-2">Contact Information</h3>
                    <ul class="list-disc list-inside">
                        <li>**Sanitation Department Helpline:** 1800-XXX-XXXX</li>
                        <li>**Email:** sanitation@pmc.gov.in</li>
                    </ul>
                    <h3 class="text-xl font-bold mt-4 mb-2">Announcements</h3>
                    <p>Check back here for the latest news and announcements regarding waste collection schedules, special drives, and cleanliness campaigns in your area.</p>
                </div>
            `;
            break;
        case 'jobs':
            viewHtml = `
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Worker Job Application</h2>
                <div class="prose max-w-none">
                    <p>Interested in joining the sanitation team? We are looking for dedicated individuals to help us keep our city clean.</p>
                    <h3 class="text-xl font-bold mt-4 mb-2">Current Openings</h3>
                    <ul class="list-disc list-inside">
                        <li>Sanitation Worker</li>
                        <li>Waste Collection Driver</li>
                        <li>Recycling Center Technician</li>
                    </ul>
                    <p class="mt-4">For more information and to apply, please contact the municipal office during business hours or check the official PMC website for job announcements.</p>
                </div>
            `;
            break;
    }
    container.innerHTML = viewHtml;
    if (view === 'report' || userRole === 'admin' || userRole === 'worker') {
        initMapbox();
    }
    updateUI();
};

const updateUI = () => {
    if (!user && userRole !== 'admin') return;

    if (userRole === 'citizen') {
        const list = document.getElementById('citizen-complaint-list');
        const fileNewComplaintBtn = document.getElementById('file-new-complaint-btn');
        const complaintForm = document.getElementById('complaint-form');

        if (list) {
            list.innerHTML = complaints.filter(c => c.submittedBy === user.uid).map(c => `
                <div class="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  
                    <div class="flex-1">
                        <p class="text-gray-800 font-semibold text-lg">${c.description}</p>
                        <p class="text-sm text-gray-600 mt-1">Location: ${c.locationName}</p>
                        <p class="text-sm text-gray-600 mt-1">Waste Type: ${c.wasteType}</p>
                        <p class="text-sm mt-1 font-medium ${getComplaintStatusColor(c.status)}">Status: ${c.status}</p>
                        <p class="text-xs text-gray-500 mt-1">Submitted on: ${new Date(c.submittedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');
        }

        if (fileNewComplaintBtn) {
            fileNewComplaintBtn.addEventListener('click', () => renderCitizenView('report'));
        }

        if (complaintForm) {
            complaintForm.addEventListener('submit', handleSubmitComplaint);
            document.getElementById('upload-file-btn').addEventListener('click', () => {
                document.querySelector('input[name="image"]').click();
            });
            document.getElementById('capture-photo-btn').addEventListener('click', startCamera);
            document.getElementById('take-photo-btn').addEventListener('click', capturePhoto);
        }
    } else if (userRole === 'worker') {
        const list = document.getElementById('worker-task-list');
        const activeComplaints = complaints.filter(c => c.status === 'Assigned' || c.status === 'In Progress');
        if (list) {
            list.innerHTML = activeComplaints.map(complaint => `
                <li class="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer complaint-list-item" data-id="${complaint.id}">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-gray-800 font-semibold">${complaint.locationName}</p>
                            <p class="text-sm text-gray-600 mt-1">${complaint.wasteType}</p>
                            <p class="text-sm mt-1 font-medium ${getComplaintStatusColor(complaint.status)}">Status: ${complaint.status}</p>
                        </div>
                    </div>
                </li>
            `).join('');
            document.querySelectorAll('.complaint-list-item').forEach(item => {
                item.addEventListener('click', () => {
                    const complaint = complaints.find(c => c.id === item.dataset.id);
                    if (complaint) showComplaintModal(complaint);
                });
            });
        }
        
        if (map) {
            mapboxMarkers.forEach(m => m.remove());
            mapboxMarkers = activeComplaints.map(complaint => {
                const markerElement = getPinColor(complaint.wasteType);
                const marker = new mapboxgl.Marker({ element: markerElement })
                    .setLngLat([complaint.location.lng, complaint.location.lat])
                    .addTo(map);
                markerElement.addEventListener('click', () => showComplaintModal(complaint));
                return marker;
            });
            
            if (activeComplaints.length > 0) {
                const bounds = new mapboxgl.LngLatBounds();
                activeComplaints.forEach(c => bounds.extend([c.location.lng, c.location.lat]));
                map.fitBounds(bounds, { padding: 50 });
            }
        }

    } else if (userRole === 'admin') {
        const complaintTable = document.getElementById('admin-complaint-table');
        if (!complaintTable) return;
        complaintTable.innerHTML = complaints.map(complaint => `
            <tr class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 text-left whitespace-nowrap">${complaint.id.substring(0, 6)}...</td>
                <td class="py-3 px-6 text-left">${complaint.description}</td>
                <td class="py-3 px-6 text-left">${complaint.locationName}</td>
                <td class="py-3 px-6 text-left">${complaint.submittedByName || 'N/A'}</td>
                <td class="py-3 px-6 text-left">
                    <span class="py-1 px-3 rounded-full text-xs font-semibold ${getComplaintStatusColor(complaint.status)}">
                        ${complaint.status}
                    </span>
                </td>
                <td class="py-3 px-6 text-center">
                    <div class="flex items-center justify-center space-x-2">
                        <button data-id="${complaint.id}" class="assign-task-btn text-white bg-blue-500 hover:bg-blue-600 font-bold py-1 px-3 rounded-md transition-colors">
                            Assign Task
                        </button>
                        <button data-id="${complaint.id}" class="delete-complaint-btn text-white bg-red-500 hover:bg-red-600 font-bold py-1 px-3 rounded-md transition-colors">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.assign-task-btn').forEach(button => {
            button.addEventListener('click', (e) => handleAssignTask(e.target.dataset.id));
        });
        document.querySelectorAll('.delete-complaint-btn').forEach(button => {
            button.addEventListener('click', (e) => handleDeleteComplaint(e.target.dataset.id));
        });
        
        if (map) {
            mapboxMarkers.forEach(m => m.remove());
            mapboxMarkers = complaints.map(complaint => {
                const markerElement = getPinColor(complaint.status);
                const marker = new mapboxgl.Marker({ element: markerElement })
                    .setLngLat([complaint.location.lng, complaint.location.lat])
                    .addTo(map);
                markerElement.addEventListener('click', () => showComplaintModal(complaint));
                return marker;
            });
            
            if (complaints.length > 0) {
                const bounds = new mapboxgl.LngLatBounds();
                complaints.forEach(c => bounds.extend([c.location.lng, c.location.lat]));
                map.fitBounds(bounds, { padding: 50 });
            }
        }
    }
};


const initMapbox = async () => {
    const defaultLocation = [73.8567, 18.5204]; // [lng, lat] for Pune
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    // Make sure to set the access token before creating the map
    mapboxgl.accessToken = 'pk.eyJ1IjoidHJ1cHRpMTkiLCJhIjoiY21lMzcwODVzMDRueTJsczhpaHYyYzlqbSJ9.krw31KDYmNR-N3y1rsLBmQ';
    
    // Add a console log to debug
    console.log("Initializing Mapbox with token:", mapboxgl.accessToken);

    try {
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: defaultLocation,
            zoom: 12
        });

        console.log("Map object created successfully:", map);

        map.on('load', () => {
            console.log("Map loaded successfully");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLngLat = [position.coords.longitude, position.coords.latitude];
                        if (userRole === 'citizen' || userRole === 'worker') {
                            map.setCenter(userLngLat);
                            map.setZoom(15);
                        }
                        if (userRole === 'citizen') {
                            const markerElement = getPinColor('blue');
                            new mapboxgl.Marker({ element: markerElement })
                                .setLngLat(userLngLat)
                                .addTo(map);
                        }
                    },
                    (error) => {
                        console.error("Geolocation failed:", error);
                        console.log("Using default location.");
                    }
                );
            }
        });

        // Add error handling for map
        map.on('error', (e) => {
            console.error("Mapbox error:", e);
        });
    } catch (error) {
        console.error("Error initializing Mapbox:", error);
    }
};


const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!db) { showModal("Database not ready."); return; }
    
    let lat, lng;
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
    } catch (err) {
        console.error("Geolocation error:", err);
        showModal("Failed to get location. Please enable location services.");
        return;
    }

    const form = e.target;
    const newComplaint = {
        description: form.description.value,
        locationName: form.location.value,
        location: { lat, lng },
        wasteType: form['waste-type'].value,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        submittedBy: user.uid,
        submittedByName: user.displayName || user.email || 'Anonymous Citizen',
        imageUrl: document.getElementById('captured-photo').src || 'https://placehold.co/400x300'
    };
    
    try {
        await addDoc(collection(db, `/artifacts/${appId}/public/data/complaints`), newComplaint);
        showModal("Complaint submitted successfully!");
        renderCitizenView('home');
    } catch (e) {
        console.error("Error adding document: ", e);
        showModal("Failed to submit complaint.");
    }
};

const startCamera = async () => {
    document.querySelector('input[name="image"]').classList.add('hidden');
    const cameraContainer = document.getElementById('camera-container');
    cameraContainer.classList.remove('hidden');

    const video = document.getElementById('camera-feed');
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = videoStream;
    } catch (err) {
        console.error("Camera access denied or failed: ", err);
        showModal("Failed to access camera. Please check permissions.");
        cameraContainer.classList.add('hidden');
    }
};

const stopCamera = () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    const cameraContainer = document.getElementById('camera-container');
    if(cameraContainer) cameraContainer.classList.add('hidden');
};

const capturePhoto = () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('photo-canvas');
    const photo = document.getElementById('captured-photo');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');
    photo.src = imageDataUrl;
    photo.classList.remove('hidden');

    stopCamera();
};

const handleAssignTask = async (complaintId) => {
    if (!db) return;
    const complaintDocRef = doc(db, `/artifacts/${appId}/public/data/complaints`, complaintId);
    try {
        await updateDoc(complaintDocRef, { status: 'Assigned', assignedTo: "Worker" }); // Example worker assignment
        showModal("Task assigned successfully!");
    } catch (e) {
        console.error("Error assigning task:", e);
        showModal("Failed to assign task.");
    }
};

const handleMarkAsResolved = async (complaintId) => {
    if (!db) return;
    const complaintDocRef = doc(db, `/artifacts/${appId}/public/data/complaints`, complaintId);
    try {
        await updateDoc(complaintDocRef, { 
            status: 'Pending Verification',
            resolvedImageUrl: 'https://placehold.co/400x300', // Placeholder, should be replaced with actual image upload logic
            resolvedAt: new Date().toISOString()
        });
        showModal("Complaint marked as resolved. Awaiting Admin verification.");
    } catch (e) {
        console.error("Error marking complaint as resolved:", e);
        showModal("Failed to mark complaint as resolved.");
    }
};

const handleAdminVerification = async (complaintId, newStatus) => {
    if (!db) return;
    const complaintDocRef = doc(db, `/artifacts/${appId}/public/data/complaints`, complaintId);
    let updateData = { status: newStatus };
    if (newStatus === 'Resolved') {
         updateData.resolvedAt = new Date().toISOString();
         showModal(`Complaint status updated to ${newStatus}.`);
    } else if (newStatus === 'Assigned') {
         const feedback = prompt("Please provide feedback for the worker:");
         updateData.feedback = feedback;
         showModal(`Complaint status updated to ${newStatus}.`);
    }

    try {
        await updateDoc(complaintDocRef, updateData);
        document.getElementById('complaint-modal').classList.add('hidden');
    } catch (e) {
        console.error("Error updating complaint status:", e);
        showModal("Failed to update complaint status.");
    }
};

const handleDeleteComplaint = async (complaintId) => {
     if (!db) return;
     showModal("Are you sure you want to delete this complaint?", true, async () => {
         try {
             await deleteDoc(doc(db, `/artifacts/${appId}/public/data/complaints`, complaintId));
             showModal("Complaint deleted successfully!");
         } catch (e) {
             console.error("Error deleting document:", e);
             showModal("Failed to delete complaint.");
         }
     });
};

const handleOptimizeRoute = () => {
    if (!map || mapboxMarkers.length === 0) {
        showModal("No complaints to optimize a route for.");
        return;
    }

    const coordinates = complaints
        .filter(c => c.status === 'Assigned' || c.status === 'In Progress')
        .map(c => [c.location.lng, c.location.lat]);
    
    if (coordinates.length < 2) {
        showModal("Need at least two points to create a route.");
        return;
    }

    const coordsString = coordinates.join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const route = data.routes[0].geometry.coordinates;
            const geojson = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: route
                }
            };
            if (map.getSource(routeSourceId)) {
                map.getSource(routeSourceId).setData(geojson);
            } else {
                map.addLayer({
                    id: routeLayerId,
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: geojson
                    },
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#3887be', 'line-width': 5, 'line-opacity': 0.75 }
                });
            }
            showModal("Optimized route has been drawn on the map.");
        })
        .catch(err => {
            console.error('Error fetching route:', err);
            showModal("Could not optimize route.");
        });
};


// --- CORRECTED Event Listeners Initialization ---

// Select the initial role buttons
const citizenButton = document.querySelector('.role-button.citizen');
const workerButton = document.querySelector('.role-button.worker');
const adminButton = document.querySelector('.role-button.admin');

// Select the views
const authView = document.getElementById('auth-view');
const roleAuthView = document.getElementById('role-auth-view');

citizenButton.addEventListener('click', () => {
    authView.classList.add('hidden');
    roleAuthView.classList.remove('hidden');
    document.getElementById('auth-title').textContent = "Citizen Login";
    document.getElementById('signup-title').textContent = "Citizen Sign Up";
    document.getElementById('signup-form-container').classList.add('hidden');
    document.getElementById('login-form-container').classList.remove('hidden');
    document.getElementById('show-signup').classList.remove('hidden');
    currentRole = 'citizen';
});

workerButton.addEventListener('click', () => {
    authView.classList.add('hidden');
    roleAuthView.classList.remove('hidden');
    document.getElementById('auth-title').textContent = "Worker Login";
    document.getElementById('signup-title').textContent = "Worker Sign Up";
    document.getElementById('signup-form-container').classList.add('hidden');
    document.getElementById('login-form-container').classList.remove('hidden');
    document.getElementById('show-signup').classList.remove('hidden');
    currentRole = 'worker';
});

adminButton.addEventListener('click', () => {
    authView.classList.add('hidden');
    roleAuthView.classList.remove('hidden');
    document.getElementById('auth-title').textContent = "Admin Login";
    // Admin does not have a public sign-up form
    document.getElementById('signup-form-container').classList.add('hidden');
    document.getElementById('login-form-container').classList.remove('hidden');
    document.getElementById('show-signup').classList.add('hidden');
    currentRole = 'admin';
});

// Form Switching Logic
document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form-container').classList.add('hidden');
    document.getElementById('signup-form-container').classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form-container').classList.add('hidden');
    document.getElementById('login-form-container').classList.remove('hidden');
});

// Form Submissions
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target['signup-email'].value;
    const password = e.target['signup-password'].value;
    const name = e.target['signup-name'].value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        user = userCredential.user; // Set user immediately
        userRole = currentRole;
        showModal("Sign up successful! You are now logged in.");
        renderContent(userRole, 'home');
    } catch (error) {
        console.error("Sign up error:", error);
        showModal(error.message);
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target['login-email'].value;
    const password = e.target['login-password'].value;
    
    if (currentRole === 'admin') {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            userRole = 'admin'; // Set the role for admin
            showModal("Admin login successful!");
            renderContent('admin', 'dashboard');
        } else {
            showModal("Invalid admin credentials.");
        }
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user; // Set user immediately
        userRole = currentRole;
        showModal("Login successful!");
        const initialView = userRole === 'worker' ? 'dashboard' : 'home';
        renderContent(userRole, initialView);
    } catch (error) {
        console.error("Login error:", error);
        showModal(error.message);
    }
});

// Modal Buttons
document.getElementById('modal-ok').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-confirm').addEventListener('click', () => {
    if (modalCallback) modalCallback();
    closeModal();
});

// Initialize the app when the window loads
window.onload = initFirebase;