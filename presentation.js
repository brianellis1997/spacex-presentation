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
            setTimeout(() => createAgentArchitecture(), 100);
        } else if (currentSlide.id === 'parallel-processing') {
            setTimeout(createParallelChart, 100);
        }
    }
});

// Create interactive timeline using D3.js
Reveal.on('slidechanged', event => {
    if (event.currentSlide.id === 'background-journey') {
        createJourneyTimeline();
    } else if (event.currentSlide.id === 'architecture') {
        setTimeout(() => createAgentArchitecture(), 100);
    } else if (event.currentSlide.id === 'liaison-example') {
        setTimeout(() => createLiaisonQueryFlow(), 100);
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
        { year: "2020", title: "RF Monitoring ML", description: "First ML project", y: 280, color: "#667eea" },
        { year: "2021", title: "Penn State", description: "BS Data Science", y: 60, color: "#764ba2" },
        { year: "2023", title: "Space Force Intern", description: "Predictive maintenance", y: 280, color: "#00ff88" },
        { year: "2024", title: "1st Edge", description: "Lead AI Engineer", y: 60, color: "#ff6b35" },
        { year: "2025", title: "UT Austin", description: "MS in AI", y: 280, color: "#667eea" }
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
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.8)
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
            setTimeout(() => createAgentArchitecture(), 100);
            break;
        case 'liaison-example':
            setTimeout(() => createLiaisonQueryFlow(), 100);
            break;
        case 'parallel-processing':
            createParallelChart();
            break;
        case 'rag-pipeline':
            setTimeout(() => createDynamicSQLGenerator(), 300);
            break;
        case 'document-processing-pipeline':
            createDocumentProcessingFlow();
            break;
        case 'document-processing':
            createDocumentPipeline();
            createClassificationHeatmap();
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
        { label: "Poor Coverage", icon: "⚠️", y: 400 }
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
    if (!container) return;
    
    container.innerHTML = '';
    
    const svg = d3.select('#agent-flow-diagram')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 1600 700');
    
    // Define arrow markers
    const defs = svg.append('defs');
    
    // Regular arrowhead for programmatic workflows
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
    
    // Purple arrowhead for agentic decisions
    defs.append('marker')
        .attr('id', 'purplearrowhead')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', '#764ba2');
    
    // Node positions - much more spread out and organic layout
    const nodes = {
        // Main flow - organic positioning with more space
        user: { x: 80, y: 80, label: "User Input", color: "#667eea", icon: "👤", size: 70 },
        retrieval: { x: 300, y: 60, label: "Auto Retrieval\n(pgvector)", color: "#ff6b35", icon: "🔍", size: 80 },
        generator: { x: 750, y: 120, label: "Generator\nAgent", color: "#667eea", icon: "🤖", size: 100 },
        auditor: { x: 1150, y: 80, label: "Auditor/\nReflection", color: "#00ff88", icon: "✅", size: 80 },
        output: { x: 1380, y: 100, label: "User Output", color: "#667eea", icon: "📤", size: 70 },
        
        // Specialized agents - much more spread with organic positioning
        codeGen: { x: 450, y: 320, label: "SQL Code\nGenerator", color: "#00ff88", icon: "🤖", size: 90 },
        tools: { x: 950, y: 280, label: "Tool Node\n(Python, API)", color: "#ff6b35", icon: "🔧", size: 85 },
        
        // Document processing pipeline - separate from user input
        docUpload: { x: 80, y: 400, label: "Document\nUpload", color: "#667eea", icon: "📁", size: 75 },
        docParser: { x: 250, y: 480, label: "Document\nParser", color: "#ff6b35", icon: "📄", size: 80 },
        questionProc: { x: 550, y: 520, label: "Question\nProcessor", color: "#ff6b35", icon: "🔍", size: 75 },
        qaAgent: { x: 900, y: 480, label: "Q&A Agent\n(Template)", color: "#764ba2", icon: "🤖", size: 90 },
        database: { x: 1200, y: 520, label: "Update DB\n(Answers)", color: "#764ba2", icon: "💾", size: 80 },
        reports: { x: 1420, y: 480, label: "Dynamic\nReports", color: "#ff6b35", icon: "📊", size: 85 }
    };
    
    // Create links - corrected flow and agentic decisions
    // agentic: true means the generator makes a decision to route (dashed line)
    // agentic: false means automatic workflow (solid line)
    const links = [
        // Main user query flow
        { source: "user", target: "retrieval", label: "query", agentic: false },
        { source: "retrieval", target: "generator", label: "context", agentic: false },
        { source: "generator", target: "auditor", label: "validate", agentic: false },
        { source: "auditor", target: "output", label: "approved", agentic: false },
        { source: "auditor", target: "generator", label: "retry", curved: true, curveOffset: -60, agentic: true },
        
        // Generator routing to specialized agents (ONLY agentic decisions)
        { source: "generator", target: "codeGen", label: "sql", agentic: true },
        { source: "generator", target: "tools", label: "api", agentic: true },
        
        // Return flows from agents (automatic)
        { source: "codeGen", target: "generator", label: "results", agentic: false },
        { source: "tools", target: "generator", label: "results", agentic: false },
        
        // Document processing pipeline (separate from user queries)
        { source: "docUpload", target: "docParser", label: "docs", agentic: false },
        { source: "docParser", target: "questionProc", label: "classified", agentic: false },
        { source: "questionProc", target: "qaAgent", label: "questions", agentic: false },
        { source: "qaAgent", target: "database", label: "answers", agentic: false },
        { source: "database", target: "reports", label: "reports", agentic: false }
    ];
    
    // Helper function to calculate intersection point with ellipse
    function getEllipseIntersection(centerX, centerY, rx, ry, targetX, targetY) {
        const dx = targetX - centerX;
        const dy = targetY - centerY;
        const angle = Math.atan2(dy, dx);
        return {
            x: centerX + rx * Math.cos(angle),
            y: centerY + ry * Math.sin(angle)
        };
    }

    // Draw links
    links.forEach((link, i) => {
        const source = nodes[link.source];
        const target = nodes[link.target];
        
        // Calculate ellipse radii for source and target
        const sourceRx = (source.size || 60) / 2;
        const sourceRy = (source.size || 60) / 3;
        const targetRx = (target.size || 60) / 2;
        const targetRy = (target.size || 60) / 3;
        
        // Calculate start and end points on ellipse boundaries
        const startPoint = getEllipseIntersection(source.x, source.y, sourceRx, sourceRy, target.x, target.y);
        const endPoint = getEllipseIntersection(target.x, target.y, targetRx, targetRy, source.x, source.y);
        
        let path;
        if (link.curved) {
            // More organic curved paths
            const midX = (startPoint.x + endPoint.x) / 2;
            const offset = link.curveOffset || -80;
            const midY = Math.min(startPoint.y, endPoint.y) + offset;
            path = `M ${startPoint.x} ${startPoint.y} Q ${midX} ${midY} ${endPoint.x} ${endPoint.y}`;
        } else {
            // Slightly curved "straight" lines for more organic feel
            const midX = (startPoint.x + endPoint.x) / 2;
            const curvature = (startPoint.x < endPoint.x && startPoint.y !== endPoint.y) ? 15 : 0;
            const midY = (startPoint.y + endPoint.y) / 2 + curvature;
            if (curvature > 0) {
                path = `M ${startPoint.x} ${startPoint.y} Q ${midX} ${midY} ${endPoint.x} ${endPoint.y}`;
            } else {
                path = `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`;
            }
        }
        
        const pathElement = svg.append('path')
            .attr('d', path)
            .attr('stroke', link.agentic ? '#764ba2' : '#667eea')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('marker-end', link.agentic ? 'url(#purplearrowhead)' : 'url(#arrowhead)')
            .attr('opacity', 0);
        
        if (link.agentic) {
            // Dashed line for agentic decisions
            pathElement
                .attr('stroke-dasharray', '8,4')
                .transition()
                .duration(500)
                .delay(i * 100)
                .attr('opacity', 0.7);
        } else {
            // Animated solid line for workflows
            pathElement
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
        }
        
        // Add label with offset for curved paths
        const labelX = (startPoint.x + endPoint.x) / 2;
        let labelY = (startPoint.y + endPoint.y) / 2;
        
        // Offset curved path labels
        if (link.curved) {
            labelY -= 25;
        }
        
        // Skip labels for many arrows to reduce clutter
        const skipLabel = (
            (link.source === 'auditor' && link.target === 'generator') ||
            (link.source === 'tools' && link.target === 'generator') ||
            (link.source === 'codeGen' && link.target === 'generator') ||
            (link.source === 'docUpload' && link.target === 'docParser') ||
            (link.source === 'docParser' && link.target === 'questionProc') ||
            (link.source === 'questionProc' && link.target === 'qaAgent') ||
            (link.source === 'qaAgent' && link.target === 'database') ||
            (link.source === 'database' && link.target === 'reports') ||
            (link.source === 'user' && link.target === 'retrieval') ||
            (link.source === 'retrieval' && link.target === 'generator')
        );
        
        if (!skipLabel) {
            svg.append('text')
                .attr('x', labelX)
                .attr('y', labelY - 5)
                .attr('text-anchor', 'middle')
                .attr('fill', '#b0b0b0')
                .style('font-size', '11px')
                .style('opacity', 0)
                .text(link.label)
                .transition()
                .duration(500)
                .delay(500 + i * 100)
                .style('opacity', 1);
        }
    });
    
    // Draw nodes with dynamic sizing
    Object.entries(nodes).forEach(([, node], i) => {
        const nodeSize = node.size || 60;
        const g = svg.append('g')
            .attr('transform', `translate(${node.x}, ${node.y})`)
            .style('cursor', 'pointer');
        
        // Dynamic elliptical shape for more organic look
        g.append('ellipse')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('rx', nodeSize/2)
            .attr('ry', nodeSize/3)
            .attr('fill', `${node.color}20`)
            .attr('stroke', node.color)
            .attr('stroke-width', 3)
            .style('opacity', 0)
            .transition()
            .duration(600)
            .delay(i * 150)
            .style('opacity', 1)
            .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))');
        
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
    
    // Add legend for line types
    const legend = svg.append('g')
        .attr('transform', 'translate(50, 600)')
        .style('opacity', 0);
    
    // Legend background
    legend.append('rect')
        .attr('x', -10)
        .attr('y', -5)
        .attr('width', 320)
        .attr('height', 80)
        .attr('rx', 10)
        .attr('fill', 'rgba(0, 0, 0, 0.6)')
        .attr('stroke', 'rgba(102, 126, 234, 0.3)')
        .attr('stroke-width', 1);
    
    // Legend title
    legend.append('text')
        .attr('x', 5)
        .attr('y', 15)
        .attr('fill', '#fff')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text('Arrow Types:');
    
    // Solid line example
    legend.append('line')
        .attr('x1', 10)
        .attr('y1', 35)
        .attr('x2', 60)
        .attr('y2', 35)
        .attr('stroke', '#667eea')
        .attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrowhead)');
    
    legend.append('text')
        .attr('x', 70)
        .attr('y', 39)
        .attr('fill', '#e0e0e0')
        .style('font-size', '12px')
        .text('Programmatic workflows');
    
    // Dashed line example
    legend.append('line')
        .attr('x1', 10)
        .attr('y1', 55)
        .attr('x2', 60)
        .attr('y2', 55)
        .attr('stroke', '#764ba2')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '8,4')
        .attr('marker-end', 'url(#circlehead)');
    
    legend.append('text')
        .attr('x', 70)
        .attr('y', 59)
        .attr('fill', '#e0e0e0')
        .style('font-size', '12px')
        .text('Agentic decisions');
    
    // Animate legend in after nodes are drawn
    legend.transition()
        .duration(800)
        .delay(2000)
        .style('opacity', 1);
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
        const slideId = event.currentSlide.id;
        
        // Show/hide report overlay based on current slide
        const reportOverlay = document.getElementById('report-overlay');
        if (reportOverlay) {
            if (slideId === 'qa-pipeline') {
                reportOverlay.style.display = 'block';
            } else {
                reportOverlay.style.display = 'none';
            }
        }
        
        // Special handling for slides with multiple visualizations
        if (slideId === 'rag-pipeline') {
            setTimeout(() => createDynamicSQLGenerator(), 300);
        } else if (slideId === 'document-processing-pipeline') {
            createDocumentProcessingFlow();
        } else if (slideId === 'document-processing') {
            createDocumentPipeline();
            setTimeout(createClassificationHeatmap, 300);
        } else {
            initializeVisualization(slideId);
        }
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
        { x: 150, y: 200, label: "Participant\nDocument", icon: "📄", color: "#764ba2" },
        { x: 350, y: 200, label: "Classify\nDocument", icon: "🏷️", color: "#667eea" },
        { x: 550, y: 200, label: "Retrieve\nQuestions", icon: "❓", color: "#00ff88" },
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
            .text("Example: \"System Requirements Doc\" → Classify → Retrieve 15 questions → Extract 15 answers → Database → Real-time report")
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

// SQL Code Generator Flow Visualization
function createSQLGeneratorFlow() {
    // Clear any existing diagram
    d3.select("#sql-generator-flow").selectAll("*").remove();
    
    const container = d3.select("#sql-generator-flow");
    if (container.empty()) return;
    
    // Add heading
    container.append("h4")
        .style("color", "#667eea")
        .style("margin-bottom", "10px")
        .style("text-align", "center")
        .text("SQL Code Generator Pipeline");
    
    const svg = d3.select("#sql-generator-flow")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "300")
        .attr("viewBox", "0 0 1200 300");
    
    // Define flow steps
    const steps = [
        { x: 50, y: 150, width: 120, height: 60, label: "User Query", example: "\"Show me contracts\nby status\"", color: "#667eea" },
        { x: 220, y: 150, width: 140, height: 60, label: "MCP SQL\nCode Generator", example: "Agent analyzes\nintent", color: "#00ff88" },
        { x: 410, y: 150, width: 130, height: 60, label: "PostgreSQL\nSchema", example: "contracts table\nschema retrieved", color: "#764ba2" },
        { x: 590, y: 150, width: 120, height: 60, label: "SQL Query\nGenerated", example: "SELECT status,\nCOUNT(*) FROM...", color: "#ff6b35" },
        { x: 760, y: 150, width: 120, height: 60, label: "Execute\nQuery", example: "PostgreSQL\nexecution", color: "#667eea" },
        { x: 930, y: 150, width: 120, height: 60, label: "Results to\nGenerator", example: "Structured\ndata returned", color: "#00ff88" }
    ];
    
    // Draw connecting arrows
    for (let i = 0; i < steps.length - 1; i++) {
        const start = steps[i];
        const end = steps[i + 1];
        
        svg.append("path")
            .attr("d", `M ${start.x + start.width} ${start.y + start.height/2} L ${end.x} ${end.y + end.height/2}`)
            .attr("stroke", "#764ba2")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("marker-end", "url(#sql-arrow)")
            .style("opacity", 0)
            .transition()
            .duration(600)
            .delay(i * 300)
            .style("opacity", 0.8);
    }
    
    // Define arrow marker for SQL flow
    svg.append("defs")
        .append("marker")
        .attr("id", "sql-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#764ba2");
    
    // Draw step boxes
    steps.forEach((step, i) => {
        const g = svg.append("g")
            .attr("transform", `translate(${step.x}, ${step.y})`)
            .style("opacity", 0);
        
        // Background box
        g.append("rect")
            .attr("width", step.width)
            .attr("height", step.height)
            .attr("rx", 8)
            .attr("fill", step.color)
            .attr("fill-opacity", 0.1)
            .attr("stroke", step.color)
            .attr("stroke-width", 2);
        
        // Label
        g.append("text")
            .attr("x", step.width/2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("fill", step.color)
            .style("font-weight", "bold")
            .style("font-size", "14px")
            .text(step.label.split('\n')[0]);
        
        if (step.label.includes('\n')) {
            g.append("text")
                .attr("x", step.width/2)
                .attr("y", 35)
                .attr("text-anchor", "middle")
                .attr("fill", step.color)
                .style("font-weight", "bold")
                .style("font-size", "14px")
                .text(step.label.split('\n')[1]);
        }
        
        // Example text
        g.append("text")
            .attr("x", step.width/2)
            .attr("y", 50)
            .attr("text-anchor", "middle")
            .attr("fill", "#b0b0b0")
            .style("font-size", "10px")
            .text(step.example.split('\n')[0]);
        
        if (step.example.includes('\n')) {
            g.append("text")
                .attr("x", step.width/2)
                .attr("y", 62)
                .attr("text-anchor", "middle")
                .attr("fill", "#b0b0b0")
                .style("font-size", "10px")
                .text(step.example.split('\n')[1]);
        }
        
        // Animate in
        g.transition()
            .duration(500)
            .delay(i * 300)
            .style("opacity", 1);
    });
}

// Classification Accuracy Heatmap
function createClassificationHeatmap() {
    // Clear any existing heatmap
    d3.select("#classification-heatmap").selectAll("*").remove();
    
    const svg = d3.select("#classification-heatmap")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "340")
        .attr("viewBox", "0 0 800 340");
    
    // Sample accuracy data for 24 document types (4 rows)
    const documentTypes = [
        { name: "System Requirements", accuracy: 0.99, docs: 245 },
        { name: "Technical Specs", accuracy: 0.98, docs: 189 },
        { name: "Test Plans", accuracy: 1.00, docs: 134 },
        { name: "Safety Reports", accuracy: 0.97, docs: 167 },
        { name: "Training Manuals", accuracy: 0.99, docs: 203 },
        { name: "Maintenance Logs", accuracy: 0.98, docs: 278 },
        { name: "Compliance Docs", accuracy: 1.00, docs: 156 },
        { name: "Budget Reports", accuracy: 0.96, docs: 198 },
        { name: "Personnel Files", accuracy: 0.99, docs: 234 },
        { name: "Equipment Lists", accuracy: 0.98, docs: 145 },
        { name: "Project Plans", accuracy: 0.99, docs: 189 },
        { name: "Status Updates", accuracy: 0.97, docs: 267 },
        { name: "Meeting Notes", accuracy: 0.95, docs: 123 },
        { name: "Policy Docs", accuracy: 1.00, docs: 178 },
        { name: "Change Orders", accuracy: 0.98, docs: 198 },
        { name: "Incident Reports", accuracy: 0.97, docs: 134 },
        { name: "Quality Audits", accuracy: 0.99, docs: 156 },
        { name: "Contract Docs", accuracy: 0.98, docs: 187 },
        { name: "Purchase Orders", accuracy: 0.97, docs: 145 },
        { name: "Risk Assessments", accuracy: 0.99, docs: 123 },
        { name: "Work Orders", accuracy: 0.98, docs: 198 },
        { name: "Inspection Reports", accuracy: 0.96, docs: 167 },
        { name: "Training Records", accuracy: 0.99, docs: 234 },
        { name: "Security Protocols", accuracy: 1.00, docs: 145 }
    ];
    
    // Create grid layout - 6 columns for better distribution
    const cols = 6;
    const cellWidth = 120;
    const cellHeight = 55;
    const startX = 50;
    const startY = 25;
    
    // Color scale for accuracy
    const colorScale = d3.scaleLinear()
        .domain([0.95, 1.0])
        .range(["#ff6b35", "#00ff88"]);
    
    // Create heatmap cells
    documentTypes.forEach((doc, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * cellWidth;
        const y = startY + row * cellHeight;
        
        const g = svg.append("g")
            .attr("transform", `translate(${x}, ${y})`)
            .style("opacity", 0);
        
        // Cell background
        g.append("rect")
            .attr("width", cellWidth - 5)
            .attr("height", cellHeight - 5)
            .attr("rx", 4)
            .attr("fill", colorScale(doc.accuracy))
            .attr("fill-opacity", 0.8)
            .attr("stroke", colorScale(doc.accuracy))
            .attr("stroke-width", 1);
        
        // Document type name
        g.append("text")
            .attr("x", (cellWidth - 5) / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text(doc.name.length > 12 ? doc.name.substring(0, 10) + "..." : doc.name);
        
        // Accuracy percentage
        g.append("text")
            .attr("x", (cellWidth - 5) / 2)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text((doc.accuracy * 100).toFixed(0) + "%");
        
        // Document count
        g.append("text")
            .attr("x", (cellWidth - 5) / 2)
            .attr("y", 42)
            .attr("text-anchor", "middle")
            .attr("fill", "#e0e0e0")
            .style("font-size", "8px")
            .text(doc.docs + " docs");
        
        // Animate in
        g.transition()
            .duration(400)
            .delay(i * 100)
            .style("opacity", 1);
        
        // Add hover effects
        g.on("mouseover", function() {
            d3.select(this).select("rect")
                .transition()
                .duration(200)
                .attr("fill-opacity", 1)
                .attr("stroke-width", 2);
        })
        .on("mouseout", function() {
            d3.select(this).select("rect")
                .transition()
                .duration(200)
                .attr("fill-opacity", 0.8)
                .attr("stroke-width", 1);
        });
    });
    
    // Add legend positioned further below the heatmap (after 4 rows)
    const legend = svg.append("g")
        .attr("transform", "translate(250, 255)");
    
    legend.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("fill", "#b0b0b0")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Accuracy Scale");
    
    // Color gradient legend
    const gradientId = "accuracy-gradient";
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    
    gradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#ff6b35");
    
    gradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#00ff88");
    
    legend.append("rect")
        .attr("x", -40)
        .attr("y", 15)
        .attr("width", 80)
        .attr("height", 8)
        .attr("fill", `url(#${gradientId})`)
        .attr("rx", 4);
    
    legend.append("text")
        .attr("x", -40)
        .attr("y", 35)
        .attr("fill", "#b0b0b0")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .text("95%");
    
    legend.append("text")
        .attr("x", 40)
        .attr("y", 35)
        .attr("fill", "#b0b0b0")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .text("100%");
}

// Dynamic SQL Code Generator Visualization
function createDynamicSQLGenerator() {
    // Clear any existing content first
    d3.select("#sql-generator-dynamic").selectAll("*").remove();
    
    const svg = d3.select("#sql-generator-dynamic")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 1600 600")
        .attr("preserveAspectRatio", "xMidYMid meet");
    
    // Define the components with larger sizes for better text fitting and wider layout
    const components = {
        userQuery: { 
            x: 220, y: 150, 
            label: "User Query", 
            example: "\"Show me contracts\nby status\"", 
            color: "#667eea",
            size: 220,
            shape: "blob",
            icon: "💬"
        },
        dbSchema: { 
            x: 220, y: 450, 
            label: "PostgreSQL Schema", 
            example: "contracts table:\nid, status, amount...", 
            color: "#764ba2",
            size: 230,
            shape: "hexagon",
            icon: "🗄️"
        },
        codeGenerator: { 
            x: 750, y: 300, 
            label: "SQL Code Generator\nAgent", 
            example: "3B fine-tuned model\nwith vLLM optimization", 
            color: "#ff6b35",
            size: 200,
            shape: "robot",
            icon: "🤖"
        },
        sqlQuery: { 
            x: 1180, y: 150, 
            label: "Generated SQL", 
            example: "SELECT status,\nCOUNT(*) FROM contracts\nGROUP BY status", 
            color: "#667eea",
            size: 240,
            shape: "rounded",
            icon: "💻"
        },
        execution: { 
            x: 1180, y: 450, 
            label: "Query Execution", 
            example: "PostgreSQL\nprocessing", 
            color: "#764ba2",
            size: 210,
            shape: "diamond",
            icon: "⚡"
        },
        results: { 
            x: 1450, y: 300, 
            label: "Results", 
            example: "Active: 45\nComplete: 23\nPending: 12", 
            color: "#00ff88",
            size: 220,
            shape: "blob",
            icon: "📊"
        }
    };
    
    // Define connections showing simultaneous input
    const connections = [
        { from: "userQuery", to: "codeGenerator", label: "natural language", style: "curved" },
        { from: "dbSchema", to: "codeGenerator", label: "schema context", style: "curved" },
        { from: "codeGenerator", to: "sqlQuery", label: "generates", style: "straight" },
        { from: "sqlQuery", to: "execution", label: "executes", style: "straight" },
        { from: "execution", to: "results", label: "returns", style: "straight" }
    ];
    
    // Draw connections first
    connections.forEach((conn, i) => {
        const from = components[conn.from];
        const to = components[conn.to];
        
        let path;
        if (conn.style === "curved") {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 + (from.y < to.y ? -50 : 50);
            path = `M ${from.x + 40} ${from.y} Q ${midX} ${midY} ${to.x - 60} ${to.y}`;
        } else {
            path = `M ${from.x + 40} ${from.y} L ${to.x - 60} ${to.y}`;
        }
        
        svg.append("path")
            .attr("d", path)
            .attr("stroke", "#667eea")
            .attr("stroke-width", 3)
            .attr("fill", "none")
            .attr("marker-end", "url(#sql-arrow)")
            .style("opacity", 0)
            .transition()
            .duration(800)
            .delay(i * 400)
            .style("opacity", 0.4);
        
        // Add label
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        
        svg.append("text")
            .attr("x", midX)
            .attr("y", midY - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "#b0b0b0")
            .style("font-size", "10px")
            .style("opacity", 0)
            .text(conn.label)
            .transition()
            .duration(400)
            .delay(i * 400 + 500)
            .style("opacity", 0.7);
    });
    
    // Arrow marker
    svg.append("defs")
        .append("marker")
        .attr("id", "sql-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#667eea");
    
    // Draw components with dynamic shapes
    Object.entries(components).forEach(([, comp], i) => {
        const g = svg.append("g")
            .attr("transform", `translate(${comp.x}, ${comp.y})`)
            .style("opacity", 0);
        
        // Draw different shapes based on component type
        if (comp.shape === "robot") {
            // Special robot shape for the code generator
            g.append("rect")
                .attr("x", -comp.size/2)
                .attr("y", -comp.size/2.5)
                .attr("width", comp.size)
                .attr("height", comp.size * 0.8)
                .attr("rx", comp.size/4)
                .attr("fill", `${comp.color}25`)
                .attr("stroke", comp.color)
                .attr("stroke-width", 4)
                .style("filter", "drop-shadow(0 6px 12px rgba(255,107,53,0.4))");
        } else if (comp.shape === "blob") {
            // Organic blob shape
            const path = `M ${-comp.size/2} 0 
                         Q ${-comp.size/3} ${-comp.size/2.5} 0 ${-comp.size/3}
                         Q ${comp.size/3} ${-comp.size/2.5} ${comp.size/2} 0
                         Q ${comp.size/3} ${comp.size/2.5} 0 ${comp.size/3}
                         Q ${-comp.size/3} ${comp.size/2.5} ${-comp.size/2} 0 Z`;
            g.append("path")
                .attr("d", path)
                .attr("fill", `${comp.color}20`)
                .attr("stroke", comp.color)
                .attr("stroke-width", 3);
        } else if (comp.shape === "hexagon") {
            // Hexagon shape
            const points = [];
            for (let j = 0; j < 6; j++) {
                const angle = (j * 60) * Math.PI / 180;
                const x = (comp.size/2.5) * Math.cos(angle);
                const y = (comp.size/2.5) * Math.sin(angle);
                points.push(`${x},${y}`);
            }
            g.append("polygon")
                .attr("points", points.join(" "))
                .attr("fill", `${comp.color}20`)
                .attr("stroke", comp.color)
                .attr("stroke-width", 3);
        } else if (comp.shape === "diamond") {
            // Diamond shape
            const path = `M 0 ${-comp.size/2.5} L ${comp.size/2.5} 0 L 0 ${comp.size/2.5} L ${-comp.size/2.5} 0 Z`;
            g.append("path")
                .attr("d", path)
                .attr("fill", `${comp.color}20`)
                .attr("stroke", comp.color)
                .attr("stroke-width", 3);
        } else {
            // Default ellipse for other shapes
            g.append("ellipse")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("rx", comp.size/2.2)
                .attr("ry", comp.size/3.2)
                .attr("fill", `${comp.color}20`)
                .attr("stroke", comp.color)
                .attr("stroke-width", 3);
        }
        
        // Icon - moved higher up
        g.append("text")
            .attr("x", 0)
            .attr("y", comp.shape === "robot" ? -25 : -20)
            .attr("text-anchor", "middle")
            .style("font-size", comp.shape === "robot" ? "32px" : "24px")
            .style("opacity", 0)
            .text(comp.icon)
            .transition()
            .duration(500)
            .delay(i * 200 + 300)
            .style("opacity", 1);
        
        // Title with larger font - moved higher up
        g.append("text")
            .attr("x", 0)
            .attr("y", comp.shape === "robot" ? 5 : 0)
            .attr("text-anchor", "middle")
            .attr("fill", comp.color)
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(comp.label.split('\n')[0]);
        
        if (comp.label.includes('\n')) {
            g.append("text")
                .attr("x", 0)
                .attr("y", comp.shape === "robot" ? 25 : 20)
                .attr("text-anchor", "middle")
                .attr("fill", comp.color)
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text(comp.label.split('\n')[1]);
        }
        
        // Example text with larger font and better spacing - moved higher up
        const exampleLines = comp.example.split('\n');
        const startY = comp.shape === "robot" ? 50 : (comp.label.includes('\n') ? 40 : 30);
        exampleLines.forEach((line, j) => {
            g.append("text")
                .attr("x", 0)
                .attr("y", startY + j * 16)
                .attr("text-anchor", "middle")
                .attr("fill", "#b0b0b0")
                .style("font-size", "13px")
                .text(line);
        });
        
        // Animate in
        g.transition()
            .duration(600)
            .delay(i * 200)
            .style("opacity", 1);
    });
}

// Document Processing Flow
function createDocumentProcessingFlow() {
    const svg = d3.select("#doc-processing-flow")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "400")
        .attr("viewBox", "0 0 600 400");
    
    // Simple flow: Documents -> Dolphin AI -> Text/Image Extract -> Embeddings -> pgvector -> Hybrid Search
    const steps = [
        { x: 100, y: 100, label: "Documents", color: "#667eea" },
        { x: 100, y: 200, label: "Dolphin AI", color: "#00ff88" },
        { x: 100, y: 300, label: "Text/Image\nExtract", color: "#764ba2" },
        { x: 300, y: 200, label: "Embeddings", color: "#ff6b35" },
        { x: 500, y: 200, label: "pgvector DB", color: "#667eea" },
        { x: 500, y: 300, label: "Hybrid Search", color: "#00ff88" }
    ];
    
    // Draw connections
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5]
    ];
    
    connections.forEach(([from, to], i) => {
        const start = steps[from];
        const end = steps[to];
        
        svg.append("path")
            .attr("d", `M ${start.x + 25} ${start.y} L ${end.x - 25} ${end.y}`)
            .attr("stroke", "#764ba2")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style("opacity", 0)
            .transition()
            .duration(500)
            .delay(i * 300)
            .style("opacity", 0.7);
    });
    
    // Draw steps
    steps.forEach((step, i) => {
        const g = svg.append("g")
            .attr("transform", `translate(${step.x}, ${step.y})`)
            .style("opacity", 0);
        
        g.append("circle")
            .attr("r", 25)
            .attr("fill", `${step.color}30`)
            .attr("stroke", step.color)
            .attr("stroke-width", 2);
        
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 5)
            .attr("fill", step.color)
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text(step.label.split('\n')[0]);
        
        if (step.label.includes('\n')) {
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("y", 15)
                .attr("fill", step.color)
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .text(step.label.split('\n')[1]);
        }
        
        g.transition()
            .duration(400)
            .delay(i * 200)
            .style("opacity", 1);
    });
}

// Code tab switcher
// Liaison Ad-hoc Query Flow Visualization
function createLiaisonQueryFlow() {
    // Clear any existing content
    d3.select("#liaison-query-flow").selectAll("*").remove();
    
    const svg = d3.select("#liaison-query-flow")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 2100 900")
        .attr("preserveAspectRatio", "xMidYMid meet");
    
    // Define the complete workflow - EXPANDED SNAKE PATTERN WITH LARGER COMPONENTS
    const steps = [
        // ROW 1: Initial Query Processing (LEFT → RIGHT)
        {
            id: "liaison-query",
            x: 300, y: 180,
            title: "1. Liaison Query",
            subtitle: "User Input",
            content: "\"Give me MFIX 2025 participants\nin Field Site 1 with UAS tech\nand soldier counts\"",
            color: "#667eea",
            icon: "👤",
            type: "input",
            size: 240
        },
        {
            id: "generator-analysis",
            x: 780, y: 180,
            title: "2. Generator Agent",
            subtitle: "Query Analysis",
            content: "THINKING: \"I need info from\nparticipant-experiment view\nfor location & participants\"",
            color: "#00ff88",
            icon: "🤖",
            type: "thinking",
            size: 240
        },
        {
            id: "code-gen-1",
            x: 1260, y: 180,
            title: "3. Code Generator",
            subtitle: "First SQL Query",
            content: "SELECT * FROM\nparticipant_experiment\nWHERE event='MFIX 2025'\nAND field_site='Site 1'",
            color: "#ff6b35",
            icon: "💻",
            type: "code",
            size: 240
        },
        {
            id: "db-result-1",
            x: 1740, y: 180,
            title: "4. Database Result",
            subtitle: "Partial Data",
            content: "Returns: 12 participants\nwith IDs and basic info\n(no UAS/soldier data yet)",
            color: "#764ba2",
            icon: "📊",
            type: "data",
            size: 240
        },
        
        // ROW 2: Secondary Query Processing (RIGHT → LEFT for natural flow)
        {
            id: "generator-thinking",
            x: 1740, y: 460,
            title: "5. Generator Observes",
            subtitle: "Next Decision",
            content: "THINKING: \"Need UAS tech\nand soldier data from\nparticipant_requirements\"",
            color: "#00ff88",
            icon: "🧠",
            type: "thinking",
            size: 240
        },
        {
            id: "generator-query",
            x: 1260, y: 460,
            title: "6. Generator Query",
            subtitle: "Self-Generated Query",
            content: "Generator creates:\n\"Get tech type and soldier count\nfor these 12 participant IDs\"",
            color: "#00ff88",
            icon: "📝",
            type: "thinking",
            size: 240
        },
        {
            id: "code-gen-2",
            x: 780, y: 460,
            title: "7. Code Generator",
            subtitle: "Second SQL Query",
            content: "SELECT technology_type,\nsoldier_count FROM\nparticipant_requirements\nWHERE participant_id IN (...)",
            color: "#ff6b35",
            icon: "💻",
            type: "code",
            size: 240
        },
        {
            id: "db-result-2",
            x: 300, y: 460,
            title: "8. Database Result",
            subtitle: "UAS & Soldier Data",
            content: "Returns: Tech types & counts\n8 with UAS, 4 other tech\nSoldier counts: 15-45 each",
            color: "#764ba2",
            icon: "📊",
            type: "data",
            size: 240
        },

        // ROW 3: Final Processing & Output (LEFT → RIGHT)
        {
            id: "generator-final",
            x: 560, y: 740,
            title: "9. Generator Combines",
            subtitle: "Data Processing",
            content: "THINKING: \"I have all data.\nLet me write Python to join\nand filter UAS participants\"",
            color: "#00ff88",
            icon: "🤖",
            type: "thinking",
            size: 240
        },
        {
            id: "python-join",
            x: 1020, y: 740,
            title: "10. Python Processing",
            subtitle: "Data Joining",
            content: "result = merge_data(part_data,\nreq_data, on='participant_id')\nuas_filter = tech=='UAS'",
            color: "#667eea",
            icon: "🐍",
            type: "code",
            size: 240
        },
        {
            id: "final-report",
            x: 1480, y: 740,
            title: "11. Generated Report",
            subtitle: "JSON to Frontend",
            content: "8 UAS Participants:\nAlpha Corp (32 soldiers)\nBravo Systems (28 soldiers)\n...formatted table",
            color: "#00ff88",
            icon: "📋",
            type: "output",
            size: 240
        }
    ];
    
    // Define connections with data flow labels - SNAKE PATTERN FLOW
    const connections = [
        // Row 1: LEFT → RIGHT horizontal flow
        { from: "liaison-query", to: "generator-analysis", label: "natural language", dataFlow: "User query string" },
        { from: "generator-analysis", to: "code-gen-1", label: "SQL request", dataFlow: "Query + Schema context" },
        { from: "code-gen-1", to: "db-result-1", label: "execute", dataFlow: "SQL query execution" },
        
        // Vertical connection: Row 1 → Row 2 (rightmost to rightmost)
        { from: "db-result-1", to: "generator-thinking", label: "partial data", dataFlow: "12 participant records" },
        
        // Row 2: RIGHT → LEFT horizontal flow (snake pattern)
        { from: "generator-thinking", to: "generator-query", label: "reasoning", dataFlow: "Analysis of missing data" },
        { from: "generator-query", to: "code-gen-2", label: "new query", dataFlow: "Generated query + participant IDs" },
        { from: "code-gen-2", to: "db-result-2", label: "execute", dataFlow: "SQL with WHERE IN clause" },
        
        // Vertical connection: Row 2 → Row 3 (leftmost to center)
        { from: "db-result-2", to: "generator-final", label: "tech data", dataFlow: "Technology & soldier data" },
        
        // Row 3: LEFT → RIGHT horizontal flow
        { from: "generator-final", to: "python-join", label: "join request", dataFlow: "Python merge instruction" },
        { from: "python-join", to: "final-report", label: "filtered data", dataFlow: "8 UAS participants + counts" }
    ];
    
    // Create gradients for different step types
    const defs = svg.append("defs");
    
    // Thinking gradient
    const thinkingGradient = defs.append("linearGradient")
        .attr("id", "thinking-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
    thinkingGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#00ff88")
        .style("stop-opacity", 0.3);
    thinkingGradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#00ff88")
        .style("stop-opacity", 0.1);
    
    // Code gradient
    const codeGradient = defs.append("linearGradient")
        .attr("id", "code-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
    codeGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#ff6b35")
        .style("stop-opacity", 0.3);
    codeGradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#ff6b35")
        .style("stop-opacity", 0.1);
    
    // Data gradient
    const dataGradient = defs.append("linearGradient")
        .attr("id", "data-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
    dataGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#764ba2")
        .style("stop-opacity", 0.3);
    dataGradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#764ba2")
        .style("stop-opacity", 0.1);
    
    // Arrow marker
    defs.append("marker")
        .attr("id", "flow-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#667eea");
    
    // Draw connections first
    connections.forEach((conn, i) => {
        const fromStep = steps.find(s => s.id === conn.from);
        const toStep = steps.find(s => s.id === conn.to);
        
        if (!fromStep || !toStep) return;
        
        // Calculate path - smart routing with proper direction handling
        let path;
        const stepRadius = (fromStep.size || 140) / 2;
        
        // Determine if this is a right-to-left flow (Row 2 snake pattern)
        const isRightToLeft = fromStep.x > toStep.x && Math.abs(fromStep.y - toStep.y) < 50;
        
        // Calculate start and end points based on flow direction
        let startX, endX;
        if (isRightToLeft) {
            // Right to left: start from left edge of source, end at right edge of target
            startX = fromStep.x - stepRadius;
            endX = toStep.x + stepRadius;
        } else if (Math.abs(fromStep.y - toStep.y) > 50) {
            // Vertical connections: special handling
            if (conn.from === "db-result-1" && conn.to === "generator-thinking") {
                // #4 to #5: both elements are on right side, connect right edge to right edge
                startX = fromStep.x + stepRadius;
                endX = toStep.x + stepRadius;
            } else if (conn.from === "db-result-2" && conn.to === "generator-final") {
                // #8 to #9: left side to center, connect left edge to left edge
                startX = fromStep.x - stepRadius;
                endX = toStep.x - stepRadius;
            } else {
                // Default vertical: right edge to left edge
                startX = fromStep.x + stepRadius;
                endX = toStep.x - stepRadius;
            }
        } else {
            // Left to right horizontal: start from right edge of source, end at left edge of target
            startX = fromStep.x + stepRadius;
            endX = toStep.x - stepRadius;
        }
        
        if (Math.abs(fromStep.y - toStep.y) > 50) {
            // Curved path for vertical connections
            const midX = (fromStep.x + toStep.x) / 2;
            const midY = (fromStep.y + toStep.y) / 2;
            path = `M ${startX} ${fromStep.y} Q ${midX} ${midY} ${endX} ${toStep.y}`;
        } else {
            // Straight path for horizontal connections
            path = `M ${startX} ${fromStep.y} L ${endX} ${toStep.y}`;
        }
        
        const pathElement = svg.append("path")
            .attr("d", path)
            .attr("stroke", "#667eea")
            .attr("stroke-width", 3)
            .attr("fill", "none")
            .attr("marker-end", "url(#flow-arrow)")
            .attr("stroke-dasharray", "10,5")
            .style("opacity", 0);
        
        // Animate path
        pathElement
            .transition()
            .duration(800)
            .delay(i * 500)
            .style("opacity", 0.7);
        
        // Add data flow label
        const midX = (fromStep.x + toStep.x) / 2;
        const midY = (fromStep.y + toStep.y) / 2;
        
        svg.append("text")
            .attr("x", midX)
            .attr("y", midY - 15)
            .attr("text-anchor", "middle")
            .attr("fill", "#b0b0b0")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("opacity", 0)
            .text(conn.dataFlow)
            .transition()
            .duration(400)
            .delay(i * 500 + 400)
            .style("opacity", 0.8);
    });
    
    // Draw steps
    steps.forEach((step, i) => {
        const g = svg.append("g")
            .attr("transform", `translate(${step.x}, ${step.y})`)
            .style("opacity", 0);
        
        // Background shape based on type - MUCH LARGER
        const stepSize = step.size || 140;
        const rx = stepSize / 2;
        const ry = stepSize / 2.3;
        
        let shape;
        if (step.type === "thinking") {
            // Cloud-like shape for thinking
            shape = g.append("ellipse")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("fill", "url(#thinking-gradient)")
                .attr("stroke", step.color)
                .attr("stroke-width", 4)
                .attr("stroke-dasharray", "12,6");
        } else if (step.type === "code") {
            // Rectangle for code
            shape = g.append("rect")
                .attr("x", -rx)
                .attr("y", -ry)
                .attr("width", stepSize)
                .attr("height", ry * 2)
                .attr("rx", 15)
                .attr("fill", "url(#code-gradient)")
                .attr("stroke", step.color)
                .attr("stroke-width", 4);
        } else if (step.type === "data") {
            // Diamond for data
            shape = g.append("polygon")
                .attr("points", `0,${-ry} ${rx},0 0,${ry} ${-rx},0`)
                .attr("fill", "url(#data-gradient)")
                .attr("stroke", step.color)
                .attr("stroke-width", 4);
        } else {
            // Default ellipse for input/output
            shape = g.append("ellipse")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("fill", `${step.color}20`)
                .attr("stroke", step.color)
                .attr("stroke-width", 4);
        }
        
        // Icon - LARGE FOR WELL-SPACED BOXES
        g.append("text")
            .attr("x", 0)
            .attr("y", -60)
            .attr("text-anchor", "middle")
            .style("font-size", "40px")
            .text(step.icon);
        
        // Title - LARGE
        g.append("text")
            .attr("x", 0)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .attr("fill", step.color)
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text(step.title);
        
        // Subtitle - READABLE
        g.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("fill", "#b0b0b0")
            .style("font-size", "14px")
            .style("font-style", "italic")
            .text(step.subtitle);
        
        // Content - multiline support with CLEAR TEXT
        const lines = step.content.split('\n');
        lines.forEach((line, j) => {
            g.append("text")
                .attr("x", 0)
                .attr("y", 18 + j * 16)
                .attr("text-anchor", "middle")
                .attr("fill", step.type === "thinking" ? "#00ff88" : "#e0e0e0")
                .style("font-size", "14px")
                .style("font-family", step.type === "code" ? "monospace" : "inherit")
                .style("font-weight", step.type === "thinking" ? "bold" : "normal")
                .text(line);
        });
        
        // Animate step appearance
        g.transition()
            .duration(600)
            .delay(i * 500)
            .style("opacity", 1);
    });
    
}

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
    // Add active class to clicked tab
    const clickedElement = arguments[0] ? arguments[0].target : null;
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
};