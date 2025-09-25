/**
 * Language support for the proposals page
 */

// Available languages
const proposalsLanguages = {
    english: {
        title: "Comprehensive Waste Management Proposals",
        intro: "The following proposals aim to develop a strict system to ensure that every citizen is trained on waste management, waste workers get strict training and required safety gear, waste management facilities are present in every ULB/GP, and a dedicated decentralised monitoring system is in place.",
        proposal1Title: "Mandatory training for every citizen",
        proposal1Text: "Similar to countries where military training is mandatory for every citizen, in India, there shall be mandatory Waste Management training for every Waste Generator/Citizen. This will ensure source segregation, which will result in better waste management, lesser load on waste management facilities and landfills.",
        proposal1Sub1: "Physical training on types of waste, source segregation, how to make compost at home, re-use of plastic, etc.",
        proposal1Sub2: "Distribution of 3 types of dustbins for dry, wet and domestic hazardous waste to every household/citizen.",
        proposal1Sub3: "Distribution of a designed and tested compost making kit to every household/citizen.",
        proposal1Sub4: "App-based monitoring.",
        proposal2Title: "Phase-wise training to all Waste Workers",
        proposal2Text: "Professional training programs to ensure waste workers have proper knowledge and equipment to handle different types of waste safely and efficiently.",
        proposal3Title: "Formation of Area Committee for Monitoring – "Green Champions"",
        proposal3Text: "Decentralised approach for Monitoring has to be done at every step of Waste Management for bulk waste generators, residential areas, commercial & Public semi-public building, Industrial buildings, etc.",
        proposal3Sub1: "Training of all Waste Generators",
        proposal3Sub2: "Waste Generation: Source segregation happening or not, no wet waste to be collected",
        proposal3Sub3: "Waste Collection happening on ground level",
        proposal3Sub4: "Waste transportation",
        proposal3Sub5: "Waste treatment",
        proposal3Sub6: "Waste Disposal",
        proposal4Title: "Incentive based approach",
        proposal4Text: "Incentive to Bulk waste generators and other buildings for source segregation.",
        proposal5Title: "Waste Movements in ULBs",
        proposal5Text: "Taking example from Karnataka's Yadgir city, "If you see waste, send photo" similar movement to be made mandatory for every ULB regardless of its size and population, to ensure community participation.",
        proposal6Title: "Community Participation",
        proposal6Text: "One day of all working staff regardless of employment type to be engaged in Cleaning of Public areas, waste management. Inspired from Cleaning-day followed in schools every week, every waste generator to be responsible for keeping the country clean and contributing to waste management, starting from Govt. sector.",
        proposal7Title: "Penalization system",
        proposal7Text: "Fines to be imposed and no waste collection for buildings not segregating waste at source as punishment.",
        proposal8Title: "Waste Management Facilities to be made available in every ULB",
        proposal8Sub1: "Biomethanization plant",
        proposal8Sub2: "W-to-E plant",
        proposal8Sub3: "Multiple Recycling centres for different types of waste",
        proposal8Sub4: "Scrap collection shops – Online app based",
        proposal9Title: "Complete Digital App-based system for",
        proposal9Sub1: "Training of all Waste Generators",
        proposal9Sub2: "Shopping of Waste utilities – compost kits, dustbins, etc.",
        proposal9Sub3: "Tracking of Waste collection vehicles",
        proposal9Sub4: "Location of Waste management facilities, Recycling centres, scrap shops etc.",
        proposal9Sub5: "Option to upload geo-tagged photos of dumping sites, etc.",
        backToHome: "Back to Home"
    },
    hindi: {
        title: "वयपक अपशषट परबधन परसतव",
        intro: "नमनलखत परसतव क उददशय एक सखत परणल वकसत करन ह तक यह सनशचत कय ज सक क परतयक नगरक क अपशषट परबधन पर परशकषत कय जए, अपशषट करमचरय क कड परशकषण और आवशयक सरकष गयर मल, अपशषट परबधन सवधए परतयक ULB/GP म मजद ह, और एक समरपत वकदरकत नगरन परणल सथपत ह",
        proposal1Title: "परतयक नगरक क लए अनवरय परशकषण",
        proposal1Text: "जन दश म हर नगरक क लए सनय परशकषण अनवरय ह, उनक तरह भरत म भ हर अपशषट उतपदक/नगरक क लए अपशषट परबधन परशकषण अनवरय हग इसस सरत पर ह अलगव सनशचत हग, जसस बहतर अपशषट परबधन, अपशषट परबधन सवधओ और लडफल पर कम भर हग",
        proposal1Sub1: "अपशषट क परकर, सरत पर अलगव, घर पर खद कस बनए, पलसटक क पन: उपयग आद पर भतक परशकषण",
        proposal1Sub2: "परतयक घर/नगरक क सख, गल और घरल खतरनक कचर क लए 3 परकर क डसटबन क वतरण",
        proposal1Sub3: "परतयक घर/नगरक क डजइन कए गए और परकषण कए गए खद बनन क कट क वतरण",
        proposal1Sub4: "ऐप-आधरत नगरन",
        proposal2Title: "सभ अपशषट करमय क चरणबदध परशकषण",
        proposal2Text: "पशवर परशकषण करयकरम यह सनशचत करन क लए क अपशषट करमय क वभनन परकर क कचर क सरकषत और कशलतपरवक सभलन क लए उचत जञन और उपकरण ह",
        proposal3Title: "नगरन क लए कषतर समत क गठन - "गरन चमपयस"",
        proposal3Text: "बलक अपशषट उतपदक, आवसय कषतर, वणजयक और सरवजनक अरध-सरवजनक भवन, औदयगक भवन आद क लए अपशषट परबधन क हर चरण पर नगरन क लए वकदरकत दषटकण अपनय जन चहए",
        proposal3Sub1: "सभ अपशषट उतपदक क परशकषण",
        proposal3Sub2: "अपशषट उतपदन: सरत पर अलगव ह रह ह य नह, कई गल कचर एकतर नह कय जएग",
        proposal3Sub3: "जमन सतर पर अपशषट सगरह",
        proposal3Sub4: "अपशषट परवहन",
        proposal3Sub5: "अपशषट उपचर",
        proposal3Sub6: "अपशषट नपटन",
        proposal4Title: "परतसहन आधरत दषटकण",
        proposal4Text: "सरत पर अलगव क लए बलक अपशषट उतपदक और अनय भवन क परतसहन",
        proposal5Title: "ULB म अपशषट आदलन",
        proposal5Text: "करनटक क यदगर शहर स उदहरण लत हए, "अगर आप कचर दखत ह, त फट भज" जस आदलन परतयक ULB क लए अनवरय कय जएग, चह उसक आकर और जनसखय कछ भ ह, तक समदयक भगदर सनशचत क ज सक",
        proposal6Title: "समदयक भगदर",
        proposal6Text: "रजगर क परकर क बवजद सभ करयरत करमचरय क एक दन सरवजनक कषतर क सफई, अपशषट परबधन म लगय जएग सकल म हर हफत पलन कए जन वल सफई-दवस स पररत, परतयक अपशषट उतपदक दश क सफ रखन और अपशषट परबधन म यगदन दन क लए जममदर हग, सरकर कषतर स शर करक",
        proposal7Title: "दड परणल",
        proposal7Text: "सरत पर कचर क अलग न करन वल भवन क लए जरमन लगय जएग और सज क रप म कचर सगरह नह कय जएग",
        proposal8Title: "परतयक ULB म उपलबध करई जन वल अपशषट परबधन सवधए",
        proposal8Sub1: "बयमथनइजशन पलट",
        proposal8Sub2: "अपशषट स ऊरज सयतर",
        proposal8Sub3: "वभनन परकर क कचर क लए कई रसइकलग कदर",
        proposal8Sub4: "सकरप कलकशन शप - ऑनलइन ऐप आधरत",
        proposal9Title: "परण डजटल ऐप-आधरत परणल क लए",
        proposal9Sub1: "सभ अपशषट उतपदक क परशकषण",
        proposal9Sub2: "अपशषट उपयगतओ क खरदर - खद कट, डसटबन, आद",
        proposal9Sub3: "अपशषट सगरह वहन क टरकग",
        proposal9Sub4: "अपशषट परबधन सवधओ, रसइकलग कदर, सकरप दकन आद क सथन",
        proposal9Sub5: "डपग सइट आद क भ-टग क गई फट अपलड करन क वकलप",
        backToHome: "हम पज पर वपस जए"
    },
    marathi: {
        title: "सरवसमवशक कचर वयवसथपन परसतव",
        intro: "खलल परसतवच उददश ह परतयक नगरकल कचर वयवसथपनवर परशकषत कल जईल, कचर कमगरन कठर परशकषण आण आवशयक सरकष उपकरण मळतल, परतयक ULB/GP मधय कचर वयवसथपन सवध उपलबध असतल आण समरपत वकदरकत दखरख परणल सथपत कल जईल यच खतर करणयसठ एक कठर परणल वकसत करण आह.",
        proposal1Title: "परतयक नगरकसठ अनवरय परशकषण",
        proposal1Text: "जय दशमधय परतयक नगरकसठ लषकर परशकषण अनवरय आह, तयचय धरतवर भरतत, परतयक कचर नरमत/नगरकसठ कचर वयवसथपन परशकषण अनवरय असल. ह सतरतवर वरगकरण सनशचत करल, जयमळ चगल कचर वयवसथपन, कचर वयवसथपन सवधवर आण लडफलसवर कम भर यईल.",
        proposal1Sub1: "कचऱयच परकर, सतरतवर वरगकरण, घर कपसट कस बनवव, पलसटकच पनरवपर, इतयदवर परतयकष परशकषण.",
        proposal1Sub2: "परतयक घर/नगरकसठ सक, ओल आण घरगत धकदयक कचऱयसठ 3 परकरचय कचरपटयच वटप.",
        proposal1Sub3: "परतयक घर/नगरकसठ डझइन कलल आण चचण कलल कपसट तयर करणयच कट वटप.",
        proposal1Sub4: "अप-आधरत दखरख.",
        proposal2Title: "सरव कचर कमगरन टपपयटपपयन परशकषण",
        proposal2Text: "वयवसयक परशकषण करयकरम ह सनशचत करणयसठ क कचर कमगरकड ववध परकरच कचर सरकषतपण आण करयकषमतन हतळणयसठ यगय जञन आण उपकरण आहत.",
        proposal3Title: "दखरखसठ कषतर समतच सथपन - "गरन चमपयनस"",
        proposal3Text: "मठय परमणत कचर नरमत, नवस कषतर, वयवसयक आण सरवजनक अरध-सरवजनक इमरत, औदयगक इमरत इतयदसठ कचर वयवसथपनचय परतयक टपपयवर दखरखसठ वकदरत दषटकन वपरल जण आवशयक आह.",
        proposal3Sub1: "सरव कचर नरमतयच परशकषण",
        proposal3Sub2: "कचर नरमत: सतरतवर वरगकरण हत आह क नह, ओल कचर गळ कर नय",
        proposal3Sub3: "जमनचय पतळवर कचर सकलन",
        proposal3Sub4: "कचर वहतक",
        proposal3Sub5: "कचर परकरय",
        proposal3Sub6: "कचर वलहवट",
        proposal4Title: "परतसहन आधरत दषटकन",
        proposal4Text: "सतरतवर वरगकरणसठ मठय परमणत कचर नरमत आण इतर इमरतन परतसहन.",
        proposal5Title: "ULB मधय कचर चळवळ",
        proposal5Text: "करनटकचय यदगर शहरच उदहरण घऊन, "तमहल कचर दसल तर फट पठव" अश चळवळ परतयक ULB सठ तयचय आकरमन आण लकसखयच परव न करत, समदयक सहभग सनशचत करणयसठ अनवरय कल जईल.",
        proposal6Title: "समदयक सहभग",
        proposal6Text: "रजगरचय परकरच वचर न करत सरव करयरत करमचऱयच एक दवस सरवजनक कषतरचय सवचछतत, कचर वयवसथपनत गतवल जईल. शळमधय दर आठवडयल पळलय जणऱय सवचछत-दनपरमण, परतयक कचर नरमत दश सवचछ ठवणयस आण कचर वयवसथपनत यगदन दणयस जबबदर असल, सरकर कषतरपसन सरवत करन.",
        proposal7Title: "दडतमक परणल",
        proposal7Text: "सतरतवर कचर वरगकरण न करणऱय इमरतन दड आण शकष महणन कचर सकलन न करण.",
        proposal8Title: "परतयक ULB मधय उपलबध करन दणयचय कचर वयवसथपन सवध",
        proposal8Sub1: "बयमथनयझशन पलट",
        proposal8Sub2: "कचऱयपसन-ऊरज परकलप",
        proposal8Sub3: "ववध परकरचय कचऱयसठ अनक रसयकलग कदर",
        proposal8Sub4: "सकरप सकलन दकन - ऑनलइन अप आधरत",
        proposal9Title: "सपरण डजटल अप-आधरत परणल",
        proposal9Sub1: "सरव कचर नरमतयच परशकषण",
        proposal9Sub2: "कचर उपयगत खरद - कपसट कटस, कचरपटय, इ.",
        proposal9Sub3: "कचर सकलन वहनच मगव",
        proposal9Sub4: "कचर वयवसथपन सवध, रसयकलग कदर, सकरप दकन इ. च सथन",
        proposal9Sub5: "डपग सइटस इ. च भ-टग कलल फट अपलड करणयच परयय.",
        backToHome: "मखयपषठवर परत ज"
    }
};

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    // Create language selector
    createProposalsLanguageSelector();
    
    // Apply default language (English)
    applyProposalsLanguage("english");
    
    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get("lang");
    if (lang && proposalsLanguages[lang]) {
        applyProposalsLanguage(lang);
        updateProposalsActiveButton(lang);
    }
});

// Create language selector
function createProposalsLanguageSelector() {
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
        for (const lang in proposalsLanguages) {
            const button = document.createElement("button");
            button.textContent = lang === "english" ? "English" : 
                               lang === "hindi" ? "हनद" : "मरठ";
            button.className = "lang-button";
            button.setAttribute("data-lang", lang);
            button.style.padding = "5px 10px";
            button.style.borderRadius = "4px";
            button.style.backgroundColor = lang === "english" ? "#4CAF50" : "#f0f0f0";
            button.style.color = lang === "english" ? "white" : "black";
            button.style.border = "none";
            button.style.cursor = "pointer";
            
            button.addEventListener("click", function() {
                applyProposalsLanguage(lang);
                updateProposalsActiveButton(lang);
            });
            
            langSelector.appendChild(button);
        }
        
        header.appendChild(langSelector);
    }
}

// Apply language to the proposals page
function applyProposalsLanguage(lang) {
    if (!proposalsLanguages[lang]) return;
    
    const text = proposalsLanguages[lang];
    const proposalSection = document.querySelector(".proposal-section");
    
    if (!proposalSection) return;
    
    // Update main title and intro
    const mainTitle = proposalSection.querySelector("h2");
    if (mainTitle) mainTitle.textContent = text.title;
    
    const intro = proposalSection.querySelector("p.mb-6");
    if (intro) intro.textContent = text.intro;
    
    // Update all proposal titles and texts
    const proposals = proposalSection.querySelectorAll("ol > li");
    
    if (proposals.length >= 9) {
        // Proposal 1
        updateProposalContent(proposals[0], text.proposal1Title, text.proposal1Text);
        updateSubItems(proposals[0], [text.proposal1Sub1, text.proposal1Sub2, text.proposal1Sub3, text.proposal1Sub4]);
        
        // Proposal 2
        updateProposalContent(proposals[1], text.proposal2Title, text.proposal2Text);
        
        // Proposal 3
        updateProposalContent(proposals[2], text.proposal3Title, text.proposal3Text);
        updateSubItems(proposals[2], [text.proposal3Sub1, text.proposal3Sub2, text.proposal3Sub3, text.proposal3Sub4, text.proposal3Sub5, text.proposal3Sub6]);
        
        // Proposal 4
        updateProposalContent(proposals[3], text.proposal4Title, text.proposal4Text);
        
        // Proposal 5
        updateProposalContent(proposals[4], text.proposal5Title, text.proposal5Text);
        
        // Proposal 6
        updateProposalContent(proposals[5], text.proposal6Title, text.proposal6Text);
        
        // Proposal 7
        updateProposalContent(proposals[6], text.proposal7Title, text.proposal7Text);
        
        // Proposal 8
        updateProposalContent(proposals[7], text.proposal8Title);
        updateSubItems(proposals[7], [text.proposal8Sub1, text.proposal8Sub2, text.proposal8Sub3, text.proposal8Sub4]);
        
        // Proposal 9
        updateProposalContent(proposals[8], text.proposal9Title);
        updateSubItems(proposals[8], [text.proposal9Sub1, text.proposal9Sub2, text.proposal9Sub3, text.proposal9Sub4, text.proposal9Sub5]);
    }
    
    // Update back button
    const backButton = document.querySelector(".back-button");
    if (backButton) {
        backButton.innerHTML = `<i class="fas fa-arrow-left mr-2"></i> ${text.backToHome}`;
    }
}

// Helper function to update proposal content
function updateProposalContent(proposalElement, title, text) {
    if (!proposalElement) return;
    
    const titleElement = proposalElement.querySelector("h3");
    if (titleElement) titleElement.textContent = title;
    
    if (text) {
        const textElement = proposalElement.querySelector("p");
        if (textElement) textElement.textContent = text;
    }
}

// Helper function to update sub-items
function updateSubItems(proposalElement, items) {
    if (!proposalElement) return;
    
    const subList = proposalElement.querySelector("ol.list-roman");
    if (!subList) return;
    
    const subItems = subList.querySelectorAll("li");
    
    for (let i = 0; i < subItems.length && i < items.length; i++) {
        subItems[i].textContent = items[i];
    }
}

// Update active language button
function updateProposalsActiveButton(activeLang) {
    const buttons = document.querySelectorAll(".lang-button");
    
    buttons.forEach(button => {
        const lang = button.getAttribute("data-lang");
        button.style.backgroundColor = lang === activeLang ? "#4CAF50" : "#f0f0f0";
        button.style.color = lang === activeLang ? "white" : "black";
    });
}
