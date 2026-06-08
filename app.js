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
    const modalImageContainer = document.getElementById('modal-image-container');

    // Mapping of mock data for deep dive
    const mockData = {
        'C4': {
            desc: "Fusión de 'What' (Data) con 'XML & Namespaces'. Representa el documento operativo en bruto original (Facturas y Nómina Electrónica en XML UBL 2.1), actuando como el contrato de eventos de negocio y punto inicial de la ingesta sin sufrir mutilación relacional.",
            code: `<!-- Evento de Negocio: Factura UBL 2.1 XML (C4) -->
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:ID>FECA1073</cbc:ID>
    <cbc:IssueDate>2025-11-30</cbc:IssueDate>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>900824516</cbc:CompanyID>
            </cac:PartyTaxScheme>
        </cac:Party>
    </cac:AccountingSupplierParty>
</Invoice>`
        },
        'B4': {
            desc: "Fusión de 'How' (Process) con 'XML & Namespaces'. El programa de ingesta y extracción que abre la base de datos transaccional NoSQL DDBB, escanea los documentos XML físicos y ejecuta consultas analíticas en XQuery para estructurar la información intermedia.",
            code: `(: Programa de Ingesta & Consulta Transaccional XQuery (B4) :)
for $doc in db:get("TRANSACTIONS")//(inv:Invoice | cac:Attachment/cac:ExternalReference)
let $IssueDate := $doc/cbc:IssueDate
let $NumeroFactura := $doc/cbc:ID
let $ASP_NIT := $doc/cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID
return
  <record>
    <entry name="Fecha">{data($IssueDate)}</entry>
    <entry name="Numero">{data($NumeroFactura)}</entry>
    <entry name="NIT">{data($ASP_NIT)}</entry>
  </record>`
        },
        'B3': {
            desc: "Fusión de 'How' (Process) con 'RDF (Graph)'. Mapeador semántico que traduce y normaliza las estructuras físicas planas de negocio XML/CSV en esquemas lógicos representados en JSON-LD (RDF) para permitir la coherencia del grafo.",
            image: "Mapeo.jpg",
            code: `// JSON-LD Logical Mapping Output (RDF Schema) (B3)
{
  "@context": "https://enterprise.org/contexts/accounting.jsonld",
  "@id": "urn:event:invoice:FECA1073",
  "@type": "BusinessEvent",
  "documentNumber": "FECA1073",
  "supplier": "urn:party:nit:900824516",
  "items": [
    {
      "code": "ITEM-001",
      "price": 85000
    }
  ]
}`
        },
        'C3': {
            desc: "Fusión de 'What' (Data) con 'RDF (Graph)'. Almacena y consolida los modelos lógicos de transacciones en la base de datos semántica Graph DDBB en formato de documentos JSON-LD vinculados.",
            code: `// JSON-LD Logical Graph Representation (C3)
{
  "@context": {
    "ex": "http://example.org/accounting#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "amount": { "@id": "ex:amount", "@type": "xsd:decimal" },
    "account": { "@id": "ex:account", "@type": "xsd:string" }
  },
  "@id": "urn:entry:ledger:163035112",
  "@type": "ex:LedgerEntry",
  "account": "163035112",
  "amount": 38319.33,
  "debitCreditCode": "D"
}`
        },
        'B2': {
            desc: "Fusión de 'How' (Process) con 'Ontology (OWL)'. Mapeo conceptual de partida doble (Pacioli) adaptado al estándar. Distribuye aritméticamente los Débitos (Gasto 513095011, IVA 163035112) y Créditos (Retención de 15% 251905052, Cuentas por Pagar Neto 250205010).",
            code: `<!-- Regla Conceptual de Partida Doble en MapForce (B2) -->
<component name="if-else" library="core" uid="25" kind="4">
    <sources>
        <datapoint pos="0" key="debitCreditCode == 'D'"/>
        <datapoint pos="1" key="amountDecimal"/>
        <datapoint pos="2" key="decimalZero"/>
    </sources>
    <targets>
        <datapoint pos="0" key="MO_DEBITO"/>
    </targets>
</component>`
        },
        'C2': {
            desc: "Fusión de 'What' (Data) con 'Ontology (OWL)'. Las taxonomías de XBRL Global Ledger (GL) y marcos ESG que definen la semántica compartida y los conceptos contables mundiales, sirviendo de base semántica firme para la consistencia y la auditoría automática.",
            code: `<!-- Referencia Conceptual Ontológica a la Taxonomía Global (C2) -->
<xbrl xmlns="http://www.xbrl.org/2003/instance"
       xmlns:gl-cor="http://www.xbrl.org/int/gl/cor/2015-03-25"
       schemaRef="../Taxonomia/gl-plt-all-2015-03-25.xsd">
    <gl-cor:accountingEntries>
        <gl-cor:entryHeader>
            <gl-cor:entryDetail>
                <gl-cor:account>513095011</gl-cor:account>
            </gl-cor:entryDetail>
        </gl-cor:entryHeader>
    </gl-cor:accountingEntries>
</xbrl>`
        },
        'C6': {
            desc: "Fusión de 'What' (Data) con 'Linked Data Assets'. Las instancias contables reales y activas en ejecución y sincronizadas dentro del grafo de base de datos Graph DDBB. Son la base para los reportes semánticos y el write-back al sistema relacional.",
            code: `// Graph DDBB Instances Query Output (C6)
[
  {
    "id": "urn:journal:entry:TRP-00002357",
    "account": "111505110",
    "description": "BANCOLOMBIA CTA CTE No. 3007917432",
    "debit": 56392.51,
    "credit": 0.00
  },
  {
    "id": "urn:journal:entry:TRP-00002357",
    "account": "251905040",
    "description": "RET FTE REND.FIN REPO CRCC",
    "debit": 0.00,
    "credit": 56392.51
  }
]`
        },
        'default': {
            desc: "Visualización ampliada de este holón de la arquitectura empresarial. En este entorno, cada intersección Zachman/Fila Semántica representa una perspectiva formalizada y documentada de nuestro ecosistema.",
            code: `[ Estado del Sistema ]
Leyendo configuraciones ontológicas... OK
Validando reglas de correspondencia en el Grafo... OK
Nodos del Gemelo Digital Semántico activos.`
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

            if (data.image) {
                modalImageContainer.innerHTML = `<img src="${data.image}" style="max-width: 100%; border-radius: 6px; margin-top: 15px; border: 1px solid #ddd; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />`;
            } else {
                modalImageContainer.innerHTML = '';
            }

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