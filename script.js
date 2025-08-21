document.addEventListener('DOMContentLoaded', function() {
    renderExecutors();
    
    const categoryTabs = document.querySelectorAll('.category-tab');
    const executorContainers = document.querySelectorAll('.executors-container');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            executorContainers.forEach(container => {
                container.classList.remove('active');
                if (container.id === `${category}-executors`) {
                    setTimeout(() => {
                        container.classList.add('active');
                    }, 50);
                }
            });
            
            animateCards();
        });
    });
    
    function renderExecutors() {
        const iosContainer = document.getElementById('ios-executors');
        const androidContainer = document.getElementById('android-executors');
        const pcContainer = document.getElementById('pc-executors');
        
        iosContainer.innerHTML = '';
        androidContainer.innerHTML = '';
        pcContainer.innerHTML = '';
        
        executorsData.forEach(executor => {
            const card = createExecutorCard(executor);
            
            if (executor.platform === 'ios') {
                iosContainer.appendChild(card);
            } else if (executor.platform === 'android') {
                androidContainer.appendChild(card);
            } else if (executor.platform === 'pc') {
                pcContainer.appendChild(card);
            }
        });
        
        animateCards();
    }
    
    function createExecutorCard(executor) {
        const card = document.createElement('div');
        card.className = 'executor-card';
        
        const priceClass = executor.price === 'free' ? 'free' : 'paid';
        const priceText = executor.price === 'free' ? 'Free' : 'Paid';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="executor-name">${executor.name}</h3>
                <div class="price-tag ${priceClass}">${priceText}</div>
            </div>
            <div class="card-body">
                <ul class="feature-list">
                    ${executor.features.map(feature => `
                        <li class="feature-item">
                            <i class="fas fa-check-circle"></i>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="card-footer">
                <button class="action-btn website-btn" data-url="${executor.website}">
                    <span>Website</span>
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="action-btn discord-btn" data-url="${executor.discord}">
                    <span>Discord</span>
                    <i class="fab fa-discord"></i>
                </button>
            </div>
        `;
        
        const buttons = card.querySelectorAll('.action-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                if (url) {
                    if (this.classList.contains('discord-btn')) {
                        simulateDiscordJoin(this);
                    } else if (this.classList.contains('website-btn')) {
                        window.open(url, '_blank');
                    }
                }
            });
        });
        
        return card;
    }
    
    function simulateDiscordJoin(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Joined!';
            button.style.background = 'linear-gradient(90deg, #238636, #2ea043)';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
                button.style.background = '';
                window.open(button.getAttribute('data-url'), '_blank');
            }, 1500);
        }, 1500);
    }
    
    const executorCards = document.querySelectorAll('.executor-card');
    
    executorCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 25;
            const angleX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    const bgCircles = document.querySelectorAll('.bg-circle');
    
    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        bgCircles.forEach((circle, index) => {
            const moveX = (mouseX - 0.5) * 20 * (index + 1);
            const moveY = (mouseY - 0.5) * 20 * (index + 1);
            
            circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    function animateCards() {
        const cards = document.querySelectorAll('.executor-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });
        
        document.querySelectorAll('.executor-card, .hero-title, .hero-subtitle').forEach(el => {
            observer.observe(el);
        });
    }
});