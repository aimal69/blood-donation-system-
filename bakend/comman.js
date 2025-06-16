// Common JavaScript functions for Blood Bank Management System

// Generic search function for tables
function searchTable(tableId, searchInputId) {
    const input = document.getElementById(searchInputId);
    const filter = input.value.toLowerCase();
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length - 1; j++) { // Exclude actions column
            if (cells[j] && cells[j].textContent.toLowerCase().includes(filter)) {
                found = true;
                break;
            }
        }

        row.style.display = found ? '' : 'none';
    }
}

// Generic filter function for tables
function filterTable(tableId, filters) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let showRow = true;

        // Apply each filter
        filters.forEach(filter => {
            if (filter.value && cells[filter.columnIndex] && showRow) {
                const cellText = cells[filter.columnIndex].textContent.toLowerCase();
                
                if (filter.type === 'exact') {
                    if (!cellText.includes(filter.value.toLowerCase())) {
                        showRow = false;
                    }
                } else if (filter.type === 'contains') {
                    if (!cellText.includes(filter.value.toLowerCase())) {
                        showRow = false;
                    }
                } else if (filter.type === 'quantity') {
                    const quantity = parseInt(cellText.match(/\d+/)?.[0] || 0);
                    if (filter.value === 'low' && quantity >= 100) showRow = false;
                    if (filter.value === 'medium' && (quantity < 100 || quantity > 300)) showRow = false;
                    if (filter.value === 'high' && quantity <= 300) showRow = false;
                }
            }
        });

        row.style.display = showRow ? '' : 'none';
    }
}

// Toggle form visibility
function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav ul');
    nav.classList.toggle('mobile-open');
}

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav ul {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav ul.mobile-open {
            display: flex;
        }
        
        .mobile-menu-toggle {
            display: block;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .header .container {
            position: relative;
        }
    }
    
    @media (min-width: 769px) {
        .mobile-menu-toggle {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Initialize mobile menu toggle button
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    if (nav && window.innerWidth <= 768) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = '☰';
        toggleButton.onclick = toggleMobileMenu;
        nav.insertBefore(toggleButton, nav.firstChild);
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Show success/error messages
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#059669' : '#dc2626'};
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(animationStyle);

// Export functions for use in individual pages
window.BloodBankUtils = {
    searchTable,
    filterTable,
    toggleForm,
    toggleMobileMenu,
    validateEmail,
    validatePhone,
    validateRequired,
    showMessage
};
