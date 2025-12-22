const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
const environmentalTags = ['quiet area', 'large balcony', 'family-friendly', 'green view', 'near main gate', 'sunny side', 'comfortable fittings', 'spacious layout', 'compact & cozy', 'modern interior', 'high security'];

// A curated list of high-quality images that look like modern apartments/flats
// Using Unsplash IDs for reliable, high-quality architecture/interior shots
const bashundharaImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop', // Modern Living Room
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop', // Minimalist Apartment
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop', // Bedroom
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop', // Building Exterior (Modern)
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop', // Kitchen/Dining
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop', // Cozy Bedroom
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop', // Wide Balcony View
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop', // Another Exterior
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop', // Kitchen
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&h=400&fit=crop', // Bright Living space
    'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=600&h=400&fit=crop', // Modern Hallway
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'  // Premium Building
];

const apartments = [];

for (let i = 1; i <= 200; i++) {
    const randomBlock = blocks[Math.floor(Math.random() * blocks.length)];
    const isPremium = ['A', 'B', 'C'].includes(randomBlock);
    
    // Premium blocks have larger sizes and higher rent on average
    const sqft = isPremium ? Math.floor(Math.random() * (2800 - 1400) + 1400) : Math.floor(Math.random() * (1300 - 600) + 600);
    // Rent calculation roughly based on sqft and block premium
    let baseRent = sqft * (isPremium ? 30 : 20); 
    const rent = Math.floor(baseRent / 500) * 500; // Round to nearest 500
    
    const beds = sqft > 1800 ? 4 : (sqft > 1200 ? 3 : 2);
    
    // Pick 2 random environmental tags
    const tags = [];
    const shuffledTags = environmentalTags.sort(() => 0.5 - Math.random());
    tags.push(shuffledTags[0], shuffledTags[1]);

    // --- IMAGE SELECTION LOGIC ---
    // Use modulo operator (%) to cycle through the image array smoothly across 200 items
    const imgIndex = i % bashundharaImages.length;
    const selectedImage = bashundharaImages[imgIndex];

    apartments.push({
        id: i,
        block: randomBlock,
        rent: rent,
        beds: beds,
        sqft: sqft,
        lift: isPremium || Math.random() > 0.4, // Premium blocks mostly have lifts
        owner: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
        tags: tags,
        img: selectedImage, // Use the curated image
        description: `A ${tags[0]} apartment located in the heart of Block ${randomBlock}. This ${sqft} sqft unit features a ${tags[1]} environment.`
    });
}

// Initial display
displayFlats(apartments);

function predictFairPrice(apt) {
    let basePrice = apt.sqft * 20; // 20 TK per sqft
    
    // Add premium for specific blocks
    if (['A', 'B', 'C', 'D'].includes(apt.block)) {
        basePrice += 5000;
    }
    
    // Add premium for Lift
    if (apt.lift) {
        basePrice += 2000;
    }

    const difference = ((apt.rent - basePrice) / basePrice) * 100;
    
    if (difference > 10) return { status: "High", color: "red" };
    if (difference < -10) return { status: "Great Deal", color: "green" };
    return { status: "Fair Market Price", color: "blue" };
}
function filterByBlock() {
    const selectedBlock = document.getElementById('filterBlock').value;
    
    if (selectedBlock === "ALL") {
        displayFlats(apartments); // Show everything
    } else {
        // Filter the array based on the Combo Box value
        const filteredData = apartments.filter(apt => apt.block === selectedBlock);
        
        // If no flats are found, show a message, otherwise show the results
        if (filteredData.length === 0) {
            document.getElementById('propertyGrid').innerHTML = 
                `<p class="no-results">Sorry, no apartments currently listed in Block ${selectedBlock}.</p>`;
        } else {
            displayFlats(filteredData);
        }
    }
}
function aiRecommendation(userInput) {
    const query = userInput.toLowerCase();
    let recommendation = "";

    if (query.includes("cheap") || query.includes("low price")) {
        const cheapFlat = apartments.reduce((prev, curr) => prev.rent < curr.rent ? prev : curr);
        recommendation = `I found a great budget option in Block ${cheapFlat.block} for only ${cheapFlat.rent} BDT!`;
    } 
    else if (query.includes("block a")) {
        recommendation = "Block A is premium! I have 2 listings there with high-end security.";
    } 
    else {
        recommendation = "I can help you find flats in Bashundhara. Try asking for 'cheap flats' or 'Block A'.";
    }

    return recommendation;
}


function displayFlats(data) {
    const grid = document.getElementById('propertyGrid');
    grid.innerHTML = ''; // Clear previous
    
    data.forEach(apt => {
        const priceAnalysis = predictFairPrice(apt);
        
        // Inside your displayFlats function, change the card div to:
// This goes inside your displayFlats loop
grid.innerHTML += `
    <div class="apt-card" onclick="openDetail(${apt.id})">
        <div class="image-wrapper">
            <img src="${apt.img}" alt="Apartment Image">
            <div class="badge-guest-favorite">Guest favorite</div>
            <button class="wishlist-heart"><i class="far fa-heart"></i></button>
        </div>
        <div class="apt-card-info">
            <div class="card-title-row">
                <h3>Apartment in Block ${apt.block}</h3>
                <span class="rating">★ 4.89</span>
            </div>
            <p class="subtitle">Bashundhara R/A, Dhaka</p>
            <p class="price-row">
                <strong>${apt.rent} BDT</strong> month
            </p>
        </div>
    </div>
`;
    });
}

// Initialize on page load
displayFlats(apartments);


// Grab the form element
const apartmentForm = document.getElementById('apartmentForm');

apartmentForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page refresh

    // 1. Collect Data from Form
    const newApt = {
        id: apartments.length + 1,
        block: document.getElementById('block').value.toUpperCase(),
        rent: parseInt(document.getElementById('rent').value),
        beds: document.getElementById('beds').value,
        sqft: parseInt(document.getElementById('sqft').value),
        lift: document.getElementById('lift').value === "true",
        owner: document.getElementById('ownerContact').value,
        // Use a placeholder if no image URL is provided
        img: document.getElementById('imageUrl').value || 'https://via.placeholder.com/300x200?text=No+Image'
    };

    // 2. Add to our local "Database" (Array)
    apartments.unshift(newApt); // adds to the beginning of the list

    // 3. Refresh the UI
    displayFlats(apartments);

    // 4. Reset form and give feedback
    apartmentForm.reset();
    alert("Success! Your apartment in Block " + newApt.block + " is now listed.");
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
let navigationSource = 'home'; // Tracks where the user was before opening details
// GLOBAL VARIABLE to track currently viewed apartment
let activeApartment = null;
// --- FIXED CONFIRMATION LOGIC ---
function goToConfirmation() {
    if (!activeApartment) {
        alert("Please select an apartment first!");
        return;
    }

    // Hide Detail, Show Confirm (Using the correct ID from your HTML)
    document.getElementById('apartmentDetail').style.display = 'none';
    document.getElementById('confirmAndPay').style.display = 'block';

    // Populate Summary Card
    document.getElementById('sumImg').src = activeApartment.img;
    document.getElementById('sumTitle').innerText = `Apartment in Block ${activeApartment.block}`;
    
    // Formatting Price for 1 Month
    document.getElementById('priceLabel').innerText = `1 month x ${activeApartment.rent.toLocaleString()} BDT`;
    document.getElementById('basePriceSum').innerText = `${activeApartment.rent.toLocaleString()} BDT`;
    document.getElementById('totalPriceSum').innerText = `${activeApartment.rent.toLocaleString()} BDT`;

    window.scrollTo(0, 0);
}

// Attach the trigger to the button
document.querySelector('.reserve-btn').onclick = goToConfirmation;
function exitConfirmation() {
    document.getElementById('confirmAndPay').style.display = 'none';
    document.getElementById('apartmentDetail').style.display = 'block';
}
// --- FIXED NAVIGATION SOURCE ---
// let navigationSource = 'home'; 
// let activeApartment = null;

// --- FIXED DETAIL VIEW ---
function openDetail(id, source = 'home') {
    activeApartment = apartments.find(a => a.id === id);
    if (!activeApartment) return;

    navigationSource = source; 
    const analysis = predictFairPrice(activeApartment);

    // Hide everything
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    document.querySelector('.admin-section').style.display = 'none';
    if (document.getElementById('aiConsultancyPage')) {
        document.getElementById('aiConsultancyPage').style.display = 'none';


        
    }

    // Show Detail Page
    const detailPage = document.getElementById('apartmentDetail');
    detailPage.style.display = 'block';

    // Populate Text
    document.getElementById('detailTitle').innerText = `Modern Flat - Block ${activeApartment.block}`;
    document.getElementById('resPrice').innerText = activeApartment.rent.toLocaleString();
    document.getElementById('img0').src = activeApartment.img;
    document.getElementById('roomSpecs').innerText = `${activeApartment.beds} Bedrooms • Bashundhara Block ${activeApartment.block} • Lift: ${activeApartment.lift ? 'Yes' : 'No'}`;
    
    // AI Verdict
    const verdictEl = document.getElementById('aiVerdict');
    verdictEl.innerText = `Based on Block ${activeApartment.block} trends, this price is ${analysis.status}.`;
    verdictEl.style.color = analysis.color;

    // --- FIXED MAP URL ---
    const fullAddress = `Bashundhara Block ${activeApartment.block}, Dhaka, Bangladesh`;
    const encodedAddress = encodeURIComponent(fullAddress);
    document.getElementById('map-container').innerHTML = `
        <iframe 
            src="https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            loading="lazy" 
            style="width:100%; height:100%; border:0;"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    `;

    window.scrollTo(0, 0);
}

// HANDLE FINAL BOOKING
function handleFinalBooking() {
    alert(`Request sent to the owner in Block ${activeApartment.block}! They will contact you shortly at your registered number.`);
}

function closeDetail() {
    // document.getElementById('apartmentDetail').style.display = 'none';
    // document.querySelector('.hero').style.display = 'flex';
    // document.querySelector('main').style.display = 'block';
    // document.querySelector('.admin-section').style.display = 'block';
   

    // // Hide the detail page
    document.getElementById('apartmentDetail').style.display = 'none';

    if (navigationSource === 'ai') {
        // Return to AI Consultancy
        document.getElementById('aiConsultancyPage').style.display = 'block';
    } else {
        // Return to Home Page
        document.querySelector('.hero').style.display = 'flex';
        document.querySelector('main').style.display = 'block';
        document.querySelector('.admin-section').style.display = 'block';
    }
}
    




// --- Modal Switching Logic ---
function openAuth(type) {
    document.getElementById('authOverlay').style.display = 'flex';
    if(type === 'login') showLogin();
    else showRegister();
}

function closeAuth() {
    document.getElementById('authOverlay').style.display = 'none';
}// --- Modal Switching Logic ---
function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('toggleText').innerHTML = 'Don\'t have an account? <a href="#" onclick="showRegister()">Register</a>';
}

function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('toggleText').innerHTML = 'Already have an account? <a href="#" onclick="showLogin()">Log in</a>';
}

// --- Registration Logic ---
// --- Updated Registration Logic ---
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 1. Grab all relevant data
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const type = document.getElementById('userType').value;
    const phone = document.getElementById('regPhone').value;

    // 2. Logic based on User Type
    let welcomeMessage = "";
    if (type === "Owner") {
        welcomeMessage = `Welcome ${name}! As an Owner, you can now list your flats in Bashundhara.`;
    } else {
        welcomeMessage = `Welcome ${name}! As a Tenant, you can now contact owners and book flats.`;
    }

    // 3. Display the result
    alert(welcomeMessage);
    
    // 4. Update UI to show the user is logged in
    document.querySelector('.nav-auth').innerHTML = `
        <div class="user-pill">
            <i class="fas fa-user-circle"></i> 
            <span>${name.split(' ')[0]} (${type})</span>
            <button onclick="location.reload()" class="btn-logout">Logout</button>
        </div>
    `;

    closeAuth(); // Close modal
});

// --- Login Logic ---
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    
    alert(`${email}, Welcome back!`);
    
    closeAuth();
});







function processAIQuery() {
    const inputField = document.getElementById('ai-input');
    const query = inputField.value.toLowerCase();
    if (!query) return;

    addMessage(query, 'user-msg');
    inputField.value = '';

    // 1. Define Preferences Categories
    const isStudent = query.includes('student') || query.includes('aiub') || query.includes('nsu') || query.includes('iub');
    const isFamily = query.includes('family') || query.includes('3 bedroom') || query.includes('safe');
    const isBachelor = query.includes('bachelor') || query.includes('single');

    // 2. Filter and Rank
    let bestMatch = null;
    let explanation = "";

    if (isStudent) {
        // Students usually want Blocks close to gates (A, B, C) and lower rent
        bestMatch = apartments.find(a => ['A', 'B', 'C'].includes(a.block) && a.rent < 25000);
        explanation = "Since you're a student, I recommend this flat in Block " + (bestMatch ? bestMatch.block : "B") + " because it's close to the main universities and has affordable rent.";
    } 
    else if (isFamily) {
        // Families want Lifts and more Bedrooms
        bestMatch = apartments.find(a => a.beds >= 3 && a.lift === true);
        explanation = "For a family, safety and comfort are key. I suggest this 3-bedroom flat because it includes a lift and is located in a quiet, residential block.";
    }
    else if (isBachelor) {
        bestMatch = apartments.find(a => a.beds <= 2 && a.rent < 20000);
        explanation = "Found a bachelor-friendly spot! It's a compact space with manageable rent, perfect for a single professional or student.";
    }

    // 3. AI Response Action
    setTimeout(() => {
        if (bestMatch) {
            addMessage(`🤖 AI Recommendation: "${explanation}"`, 'bot-msg');
            
            // Highlight the recommended flat
            const recommendationCard = `
                <div class="ai-suggestion-card" onclick="openDetail(${bestMatch.id})">
                    <img src="${bestMatch.img}" style="width:50px; border-radius:5px;">
                    <div>
                        <strong>Block ${bestMatch.block} - ${bestMatch.rent} BDT</strong><br>
                        <small>Click to view this match</small>
                    </div>
                </div>`;
            addMessageHTML(recommendationCard, 'bot-msg');
            
            // Optionally filter the main grid to show the match
            displayFlats([bestMatch]);
        } else {
            addMessage("I'm not sure about that specific preference. Could you tell me if you're a student, a family, or looking for a specific block?", 'bot-msg');
        }
    }, 800);
}

// Helper to allow HTML in chat (for the suggestion card)
function addMessageHTML(html, className) {
    const body = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}



function showAIConsultancy() {
    // Hide everything else
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    document.querySelector('.admin-section').style.display = 'none';
    document.getElementById('apartmentDetail').style.display = 'none';
    
    // Show AI Page
    document.getElementById('aiConsultancyPage').style.display = 'block';
    window.scrollTo(0,0);
}

function showHome() {
    document.getElementById('aiConsultancyPage').style.display = 'none';
    document.getElementById('apartmentDetail').style.display = 'none';
    document.querySelector('.hero').style.display = 'flex';
    document.querySelector('main').style.display = 'block';
    document.querySelector('.admin-section').style.display = 'block';
}

// Logic for processing the full-screen AI chat
function processFullAIQuery() {
    const inputField = document.getElementById('full-ai-input');
    const query = inputField.value.toLowerCase();
    if (!query) return;

    addMessageToConsultant(query, 'user-msg');
    
    // Use the same logic we built earlier for Intent Recognition
    // (Search for student, family, bachelor, price, and blocks)
    
    // Simulate AI thinking and then call your filter/recommendation logic
    setTimeout(() => {
        addMessageToConsultant("🤖 Based on your preferences, I recommend looking at Block C. It offers the best price-to-amenity ratio for your profile.", 'bot-msg');
    }, 1000);

    inputField.value = '';
}

function addMessageToConsultant(text, className) {
    const body = document.getElementById('full-chat-body');
    const div = document.createElement('div');
    div.className = className;
    div.innerText = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}


// function handleConsultancyLogic() {
//     const input = document.getElementById('consultancy-input');
//     const userQuery = input.value.toLowerCase().trim();
//     if (!userQuery) return;

//     appendMessage(input.value, 'user-bubble');
//     input.value = '';

//     // Simulate AI "Thinking" state
//     setTimeout(() => {
//         let aiResponse = "";
//         let filterResults = [...apartments]; // Start with all data
        
//         // --- 1. INTENT: BUDGET & PRICE ---
//         if (userQuery.includes("budget") || userQuery.includes("cheap") || userQuery.includes("under") || userQuery.includes("price")) {
//             const numbers = userQuery.match(/\d+/g); 
//             if (numbers) {
//                 const limit = parseInt(numbers[0]) * (userQuery.includes("k") ? 1000 : 1);
//                 filterResults = filterResults.filter(a => a.rent <= limit);
//                 aiResponse += `I've found options fitting your budget of ${limit} BDT. `;
//             } else {
//                 aiResponse += "Bashundhara rents vary by Block. Blocks I and J are generally more affordable, while A-D are premium. What is your preferred range? ";
//             }
//         }

//         // --- 2. INTENT: LIFESTYLE (Student, Bachelor, Family) ---
//         if (userQuery.includes("student") || userQuery.includes("university") || userQuery.includes("nsu") || userQuery.includes("aiub")) {
//             filterResults = filterResults.filter(a => ['A', 'B', 'C'].includes(a.block));
//             aiResponse += "As a student, I'm prioritizing Blocks A, B, and C for you because they are closest to the university gates and save commute time. ";
//         } else if (userQuery.includes("family") || userQuery.includes("kids") || userQuery.includes("safe")) {
//             filterResults = filterResults.filter(a => a.beds >= 3 && a.lift === true);
//             aiResponse += "For families, I've filtered for 3+ bedroom flats with lift access in quieter residential blocks. ";
//         }

//         // --- 3. INTENT: LOCATION (Specific Blocks) ---
//         const blocks = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
//         let blockMentioned = blocks.find(b => userQuery.includes(`block ${b}`));
//         if (blockMentioned) {
//             filterResults = filterResults.filter(a => a.block.toLowerCase() === blockMentioned);
//             aiResponse += `Focusing specifically on Block ${blockMentioned.toUpperCase()} as requested. `;
//         }

//         // --- 4. INTENT: PRICE PREDICTION (Is this fair?) ---
//         if (userQuery.includes("fair") || userQuery.includes("predict") || userQuery.includes("worth it")) {
//             aiResponse += "My AI analysis calculates fairness based on sq-ft rates in Bashundhara (approx 25-30 BDT/sqft). I will tag my recommendations with a 'Fair Price' badge. ";
//         }

//         // --- FINAL RESPONSE GENERATION ---
//         if (filterResults.length > 0 && aiResponse !== "") {
//             appendMessage(aiResponse, 'bot-bubble');
//             presentRecommendation(filterResults[0]); // Suggest the best match
//         } else if (aiResponse === "") {
//             appendMessage("I'm here to help with your Bashundhara move! You can ask me about budgets, specific blocks, or tell me if you're a student or moving with family.", 'bot-bubble');
//         } else {
//             appendMessage("I understand your preference, but I don't have a perfect match right now. Here is the closest alternative in a nearby block.", 'bot-bubble');
//             presentRecommendation(apartments[0]);
//         }
//     }, 1000);
// }




function handleConsultancyLogic() {
    const input = document.getElementById('consultancy-input');
    const userQuery = input.value.toLowerCase().trim();
    if (!userQuery) return;

    appendMessage(input.value, 'user-bubble');
    input.value = '';

    setTimeout(() => {
        let aiResponse = "";
        let filterResults = [...apartments];

        // 1. Environmental & Subjective Filtering
        const queryTerms = userQuery.split(" ");
        filterResults = filterResults.filter(apt => {
            // Match against block, tags, or description
            return apt.tags.some(tag => userQuery.includes(tag)) || 
                   (userQuery.includes("big") && apt.sqft > 1500) ||
                   (userQuery.includes("small") && apt.sqft < 1000);
        });

        // 2. Refining response based on volume of data
        if (filterResults.length > 0) {
            const bestMatch = filterResults[0];
            aiResponse = `Out of 200 available listings in Bashundhara, I found ${filterResults.length} flats that match your preference for a "${userQuery}" environment. I highly recommend the one in Block ${bestMatch.block} because it is ${bestMatch.tags.join(' and ')}.`;
            
            appendMessage(aiResponse, 'bot-bubble');
            presentRecommendation(bestMatch);
        } else {
            appendMessage("I couldn't find an exact match for that specific description among our 200 flats, but Block D usually offers a very comfortable and quiet environment. Let me show you a top-rated option there.", 'bot-bubble');
            presentRecommendation(apartments.find(a => a.block === 'D'));
        }
    }, 1200);
}


// Add this inside your setTimeout logic as a "General Knowledge" fallback
const generalGreetings = ["hi", "hello", "hey", "who are you"];
if (generalGreetings.some(greet => userQuery.includes(greet))) {
    aiResponse = "Hello! I am your Bashundhara R/A Housing Consultant. I can help you find flats, predict fair prices, and explain block-wise benefits. How can I assist you today?";
}

function appendMessage(text, className) {
    const chatWindow = document.getElementById('full-chat-window');
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function presentRecommendation(apt) {
    const chatWindow = document.getElementById('full-chat-window');
    const card = document.createElement('div');
    card.className = 'bot-bubble';
    card.style.borderLeft = '4px solid #ff385c';
    card.innerHTML = `
        <strong>AI Recommended Match:</strong><br>
        Block ${apt.block} | ${apt.rent} BDT | ${apt.beds} Beds<br>
        <button onclick="openDetail(${apt.id})" style="margin-top:10px; cursor:pointer; color:#ff385c; border:none; background:none; font-weight:bold;">View Full Details & Map →</button>
    `;
    chatWindow.appendChild(card);
}

function setQuery(text) {
    document.getElementById('consultancy-input').value = text;
    handleConsultancyLogic();
}



function goToConfirmPage() {
    // 1. Get current apartment data (stored during openDetail)
    const currentAptId = document.getElementById('apartmentDetail').getAttribute('data-apt-id');
    const apt = apartments.find(a => a.id == currentAptId);

    // 2. Hide Detail Page, Show Confirm Page
    document.getElementById('apartmentDetail').style.display = 'none';
    document.getElementById('confirmPayPage').style.display = 'block';

    // 3. Populate Summary
    document.getElementById('confirmImg').src = apt.img;
    document.getElementById('confirmTitle').innerText = `Modern Flat in Block ${apt.block}`;
    document.getElementById('priceCalculation').innerText = `1 month x ${apt.rent} BDT`;
    document.getElementById('totalBasePrice').innerText = `${apt.rent} BDT`;
    document.getElementById('finalTotalPrice').innerText = `${apt.rent} BDT`;

    window.scrollTo(0, 0);
}

function goBackToDetail() {
    document.getElementById('confirmPayPage').style.display = 'none';
    document.getElementById('apartmentDetail').style.display = 'block';
}

// UPDATE: Attach this to your red "Reserve" or "Contact Owner" button
document.querySelector('.reserve-btn').onclick = goToConfirmPage;


function handlePillSearch() {
    const where = document.getElementById('mainWhere').value.toUpperCase();
    const guests = parseInt(document.getElementById('mainWho').value) || 0;

    const filtered = apartments.filter(apt => {
        // 1. Check Location (Block)
        const blockMatch = where === "" || apt.block.includes(where);
        
        // 2. Check Capacity (Assuming 1 bed can hold 2 guests)
        const capacityMatch = guests === 0 || (apt.beds * 2) >= guests;

        return blockMatch && capacityMatch;
    });

    if (filtered.length > 0) {
        displayFlats(filtered);
        // Scroll to results
        document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("No flats found matching those specific criteria in Bashundhara.");
    }
}



// function applyAdvancedFilter() {
//     const preferredBlock = document.getElementById('whereInput').value.toUpperCase();
//     const guestLimit = parseInt(document.getElementById('guestCount').value) || 0;
//     const checkInDate = document.getElementById('checkIn').value;
//     const checkOutDate = document.getElementById('checkOut').value;

//     const filteredData = apartments.filter(apt => {
//         // 1. Block Filter: Matches the specific block if typed
//         const blockMatch = !preferredBlock || apt.block === preferredBlock;

//         // 2. Capacity Filter: Checks if flat can hold the requested members
//         // Logic: Assuming 1 bedroom holds up to 2 people
//         const capacityMatch = guestLimit === 0 || (apt.beds * 2) >= guestLimit;

//         // 3. Date Filter: (Conceptual for static data)
//         // In a live system, this would check against a 'reservations' array.
//         // For now, we ensure dates are validly selected.
//         const dateMatch = (checkInDate && checkOutDate) ? true : true; 

//         return blockMatch && capacityMatch && dateMatch;
//     });

//     if (filteredData.length > 0) {
//         displayFlats(filteredData);
//     } else {
//         document.getElementById('propertyGrid').innerHTML = 
//             `<p class="no-results">No apartments found for those specific preferences. Try a different block or fewer guests.</p>`;
//     }
// }

// Add these at the very top of your try.js to keep track of user selection
let selectedCheckIn = "Add date";
let selectedCheckOut = "Add date";

function applyAdvancedFilter() {
    // 1. Capture the dates from the search pill inputs
    const checkInInput = document.getElementById('checkIn').value;
    const checkOutInput = document.getElementById('checkOut').value;
    
    // Store them in our global variables
    selectedCheckIn = checkInInput || "Add date";
    selectedCheckOut = checkOutInput || "Add date";

    // ... (rest of your existing filtering logic)
    const preferredBlock = document.getElementById('whereInput').value.toUpperCase();
    const guestLimit = parseInt(document.getElementById('guestCount').value) || 0;

    const filteredData = apartments.filter(apt => {
        const blockMatch = !preferredBlock || apt.block === preferredBlock;
        const capacityMatch = guestLimit === 0 || (apt.beds * 2) >= guestLimit;
        return blockMatch && capacityMatch;
    });

    displayFlats(filteredData);
}








async function loadRealData() {
    const response = await fetch('/api/apartments');
    const data = await response.json();
    displayFlats(data); // Uses your existing display function
}




apartmentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const newApt = { /* ... gather data from form ... */ };

    const response = await fetch('/api/apartments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApt)
    });

    if(response.ok) {
        alert("Flat listed successfully in MongoDB!");
        loadRealData();
    }
});