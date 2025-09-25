/**
 * Language selection functionality for Swachh Sathi website
 */

// Available languages
const languages = {
    english: {
        lang: "English",
        selectRole: "Select Your Role",
        roleDescription: "Please choose your role to proceed to the dashboard.",
        citizen: "Citizen",
        worker: "Worker",
        admin: "Admin",
        viewProposals: "View Waste Management Proposals",
        login: "Login",
        signup: "Sign Up",
        email: "Email",
        password: "Password",
        fullName: "Full Name",
        noAccount: "Don't have an account? Sign Up",
        haveAccount: "Already have an account? Login",
        backToHome: "Back to Home"
    },
    hindi: {
        lang: "हनद",
        selectRole: "अपन भमक चन",
        roleDescription: "डशबरड पर जन क लए कपय अपन भमक चन",
        citizen: "नगरक",
        worker: "करमचर",
        admin: "परशसक",
        viewProposals: "कचर परबधन परसतव दख",
        login: "लग इन कर",
        signup: "सइन अप कर",
        email: "ईमल",
        password: "पसवरड",
        fullName: "पर नम",
        noAccount: "खत नह ह? सइन अप कर",
        haveAccount: "पहल स ह एक खत ह? लग इन कर",
        backToHome: "हम पज पर वपस जए"
    },
    marathi: {
        lang: "मरठ",
        selectRole: "तमच भमक नवड",
        roleDescription: "डशबरडवर जणयसठ कपय तमच भमक नवड.",
        citizen: "नगरक",
        worker: "कमगर",
        admin: "परशसक",
        viewProposals: "कचर वयवसथपन परसतव पह",
        login: "लग इन कर",
        signup: "सइन अप कर",
        email: "ईमल",
        password: "पसवरड",
        fullName: "परण नव",
        noAccount: "खत नह? सइन अप कर",
        haveAccount: "आधपसनच खत आह? लग इन कर",
        backToHome: "मखयपषठवर परत ज"
    }
};

// Default language
let currentLanguage = "english";

// Initialize language selection
document.addEventListener("DOMContentLoaded", function() {
    // Create language selector
    createLanguageSelector();
    
    // Add proposals button to home page
    addProposalsButtonToHome();

    // Apply initial language
    applyLanguage(currentLanguage);
});

// Create language selector
function createLanguageSelector() {
    const header = document.querySelector(".header");
    
    if (header) {
        // Create language selector container
        const langSelector = document.createElement("div");
        langSelector.className = "language-selector";
        langSelector.style.position = "absolute";
        langSelector.style.right = "20px";
        langSelector.style.top = "20px";
        langSelector.style.display = "flex";
        langSelector.style.gap = "10px";
        
        // Add language buttons
        for (const lang in languages) {
            const button = document.createElement("button");
            button.textContent = languages[lang].lang;
            button.className = "lang-button";
            button.setAttribute("data-lang", lang);
            button.style.padding = "5px 10px";
            button.style.borderRadius = "4px";
            button.style.backgroundColor = lang === currentLanguage ? "#4CAF50" : "#f0f0f0";
            button.style.color = lang === currentLanguage ? "white" : "black";
            button.style.border = "none";
            button.style.cursor = "pointer";
            
            button.addEventListener("click", function() {
                applyLanguage(lang);
                updateActiveButton(lang);
            });
            
            langSelector.appendChild(button);
        }
        
        header.appendChild(langSelector);
    }
}

// Apply the selected language
function applyLanguage(lang) {
    currentLanguage = lang;
    const text = languages[lang];
    
    // Update role selection text
    document.querySelectorAll("h2").forEach(heading => {
        if (heading.textContent === "Select Your Role" || 
            heading.textContent === "अपन भमक चन" || 
            heading.textContent === "तमच भमक नवड") {
            heading.textContent = text.selectRole;
        }
    });
    
    document.querySelectorAll("p").forEach(paragraph => {
        if (paragraph.textContent === "Please choose your role to proceed to the dashboard." || 
            paragraph.textContent === "डशबरड पर जन क लए कपय अपन भमक चन" || 
            paragraph.textContent === "डशबरडवर जणयसठ कपय तमच भमक नवड.") {
            paragraph.textContent = text.roleDescription;
        }
    });
    
    // Update role buttons
    const citizenButton = document.querySelector(".role-button.citizen span");
    const workerButton = document.querySelector(".role-button.worker span");
    const adminButton = document.querySelector(".role-button.admin span");
    
    if (citizenButton) citizenButton.textContent = text.citizen;
    if (workerButton) workerButton.textContent = text.worker;
    if (adminButton) adminButton.textContent = text.admin;
    
    // Update proposals button
    const proposalsButton = document.getElementById("home-proposals-btn");
    if (proposalsButton) {
        proposalsButton.textContent = text.viewProposals;
    }
    
    // Update login/signup forms
    const loginTitle = document.getElementById("auth-title");
    if (loginTitle) loginTitle.textContent = text.login;
    
    const signupTitle = document.getElementById("signup-title");
    if (signupTitle) signupTitle.textContent = text.signup;
    
    // Update form elements
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        if (input.placeholder === "Email") {
            input.placeholder = text.email;
        }
    });
    
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        if (input.placeholder === "Password") {
            input.placeholder = text.password;
        }
    });
    
    const nameInput = document.querySelector('input[name="signup-name"]');
    if (nameInput) nameInput.placeholder = text.fullName;
    
    // Update links
    const showSignupLink = document.getElementById("show-signup");
    if (showSignupLink) showSignupLink.textContent = text.noAccount;
    
    const showLoginLink = document.getElementById("show-login");
    if (showLoginLink) showLoginLink.textContent = text.haveAccount;

    // Update back buttons
    document.querySelectorAll(".back-button").forEach(btn => {
        if (btn.textContent.includes("Back to Home")) {
            btn.innerHTML = `<i class="fas fa-arrow-left mr-2"></i> ${text.backToHome}`;
        }
    });
}

// Update the active language button
function updateActiveButton(activeLang) {
    const buttons = document.querySelectorAll(".lang-button");
    
    buttons.forEach(button => {
        const lang = button.getAttribute("data-lang");
        button.style.backgroundColor = lang === activeLang ? "#4CAF50" : "#f0f0f0";
        button.style.color = lang === activeLang ? "white" : "black";
    });
}

// Add proposals button to home page
function addProposalsButtonToHome() {
    const mainContent = document.querySelector(".main-content");
    
    if (mainContent) {
        const roleCard = mainContent.querySelector(".role-selection-card");
        
        if (roleCard) {
            // Create proposals button container
            const proposalsContainer = document.createElement("div");
            proposalsContainer.className = "mt-8 text-center";
            
            // Create button
            const proposalsButton = document.createElement("a");
            proposalsButton.id = "home-proposals-btn";
            proposalsButton.href = "proposals.html";
            proposalsButton.className = "inline-flex items-center px-6 py-3 rounded-lg shadow-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors";
            proposalsButton.innerHTML = `
                <i class="fas fa-file-alt mr-2"></i>
                <span>View Waste Management Proposals</span>
            `;
            
            // Add button to container
            proposalsContainer.appendChild(proposalsButton);
            
            // Add container after role buttons
            roleCard.appendChild(proposalsContainer);
        }
    }
}
