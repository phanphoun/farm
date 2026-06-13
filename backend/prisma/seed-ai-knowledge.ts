/**
 * Seed farming knowledge base for FarmJumnoy AI
 * Run: npx ts-node prisma/seed-ai-knowledge.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const KNOWLEDGE_ARTICLES = [
  {
    title: 'Rice Water Management',
    source: 'CARDI Cambodia',
    language: 'km',
    cropTags: ['rice', 'irrigation'],
    text: `Water management is critical for rice cultivation in Cambodia.
Land preparation stage: flood field 5-10 cm deep for 1-2 weeks before transplanting.
Vegetative stage (0-45 days): maintain 2-5 cm water level. Allow field to dry 1-2 days every 10 days to encourage root development.
Reproductive stage (45-75 days): maintain 5-10 cm continuous flooding. This is the most critical period for water.
Ripening stage (75-105 days): drain field 10-15 days before harvest so soil dries for machine harvesting.
Total water requirement: 1000-1200 mm in dry season, 800-1000 mm in wet season.
Signs of water stress: leaf rolling, yellowing from tip, flower drop.
Signs of waterlogging: yellowing leaves, root rot, increased disease and pests.`,
  },
  {
    title: 'Brown Planthopper (BPH) Pest Control',
    source: 'Ministry of Agriculture Cambodia',
    language: 'km',
    cropTags: ['rice', 'pest', 'insect'],
    text: `Brown Planthopper (BPH) is the most damaging pest for rice in Cambodia.
Identification: small brown insects 2-5mm, found at base of rice plants. Causes "hopperburn" - circular brown patches.
Prevention: use resistant varieties (NERICA, IR64, Phka Malis). Avoid excess nitrogen fertilizer. Conserve natural enemies by minimizing broad-spectrum pesticides.
Economic threshold: 10-15 hoppers per hill at vegetative stage, 15-20 per hill at reproductive stage.
Chemical control: imidacloprid, thiamethoxam, buprofezin. Always rotate chemicals.
Biological control: preserve spiders, mirid bugs, and parasitic wasps by reducing pesticide use.
Cultural control: drain field for 3-5 days to expose hoppers and kill nymphs.`,
  },
  {
    title: 'Common Rice Diseases in Cambodia',
    source: 'Ministry of Agriculture Cambodia',
    language: 'km',
    cropTags: ['rice', 'disease', 'fungal'],
    text: `Common rice diseases affecting Cambodian farmers:
Blast disease (Pyricularia oryzae): diamond-shaped lesions with gray centers on leaves. Worst in cool weather with dry spells. Use resistant varieties, avoid excess nitrogen, apply tricyclazole or carbendazim.
Bacterial leaf blight (Xanthomonas): water-soaked lesions along leaf margins turning yellow then white. Spread by rain and irrigation water. Drain fields, avoid excess nitrogen, use copper bactericides.
Sheath blight (Rhizoctonia solani): oval lesions on leaf sheaths near water line, spreading upward. Favored by high humidity and dense planting. Apply validamycin or hexaconazole. Reduce plant density.
Brown spot (Helminthosporium): circular brown spots on leaves and grains. Caused by poor nutrition. Apply balanced fertilizer, especially potassium.`,
  },
  {
    title: 'Rice Fertilizer Guide for Cambodia',
    source: 'CARDI Cambodia',
    language: 'km',
    cropTags: ['rice', 'fertilizer', 'nutrition'],
    text: `Fertilizer recommendations for Cambodian rice production:
Recommended NPK rates: 60-30-30 kg/ha for lowland rice in typical Cambodian soils.
Application timing:
- Basal (at transplanting): all phosphorus (P), 1/3 nitrogen (N), all potassium (K).
- Tillering (21-25 days after transplanting): 1/3 nitrogen.
- Panicle initiation (45-50 days): 1/3 nitrogen.
Urea (46% N): 130 kg/ha total. Triple superphosphate (46% P2O5): 65 kg/ha. Muriate of potash (60% K2O): 50 kg/ha.
Signs of nutrient deficiency:
- Nitrogen: uniform yellowing from older leaves upward.
- Phosphorus: purplish discoloration of leaves.
- Potassium: brown leaf tips and margins on older leaves.
- Zinc: brown rusty spots, stunted growth (common in flooded soils).
Soil testing recommended every 3 years. Organic matter improves efficiency of all nutrients.`,
  },
  {
    title: 'Organic Vegetable Farming in Cambodia',
    source: 'FAO Cambodia',
    language: 'km',
    cropTags: ['vegetables', 'organic', 'soil'],
    text: `Organic vegetable farming practices for Cambodian smallholders:
Soil preparation: add 5-10 tons/ha compost or well-rotted manure. Incorporate 2-3 weeks before planting.
Key vegetables for Cambodia: morning glory (trakuon), water spinach, Chinese cabbage, long beans, bitter melon, eggplant, tomato.
Organic pest control:
- Neem oil spray (20ml/L): repels aphids, whiteflies, thrips.
- Garlic-chili spray: mix 100g garlic + 50g chili + 1L water, strain and dilute 1:10.
- Yellow sticky traps: catch flying insects.
- Hand picking: for caterpillars and large insects.
Crop rotation: rotate families every season. Avoid planting same family in same bed for 2+ years.
Companion planting: basil with tomatoes repels aphids. Marigolds repel nematodes.
Irrigation: drip irrigation saves 40-50% water vs flooding. Water in morning to reduce fungal disease.`,
  },
  {
    title: 'Cassava Cultivation in Cambodia',
    source: 'Ministry of Agriculture Cambodia',
    language: 'km',
    cropTags: ['cassava', 'cultivation', 'export'],
    text: `Cassava is Cambodia's second largest export crop after rice.
Planting: use 20-25 cm stem cuttings. Plant at 45-degree angle, 2/3 buried. Spacing: 1m x 1m or 0.8m x 1m for higher yields.
Varieties: Rayong 72, KU50, and local varieties. High-starch varieties preferred by factories.
Fertilizer: 15-15-15 NPK at 200-300 kg/ha. Apply at planting and 3 months later.
Weed control: critical in first 3 months. Hand weed or use herbicide. After canopy closes, weeds less problematic.
Pests: cassava mealybug (use biological control with Anagyrus lopezi wasp), spider mites (increase humidity, use acaricides), whitefly (neem oil, yellow traps).
Harvest: 8-12 months after planting. Starch content peaks at 10-11 months. Dry season harvest preferred.
Post-harvest: fresh cassava must be processed within 48 hours. Chip and dry to 14% moisture for storage.`,
  },
  {
    title: 'Soil Health and Composting for Cambodian Farmers',
    source: 'FAO Cambodia',
    language: 'km',
    cropTags: ['soil', 'compost', 'organic'],
    text: `Building healthy soil is the foundation of sustainable farming in Cambodia.
Making compost: layer 30cm green material (fresh leaves, grass, kitchen waste) with 10cm brown material (rice straw, dry leaves). Add thin layer of soil or manure. Keep moist. Turn every 2 weeks. Ready in 6-8 weeks.
Vermicompost: use red wriggler worms (Eisenia fetida). Feed kitchen scraps. Produces high-quality castings in 60-90 days.
Rice straw management: incorporate straw instead of burning. Adds organic matter and silica. Promotes microbial activity.
Green manure: grow Sesbania, Mucuna, or Crotalaria between seasons. Cut and incorporate before flowering. Adds 50-100 kg N/ha.
Signs of healthy soil: dark color, earthworm presence, crumbly structure, no compaction, good drainage.
Soil pH: most Cambodian soils are slightly acidic (5.5-6.5). Lime application corrects excessive acidity. Test pH before liming.`,
  },
  {
    title: 'Cambodian Planting Calendar',
    source: 'Ministry of Agriculture Cambodia',
    language: 'km',
    cropTags: ['calendar', 'seasons', 'planning'],
    text: `Cambodia has two main growing seasons based on monsoon rainfall.
Wet season rice (Vassa): transplant June-July, harvest October-December. Main season, rain-fed. Higher yields with good rainfall.
Dry season rice (Preng): transplant December-January, harvest March-May. Requires irrigation. Higher market prices due to scarcity.
Flood-recession rice (Chamkar Prey): planted as floods recede October-November, harvested January-February. Traditional system in Tonle Sap floodplains.
Vegetable calendar:
- Cool season (November-February): ideal for cabbage, lettuce, tomato, cucumber.
- Hot dry season (March-May): heat-tolerant crops: eggplant, bitter melon, long beans.
- Wet season (June-October): morning glory, water spinach, pumpkin.
Fruit trees: mango flowers December-January (harvest April-May). Longan and lychee need cool nights to induce flowering.
Important dates: start land prep 4-6 weeks before transplanting. Apply basal fertilizer at transplanting. Scout for pests weekly from 3 weeks after transplanting.`,
  },
];

async function main() {
  console.log('Seeding AI knowledge base...');

  for (const article of KNOWLEDGE_ARTICLES) {
    await (prisma as any).aIKnowledge.upsert({
      where: { title: article.title },
      update: { text: article.text, source: article.source },
      create: {
        title: article.title,
        source: article.source,
        language: article.language,
        cropTags: article.cropTags,
        text: article.text,
      },
    });
    console.log('Seeded:', article.title);
  }

  console.log('Done! Seeded', KNOWLEDGE_ARTICLES.length, 'articles.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
