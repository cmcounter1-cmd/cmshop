// ** IMPORTANT: Replace '1234567890' with your actual WhatsApp number, including country code (e.g., 15551234567) **
const WHATSAPP_NUMBER = '1234567890'; 
let cart = [];

// DOM elements
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const whatsappButton = document.getElementById('whatsapp-checkout');

// Function to update the cart display
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        whatsappButton.disabled = true;
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    // Calculate total and list items
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            ${item.name} x ${item.quantity} 
            ($${item.price.toFixed(2)} each)
            <button class="remove-item" data-name="${item.name}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    whatsappButton.disabled = false;
}

// Function to add a product to the cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    renderCart();
}

// Function to remove an item from the cart
function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();
}

// Event listener for all "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));
        addToCart(name, price);
    });
});

// Event listener for remove buttons inside the cart
cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const name = e.target.getAttribute('data-name');
        removeItem(name);
    }
});

// Event listener for the final WhatsApp checkout button
whatsappButton.addEventListener('click', () => {
    let orderSummary = "Hello! I'd like to place an order for the following chocolates:\n\n";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderSummary += `- ${item.name}: ${item.quantity} x $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}\n`;
    });

    orderSummary += `\nTotal Estimated Price: $${total.toFixed(2)}`;
    orderSummary += "\n\nPlease provide your payment and delivery details.";
    
    // Generate the WhatsApp link
    const whatsappText = encodeURIComponent(orderSummary);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;
    
    window.open(whatsappLink, '_blank');
});

// Initialize cart on page load
renderCart();
