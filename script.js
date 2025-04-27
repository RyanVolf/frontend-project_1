document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    const line = document.getElementById('curved-line');
    const buySection = document.querySelector('.buy');
    let lastScrollTop = 0;
    const maxHeight = 900;
    const minHeight = 400;
    const minCurlOffset = 0;
    const maxCurlOffset = 100;

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop) {
            nav.classList.add('nav--slide-up');
        } else {
            nav.classList.remove('nav--slide-up');
            nav.classList.add('nav--dark');
        }
        if (window.pageYOffset === 0) {
            nav.classList.remove('nav--dark');
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;

        const buyRect = buySection.getBoundingClientRect();
        const buyTop = buyRect.top + window.scrollY;
        const buyHeight = buyRect.height;
        const windowHeight = window.innerHeight;

        const scrollPercent = Math.min(
            Math.max((window.scrollY + windowHeight - buyTop) / buyHeight, 0),
            1
        );

        const scale = Math.abs(scrollPercent - 0.5) * 2;

        const currentHeight = maxHeight - (maxHeight - minHeight) * (1 - scale);
        const topY = 300 - currentHeight / 2;
        const mid1Y = topY + currentHeight / 3;
        const mid2Y = topY + (2 * currentHeight) / 3;
        const bottomY = topY + currentHeight;

        const curlOffset = minCurlOffset + (maxCurlOffset - minCurlOffset) * (1 - scale);

        const newPath = `
            M 300 ${topY}
            Q ${300 + curlOffset} ${mid1Y} 300 ${mid1Y + currentHeight / 6}
            Q ${300 - curlOffset} ${mid2Y} 300 ${bottomY}
        `;
        line.setAttribute('d', newPath);
    });

    const accountButton = document.querySelector('.account');
    const loginPopup = document.querySelector('.login-popup');
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const loginClose = document.querySelector('.login-close');
    const signupLink = document.querySelector('.signup-link');
    const loginLink = document.querySelector('.login-link');
    const loginFormContainer = document.querySelector('.login-form-container');
    const signupFormContainer = document.querySelector('.signup-form-container');

    accountButton.addEventListener('click', (e) => {
        e.preventDefault();
        loginPopup.classList.add('active');
        loginFormContainer.classList.add('active');
        signupFormContainer.classList.remove('active');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#login-email').value.trim();
        const password = document.querySelector('#login-password').value.trim();
        const loginError = loginForm.querySelector('.login-form__error');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            loginError.style.display = 'none';
            alert(`Welcome, ${user.username}!`);
            loginPopup.classList.remove('active');
            loginForm.reset();
        } else {
            loginError.style.display = 'block';
            loginPopup.querySelector('.login-content').classList.add('shake');
            setTimeout(() => {
                loginPopup.querySelector('.login-content').classList.remove('shake');
            }, 300);
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.querySelector('#signup-username').value.trim();
        const email = document.querySelector('#signup-email').value.trim();
        const password = document.querySelector('#signup-password').value.trim();
        const signupError = signupForm.querySelector('.login-form__error');
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (username === '' || email === '' || password.length < 6 || users.some(u => u.email === email)) {
            signupError.style.display = 'block';
            loginPopup.querySelector('.login-content').classList.add('shake');
            setTimeout(() => {
                loginPopup.querySelector('.login-content').classList.remove('shake');
            }, 300);
        } else {
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            signupError.style.display = 'none';
            alert('Sign up successful! Please log in.');
            loginFormContainer.classList.add('active');
            signupFormContainer.classList.remove('active');
            signupForm.reset();
        }
    });

    loginClose.addEventListener('click', () => {
        loginPopup.classList.remove('active');
        loginForm.querySelector('.login-form__error').style.display = 'none';
        signupForm.querySelector('.login-form__error').style.display = 'none';
        loginForm.reset();
        signupForm.reset();
        loginFormContainer.classList.add('active');
        signupFormContainer.classList.remove('active');
    });

    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.remove('active');
        signupFormContainer.classList.add('active');
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormContainer.classList.remove('active');
        loginFormContainer.classList.add('active');
    });

    loginPopup.addEventListener('click', (e) => {
        if (e.target === loginPopup) {
            loginPopup.classList.remove('active');
            loginForm.querySelector('.login-form__error').style.display = 'none';
            signupForm.querySelector('.login-form__error').style.display = 'none';
            loginForm.reset();
            signupForm.reset();
            loginFormContainer.classList.add('active');
            signupFormContainer.classList.remove('active');
        }
    });

    const cartButton = document.querySelector('.cart');
    const cartPopup = document.querySelector('.cart-popup');
    const cartClose = document.querySelector('.cart-close');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutButton = document.querySelector('.cart-checkout');
    const buyButtons = document.querySelectorAll('.button-buy');
    let cart = [];

    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.classList.add('added');
            cartItem.innerHTML = `
                <img src="smartwatch-screen-digital-device-removebg-preview.png" alt="${item.name}">
                <div class="cart-item-details">
                    <p>${item.name}</p>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-item-increase" data-index="${index}">+</button>
                    <button class="cart-item-decrease" data-index="${index}">-</button>
                    <button class="cart-item-remove" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        updateCartTotal();
    };

    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        cartPopup.style.display = 'flex';
    });

    cartClose.addEventListener('click', () => {
        cartPopup.style.display = 'none';
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            alert('Thank you for your purchase! This is a demo project.');
            cart = [];
            renderCart();
            cartPopup.style.display = 'none';
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('cart-item-increase')) {
            cart[index].quantity++;
            renderCart();
        } else if (e.target.classList.contains('cart-item-decrease')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            renderCart();
        } else if (e.target.classList.contains('cart-item-remove')) {
            cart.splice(index, 1);
            renderCart();
        }
    });

    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const item = {
                name: 'VELAR V1',
                price: 299.99,
                quantity: 1
            };
            const existingItem = cart.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(item);
            }
            renderCart();
            cartPopup.style.display = 'flex';
        });
    });

    const connectivityItems = document.querySelectorAll('.connectivity__item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('connectivity__bluetooth')) {
                    entry.target.classList.add('animate-bluetooth');
                } else if (entry.target.classList.contains('connectivity__wifi')) {
                    entry.target.classList.add('animate-wifi');
                } else if (entry.target.classList.contains('connectivity__nfc')) {
                    entry.target.classList.add('animate-nfc');
                } else if (entry.target.classList.contains('connectivity__gps')) {
                    entry.target.classList.add('animate-gps');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    connectivityItems.forEach(item => {
        observer.observe(item);
    });

    const subscribeForm = document.querySelector('.subscribe-form');
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        if (email) {
            alert('Thank you for subscribing! This is a demo project.');
            subscribeForm.reset();
        } else {
            alert('Please enter a valid email.');
        }
    });

    const cookieLink = document.querySelector('.cookie');
    cookieLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('This is a demo project. Cookie Policy is not implemented.');
    });
});
