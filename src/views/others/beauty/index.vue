<template>
    <div class="nexus-ai">
        <!-- 3D Canvas Background -->
        <canvas ref="canvasRef" class="webgl-canvas"></canvas>

        <!-- Neural Network Background -->
        <div class="neural-network">
            <svg class="neural-svg" ref="neuralSvg">
                <g class="neural-nodes"></g>
                <g class="neural-connections"></g>
            </svg>
        </div>

        <!-- Fluid Gradient Background -->
        <div class="fluid-bg">
            <div class="gradient-orb orb-1"></div>
            <div class="gradient-orb orb-2"></div>
            <div class="gradient-orb orb-3"></div>
        </div>

        <!-- Navigation -->
        <nav class="glass-nav">
            <div class="nav-container">
                <div class="logo-container">
                    <div class="logo-icon">
                        <div class="icon-core"></div>
                        <div class="icon-ring"></div>
                        <div class="icon-ring ring-2"></div>
                    </div>
                    <span class="logo-text">NEXUS<span class="ai-badge">AI</span></span>
                </div>
                <div class="nav-links">
                    <a href="#" class="nav-link active">Home</a>
                    <a href="#" class="nav-link">Features</a>
                    <a href="#" class="nav-link">Technology</a>
                    <a href="#" class="nav-link">Contact</a>
                </div>
                <button class="nav-cta">
                    <span>Launch App</span>
                    <div class="cta-glow"></div>
                </button>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-container">
                <!-- Holographic Card -->
                <div class="holo-card" ref="holoCard">
                    <div class="card-glow"></div>
                    <div class="card-content">
                        <div class="status-badge">
                            <span class="status-dot"></span>
                            <span>Claude 4.5 Online</span>
                        </div>

                        <h1 class="hero-title">
                            <span class="title-line">The Future of</span>
                            <span class="title-line gradient-text">Artificial Intelligence</span>
                            <span class="title-line">is Here</span>
                        </h1>

                        <p class="hero-subtitle">
                            Experience the most advanced AI model with unprecedented capabilities in reasoning,
                            creativity, and understanding.
                        </p>

                        <div class="hero-actions">
                            <button class="btn-primary" ref="primaryBtn">
                                <span class="btn-text">Start Creating</span>
                                <div class="btn-particles">
                                    <span v-for="i in 12" :key="i" class="particle"></span>
                                </div>
                                <div class="btn-shine"></div>
                            </button>

                            <button class="btn-secondary">
                                <span class="btn-icon">▶</span>
                                <span>Watch Demo</span>
                            </button>
                        </div>

                        <!-- Stats Bar -->
                        <div class="stats-bar">
                            <div class="stat-item" v-for="stat in stats" :key="stat.label">
                                <div class="stat-value">{{ stat.value }}</div>
                                <div class="stat-label">{{ stat.label }}</div>
                                <div class="stat-bar-fill"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Floating Elements -->
                    <div class="floating-elements">
                        <div class="float-chip chip-1">
                            <div class="chip-icon">🧠</div>
                            <span>Neural Processing</span>
                        </div>
                        <div class="float-chip chip-2">
                            <div class="chip-icon">⚡</div>
                            <span>Real-time Analysis</span>
                        </div>
                        <div class="float-chip chip-3">
                            <div class="chip-icon">🎯</div>
                            <span>99.9% Accuracy</span>
                        </div>
                    </div>
                </div>

                <!-- 3D Visualization -->
                <div class="hero-visual" ref="heroVisual">
                    <div class="visual-core">
                        <div class="core-sphere">
                            <div class="sphere-layer" v-for="i in 5" :key="i"></div>
                        </div>
                        <div class="orbit" v-for="i in 3" :key="i">
                            <div class="orbit-dot"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scroll Indicator -->
            <div class="scroll-indicator">
                <div class="scroll-line"></div>
                <span>Scroll to Explore</span>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
            <div class="section-header">
                <h2 class="section-title">
                    <span class="title-number">01</span>
                    <span class="title-text">Core Capabilities</span>
                </h2>
            </div>

            <div class="features-grid">
                <div
                    v-for="(feature, idx) in features"
                    :key="idx"
                    class="feature-card"
                    :ref="(el) => setFeatureRef(el, idx)"
                    @mouseenter="() => onFeatureHover(idx, true)"
                    @mouseleave="() => onFeatureHover(idx, false)"
                    @mousemove="(e) => onFeatureMove(e, idx)"
                >
                    <div class="feature-bg"></div>
                    <div class="feature-border"></div>

                    <div class="feature-icon-container">
                        <div class="icon-bg"></div>
                        <div class="feature-icon">{{ feature.icon }}</div>
                    </div>

                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p class="feature-desc">{{ feature.description }}</p>

                    <div class="feature-metrics">
                        <div class="metric">
                            <span class="metric-value">{{ feature.metric }}</span>
                            <span class="metric-label">Performance</span>
                        </div>
                    </div>

                    <div class="card-shine"></div>
                </div>
            </div>
        </section>

        <!-- Tech Visualization -->
        <section class="tech-section">
            <div class="tech-container">
                <h2 class="section-title centered">
                    <span class="title-number">02</span>
                    <span class="title-text">Neural Architecture</span>
                </h2>

                <div class="tech-grid">
                    <!-- Data Flow Visualization -->
                    <div class="tech-card data-flow">
                        <div class="flow-container">
                            <div class="flow-layer" v-for="i in 8" :key="i">
                                <div class="flow-bar"></div>
                            </div>
                        </div>
                        <div class="card-label">Data Processing</div>
                    </div>

                    <!-- Brain Visualization -->
                    <div class="tech-card brain-viz">
                        <div class="brain-container">
                            <div class="brain-hemisphere left">
                                <div class="brain-node" v-for="i in 12" :key="i"></div>
                            </div>
                            <div class="brain-hemisphere right">
                                <div class="brain-node" v-for="i in 12" :key="i"></div>
                            </div>
                            <svg class="brain-connections">
                                <path v-for="i in 20" :key="i" class="brain-path"></path>
                            </svg>
                        </div>
                        <div class="card-label">Neural Network</div>
                    </div>

                    <!-- Quantum Processor -->
                    <div class="tech-card quantum">
                        <div class="quantum-container">
                            <div class="quantum-core">
                                <div class="quantum-ring" v-for="i in 6" :key="i"></div>
                            </div>
                        </div>
                        <div class="card-label">Quantum Core</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Interactive Demo -->
        <section class="demo-section">
            <div class="demo-container">
                <div class="demo-terminal" ref="terminal">
                    <div class="terminal-header">
                        <div class="terminal-dots">
                            <span class="dot red"></span>
                            <span class="dot yellow"></span>
                            <span class="dot green"></span>
                        </div>
                        <div class="terminal-title">AI Response Terminal</div>
                    </div>

                    <div class="terminal-body">
                        <div class="terminal-line" v-for="(line, idx) in terminalLines" :key="idx">
                            <span class="line-prompt">{{ line.prompt }}</span>
                            <span class="line-text">{{ line.text }}</span>
                        </div>
                        <div class="terminal-cursor"></div>
                    </div>

                    <div class="demo-prompt">
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            class="prompt-input"
                            @keyup.enter="handlePromptSubmit"
                        />
                        <button class="prompt-submit">
                            <span>→</span>
                        </button>
                    </div>
                </div>

                <div class="demo-stats">
                    <div class="stat-card" v-for="demoStat in demoStats" :key="demoStat.label">
                        <div class="stat-icon">{{ demoStat.icon }}</div>
                        <div class="stat-info">
                            <div class="stat-number">{{ demoStat.value }}</div>
                            <div class="stat-text">{{ demoStat.label }}</div>
                        </div>
                        <div class="stat-graph">
                            <div class="graph-bar" v-for="i in 12" :key="i"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <div class="cta-container">
                <div class="cta-content">
                    <h2 class="cta-title">Ready to Build the Future?</h2>
                    <p class="cta-subtitle">Join thousands of developers and creators using NEXUS AI</p>

                    <div class="cta-actions">
                        <button class="btn-large">
                            <span>Get Started Free</span>
                            <div class="btn-aurora"></div>
                        </button>
                        <button class="btn-outline">
                            <span>View Documentation</span>
                        </button>
                    </div>

                    <div class="trust-badges">
                        <div class="badge" v-for="badge in trustBadges" :key="badge">
                            {{ badge }}
                        </div>
                    </div>
                </div>

                <!-- Animated Background -->
                <div class="cta-background">
                    <div class="cta-grid">
                        <div class="grid-line" v-for="i in 20" :key="i"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-left">
                    <div class="footer-logo">NEXUS AI</div>
                    <p>The most advanced AI model of 2025</p>
                </div>
                <div class="footer-links">
                    <div class="link-group">
                        <h4>Product</h4>
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">API</a>
                    </div>
                    <div class="link-group">
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Blog</a>
                        <a href="#">Careers</a>
                    </div>
                    <div class="link-group">
                        <h4>Resources</h4>
                        <a href="#">Documentation</a>
                        <a href="#">Support</a>
                        <a href="#">Status</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 NEXUS AI. Built with ❤️ by Claude 4.5</p>
            </div>
        </footer>

        <!-- Cursor Follower -->
        <div class="cursor-dot" ref="cursorDot"></div>
        <div class="cursor-ring" ref="cursorRing"></div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    gsap.registerPlugin(ScrollTrigger);

    // Refs
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const neuralSvg = ref<SVGElement | null>(null);
    const holoCard = ref<HTMLElement | null>(null);
    const heroVisual = ref<HTMLElement | null>(null);
    const primaryBtn = ref<HTMLElement | null>(null);
    const terminal = ref<HTMLElement | null>(null);
    const cursorDot = ref<HTMLElement | null>(null);
    const cursorRing = ref<HTMLElement | null>(null);

    const featureRefs = ref<(HTMLElement | null)[]>([]);

    // Data
    const stats = [
        { value: '200B+', label: 'Parameters' },
        { value: '99.9%', label: 'Uptime' },
        { value: '<10ms', label: 'Latency' },
    ];

    const features = [
        {
            icon: '🧠',
            title: 'Advanced Reasoning',
            description: 'Multi-step logical thinking with chain-of-thought processing',
            metric: '98%',
        },
        {
            icon: '🎨',
            title: 'Creative Generation',
            description: 'Text, code, and visual content with artistic understanding',
            metric: '95%',
        },
        {
            icon: '🔍',
            title: 'Deep Analysis',
            description: 'Complex data interpretation and pattern recognition',
            metric: '97%',
        },
        {
            icon: '🌐',
            title: 'Multilingual',
            description: 'Support for 100+ languages with cultural context',
            metric: '94%',
        },
        {
            icon: '⚡',
            title: 'Real-time Processing',
            description: 'Instant responses with streaming capabilities',
            metric: '99%',
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            description: 'Enterprise-grade security with data encryption',
            metric: '100%',
        },
    ];

    const terminalLines = ref([
        { prompt: '> ', text: 'Initializing NEXUS AI...' },
        { prompt: '✓ ', text: 'Neural networks loaded' },
        { prompt: '✓ ', text: 'Quantum processors online' },
        { prompt: '> ', text: 'Ready for input' },
    ]);

    const demoStats = [
        { icon: '⚡', label: 'Requests/sec', value: '15.2K' },
        { icon: '🎯', label: 'Accuracy', value: '99.8%' },
        { icon: '🚀', label: 'Speed', value: '8ms' },
    ];

    const trustBadges = ['🏆 Best AI 2025', '⭐ 500K+ Users', '🔒 SOC 2 Certified', '🌍 Global Coverage'];

    // Helpers
    const setFeatureRef = (el: any, idx: number) => {
        if (el) featureRefs.value[idx] = el;
    };

    const onFeatureHover = (idx: number, isEnter: boolean) => {
        const card = featureRefs.value[idx];
        if (!card) return;

        const bg = card.querySelector('.feature-bg');
        const shine = card.querySelector('.card-shine');

        gsap.to(bg, {
            opacity: isEnter ? 1 : 0,
            scale: isEnter ? 1 : 0.8,
            duration: 0.4,
        });

        if (isEnter) {
            gsap.fromTo(
                shine,
                { x: '-100%', opacity: 0 },
                { x: '200%', opacity: 1, duration: 0.6, ease: 'power2.out' }
            );
        }
    };

    const onFeatureMove = (e: MouseEvent, idx: number) => {
        const card = featureRefs.value[idx];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
            rotationY: x / 20,
            rotationX: -y / 20,
            transformPerspective: 1000,
            duration: 0.5,
            ease: 'power2.out',
        });
    };

    const handlePromptSubmit = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.value.trim()) {
            terminalLines.value.push(
                { prompt: '$ ', text: input.value },
                { prompt: '◆ ', text: 'Processing with NEXUS AI...' }
            );
            input.value = '';

            setTimeout(() => {
                terminalLines.value.push({ prompt: '✓ ', text: 'Response generated successfully!' });
            }, 1500);
        }
    };

    // WebGL Particle System
    const initWebGL = () => {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: any[] = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 200, 255, 0.6)`;
                ctx.fill();

                // Connect nearby particles
                particles.forEach((p2, j) => {
                    if (i !== j) {
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 100) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(100, 200, 255, ${0.2 * (1 - dist / 100)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();
    };

    // Neural Network Visualization
    const initNeuralNetwork = () => {
        const svg = neuralSvg.value;
        if (!svg) return;

        const nodes: any[] = [];
        const nodeCount = 30;

        for (let i = 0; i < nodeCount; i++) {
            const node = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
            };
            nodes.push(node);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', String(node.x));
            circle.setAttribute('cy', String(node.y));
            circle.setAttribute('r', '3');
            circle.setAttribute('fill', '#64c8ff');
            circle.setAttribute('opacity', '0.6');
            svg.querySelector('.neural-nodes')?.appendChild(circle);
        }

        const animate = () => {
            const circles = svg.querySelectorAll('.neural-nodes circle');
            const connectionsGroup = svg.querySelector('.neural-connections');
            if (connectionsGroup) connectionsGroup.innerHTML = '';

            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
                if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

                const circle = circles[i];
                circle.setAttribute('cx', String(node.x));
                circle.setAttribute('cy', String(node.y));

                // Create connections
                nodes.forEach((node2, j) => {
                    if (i < j) {
                        const dx = node.x - node2.x;
                        const dy = node.y - node2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 150) {
                            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                            line.setAttribute('x1', String(node.x));
                            line.setAttribute('y1', String(node.y));
                            line.setAttribute('x2', String(node2.x));
                            line.setAttribute('y2', String(node2.y));
                            line.setAttribute('stroke', '#64c8ff');
                            line.setAttribute('stroke-width', '0.5');
                            line.setAttribute('opacity', String(0.3 * (1 - dist / 150)));
                            connectionsGroup?.appendChild(line);
                        }
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();
    };

    // Animations
    onMounted(() => {
        // Custom Cursor
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot.value, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
            });
            gsap.to(cursorRing.value, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
            });
        });

        // Initialize WebGL and Neural Network
        initWebGL();
        initNeuralNetwork();

        // Fluid Orbs Animation
        gsap.to('.orb-1', {
            x: 300,
            y: -200,
            duration: 20,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        gsap.to('.orb-2', {
            x: -200,
            y: 300,
            duration: 25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        gsap.to('.orb-3', {
            x: 200,
            y: 200,
            duration: 30,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        // Hero Card 3D Tilt
        if (holoCard.value) {
            holoCard.value.addEventListener('mousemove', (e) => {
                const rect = holoCard.value!.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(holoCard.value, {
                    rotationY: x / 30,
                    rotationX: -y / 30,
                    transformPerspective: 1000,
                    duration: 0.5,
                });
            });

            holoCard.value.addEventListener('mouseleave', () => {
                gsap.to(holoCard.value, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.5,
                });
            });
        }

        // Floating Chips Animation
        gsap.to('.chip-1', {
            y: -20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        gsap.to('.chip-2', {
            y: -15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.5,
        });

        gsap.to('.chip-3', {
            y: -25,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1,
        });

        // Visual Core Rotation
        gsap.to('.core-sphere', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none',
        });

        gsap.to('.orbit', {
            rotation: -360,
            duration: 15,
            repeat: -1,
            ease: 'none',
            stagger: 1,
        });

        // Scroll Animations
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
        });

        // Tech Visualizations
        gsap.to('.flow-bar', {
            scaleX: () => Math.random(),
            duration: 1,
            repeat: -1,
            stagger: {
                each: 0.1,
                repeat: -1,
            },
        });

        gsap.to('.brain-node', {
            scale: 1.5,
            opacity: 0.8,
            duration: 1,
            repeat: -1,
            yoyo: true,
            stagger: {
                each: 0.1,
                repeat: -1,
            },
        });

        gsap.to('.quantum-ring', {
            rotation: 360,
            duration: 10,
            repeat: -1,
            ease: 'none',
            stagger: 0.5,
        });

        // Terminal Cursor Blink
        gsap.to('.terminal-cursor', {
            opacity: 0,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
        });

        // Stats Bars Animation
        gsap.to('.graph-bar', {
            scaleY: () => 0.3 + Math.random() * 0.7,
            duration: 1,
            repeat: -1,
            stagger: {
                each: 0.1,
                repeat: -1,
            },
        });

        // Stat Bar Fill Animation
        gsap.to('.stat-bar-fill', {
            scaleX: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.stats-bar',
                start: 'top 80%',
            },
        });
    });

    onUnmounted(() => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
    });
</script>

<style lang="scss" scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .nexus-ai {
        position: relative;
        background: #0a0a14;
        color: #fff;
        min-height: 100vh;
        overflow-x: hidden;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    // WebGL Canvas
    .webgl-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
    }

    // Neural Network
    .neural-network {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        pointer-events: none;
        opacity: 0.3;

        .neural-svg {
            width: 100%;
            height: 100%;
        }
    }

    // Fluid Background
    .fluid-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;

        .gradient-orb {
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            filter: blur(100px);
            opacity: 0.4;

            &.orb-1 {
                top: 10%;
                left: 20%;
                background: radial-gradient(circle, #6366f1 0%, transparent 70%);
            }

            &.orb-2 {
                bottom: 20%;
                right: 10%;
                background: radial-gradient(circle, #ec4899 0%, transparent 70%);
            }

            &.orb-3 {
                top: 50%;
                left: 50%;
                background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
            }
        }
    }

    // Navigation
    .glass-nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        padding: 1.5rem 0;
        background: rgba(10, 10, 20, 0.6);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 1rem;

            .logo-icon {
                position: relative;
                width: 40px;
                height: 40px;

                .icon-core {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 12px;
                    height: 12px;
                    background: #64c8ff;
                    border-radius: 50%;
                    box-shadow: 0 0 20px #64c8ff;
                }

                .icon-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 30px;
                    height: 30px;
                    border: 2px solid #64c8ff;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: rotate 3s linear infinite;

                    &.ring-2 {
                        width: 40px;
                        height: 40px;
                        border-color: #ec4899;
                        border-right-color: transparent;
                        animation-duration: 4s;
                        animation-direction: reverse;
                    }
                }
            }

            .logo-text {
                font-size: 1.5rem;
                font-weight: 900;
                letter-spacing: 2px;

                .ai-badge {
                    display: inline-block;
                    margin-left: 0.5rem;
                    padding: 0.2rem 0.5rem;
                    font-size: 0.7rem;
                    background: linear-gradient(135deg, #6366f1, #ec4899);
                    border-radius: 4px;
                }
            }
        }

        .nav-links {
            display: flex;
            gap: 3rem;

            .nav-link {
                color: rgba(255, 255, 255, 0.7);
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s;
                position: relative;

                &.active,
                &:hover {
                    color: #fff;
                }

                &.active::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, #6366f1, #ec4899);
                    border-radius: 2px;
                }
            }
        }

        .nav-cta {
            position: relative;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border: none;
            border-radius: 8px;
            color: #fff;
            font-weight: 600;
            cursor: pointer;
            overflow: hidden;

            span {
                position: relative;
                z-index: 2;
            }

            .cta-glow {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }

            &:hover .cta-glow {
                opacity: 1;
            }
        }
    }

    // Hero Section
    .hero-section {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8rem 2rem 4rem;
        z-index: 10;

        .hero-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .holo-card {
            position: relative;
            padding: 4rem;
            background: rgba(20, 20, 40, 0.5);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            transform-style: preserve-3d;

            .card-glow {
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(135deg, #6366f1, #ec4899, #06b6d4);
                border-radius: 24px;
                opacity: 0.5;
                filter: blur(20px);
                z-index: -1;
            }

            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: rgba(100, 200, 100, 0.1);
                border: 1px solid rgba(100, 200, 100, 0.3);
                border-radius: 20px;
                font-size: 0.85rem;
                margin-bottom: 2rem;

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #64c864;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                }
            }

            .hero-title {
                font-size: 3.5rem;
                font-weight: 900;
                line-height: 1.1;
                margin-bottom: 1.5rem;

                .title-line {
                    display: block;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #6366f1, #ec4899, #06b6d4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            }

            .hero-subtitle {
                font-size: 1.2rem;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 2.5rem;
            }

            .hero-actions {
                display: flex;
                gap: 1rem;
                margin-bottom: 3rem;
            }

            .btn-primary {
                position: relative;
                padding: 1rem 2.5rem;
                background: linear-gradient(135deg, #6366f1, #ec4899);
                border: none;
                border-radius: 12px;
                color: #fff;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                overflow: hidden;

                .btn-text {
                    position: relative;
                    z-index: 3;
                }

                .btn-particles {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;

                    .particle {
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: #fff;
                        border-radius: 50%;
                        opacity: 0;
                    }
                }

                .btn-shine {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transform: skewX(-20deg);
                }

                &:hover .btn-shine {
                    animation: shine 1s ease;
                }
            }

            .btn-secondary {
                padding: 1rem 2rem;
                background: transparent;
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                color: #fff;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s;

                .btn-icon {
                    font-size: 0.9rem;
                }

                &:hover {
                    border-color: rgba(255, 255, 255, 0.5);
                    background: rgba(255, 255, 255, 0.05);
                }
            }

            .stats-bar {
                display: flex;
                gap: 2rem;
                padding-top: 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);

                .stat-item {
                    position: relative;
                    flex: 1;

                    .stat-value {
                        font-size: 2rem;
                        font-weight: 900;
                        background: linear-gradient(135deg, #64c8ff, #ec4899);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .stat-label {
                        font-size: 0.85rem;
                        color: rgba(255, 255, 255, 0.5);
                        margin-top: 0.25rem;
                    }

                    .stat-bar-fill {
                        position: absolute;
                        bottom: -8px;
                        left: 0;
                        width: 100%;
                        height: 3px;
                        background: linear-gradient(90deg, #6366f1, #ec4899);
                        border-radius: 2px;
                        transform: scaleX(0);
                        transform-origin: left;
                    }
                }
            }

            .floating-elements {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;

                .float-chip {
                    position: absolute;
                    padding: 0.75rem 1.25rem;
                    background: rgba(20, 20, 40, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.9rem;

                    .chip-icon {
                        font-size: 1.5rem;
                    }

                    &.chip-1 {
                        top: -30px;
                        right: 50px;
                    }

                    &.chip-2 {
                        top: 150px;
                        right: -40px;
                    }

                    &.chip-3 {
                        bottom: 100px;
                        left: -50px;
                    }
                }
            }
        }

        .hero-visual {
            position: relative;
            height: 600px;

            .visual-core {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .core-sphere {
                    position: relative;
                    width: 300px;
                    height: 300px;
                    transform-style: preserve-3d;

                    .sphere-layer {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border: 2px solid;
                        border-radius: 50%;
                        opacity: 0.3;

                        &:nth-child(1) {
                            width: 80%;
                            height: 80%;
                            border-color: #6366f1;
                        }

                        &:nth-child(2) {
                            width: 90%;
                            height: 90%;
                            border-color: #ec4899;
                        }

                        &:nth-child(3) {
                            width: 100%;
                            height: 100%;
                            border-color: #06b6d4;
                        }

                        &:nth-child(4) {
                            width: 110%;
                            height: 110%;
                            border-color: #6366f1;
                        }

                        &:nth-child(5) {
                            width: 120%;
                            height: 120%;
                            border-color: #ec4899;
                        }
                    }
                }

                .orbit {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 400px;
                    height: 400px;
                    border: 1px solid rgba(100, 200, 255, 0.2);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);

                    &:nth-child(2) {
                        width: 500px;
                        height: 500px;
                    }

                    &:nth-child(3) {
                        width: 600px;
                        height: 600px;
                    }

                    .orbit-dot {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 12px;
                        height: 12px;
                        background: #64c8ff;
                        border-radius: 50%;
                        box-shadow: 0 0 20px #64c8ff;
                    }
                }
            }
        }

        .scroll-indicator {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            opacity: 0.6;

            .scroll-line {
                width: 2px;
                height: 40px;
                background: linear-gradient(to bottom, transparent, #64c8ff, transparent);
                animation: scroll-down 2s ease-in-out infinite;
            }

            span {
                font-size: 0.85rem;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
        }
    }

    // Features Section
    .features-section {
        position: relative;
        padding: 8rem 2rem;
        z-index: 10;

        .section-header {
            max-width: 1400px;
            margin: 0 auto 4rem;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 2rem;
            font-size: 3rem;
            font-weight: 900;

            .title-number {
                font-size: 1.5rem;
                color: rgba(255, 255, 255, 0.3);
                font-weight: 300;
            }

            &.centered {
                justify-content: center;
                margin-bottom: 4rem;
            }
        }

        .features-grid {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .feature-card {
            position: relative;
            padding: 2.5rem;
            background: rgba(20, 20, 40, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            cursor: pointer;
            transform-style: preserve-3d;
            transition: transform 0.3s;

            .feature-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
                border-radius: 20px;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .feature-border {
                position: absolute;
                top: -1px;
                left: -1px;
                right: -1px;
                bottom: -1px;
                background: linear-gradient(135deg, #6366f1, #ec4899);
                border-radius: 20px;
                opacity: 0;
                z-index: -1;
                transition: opacity 0.3s;
            }

            &:hover .feature-border {
                opacity: 0.5;
            }

            .feature-icon-container {
                position: relative;
                width: 80px;
                height: 80px;
                margin-bottom: 1.5rem;

                .icon-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));
                    border-radius: 50%;
                    filter: blur(10px);
                }

                .feature-icon {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                }
            }

            .feature-title {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
            }

            .feature-desc {
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }

            .feature-metrics {
                display: flex;
                gap: 2rem;

                .metric {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;

                    .metric-value {
                        font-size: 2rem;
                        font-weight: 900;
                        background: linear-gradient(135deg, #64c8ff, #ec4899);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .metric-label {
                        font-size: 0.85rem;
                        color: rgba(255, 255, 255, 0.5);
                    }
                }
            }

            .card-shine {
                position: absolute;
                top: 0;
                left: -100%;
                width: 50%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transform: skewX(-20deg);
                pointer-events: none;
            }
        }
    }

    // Tech Section
    .tech-section {
        position: relative;
        padding: 8rem 2rem;
        z-index: 10;

        .tech-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .tech-card {
            position: relative;
            aspect-ratio: 1;
            background: rgba(20, 20, 40, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem;
            overflow: hidden;

            .card-label {
                position: absolute;
                bottom: 2rem;
                left: 2rem;
                font-size: 1.2rem;
                font-weight: 700;
                z-index: 10;
            }
        }

        .data-flow {
            .flow-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                height: 100%;
                justify-content: center;

                .flow-layer {
                    height: 30px;
                    background: rgba(100, 200, 255, 0.1);
                    border-radius: 8px;
                    overflow: hidden;

                    .flow-bar {
                        height: 100%;
                        background: linear-gradient(90deg, #6366f1, #ec4899);
                        transform-origin: left;
                        border-radius: 8px;
                    }
                }
            }
        }

        .brain-viz {
            .brain-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                gap: 4rem;
                justify-content: center;
                align-items: center;

                .brain-hemisphere {
                    position: relative;
                    width: 120px;
                    height: 200px;

                    .brain-node {
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        background: #64c8ff;
                        border-radius: 50%;
                        box-shadow: 0 0 10px #64c8ff;

                        @for $i from 1 through 12 {
                            &:nth-child(#{$i}) {
                                top: random(180) + px;
                                left: random(100) + px;
                            }
                        }
                    }
                }

                .brain-connections {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;

                    .brain-path {
                        stroke: #64c8ff;
                        stroke-width: 1;
                        opacity: 0.3;
                        fill: none;
                    }
                }
            }
        }

        .quantum {
            .quantum-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .quantum-core {
                    position: relative;
                    width: 200px;
                    height: 200px;

                    .quantum-ring {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border: 2px solid;
                        border-radius: 50%;

                        @for $i from 1 through 6 {
                            &:nth-child(#{$i}) {
                                width: 40px + ($i * 20px);
                                height: 40px + ($i * 20px);
                                border-color: rgba(100, 200, 255, 1 - $i * 0.15);
                            }
                        }
                    }
                }
            }
        }
    }

    // Demo Section
    .demo-section {
        position: relative;
        padding: 8rem 2rem;
        z-index: 10;

        .demo-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }

        .demo-terminal {
            background: rgba(20, 20, 40, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            overflow: hidden;

            .terminal-header {
                padding: 1rem 1.5rem;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);

                .terminal-dots {
                    display: flex;
                    gap: 0.5rem;

                    .dot {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;

                        &.red {
                            background: #ff5f57;
                        }

                        &.yellow {
                            background: #ffbd2e;
                        }

                        &.green {
                            background: #28ca42;
                        }
                    }
                }

                .terminal-title {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                }
            }

            .terminal-body {
                padding: 2rem;
                font-family: 'Monaco', 'Courier New', monospace;
                font-size: 0.95rem;
                min-height: 300px;

                .terminal-line {
                    margin-bottom: 0.75rem;

                    .line-prompt {
                        color: #64c8ff;
                        margin-right: 0.5rem;
                    }

                    .line-text {
                        color: rgba(255, 255, 255, 0.9);
                    }
                }

                .terminal-cursor {
                    display: inline-block;
                    width: 8px;
                    height: 18px;
                    background: #64c8ff;
                    margin-left: 0.5rem;
                    vertical-align: middle;
                }
            }

            .demo-prompt {
                padding: 1.5rem;
                background: rgba(0, 0, 0, 0.3);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 1rem;

                .prompt-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: #fff;
                    font-size: 1rem;
                    outline: none;
                    font-family: inherit;

                    &::placeholder {
                        color: rgba(255, 255, 255, 0.4);
                    }

                    &:focus {
                        border-color: #64c8ff;
                    }
                }

                .prompt-submit {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #6366f1, #ec4899);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: transform 0.2s;

                    &:hover {
                        transform: scale(1.05);
                    }
                }
            }
        }

        .demo-stats {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            .stat-card {
                padding: 2rem;
                background: rgba(20, 20, 40, 0.6);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;

                .stat-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .stat-info {
                    margin-bottom: 1.5rem;

                    .stat-number {
                        font-size: 2rem;
                        font-weight: 900;
                        background: linear-gradient(135deg, #64c8ff, #ec4899);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .stat-text {
                        font-size: 0.9rem;
                        color: rgba(255, 255, 255, 0.6);
                        margin-top: 0.25rem;
                    }
                }

                .stat-graph {
                    display: flex;
                    align-items: flex-end;
                    gap: 4px;
                    height: 60px;

                    .graph-bar {
                        flex: 1;
                        background: linear-gradient(to top, #6366f1, #ec4899);
                        border-radius: 2px;
                        transform-origin: bottom;
                    }
                }
            }
        }
    }

    // CTA Section
    .cta-section {
        position: relative;
        padding: 10rem 2rem;
        z-index: 10;

        .cta-container {
            position: relative;
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .cta-content {
            position: relative;
            z-index: 2;

            .cta-title {
                font-size: 4rem;
                font-weight: 900;
                margin-bottom: 1.5rem;
                background: linear-gradient(135deg, #fff, #64c8ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .cta-subtitle {
                font-size: 1.5rem;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 3rem;
            }

            .cta-actions {
                display: flex;
                gap: 1.5rem;
                justify-content: center;
                margin-bottom: 4rem;

                .btn-large {
                    position: relative;
                    padding: 1.5rem 3rem;
                    background: linear-gradient(135deg, #6366f1, #ec4899);
                    border: none;
                    border-radius: 16px;
                    color: #fff;
                    font-size: 1.3rem;
                    font-weight: 700;
                    cursor: pointer;
                    overflow: hidden;

                    span {
                        position: relative;
                        z-index: 2;
                    }

                    .btn-aurora {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
                        opacity: 0;
                        transition: opacity 0.3s;
                    }

                    &:hover .btn-aurora {
                        opacity: 1;
                        animation: aurora 2s ease infinite;
                    }
                }

                .btn-outline {
                    padding: 1.5rem 3rem;
                    background: transparent;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 16px;
                    color: #fff;
                    font-size: 1.3rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;

                    &:hover {
                        border-color: #64c8ff;
                        background: rgba(100, 200, 255, 0.1);
                    }
                }
            }

            .trust-badges {
                display: flex;
                gap: 2rem;
                justify-content: center;
                flex-wrap: wrap;

                .badge {
                    padding: 0.75rem 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.8);
                }
            }
        }

        .cta-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;

            .cta-grid {
                position: relative;
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: repeat(20, 1fr);
                gap: 1px;
                opacity: 0.1;

                .grid-line {
                    background: linear-gradient(to bottom, transparent, #64c8ff, transparent);
                    animation: grid-flow 3s ease-in-out infinite;
                    animation-delay: calc(var(--i) * 0.1s);

                    @for $i from 1 through 20 {
                        &:nth-child(#{$i}) {
                            animation-delay: #{$i * 0.1}s;
                        }
                    }
                }
            }
        }
    }

    // Footer
    .footer {
        position: relative;
        padding: 4rem 2rem 2rem;
        background: rgba(10, 10, 20, 0.8);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 10;

        .footer-content {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 3fr;
            gap: 4rem;
            padding-bottom: 3rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);

            .footer-left {
                .footer-logo {
                    font-size: 1.8rem;
                    font-weight: 900;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #6366f1, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                p {
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.6;
                }
            }

            .footer-links {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 3rem;

                .link-group {
                    h4 {
                        font-size: 1.1rem;
                        font-weight: 700;
                        margin-bottom: 1.5rem;
                    }

                    a {
                        display: block;
                        color: rgba(255, 255, 255, 0.6);
                        text-decoration: none;
                        margin-bottom: 0.75rem;
                        transition: color 0.3s;

                        &:hover {
                            color: #64c8ff;
                        }
                    }
                }
            }
        }

        .footer-bottom {
            max-width: 1400px;
            margin: 0 auto;
            padding-top: 2rem;
            text-align: center;

            p {
                color: rgba(255, 255, 255, 0.4);
                font-size: 0.9rem;
            }
        }
    }

    // Custom Cursor
    .cursor-dot {
        position: fixed;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        background: #64c8ff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
        transform: translate(-50%, -50%);
    }

    .cursor-ring {
        position: fixed;
        top: 0;
        left: 0;
        width: 30px;
        height: 30px;
        border: 2px solid rgba(100, 200, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
    }

    // Animations
    @keyframes rotate {
        from {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.5;
            transform: scale(1.2);
        }
    }

    @keyframes shine {
        to {
            left: 200%;
        }
    }

    @keyframes scroll-down {
        0% {
            transform: translateY(-20px);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(20px);
            opacity: 0;
        }
    }

    @keyframes aurora {
        0%,
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.6;
        }
    }

    @keyframes grid-flow {
        0%,
        100% {
            opacity: 0.1;
            transform: scaleY(0.5);
        }
        50% {
            opacity: 0.5;
            transform: scaleY(1.5);
        }
    }

    // Responsive Design
    @media (max-width: 1200px) {
        .hero-section .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
        }

        .hero-visual {
            height: 400px;
        }

        .demo-section .demo-container {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .glass-nav {
            .nav-container {
                padding: 0 1rem;
            }

            .nav-links {
                display: none;
            }
        }

        .hero-section {
            padding: 6rem 1rem 3rem;

            .holo-card {
                padding: 2rem;

                .hero-title {
                    font-size: 2.5rem;
                }

                .hero-subtitle {
                    font-size: 1rem;
                }

                .hero-actions {
                    flex-direction: column;

                    .btn-primary,
                    .btn-secondary {
                        width: 100%;
                    }
                }

                .stats-bar {
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .floating-elements {
                    display: none;
                }
            }
        }

        .features-section .features-grid {
            grid-template-columns: 1fr;
        }

        .tech-section .tech-grid {
            grid-template-columns: 1fr;
        }

        .footer .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;

            .footer-links {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
        }

        .cta-section {
            .cta-title {
                font-size: 2.5rem;
            }

            .cta-subtitle {
                font-size: 1.1rem;
            }

            .cta-actions {
                flex-direction: column;

                .btn-large,
                .btn-outline {
                    width: 100%;
                }
            }
        }

        .section-title {
            font-size: 2rem !important;

            .title-number {
                font-size: 1.2rem !important;
            }
        }
    }

    // Scrollbar Styling
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: #0a0a14;
    }

    ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #6366f1, #ec4899);
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #7c7ff5, #f05ba3);
    }

    // Selection
    ::selection {
        background: rgba(99, 102, 241, 0.3);
        color: #fff;
    }

    // Performance Optimizations
    * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .holo-card,
    .feature-card,
    .tech-card,
    .demo-terminal {
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
    }
</style>
