// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a proposals button to the navigation
    const addProposalsNavButton = () => {
        // Find all navigation button containers
        const navContainers = document.querySelectorAll('.nav-btn');
        
        if (navContainers.length > 0) {
            // Get the parent of the nav buttons
            const parentContainer = navContainers[0].parentNode;
            
            // Create a new button
            const proposalsButton = document.createElement('button');
            proposalsButton.className = 'nav-btn px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors';
            proposalsButton.textContent = 'Proposals';
            
            // Add click event
            proposalsButton.addEventListener('click', () => {
                window.location.href = 'proposals.html';
            });
            
            // Add button to parent container
            parentContainer.insertBefore(proposalsButton, document.getElementById('logout-button'));
        }
    };
    
    // Check periodically for navigation container to appear
    const checkForNav = setInterval(() => {
        const navButtons = document.querySelectorAll('.nav-btn');
        if (navButtons.length > 0) {
            addProposalsNavButton();
            clearInterval(checkForNav);
        }
    }, 1000);
    
    // Stop checking after 10 seconds to prevent endless loops
    setTimeout(() => clearInterval(checkForNav), 10000);
});