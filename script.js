// Sample data - Replace with your actual articles and projects
const articles = [
    {
        id: 1,
        title: "WordPress Recon & Blind XSS to Admin Dashboard Access",
        date: "2024-03-20",
        category: "Web Security",
        excerpt: "A detailed walkthrough of discovering and exploiting a WordPress site through reconnaissance, outdated plugins, and blind XSS leading to admin dashboard access...",
    },
    {
        id: 2,
        title: "That one time i could of taken over an entire casino playerbase",
        date: "2024-03-15",
        category: "Web Security",
        excerpt: "Using Wappalyzer, I discovered that the site runs on WordPress. Whenever I see WordPress, my first step is to run WPScan...",
    },
    {
        id: 3,
        title: "Windows Persistence: CLSID Hijacking",
        date: "2024-03-25",
        category: "Windows Security",
        excerpt: "A deep dive into CLSID hijacking for Windows persistence, focusing on the Recycle Bin CLSID and how to exploit it...",
    }
];

const projects = [
    {
        title: "JSSpy",
        description: "a platform for monitoring JavaScript files and detecting potential security vulnerabilities. jsspy.xyz",
        techStack: ["node.js", "express", "react", "tailwindcss"],
    },
    {
        title: "JSSpy burpsuite extension",
        description: "A burp suite extension for monitoring JavaScript files and detecting potential security vulnerabilities. https://github.com/0xGLSS/JSSpy_burp.py",
        techStack: ["Python", "Burp Suite"],
    }
];

function createArticleCard(article) {
    return `
        <div class="article-card">
            <a href="article.html?id=${article.id}">
                <div class="article-card-content">
                    <h3>${article.title}</h3>
                    <div class="article-meta">
                        <span>${article.date}</span>
                        <span>${article.category}</span>
                    </div>
                    <p>${article.excerpt}</p>
                </div>
            </a>
        </div>
    `;
}

function createProjectCard(project) {
    return `
        <div class="project-card">
            <div class="project-card-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-stack">
                    ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function loadArticles() {
    const container = document.getElementById('articles-container');
    container.innerHTML = articles.map(createArticleCard).join('');
}

function loadProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = projects.map(createProjectCard).join('');
}

// Load content when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    loadProjects();
}); 