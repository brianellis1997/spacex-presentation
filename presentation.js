// Initialize Reveal.js
Reveal.initialize({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: 'slide',
    backgroundTransition: 'fade',
    
    // Plugins
    plugins: [ RevealHighlight, RevealNotes, RevealMath ],
    
    // Configuration
    width: 1920,
    height: 1080,
    margin: 0.04,
    minScale: 0.2,
    maxScale: 2.0
}).then(() => {
    // Initialize visualizations after Reveal is ready
    const currentSlide = Reveal.getCurrentSlide();
    if (currentSlide) {
        if (currentSlide.id === 'background-journey') {
            createJourneyTimeline();
        } else if (currentSlide.id === 'problem-statement') {
            createBottleneckDiagram();
        } else if (currentSlide.id === 'architecture') {
            createAgentArchitecture();
        } else if (currentSlide.id === 'parallel-processing') {
            setTimeout(createParallelChart, 100);
        }
    }
});

// Create interactive timeline using D3.js
Reveal.on('slidechanged', event => {
    if (event.currentSlide.id === 'background-journey') {
        createJourneyTimeline();
    }
});

function createJourneyTimeline() {
    // Clear any existing timeline
    d3.select("#journey-timeline").selectAll("*").remove();
    
    const svg = d3.select("#journey-timeline");
    const width = 1400;
    const height = 400;
    
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    // Timeline data
    const timelineData = [
        { year: "2019", title: "USAF Cyber Defense", description: "Started military service", y: 60, color: "#005288" },
        { year: "2020", title: "RF Monitoring ML", description: "First ML project", y: 320, color: "#667eea" },
        { year: "2021", title: "Penn State", description: "BS Data Science", y: 60, color: "#764ba2" },
        { year: "2023", title: "Space Force Intern", description: "Predictive maintenance", y: 320, color: "#00ff88" },
        { year: "2024", title: "1st Edge", description: "Lead AI Engineer", y: 60, color: "#ff6b35" },
        { year: "2025", title: "UT Austin", description: "MS in AI", y: 320, color: "#667eea" }
    ];
    
    // Create gradient definitions
    const defs = svg.append("defs");
    
    const gradient = defs.append("linearGradient")
        .attr("id", "timeline-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%");
    
    gradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#667eea")
        .style("stop-opacity", 1);
    
    gradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#764ba2")
        .style("stop-opacity", 1);
    
    // Main timeline line
    const xScale = d3.scaleLinear()
        .domain([0, timelineData.length - 1])
        .range([100, width - 100]);
    
    // Draw the main timeline line
    svg.append("line")
        .attr("x1", xScale(0))
        .attr("y1", height / 2)
        .attr("x2", xScale(timelineData.length - 1))
        .attr("y2", height / 2)
        .attr("stroke", "url(#timeline-gradient)")
        .attr("stroke-width", 3)
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);
    
    // Create timeline nodes
    const nodes = svg.selectAll(".timeline-node")
        .data(timelineData)
        .enter()
        .append("g")
        .attr("class", "timeline-node")
        .attr("transform", (d, i) => `translate(${xScale(i)}, ${height / 2})`);
    
    // Add connecting lines to events
    nodes.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", (d) => d.y - height / 2)
        .attr("stroke", d => d.color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .style("opacity", 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 200)
        .style("opacity", 0.6);
    
    // Add circles at timeline points
    nodes.append("circle")
        .attr("r", 0)
        .attr("fill", d => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .transition()
        .duration(500)
        .delay((d, i) => i * 200)
        .attr("r", 8);
    
    // Add event boxes
    const eventBoxes = nodes.append("g")
        .attr("transform", (d) => `translate(0, ${d.y - height / 2 + 30})`);
    
    // Event box background
    eventBoxes.append("rect")
        .attr("x", -70)
        .attr("y", -30)
        .attr("width", 140)
        .attr("height", 60)
        .attr("rx", 10)
        .attr("fill", d => d.color)
        .attr("fill-opacity", 0.1)
        .attr("stroke", d => d.color)
        .attr("stroke-width", 1)
        .style("opacity", 0)
        .transition()
        .duration(600)
        .delay((d, i) => i * 200 + 300)
        .style("opacity", 1);
    
    // Year text
    eventBoxes.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -10)
        .attr("fill", d => d.color)
        .style("font-weight", "bold")
        .style("font-size", "16px")
        .style("opacity", 0)
        .text(d => d.year)
        .transition()
        .duration(600)
        .delay((d, i) => i * 200 + 400)
        .style("opacity", 1);
    
    // Title text
    eventBoxes.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 5)
        .attr("fill", "#fff")
        .style("font-size", "14px")
        .style("opacity", 0)
        .text(d => d.title)
        .transition()
        .duration(600)
        .delay((d, i) => i * 200 + 400)
        .style("opacity", 1);
    
    // Description text
    eventBoxes.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .attr("fill", "#b0b0b0")
        .style("font-size", "12px")
        .style("opacity", 0)
        .text(d => d.description)
        .transition()
        .duration(600)
        .delay((d, i) => i * 200 + 400)
        .style("opacity", 0.8);
    
    // Add hover effects
    nodes.on("mouseover", function(event, d) {
        d3.select(this).select("circle")
            .transition()
            .duration(200)
            .attr("r", 12);
        
        d3.select(this).select("rect")
            .transition()
            .duration(200)
            .attr("fill-opacity", 0.2);
    })
    .on("mouseout", function(event, d) {
        d3.select(this).select("circle")
            .transition()
            .duration(200)
            .attr("r", 8);
        
        d3.select(this).select("rect")
            .transition()
            .duration(200)
            .attr("fill-opacity", 0.1);
    });
}

// Helper function to initialize visualizations
function initializeVisualization(slideId) {
    switch(slideId) {
        case 'background-journey':
            createJourneyTimeline();
            break;
        case 'problem-statement':
            createBottleneckDiagram();
            break;
        case 'architecture':
            createAgentArchitecture();
            break;
        case 'parallel-processing':
            createParallelChart();
            break;
        case 'rag-pipeline':
            createRAGPipeline();
            break;
        case 'document-processing':
            createDocumentPipeline();
            break;
        case 'evaluation':
            createEvaluationChart();
            break;
        case 'qa-pipeline':
            createQAPipeline();
            break;
        case 'results':
            createResultsChart();
            break;
        case 'business-impact':
            createROIChart();
            break;
        case 'scalability':
            createScalabilityViz();
            break;
    }
}

// Initialize current slide on multiple events to ensure it works
document.addEventListener('DOMContentLoaded', function() {
    // Wait for libraries to load
    const checkAndInit = () => {
        if (typeof Reveal !== 'undefined' && typeof d3 !== 'undefined' && typeof Chart !== 'undefined') {
            setTimeout(() => {
                const currentSlide = Reveal.getCurrentSlide();
                if (currentSlide && currentSlide.id) {
                    initializeVisualization(currentSlide.id);
                }
            }, 500);
        } else {
            setTimeout(checkAndInit, 100);
        }
    };
    checkAndInit();
});

// Also initialize on window load as backup
window.addEventListener('load', function() {
    setTimeout(() => {
        const currentSlide = Reveal.getCurrentSlide();
        if (currentSlide && currentSlide.id) {
            initializeVisualization(currentSlide.id);
        }
    }, 1000);
});

// Problem Statement Bottleneck Visualization
function createBottleneckDiagram() {
    const svg = d3.select("#bottleneck-diagram");
    svg.selectAll("*").remove();
    
    const width = 1400;
    const height = 500;
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    // Create gradient for flow
    const defs = svg.append("defs");
    const flowGradient = defs.append("linearGradient")
        .attr("id", "flow-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%");
    
    flowGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#ff6b35")
        .style("stop-opacity", 0.8);
    
    flowGradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#ff6b35")
        .style("stop-opacity", 0.2);
    
    // Companies on the left
    const companies = [];
    for (let i = 0; i < 12; i++) {
        companies.push({ x: 100 + (i % 3) * 80, y: 100 + Math.floor(i / 3) * 80 });
    }
    
    // Draw companies
    const companyNodes = svg.selectAll(".company")
        .data(companies)
        .enter()
        .append("g")
        .attr("class", "company")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
    
    companyNodes.append("rect")
        .attr("width", 60)
        .attr("height", 60)
        .attr("rx", 10)
        .attr("fill", "rgba(102, 126, 234, 0.2)")
        .attr("stroke", "#667eea")
        .attr("stroke-width", 2)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .delay((d, i) => i * 50)
        .style("opacity", 1);
    
    companyNodes.append("text")
        .attr("x", 30)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-size", "24px")
        .text("🏢");
    
    // Bottleneck in the middle
    const bottleneck = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    bottleneck.append("circle")
        .attr("r", 0)
        .attr("fill", "rgba(255, 107, 53, 0.2)")
        .attr("stroke", "#ff6b35")
        .attr("stroke-width", 3)
        .transition()
        .duration(800)
        .delay(600)
        .attr("r", 60);
    
    bottleneck.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 5)
        .attr("fill", "#ff6b35")
        .style("font-size", "48px")
        .style("opacity", 0)
        .text("👤")
        .transition()
        .duration(500)
        .delay(1000)
        .style("opacity", 1);
    
    bottleneck.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 90)
        .attr("fill", "#ff6b35")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .text("SINGLE LIAISON")
        .transition()
        .duration(500)
        .delay(1200)
        .style("opacity", 1);
    
    // Documents flowing
    const numFlows = 20;
    for (let i = 0; i < numFlows; i++) {
        const startCompany = companies[Math.floor(Math.random() * companies.length)];
        
        svg.append("line")
            .attr("x1", startCompany.x + 60)
            .attr("y1", startCompany.y + 30)
            .attr("x2", startCompany.x + 60)
            .attr("y2", startCompany.y + 30)
            .attr("stroke", "url(#flow-gradient)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .transition()
            .duration(2000)
            .delay(1500 + i * 100)
            .attr("x2", width / 2 - 60)
            .attr("y2", height / 2);
    }
    
    // Manual processing on the right
    const processingSteps = [
        { label: "Multiple File Types", icon: "📊", y: 100 },
        { label: "Manual Tracking", icon: "👀", y: 200 },
        { label: "Manual Data Entry", icon: "⌨️", y: 300 },
        { label: "100+ Hours/Event", icon: "⏰", y: 100 }
    ];
    
    processingSteps.forEach((step, i) => {
        const g = svg.append("g")
            .attr("transform", `translate(${width - 300}, ${step.y})`);
        
        g.append("rect")
            .attr("width", 200)
            .attr("height", 60)
            .attr("rx", 10)
            .attr("fill", "rgba(255, 107, 53, 0.1)")
            .attr("stroke", "#ff6b35")
            .attr("stroke-width", 1)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .delay(2000 + i * 200)
            .style("opacity", 1);
        
        g.append("text")
            .attr("x", 30)
            .attr("y", 35)
            .attr("fill", "#fff")
            .style("font-size", "24px")
            .style("opacity", 0)
            .text(step.icon)
            .transition()
            .duration(500)
            .delay(2100 + i * 200)
            .style("opacity", 1);
        
        g.append("text")
            .attr("x", 70)
            .attr("y", 35)
            .attr("fill", "#b0b0b0")
            .style("font-size", "14px")
            .style("opacity", 0)
            .text(step.label)
            .transition()
            .duration(500)
            .delay(2100 + i * 200)
            .style("opacity", 1);
    });
}

// Multi-Agent Architecture Diagram
function createAgentArchitecture() {
    const container = document.getElementById('agent-flow-diagram');
    container.innerHTML = '';
    
    const svg = d3.select('#agent-flow-diagram')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 1400 600');
    
    // Define arrow markers
    const defs = svg.append('defs');
    defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', '#667eea');
    
    // Node positions - adjusted layout to include Q&A Agent
    const nodes = {
        user: { x: 100, y: 300, label: "User Input", color: "#667eea", icon: "👤" },
        retrieval: { x: 300, y: 150, label: "Auto Retrieval\n(pgvector)", color: "#ff6b35", icon: "🔍" },
        generator: { x: 500, y: 300, label: "Generator\nAgent", color: "#667eea", icon: "🤖" },
        auditor: { x: 750, y: 50, label: "Auditor/\nReflection", color: "#667eea", icon: "✅" },
        codeGen: { x: 500, y: 450, label: "SQL Code\nGenerator", color: "#00ff88", icon: "💻" },
        questionProc: { x: 300, y: 450, label: "Question\nProcessor", color: "#00ff88", icon: "❓" },
        docParser: { x: 700, y: 450, label: "Document\nParser", color: "#00ff88", icon: "📄" },
        qaAgent: { x: 900, y: 450, label: "Q&A Agent\n(Template)", color: "#764ba2", icon: "📋" },
        tools: { x: 950, y: 350, label: "Tool Node\n(Python, API)", color: "#ff6b35", icon: "🔧" },
        database: { x: 1100, y: 450, label: "Update DB\n(Answers)", color: "#764ba2", icon: "💾" },
        reports: { x: 1300, y: 450, label: "Dynamic\nReports", color: "#00ff88", icon: "📊" },
        output: { x: 1100, y: 300, label: "User Output", color: "#667eea", icon: "📤" }
    };
    
    // Create links - updated with Q&A flow (auditor routes to output, not generator)
    const links = [
        { source: "user", target: "retrieval", label: "auto" },
        { source: "retrieval", target: "generator", label: "context" },
        { source: "generator", target: "auditor", label: "validate" },
        { source: "auditor", target: "generator", label: "retry", curved: true },
        { source: "auditor", target: "output", label: "approved" },
        { source: "generator", target: "codeGen", label: "sql" },
        { source: "generator", target: "questionProc", label: "questions" },
        { source: "generator", target: "docParser", label: "docs" },
        { source: "generator", target: "tools", label: "api" },
        { source: "codeGen", target: "generator", label: "SQL" },
        { source: "questionProc", target: "generator", label: "questions" },
        { source: "docParser", target: "qaAgent", label: "classified" },
        { source: "qaAgent", target: "database", label: "answers" },
        { source: "database", target: "reports", label: "generate" },
        { source: "tools", target: "generator", label: "results" }
    ];
    
    // Draw links
    links.forEach((link, i) => {
        const source = nodes[link.source];
        const target = nodes[link.target];
        
        let path;
        if (link.curved) {
            // Curved path for retry loop
            const midX = (source.x + target.x) / 2;
            const midY = Math.min(source.y, target.y) - 50;
            path = `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
        } else {
            path = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
        }
        
        svg.append('path')
            .attr('d', path)
            .attr('stroke', '#667eea')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('marker-end', 'url(#arrowhead)')
            .attr('opacity', 0)
            .attr('stroke-dasharray', function() {
                const length = this.getTotalLength();
                return length + ' ' + length;
            })
            .attr('stroke-dashoffset', function() {
                return this.getTotalLength();
            })
            .transition()
            .duration(1000)
            .delay(i * 100)
            .attr('opacity', 0.6)
            .attr('stroke-dashoffset', 0);
        
        // Add label
        const labelX = (source.x + target.x) / 2;
        const labelY = (source.y + target.y) / 2;
        
        svg.append('text')
            .attr('x', labelX)
            .attr('y', labelY - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', '#b0b0b0')
            .style('font-size', '12px')
            .style('opacity', 0)
            .text(link.label)
            .transition()
            .duration(500)
            .delay(500 + i * 100)
            .style('opacity', 1);
    });
    
    // Draw nodes
    Object.entries(nodes).forEach(([key, node], i) => {
        const g = svg.append('g')
            .attr('transform', `translate(${node.x}, ${node.y})`);
        
        // Node rectangle
        g.append('rect')
            .attr('x', -60)
            .attr('y', -30)
            .attr('width', 120)
            .attr('height', 60)
            .attr('rx', 10)
            .attr('fill', `${node.color}20`)
            .attr('stroke', node.color)
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .transition()
            .duration(500)
            .delay(i * 100)
            .style('opacity', 1);
        
        // Icon
        g.append('text')
            .attr('x', 0)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('font-size', '24px')
            .style('opacity', 0)
            .text(node.icon)
            .transition()
            .duration(500)
            .delay(100 + i * 100)
            .style('opacity', 1);
        
        // Label
        const labelLines = node.label.split('\n');
        labelLines.forEach((line, j) => {
            g.append('text')
                .attr('x', 0)
                .attr('y', 15 + j * 12)
                .attr('text-anchor', 'middle')
                .attr('fill', '#fff')
                .style('font-size', '12px')
                .style('opacity', 0)
                .text(line)
                .transition()
                .duration(500)
                .delay(100 + i * 100)
                .style('opacity', 1);
        });
    });
}

// Parallel Processing Chart
function createParallelChart() {
    const canvas = document.getElementById('parallel-chart');
    if (!canvas) {
        console.log('Canvas not found, retrying...');
        setTimeout(createParallelChart, 500);
        return;
    }
    
    // Clear any existing chart
    if (window.parallelChartInstance) {
        window.parallelChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    window.parallelChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sequential Processing', 'Parallel Processing'],
            datasets: [
                {
                    label: 'SQL Generation',
                    data: [45, 15],
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: '#667eea',
                    borderWidth: 2
                },
                {
                    label: 'Question Processing',
                    data: [30, 10],
                    backgroundColor: 'rgba(0, 255, 136, 0.6)',
                    borderColor: '#00ff88',
                    borderWidth: 2
                },
                {
                    label: 'Document Parsing',
                    data: [25, 8],
                    backgroundColor: 'rgba(255, 107, 53, 0.6)',
                    borderColor: '#ff6b35',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    ticks: { color: '#b0b0b0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    stacked: true,
                    ticks: { color: '#b0b0b0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Processing Time (seconds)',
                        color: '#b0b0b0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + 's';
                        }
                    }
                }
            }
        }
    });
}

// Update slide change handler
Reveal.on('slidechanged', event => {
    // Small delay to ensure slide is fully rendered
    setTimeout(() => {
        initializeVisualization(event.currentSlide.id);
    }, 100);
});

// RAG Pipeline Visualization
function createRAGPipeline() {
    const svg = d3.select("#rag-flow");
    svg.selectAll("*").remove();
    
    const width = 1200;
    const height = 450;
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    // Pipeline stages
    const stages = [
        { x: 120, y: 225, label: "Documents", icon: "📄", color: "#667eea" },
        { x: 280, y: 225, label: "Dolphin AI", icon: "🐬", color: "#00ff88" },
        { x: 440, y: 225, label: "Text/Image Extract", icon: "🔤", color: "#764ba2" },
        { x: 620, y: 150, label: "Embeddings", icon: "🔢", color: "#00ff88" },
        { x: 620, y: 300, label: "Keywords/NER", icon: "🏷️", color: "#ff6b35" },
        { x: 800, y: 225, label: "pgvector DB", icon: "🗄️", color: "#667eea" },
        { x: 980, y: 225, label: "Hybrid Search", icon: "🔍", color: "#764ba2" }
    ];
    
    // Draw connections
    const connections = [
        [0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [5, 6]
    ];
    
    connections.forEach((conn, i) => {
        const start = stages[conn[0]];
        const end = stages[conn[1]];
        
        svg.append("path")
            .attr("d", `M ${start.x + 40} ${start.y} L ${end.x - 40} ${end.y}`)
            .attr("stroke", "#667eea")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("opacity", 0)
            .attr("stroke-dasharray", "5,5")
            .transition()
            .duration(500)
            .delay(i * 200)
            .attr("opacity", 0.6);
    });
    
    // Draw stages
    stages.forEach((stage, i) => {
        const g = svg.append("g")
            .attr("transform", `translate(${stage.x}, ${stage.y})`);
        
        g.append("circle")
            .attr("r", 0)
            .attr("fill", `${stage.color}20`)
            .attr("stroke", stage.color)
            .attr("stroke-width", 2)
            .transition()
            .duration(500)
            .delay(i * 150)
            .attr("r", 40);
        
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 0)
            .style("font-size", "24px")
            .style("opacity", 0)
            .text(stage.icon)
            .transition()
            .duration(300)
            .delay(i * 150 + 200)
            .style("opacity", 1);
        
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 60)
            .attr("fill", "#e0e0e0")
            .style("font-size", "14px")
            .style("opacity", 0)
            .text(stage.label)
            .transition()
            .duration(300)
            .delay(i * 150 + 200)
            .style("opacity", 1);
    });
}

// Document Processing Pipeline
function createDocumentPipeline() {
    const container = document.getElementById('doc-pipeline-viz');
    if (!container) return;
    
    container.innerHTML = `
        <svg width="100%" height="300" viewBox="0 0 1200 300">
            <defs>
                <linearGradient id="doc-gradient" x1="0%" x2="100%">
                    <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#667eea;stop-opacity:1" />
                </linearGradient>
            </defs>
            
            <rect x="50" y="100" width="150" height="100" rx="10" fill="rgba(0,255,136,0.1)" stroke="#00ff88" stroke-width="2"/>
            <text x="125" y="140" text-anchor="middle" fill="#fff" font-size="32">📥</text>
            <text x="125" y="180" text-anchor="middle" fill="#e0e0e0" font-size="14">Input Files</text>
            
            <line x1="200" y1="150" x2="300" y2="150" stroke="url(#doc-gradient)" stroke-width="2" stroke-dasharray="5,5"/>
            
            <rect x="300" y="100" width="150" height="100" rx="10" fill="rgba(102,126,234,0.1)" stroke="#667eea" stroke-width="2"/>
            <text x="375" y="140" text-anchor="middle" fill="#fff" font-size="32">🤖</text>
            <text x="375" y="180" text-anchor="middle" fill="#e0e0e0" font-size="14">Multimodal AI</text>
            
            <line x1="450" y1="150" x2="550" y2="150" stroke="url(#doc-gradient)" stroke-width="2" stroke-dasharray="5,5"/>
            
            <rect x="550" y="100" width="150" height="100" rx="10" fill="rgba(118,75,162,0.1)" stroke="#764ba2" stroke-width="2"/>
            <text x="625" y="140" text-anchor="middle" fill="#fff" font-size="32">🔍</text>
            <text x="625" y="180" text-anchor="middle" fill="#e0e0e0" font-size="14">Extract & Tag</text>
            
            <line x1="700" y1="150" x2="800" y2="150" stroke="url(#doc-gradient)" stroke-width="2" stroke-dasharray="5,5"/>
            
            <rect x="800" y="100" width="150" height="100" rx="10" fill="rgba(255,107,53,0.1)" stroke="#ff6b35" stroke-width="2"/>
            <text x="875" y="140" text-anchor="middle" fill="#fff" font-size="32">📊</text>
            <text x="875" y="180" text-anchor="middle" fill="#e0e0e0" font-size="14">Classify</text>
            
            <line x1="950" y1="150" x2="1050" y2="150" stroke="url(#doc-gradient)" stroke-width="2" stroke-dasharray="5,5"/>
            
            <rect x="1050" y="100" width="150" height="100" rx="10" fill="rgba(0,255,136,0.1)" stroke="#00ff88" stroke-width="2"/>
            <text x="1125" y="140" text-anchor="middle" fill="#fff" font-size="32">✅</text>
            <text x="1125" y="180" text-anchor="middle" fill="#e0e0e0" font-size="14">Stored</text>
        </svg>
    `;
}

// Evaluation Chart
function createEvaluationChart() {
    const canvas = document.getElementById('eval-chart');
    if (!canvas) {
        setTimeout(createEvaluationChart, 500);
        return;
    }
    
    if (window.evalChartInstance) {
        window.evalChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    window.evalChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Accuracy', 'Relevance', 'Completeness', 'Speed', 'Consistency', 'Coverage'],
            datasets: [
                {
                    label: 'Before Optimization',
                    data: [65, 70, 60, 40, 75, 55],
                    backgroundColor: 'rgba(255, 107, 53, 0.2)',
                    borderColor: '#ff6b35',
                    borderWidth: 2
                },
                {
                    label: 'After Optimization',
                    data: [92, 95, 89, 95, 94, 91],
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    borderColor: '#00ff88',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#e0e0e0',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

// Q&A Pipeline Visualization
function createQAPipeline() {
    const svg = d3.select("#qa-flow-diagram");
    svg.selectAll("*").remove();
    
    const width = 1200;
    const height = 400;
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    // Q&A Pipeline flow
    const steps = [
        { x: 150, y: 200, label: "Template\nDocument", icon: "📄", color: "#764ba2" },
        { x: 350, y: 200, label: "Classify\nDocument", icon: "🏷️", color: "#667eea" },
        { x: 550, y: 200, label: "Generate\nQuestions", icon: "❓", color: "#00ff88" },
        { x: 750, y: 200, label: "Extract\nAnswers", icon: "🧠", color: "#764ba2" },
        { x: 950, y: 200, label: "Update\nDatabase", icon: "💾", color: "#ff6b35" },
        { x: 1150, y: 200, label: "Generate\nReports", icon: "📊", color: "#00ff88" }
    ];
    
    // Draw flow arrows
    for (let i = 0; i < steps.length - 1; i++) {
        svg.append("path")
            .attr("d", `M ${steps[i].x + 50} ${steps[i].y} L ${steps[i + 1].x - 50} ${steps[i + 1].y}`)
            .attr("stroke", "#764ba2")
            .attr("stroke-width", 3)
            .attr("fill", "none")
            .attr("stroke-dasharray", "10,5")
            .attr("opacity", 0)
            .transition()
            .duration(500)
            .delay(i * 200)
            .attr("opacity", 0.6);
        
        // Add arrow head
        svg.append("polygon")
            .attr("points", `${steps[i + 1].x - 50},${steps[i + 1].y - 5} ${steps[i + 1].x - 50},${steps[i + 1].y + 5} ${steps[i + 1].x - 40},${steps[i + 1].y}`)
            .attr("fill", "#764ba2")
            .attr("opacity", 0)
            .transition()
            .duration(500)
            .delay(i * 200)
            .attr("opacity", 0.8);
    }
    
    // Draw step nodes
    steps.forEach((step, i) => {
        const g = svg.append("g")
            .attr("transform", `translate(${step.x}, ${step.y})`);
        
        // Circle background
        g.append("circle")
            .attr("r", 0)
            .attr("fill", `${step.color}20`)
            .attr("stroke", step.color)
            .attr("stroke-width", 3)
            .transition()
            .duration(600)
            .delay(i * 150)
            .attr("r", 45);
        
        // Icon
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("y", -5)
            .style("font-size", "28px")
            .style("opacity", 0)
            .text(step.icon)
            .transition()
            .duration(400)
            .delay(i * 150 + 300)
            .style("opacity", 1);
        
        // Label
        const labelLines = step.label.split('\n');
        labelLines.forEach((line, j) => {
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("y", 70 + j * 18)
                .attr("fill", "#e0e0e0")
                .style("font-size", "14px")
                .style("font-weight", j === 0 ? "bold" : "normal")
                .style("opacity", 0)
                .text(line)
                .transition()
                .duration(400)
                .delay(i * 150 + 300)
                .style("opacity", 1);
        });
    });
    
    // Add example data flow
    setTimeout(() => {
        const exampleY = 300;
        svg.append("rect")
            .attr("x", 50)
            .attr("y", exampleY)
            .attr("width", 1100)
            .attr("height", 60)
            .attr("rx", 10)
            .attr("fill", "rgba(118, 75, 162, 0.05)")
            .attr("stroke", "#764ba2")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5,5")
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 1);
        
        svg.append("text")
            .attr("x", 600)
            .attr("y", exampleY + 35)
            .attr("text-anchor", "middle")
            .attr("fill", "#b0b0b0")
            .style("font-size", "14px")
            .style("font-style", "italic")
            .style("opacity", 0)
            .text("Example: \"System Requirements Doc\" → 15 questions → 15 answers → Database → Real-time report")
            .transition()
            .duration(500)
            .delay(200)
            .style("opacity", 1);
    }, 1500);
}

// Results Chart
function createResultsChart() {
    const canvas = document.getElementById('results-chart');
    if (!canvas) {
        setTimeout(createResultsChart, 500);
        return;
    }
    
    if (window.resultsChartInstance) {
        window.resultsChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    window.resultsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
            datasets: [
                {
                    label: 'Documents Processed',
                    data: [100, 250, 500, 800, 1200, 1500],
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Processing Time (hours)',
                    data: [100, 40, 20, 10, 5, 2],
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: { color: '#b0b0b0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Documents',
                        color: '#00ff88'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: { color: '#b0b0b0' },
                    grid: { drawOnChartArea: false },
                    title: {
                        display: true,
                        text: 'Time (hours)',
                        color: '#ff6b35'
                    }
                },
                x: {
                    ticks: { color: '#b0b0b0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            }
        }
    });
}

// ROI Chart
function createROIChart() {
    const canvas = document.getElementById('roi-chart');
    if (!canvas) {
        setTimeout(createROIChart, 500);
        return;
    }
    
    if (window.roiChartInstance) {
        window.roiChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    window.roiChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3 (Projected)'],
            datasets: [
                {
                    label: 'Cost Savings ($K)',
                    data: [250, 500, 750],
                    backgroundColor: '#00ff88',
                    borderColor: '#00ff88',
                    borderWidth: 2
                },
                {
                    label: 'Investment ($K)',
                    data: [50, 25, 20],
                    backgroundColor: '#ff6b35',
                    borderColor: '#ff6b35',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#b0b0b0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Amount ($K)',
                        color: '#b0b0b0'
                    }
                },
                x: {
                    ticks: { color: '#b0b0b0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            }
        }
    });
}

// Scalability Visualization
function createScalabilityViz() {
    const svg = d3.select("#scale-viz");
    svg.selectAll("*").remove();
    
    const width = 1200;
    const height = 400;
    svg.attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "transparent");  // Ensure transparent background
    
    // Core system in center
    const coreX = width / 2;
    const coreY = height / 2;
    
    // Draw core
    svg.append("circle")
        .attr("cx", coreX)
        .attr("cy", coreY)
        .attr("r", 0)
        .attr("fill", "rgba(102, 126, 234, 0.2)")
        .attr("stroke", "#667eea")
        .attr("stroke-width", 3)
        .transition()
        .duration(800)
        .attr("r", 60);
    
    svg.append("text")
        .attr("x", coreX)
        .attr("y", coreY)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .text("Core Framework")
        .transition()
        .duration(500)
        .delay(500)
        .style("opacity", 1);
    
    // Use cases around core - adjusted positions to avoid cutoff
    const useCases = [
        { angle: 0, label: "Military\nLogistics", color: "#00ff88", icon: "🎖️" },
        { angle: 72, label: "Supply\nChain", color: "#ff6b35", icon: "📦" },
        { angle: 144, label: "Contract\nAnalysis", color: "#764ba2", icon: "📝" },
        { angle: 216, label: "Intel\nProcessing", color: "#00ff88", icon: "🔍" },
        { angle: 288, label: "Research\nDocs", color: "#667eea", icon: "🔬" }
    ];
    
    useCases.forEach((useCase, i) => {
        const radius = 150;  // Reduced radius to prevent cutoff
        const x = coreX + radius * Math.cos(useCase.angle * Math.PI / 180);
        const y = coreY + radius * Math.sin(useCase.angle * Math.PI / 180);
        
        // Connection line
        svg.append("line")
            .attr("x1", coreX)
            .attr("y1", coreY)
            .attr("x2", coreX)
            .attr("y2", coreY)
            .attr("stroke", useCase.color)
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.3)
            .transition()
            .duration(500)
            .delay(1000 + i * 200)
            .attr("x2", x)
            .attr("y2", y);
        
        // Use case node
        const g = svg.append("g")
            .attr("transform", `translate(${x}, ${y})`);
        
        g.append("circle")
            .attr("r", 0)
            .attr("fill", `${useCase.color}20`)
            .attr("stroke", useCase.color)
            .attr("stroke-width", 2)
            .transition()
            .duration(500)
            .delay(1200 + i * 200)
            .attr("r", 50);
        
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("y", -5)
            .style("font-size", "24px")
            .style("opacity", 0)
            .text(useCase.icon)
            .transition()
            .duration(300)
            .delay(1400 + i * 200)
            .style("opacity", 1);
        
        const labelLines = useCase.label.split('\n');
        labelLines.forEach((line, j) => {
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("y", 20 + j * 14)
                .attr("fill", "#e0e0e0")
                .style("font-size", "12px")
                .style("opacity", 0)
                .text(line)
                .transition()
                .duration(300)
                .delay(1400 + i * 200)
                .style("opacity", 1);
        });
    });
}

// Code tab switcher
window.showCodeTab = function(tab) {
    // Hide all code contents
    document.querySelectorAll('.code-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected content
    document.getElementById(tab + '-code').style.display = 'block';
    
    // Add active class to clicked tab
    event.target.classList.add('active');
};