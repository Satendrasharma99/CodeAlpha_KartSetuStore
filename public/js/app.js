let productDataStore = [];
let shoppingCartMatrix = [];
let systemAppliedDiscount = 1.0; 

document.addEventListener("DOMContentLoaded", () => {
    initializeFlashDropTimer();
    fetchProductCatalog();
});

async function fetchProductCatalog() {
    try {
        const response = await fetch('/api/products');
        productDataStore = await response.json();
        renderCatalogDisplay(productDataStore);
    } catch (error) {
        console.error("Matrix Network Failure:", error);
    }
}

function renderCatalogDisplay(items) {
    const container = document.getElementById("catalog-container");
    container.innerHTML = items.map(prod => `
        <div class="product-card cyber-glass">
            <div class="product-thumb">${prod.img}</div>
            <h3>${prod.name}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0;">${prod.desc}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
                <span style="font-size: 1.3rem; font-weight:bold; color: var(--neon-cyan);">₭${prod.price}</span>
                <span style="font-size:0.75rem; color: var(--neon-pink)">Only ${prod.stock} left</span>
            </div>
            <button class="buy-btn" onclick="injectItemToCart(${prod.id})">Link to Payload</button>
        </div>
    `).join('');
}

function applyCategoryFilter(cat) {
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    event.target.classList.add('active');
    
    if (cat === 'all') {
        renderCatalogDisplay(productDataStore);
    } else {
        const filtered = productDataStore.filter(p => p.category === cat);
        renderCatalogDisplay(filtered);
    }
}

function injectItemToCart(id) {
    const targetProduct = productDataStore.find(p => p.id === id);
    const existingEntry = shoppingCartMatrix.find(item => item.id === id);

    if (existingEntry) {
        existingEntry.quantity += 1;
    } else {
        shoppingCartMatrix.push({ ...targetProduct, quantity: 1 });
    }
    synchronizeCartState();
}

function synchronizeCartState() {
    const totalCount = shoppingCartMatrix.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById("cart-count").innerText = totalCount;

    const container = document.getElementById("cart-items-container");
    if(shoppingCartMatrix.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:2rem;">Your payload manifests are clean.</p>`;
    } else {
        container.innerHTML = shoppingCartMatrix.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.05)">
                <div>
                    <h4 style="font-size:0.95rem;">${item.name}</h4>
                    <span style="font-size:0.8rem; color:var(--neon-cyan)">₭${item.price} × ${item.quantity}</span>
                </div>
                <button class="buy-btn" style="width:auto; padding:2px 8px; margin:0;" onclick="purgeCartElement(${item.id})">Del</button>
            </div>
        `).join('');
    }
    recalculateQuantumEmi();
}

function purgeCartElement(id) {
    shoppingCartMatrix = shoppingCartMatrix.filter(item => item.id !== id);
    synchronizeCartState();
}

function toggleCartDrawer() {
    document.getElementById("cart-drawer").classList.toggle("active");
}

function toggleFormReadout(val) {
    document.getElementById("card-extended-fields").style.display = (val === 'CARD') ? 'block' : 'none';
}

function initializeFlashDropTimer() {
    let targetTime = new Date().getTime() + (2 * 60 * 60 * 1000) + (14 * 60 * 1000); 
    
    setInterval(() => {
        let now = new Date().getTime();
        let gap = targetTime - now;

        let hours = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((gap % (1000 * 60)) / 1000);
        let ms = Math.floor((gap % 1000) / 10);

        document.getElementById("countdown").innerText = 
            `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}:${ms.toString().padStart(2,'0')}`;
    }, 43);
}

let wheelSpunFlag = false;
function spinRewardWheel() {
    if (wheelSpunFlag) {
        document.getElementById("wheel-feedback").innerText = "Security protocol alert: One allocation access node daily.";
        return;
    }
    wheelSpunFlag = true;
    const degreesArr =;
    const pickedDegrees = degreesArr[Math.floor(Math.random() * degreesArr.length)] + 140; 
    
    const wheelNode = document.getElementById("reward-wheel");
    wheelNode.style.transform = `rotate(${pickedDegrees}deg)`;

    setTimeout(() => {
        systemAppliedDiscount = 0.85; 
        document.getElementById("wheel-feedback").innerText = "PROMO CONNECTED: 15% SYSTEM DISCOUNTS APPLIED.";
        recalculateQuantumEmi();
    }, 4000);
}

function recalculateQuantumEmi() {
    const rawSubtotal = shoppingCartMatrix.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const correctedSubtotal = rawSubtotal * systemAppliedDiscount;
    
    document.getElementById("cart-total-readout").innerText = `₭${correctedSubtotal.toFixed(2)}`;

    const currentMonthsSelection = parseInt(document.getElementById("emi-months").value);
    const computationalInterestRate = (currentMonthsSelection === 1) ? 0.0 : 0.015 * currentMonthsSelection; 
    const absoluteTotalWithInterest = correctedSubtotal * (1 + computationalInterestRate);
    const calculatedInstallmentsPerMonth = absoluteTotalWithInterest / currentMonthsSelection;

    document.getElementById("emi-calculation-readout").innerHTML = `
        <span style="color:#fff;">Duration Matrix:</span> <strong style="color:var(--neon-cyan);">${currentMonthsSelection} Month(s)</strong><br>
        <span style="color:#fff;">Net / Month:</span> <strong style="color:var(--neon-green);">₭${calculatedInstallmentsPerMonth.toFixed(2)} / mo</strong><br>
        <small style="color:var(--text-muted)">(Interest rate configured at ${(computationalInterestRate*100).toFixed(1)}% total scale)</small>
    `;
}

async function dispatchCheckoutTransaction() {
    if(shoppingCartMatrix.length === 0) {
        alert("Transaction Aborted: Staging area contains no freight payloads.");
        return;
    }

    const payloadChannelConfig = {
        cart: shoppingCartMatrix,
        paymentMethod: document.getElementById("payment-gateway-method").value,
        emiTerm: document.getElementById("emi-months").value
    };

    try {
        const networkResponse = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadChannelConfig)
        });
        const completionResult = await networkResponse.json();

        if(completionResult.success) {
            toggleCartDrawer();
            triggerMatrixConfettiStream();
            alert(`⚡ DEPLOYED TRANSACTION COMPLETE ⚡\nID: ${completionResult.transactionId}\n${completionResult.message}`);
            shoppingCartMatrix = [];
            synchronizeCartState();
        }
    } catch(err) {
        console.error("Critical core runtime synchronization fault:", err);
    }
}

function triggerMatrixConfettiStream() {
    const canvas = document.getElementById("confetti-layer");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particleArrayMatrix = [];
    const customColors = ['#00f3ff', '#ff0055', '#39ff14', '#ffff00'];

    for (let i = 0; i < 150; i++) {
        particleArrayMatrix.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 6 + 4,
            speedY: Math.random() * 5 + 3,
            speedX: Math.random() * 4 - 2,
            color: customColors[Math.floor(Math.random() * customColors.length)]
        });
    }

    let renderingLoopsCounter = 0;
    function cycleEngineFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particleArrayMatrix.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });

        renderingLoopsCounter++;
        if (renderingLoopsCounter < 180) { 
            requestAnimationFrame(cycleEngineFrame);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    cycleEngineFrame();
}
