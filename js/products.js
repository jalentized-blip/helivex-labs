/* =============================================
   HELIVEX LABS - Product Data
   Research peptide product catalog
   ============================================= */

const products = [
    {
        id: 1,
        name: "Tirzepatide",
        slug: "tirzepatide",
        category: "metabolic",
        description: "Dual GIP/GLP-1 receptor agonist for metabolic research. High-purity synthetic peptide for laboratory studies.",
        shortDesc: "Dual GIP/GLP-1 agonist",
        purity: "99.1%",
        image: "tirzepatide",
        badge: "Best Seller",
        variants: [
            { size: "5mg", price: 59.99, originalPrice: 79.99 },
            { size: "10mg", price: 99.99, originalPrice: 139.99 },
            { size: "15mg", price: 139.99, originalPrice: 189.99 },
            { size: "30mg", price: 249.99, originalPrice: 349.99 }
        ],
        cas: "2023788-19-2",
        sequence: "H-Aib-EGTFTSDVSSYLEGQAAKEFIAWLVKGRG-OH",
        molecularWeight: "4813.45 g/mol",
        storage: "Store at -20°C, protect from light",
        appearance: "White to off-white lyophilized powder",
        solubility: "Soluble in sterile water or bacteriostatic water",
        featured: true
    },
    {
        id: 2,
        name: "Semaglutide",
        slug: "semaglutide",
        category: "metabolic",
        description: "GLP-1 receptor agonist for metabolic and glucose regulation research. Extensively studied compound.",
        shortDesc: "GLP-1 receptor agonist",
        purity: "99.3%",
        image: "semaglutide",
        badge: "Popular",
        variants: [
            { size: "3mg", price: 49.99, originalPrice: 69.99 },
            { size: "5mg", price: 69.99, originalPrice: 99.99 },
            { size: "10mg", price: 119.99, originalPrice: 159.99 },
            { size: "20mg", price: 219.99, originalPrice: 299.99 }
        ],
        cas: "910463-68-2",
        sequence: "H-Aib-EGTFTSDVSSYLEGQAAKEFIAWLVRGRG-OH",
        molecularWeight: "4113.58 g/mol",
        storage: "Store at -20°C, protect from light",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: true
    },
    {
        id: 3,
        name: "Retatrutide",
        slug: "retatrutide",
        category: "metabolic",
        description: "Triple agonist peptide targeting GIP, GLP-1, and glucagon receptors. Novel research compound.",
        shortDesc: "Triple GIP/GLP-1/Glucagon agonist",
        purity: "98.9%",
        image: "retatrutide",
        badge: "New",
        variants: [
            { size: "5mg", price: 89.99, originalPrice: 119.99 },
            { size: "10mg", price: 159.99, originalPrice: 219.99 },
            { size: "20mg", price: 289.99, originalPrice: 399.99 }
        ],
        cas: "2381089-83-2",
        sequence: "Complex 39 amino acid sequence",
        molecularWeight: "4603.51 g/mol",
        storage: "Store at -20°C, protect from light",
        appearance: "White to off-white lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: true
    },
    {
        id: 4,
        name: "BPC-157",
        slug: "bpc-157",
        category: "healing",
        description: "Body Protection Compound for tissue repair research. Pentadecapeptide derived from gastric juice protein.",
        shortDesc: "Tissue repair peptide",
        purity: "99.5%",
        image: "bpc157",
        badge: "",
        variants: [
            { size: "5mg", price: 34.99, originalPrice: 49.99 },
            { size: "10mg", price: 59.99, originalPrice: 79.99 },
            { size: "20mg", price: 99.99, originalPrice: 139.99 }
        ],
        cas: "137525-51-0",
        sequence: "GEPPPGKPADDAGLV",
        molecularWeight: "1419.53 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: true
    },
    {
        id: 5,
        name: "TB-500",
        slug: "tb-500",
        category: "healing",
        description: "Thymosin Beta-4 fragment for tissue regeneration research. Key regulator of actin in cells.",
        shortDesc: "Thymosin Beta-4 fragment",
        purity: "99.2%",
        image: "tb500",
        badge: "",
        variants: [
            { size: "2mg", price: 29.99, originalPrice: 39.99 },
            { size: "5mg", price: 59.99, originalPrice: 79.99 },
            { size: "10mg", price: 99.99, originalPrice: 129.99 }
        ],
        cas: "77591-33-4",
        sequence: "LKKTETQ",
        molecularWeight: "4963.50 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: true
    },
    {
        id: 6,
        name: "NAD+",
        slug: "nad-plus",
        category: "longevity",
        description: "Nicotinamide Adenine Dinucleotide for cellular metabolism and aging research. Essential coenzyme.",
        shortDesc: "Cellular metabolism coenzyme",
        purity: "99.8%",
        image: "nad",
        badge: "High Demand",
        variants: [
            { size: "500mg", price: 79.99, originalPrice: 109.99 },
            { size: "1g", price: 139.99, originalPrice: 189.99 },
            { size: "5g", price: 599.99, originalPrice: 799.99 }
        ],
        cas: "53-84-9",
        sequence: "N/A (Small molecule)",
        molecularWeight: "663.43 g/mol",
        storage: "Store at -20°C, protect from moisture",
        appearance: "White to yellow powder",
        solubility: "Soluble in water",
        featured: true
    },
    {
        id: 7,
        name: "MOTS-c",
        slug: "mots-c",
        category: "longevity",
        description: "Mitochondrial-derived peptide for metabolic homeostasis and aging research.",
        shortDesc: "Mitochondrial peptide",
        purity: "99.0%",
        image: "motsc",
        badge: "",
        variants: [
            { size: "5mg", price: 69.99, originalPrice: 89.99 },
            { size: "10mg", price: 119.99, originalPrice: 159.99 }
        ],
        cas: "1627580-64-6",
        sequence: "MRWQEMGYIFYPRKLR",
        molecularWeight: "2174.67 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    },
    {
        id: 8,
        name: "GHK-Cu",
        slug: "ghk-cu",
        category: "healing",
        description: "Copper peptide complex for skin regeneration and wound healing research.",
        shortDesc: "Copper peptide complex",
        purity: "99.4%",
        image: "ghkcu",
        badge: "",
        variants: [
            { size: "50mg", price: 24.99, originalPrice: 34.99 },
            { size: "100mg", price: 44.99, originalPrice: 59.99 },
            { size: "500mg", price: 179.99, originalPrice: 249.99 }
        ],
        cas: "49557-75-7",
        sequence: "GHK-Cu (Glycyl-L-histidyl-L-lysine copper)",
        molecularWeight: "403.92 g/mol",
        storage: "Store at room temperature, protect from light",
        appearance: "Blue powder",
        solubility: "Soluble in water",
        featured: false
    },
    {
        id: 9,
        name: "Semax",
        slug: "semax",
        category: "cognitive",
        description: "Neuropeptide for cognitive function and neurological research. ACTH analog.",
        shortDesc: "Cognitive neuropeptide",
        purity: "99.1%",
        image: "semax",
        badge: "",
        variants: [
            { size: "10mg", price: 39.99, originalPrice: 54.99 },
            { size: "30mg", price: 99.99, originalPrice: 139.99 }
        ],
        cas: "80714-61-0",
        sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
        molecularWeight: "813.93 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    },
    {
        id: 10,
        name: "Selank",
        slug: "selank",
        category: "cognitive",
        description: "Anxiolytic peptide for stress and cognitive research. Tuftsin analog.",
        shortDesc: "Anxiolytic peptide",
        purity: "99.2%",
        image: "selank",
        badge: "",
        variants: [
            { size: "5mg", price: 34.99, originalPrice: 44.99 },
            { size: "10mg", price: 59.99, originalPrice: 79.99 },
            { size: "20mg", price: 99.99, originalPrice: 139.99 }
        ],
        cas: "129954-34-3",
        sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
        molecularWeight: "751.87 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    },
    {
        id: 11,
        name: "Epithalon",
        slug: "epithalon",
        category: "longevity",
        description: "Tetrapeptide for telomerase activation and anti-aging research.",
        shortDesc: "Telomerase activator",
        purity: "99.3%",
        image: "epithalon",
        badge: "",
        variants: [
            { size: "10mg", price: 29.99, originalPrice: 39.99 },
            { size: "50mg", price: 119.99, originalPrice: 169.99 },
            { size: "100mg", price: 199.99, originalPrice: 279.99 }
        ],
        cas: "307297-39-8",
        sequence: "Ala-Glu-Asp-Gly",
        molecularWeight: "390.35 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    },
    {
        id: 12,
        name: "PT-141",
        slug: "pt-141",
        category: "metabolic",
        description: "Melanocortin receptor agonist for sexual function research. Bremelanotide.",
        shortDesc: "Melanocortin agonist",
        purity: "99.0%",
        image: "pt141",
        badge: "",
        variants: [
            { size: "10mg", price: 44.99, originalPrice: 59.99 },
            { size: "20mg", price: 79.99, originalPrice: 109.99 }
        ],
        cas: "189691-06-3",
        sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH",
        molecularWeight: "1025.18 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    },
    {
        id: 13,
        name: "CJC-1295 DAC",
        slug: "cjc-1295-dac",
        category: "metabolic",
        description: "Growth hormone releasing hormone analog with drug affinity complex.",
        shortDesc: "GHRH analog with DAC",
        purity: "98.8%",
        image: "cjc1295",
        badge: "",
        variants: [
            { size: "2mg", price: 39.99, originalPrice: 54.99 },
            { size: "5mg", price: 84.99, originalPrice: 119.99 }
        ],
        cas: "863288-34-0",
        sequence: "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-NH2",
        molecularWeight: "3647.28 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    },
    {
        id: 14,
        name: "Ipamorelin",
        slug: "ipamorelin",
        category: "metabolic",
        description: "Selective growth hormone secretagogue for GH research.",
        shortDesc: "Growth hormone secretagogue",
        purity: "99.4%",
        image: "ipamorelin",
        badge: "",
        variants: [
            { size: "2mg", price: 24.99, originalPrice: 34.99 },
            { size: "5mg", price: 49.99, originalPrice: 69.99 },
            { size: "10mg", price: 89.99, originalPrice: 119.99 }
        ],
        cas: "170851-70-4",
        sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2",
        molecularWeight: "711.85 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    },
    {
        id: 15,
        name: "LL-37",
        slug: "ll-37",
        category: "healing",
        description: "Human cathelicidin antimicrobial peptide for immune research.",
        shortDesc: "Antimicrobial peptide",
        purity: "98.5%",
        image: "ll37",
        badge: "",
        variants: [
            { size: "5mg", price: 89.99, originalPrice: 119.99 },
            { size: "10mg", price: 159.99, originalPrice: 219.99 }
        ],
        cas: "154947-66-7",
        sequence: "LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES",
        molecularWeight: "4493.33 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    },
    {
        id: 16,
        name: "KPV",
        slug: "kpv",
        category: "healing",
        description: "Anti-inflammatory tripeptide derived from alpha-MSH.",
        shortDesc: "Anti-inflammatory tripeptide",
        purity: "99.6%",
        image: "kpv",
        badge: "",
        variants: [
            { size: "10mg", price: 34.99, originalPrice: 49.99 },
            { size: "50mg", price: 139.99, originalPrice: 189.99 }
        ],
        cas: "67727-97-3",
        sequence: "Lys-Pro-Val",
        molecularWeight: "342.43 g/mol",
        storage: "Store at -20°C",
        appearance: "White lyophilized powder",
        solubility: "Soluble in sterile water",
        featured: false
    }
];

// Get featured products
function getFeaturedProducts() {
    return products.filter(p => p.featured);
}

// Get products by category
function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

// Get product by slug
function getProductBySlug(slug) {
    return products.find(p => p.slug === slug);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        getFeaturedProducts,
        getProductsByCategory,
        getProductById,
        getProductBySlug,
        searchProducts
    };
}
