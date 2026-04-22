document.addEventListener('DOMContentLoaded', () => {
    // ---- Modal & Zoom-In Logic ----
    const modal = document.getElementById('holon-modal');
    const closeBtn = document.querySelector('.close-btn');
    const cells = document.querySelectorAll('.holon-cell');

    // Modal elements to update
    const modalTitle = document.getElementById('modal-title');
    const modalCell = document.getElementById('modal-cell');
    const modalLayer = document.getElementById('modal-layer');
    const modalCol = document.getElementById('modal-col');
    const modalDesc = document.getElementById('modal-desc');
    const modalCode = document.getElementById('modal-code');

    // Mapping of mock data for deep dive
    const mockData = {
        'C3': {
            desc: "This holon fuses the 'What' (Data) column of Zachman with the 'RDF (Graph)' layer of the Semantic Web. TerminusDB instances are used to store linked JSON-LD models representing enterprise schemas.",
            code: `// JSON-LD TerminusDB Document
{
  "@context": "https://schema.enterprise.com/context.jsonld",
  "@id": "urn:uuid:8b3d7a-11e9-9c2b-...",
  "@type": "InvoiceModel",
  "issuer": "company:HQ",
  "validationShape": "shacl:InvoiceShape"
}`
        },
        'A1': {
            desc: "Fuses 'Why' (Motivation) with 'Trust & UI'. Top-level auditor trust is achieved by transparent, verifiable compliance logic running inside the ERP UI.",
            code: `<!-- UI Compliance Badge -->
<div class="auditor-badge" data-trust-level="high">
    Verified by Internal Audit Protocol
    <span class="timestamp">2023-10-24</span>
</div>`
        },
        'default': {
            desc: "Simulated zoom-in for this enterprise holon. In a production environment, this view would fetch live metrics, graph schemas, or code snippets relevant to the intersection of this specific Zachman Aspect and Semantic Layer.",
            code: `[ System Log ]
Fetching ontology bindings... OK
Evaluating DFRNT logic... OK
Linked data assets active.`
        }
    };

    // Open Modal
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const cellId = cell.getAttribute('data-cell');
            const title = cell.querySelector('.title').innerText;
            const subtext = cell.querySelector('.subtext').innerText;

            // Determine row and col tags based on classes
            let layerText = "Layer";
            if(cell.classList.contains('layer-trust')) layerText = "Trust & Contextual";
            if(cell.classList.contains('layer-onto')) layerText = "Ontology & Conceptual";
            if(cell.classList.contains('layer-rdf')) layerText = "RDF & Logical";
            if(cell.classList.contains('layer-xml')) layerText = "XML & Physical";
            if(cell.classList.contains('layer-uri')) layerText = "URI & Detailed";
            if(cell.classList.contains('layer-inst')) layerText = "Instances & Enterprise";

            let colText = "Aspect";
            if(cell.classList.contains('col-why')) colText = "Why (Motivation)";
            if(cell.classList.contains('col-how')) colText = "How (Process)";
            if(cell.classList.contains('col-what')) colText = "What (Data)";
            if(cell.classList.contains('col-who')) colText = "Who (People)";
            if(cell.classList.contains('col-where')) colText = "Where (Network)";
            if(cell.classList.contains('col-when')) colText = "When (Time)";

            // Update modal UI
            modalTitle.innerText = title + " (" + subtext + ")";
            modalCell.innerText = "Cell " + cellId;
            modalLayer.innerText = layerText;
            modalCol.innerText = colText;

            const data = mockData[cellId] || mockData['default'];
            modalDesc.innerText = data.desc;
            modalCode.innerText = data.code;

            modal.style.display = 'block';
        });
    });

    // Close Modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // ---- Sidebar Filtering Logic ----
    const layerFilters = document.querySelectorAll('#layer-filters li');
    const colFilters = document.querySelectorAll('#column-filters li');
    const allCells = document.querySelectorAll('.holon-cell, .header-cell');

    let currentLayer = 'all';
    let currentCol = 'all';

    function applyFilters() {
        allCells.forEach(cell => {
            // By default remove faded class
            cell.classList.remove('faded');

            // Skip the top-left corner
            if(cell.classList.contains('corner')) return;

            let matchesLayer = true;
            let matchesCol = true;

            // Check layer
            if (currentLayer !== 'all') {
                if (cell.classList.contains('row-header')) {
                    matchesLayer = cell.classList.contains(currentLayer);
                } else if (cell.classList.contains('header-cell')) {
                    matchesLayer = false; // Fade out column headers if filtering by row
                } else {
                    matchesLayer = cell.classList.contains(currentLayer);
                }
            }

            // Check column
            if (currentCol !== 'all') {
                if (cell.classList.contains('header-cell') && !cell.classList.contains('row-header')) {
                    matchesCol = cell.classList.contains(currentCol);
                } else if (cell.classList.contains('row-header')) {
                    matchesCol = false; // Fade out row headers if filtering by col
                } else {
                    matchesCol = cell.classList.contains(currentCol);
                }
            }

            // Apply fading if it doesn't match
            if (!matchesLayer || !matchesCol) {
                cell.classList.add('faded');
            }
        });
    }

    layerFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
            layerFilters.forEach(f => f.classList.remove('active'));
            e.target.classList.add('active');
            currentLayer = e.target.getAttribute('data-layer');
            applyFilters();
        });
    });

    colFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
            colFilters.forEach(f => f.classList.remove('active'));
            e.target.classList.add('active');
            currentCol = e.target.getAttribute('data-col');
            applyFilters();
        });
    });
});