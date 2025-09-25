/**
 * This script adds proposal page functionality to the Swachh Sathi application.
 * It adds a "View Waste Management Proposals" button to the education section.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Function to add proposal button to education view
    const addProposalButtonToEducation = () => {
        // Check if the citizen education view is currently displayed
        const citizenViewContainer = document.getElementById('citizen-view-container');
        if (citizenViewContainer && citizenViewContainer.innerHTML.includes('Waste Management Education')) {
            // Look for the education section title
            const educationSection = citizenViewContainer.querySelector('h2');
            if (educationSection) {
                // Create the proposals button if it doesn't exist already
                if (!document.getElementById('view-proposals-btn')) {
                    // Create button container
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'mt-6 text-center';
                    
                    // Create button
                    const proposalsButton = document.createElement('a');
                    proposalsButton.id = 'view-proposals-btn';
                    proposalsButton.href = 'proposals.html';
                    proposalsButton.className = 'inline-block px-6 py-3 rounded-md shadow-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors';
                    proposalsButton.textContent = 'View Waste Management Proposals';
                    
                    // Add button to container and insert after title
                    buttonContainer.appendChild(proposalsButton);
                    educationSection.parentNode.insertBefore(buttonContainer, educationSection.nextSibling);
                }
            }
        }
    };
    
    // Function to observe DOM changes to detect when education view is rendered
    const setupObserver = () => {
        // Create a mutation observer to watch for changes to the citizen view container
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    addProposalButtonToEducation();
                }
            });
        });
        
        // Start observing the document for changes
        observer.observe(document.body, { childList: true, subtree: true });
    };
    
    // Initialize the observer
    setupObserver();
    
    // Try to add the button immediately in case the view is already loaded
    setTimeout(addProposalButtonToEducation, 1000);
});

// Alternative approach: Modify the renderCitizenView function
// This will only work if we can access and modify the main script
if (typeof window.originalRenderCitizenView === 'undefined' && typeof renderCitizenView === 'function') {
    // Store reference to original function
    window.originalRenderCitizenView = renderCitizenView;
    
    // Override the function
    renderCitizenView = function(view) {
        // Call original function
        window.originalRenderCitizenView(view);
        
        // Add our custom modifications for the education view
        if (view === 'education') {
            setTimeout(() => {
                const container = document.getElementById('citizen-view-container');
                if (container) {
                    // Add proposals button
                    const proposalsButton = document.createElement('a');
                    proposalsButton.href = 'proposals.html';
                    proposalsButton.className = 'mt-4 inline-block px-6 py-3 rounded-md shadow-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors';
                    proposalsButton.textContent = 'View Waste Management Proposals';
                    
                    // Create container for button and add to education view
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'mt-6 text-center';
                    buttonContainer.appendChild(proposalsButton);
                    container.appendChild(buttonContainer);
                }
            }, 100);
        }
    };
}