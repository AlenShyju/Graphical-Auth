const images = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
    'img4.jpg',
    'img5.jpg'
];
let selectedImages = [];
let sequence = [];
let pressure = 0.5;
let speed = 0.7;

function initGrid() {
    const initGrid = (gridId) => {
        const grid = document.getElementById(gridId);
        grid.innerHTML = '';
        images.forEach(img => {
            const imgElem = document.createElement('img');
            imgElem.src = img;
            imgElem.onclick = (e) => toggleImage(img, e.target);
            grid.appendChild(imgElem);
        });
    }
    initGrid('image-grid');
    initGrid('login-image-grid');
}

function toggleImage(img, element) {
    if (selectedImages.includes(img)) {
        selectedImages = selectedImages.filter(i => i !== img);
        element.classList.remove('selected');
    } else {
        selectedImages.push(img);
        element.classList.add('selected');
    }
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'c') sequence.push('click');
    if (e.key === 's') sequence.push('swipe');
    updateSequenceDisplay();
});

function updateSequenceDisplay() {
    document.getElementById('sequence-display').textContent = 
        `Sequence: ${sequence.join(', ')}`;
}

async function register() {
    const username = document.getElementById('username').value;
    if (!username || selectedImages.length === 0) {
        alert('Please fill all fields!');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                selected_images: selectedImages,
                sequence: sequence.join(','),
                pressure,
                speed
            })
        });
        alert(await response.text());
        selectedImages = [];
        sequence = [];
        document.querySelectorAll('.selected').forEach(img => img.classList.remove('selected'));
        updateSequenceDisplay();
    } catch (error) {
        alert('Registration failed!');
    }
}

async function login() {
    const username = document.getElementById('login_username').value;
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                selected_images: selectedImages,
                sequence: sequence.join(','),
                pressure,
                speed
            })
        });
        const result = await response.json();
        document.getElementById('result').innerHTML = 
            `${result.status}: ${result.reason || 'Success!'}`;
        selectedImages = [];
        sequence = [];
        document.querySelectorAll('.selected').forEach(img => img.classList.remove('selected'));
        updateSequenceDisplay();
    } catch (error) {
        alert('Login failed!');
    }
}

initGrid();