# Application Content Plan

This document maps key veterinary clinical needs to concrete in-app behaviors, detailing user inputs/outputs, safety checks, and multilingual considerations.

## Feature Behavior Map

### 1) Dose/cc Calculator with Safety Flags
- **Behavior:** Guided dosing wizard converts mg/kg or total mg to mL, tied to product concentration; surfaces red/yellow flags for overdose risk, dilution requirements, and off-label constraints.
- **Inputs:** Species → weight (kg/lb) → drug/product selection (concentration, formulation) → route → indication → dilution option.
- **Outputs:** Per-dose mg, total mg, mL per dose, max daily dose, dilution instructions, syringe size guidance.
- **Safety Alerts:** Hard stops at lethal/max dose, concentration mismatch warnings, dilution minimums, route-specific cautions, frequency ceilings.
- **Multilingual:** Numeric units localized; alert text, dilution steps, and route abbreviations translated; supports bidi scripts where needed.

### 2) Species-Specific Contraindication Traffic Light
- **Behavior:** Drug and procedure lookups show green/yellow/red status per species and life stage; tap for rationale and sources.
- **Inputs:** Species/breed → age/life stage → condition (e.g., pregnancy, renal disease) → drug/procedure.
- **Outputs:** Traffic light status, concise rationale, alternative options, reference links.
- **Safety Alerts:** Red → hard stop with override notes; yellow → monitoring prompts (labs, vitals), dose adjustments.
- **Multilingual:** Status labels and rationales localized; abbreviations avoided; icons supplemented with translated text for accessibility.

### 3) Fluid Therapy & Infusion-Rate Calculator
- **Behavior:** Computes maintenance and deficit replacement, shock bolus, and continuous infusion rates with device-specific drop-factor or pump settings.
- **Inputs:** Species → weight → hydration status → fluid type → route (IV/IO/SC) → desired % dehydration correction window → device (macro/microdrip or pump) → additives.
- **Outputs:** mL/hr, drops/min, bolus volume/time, additive dilution steps, stacked plan (maintenance + deficit + ongoing losses).
- **Safety Alerts:** Max hourly rate, electrolyte/osmolarity limits, additive compatibility, central vs peripheral line guidance.
- **Multilingual:** Units localized; pump vs drip terminology translated; procedural steps and warnings localized with icons.

### 4) Emergency Protocol Flows
- **Behavior:** Tappable algorithms for CPR, anaphylaxis, dystocia, GDV, heatstroke; each step shows timers, drug doses, and equipment checklists.
- **Inputs:** Species → weight → presenting emergency → available equipment/consumables.
- **Outputs:** Step-by-step flow with timers, drug dose tiles, shock dose calculators, defibrillation settings, escalation prompts.
- **Safety Alerts:** CPR drug repetition timers, shock energy ceilings, contraindicated drugs by species/condition, airway cautions.
- **Multilingual:** Short imperative steps translated; timer labels and button text localized; critical alerts prioritized for translation QA.

### 5) Antibiotic Stewardship
- **Behavior:** Indication-first selector suggests first/second-line choices with dosing, duration, culture prompts, and de-escalation reminders.
- **Inputs:** Species → site of infection → likely organism/resistance risk → renal/hepatic status → culture status.
- **Outputs:** Recommended agent(s), dose/duration, route, recheck timing, culture sampling reminder, withdrawal time (food animals).
- **Safety Alerts:** Avoidance in contraindicated species, renal/hepatic dose adjustments, max duration flags, extra-label use disclosures.
- **Multilingual:** Indication names and stewardship notes localized; withdrawal-time units translated; culture prompts simplified for clarity.

### 6) Anesthesia/Sedation Planner
- **Behavior:** Protocol builder with premed/induction/maintenance/recovery steps, drug stacks, monitoring checklist, and reversal options.
- **Inputs:** Species/breed → weight → ASA status → procedure type → comorbidities → equipment available → IV access status.
- **Outputs:** Drug plan with doses and mL conversions, monitoring intervals, fluid plan linkage, reversal dosing, recovery steps.
- **Safety Alerts:** Max dose per agent, drug interaction flags, airway difficulty warnings, hypothermia prevention prompts, fasting guidance.
- **Multilingual:** Protocol step labels, monitoring reminders, and reversal instructions translated; abbreviations expanded in localized strings.

### 7) Symptom → Differential Diagnosis (DDx)
- **Behavior:** Symptom-driven navigator suggests ranked DDx with key discriminators and recommended initial tests.
- **Inputs:** Species → signalment → primary symptom(s) → onset/severity → environment/travel → vaccination status.
- **Outputs:** DDx list with likelihood tiers, red-flag alerts, suggested diagnostics (labs/imaging), and next-step care links.
- **Safety Alerts:** Red-flag escalations (e.g., respiratory distress) trigger emergency flows; zoonosis precautions highlighted.
- **Multilingual:** Symptom names, red-flag descriptors, and test names localized; concise phrasing for rapid comprehension.

### 8) Lab Reference Helper
- **Behavior:** Quick search of reference intervals by species/breed/age with anemia/electrolyte calculators and interpretive tips.
- **Inputs:** Species/breed → age → test name → analyzer units → sample quality flags.
- **Outputs:** Reference range, critical low/high thresholds, interpretation snippets, unit conversions, and correction calculators (e.g., calcium for albumin).
- **Safety Alerts:** Critical value alerts, hemolysis/lipemia interference notes, unit mismatch warnings.
- **Multilingual:** Test names and interpretations localized; unit abbreviations standardized; critical alerts double-checked in translation.

### 9) Pain Management Protocols
- **Behavior:** Modalities selector (opioids, NSAIDs, local blocks, adjuncts) with dosing, re-dosing intervals, and pain scoring tools.
- **Inputs:** Species → weight → pain score → comorbidities (renal/hepatic/GI) → concurrent meds → procedure type.
- **Outputs:** Drug doses with mg→mL, intervals, multimodal plan recommendations, monitoring checklists, rescue dose guidance.
- **Safety Alerts:** Max total daily NSAID/acetaminophen, co-administration cautions (NSAID+steroid), GI bleed risk, species-specific bans.
- **Multilingual:** Pain score descriptors, monitoring prompts, and cautions localized; icons paired with text for clarity.

### 10) Multilingual Client Handouts
- **Behavior:** Auto-generate client-ready summaries for treatments, home care, and red flags; printable and shareable offline.
- **Inputs:** Species → diagnosis/procedure → medications (dose, route, frequency) → home-care instructions → language selection.
- **Outputs:** Plain-language instructions, dosing schedule, red-flag list, follow-up timing, QR/link to full instructions.
- **Safety Alerts:** Emphasize dosing accuracy, storage, and when to seek emergency care; highlight contraindicated OTC meds.
- **Multilingual:** Pre-translated templates with clinician review mode; supports RTL scripts; includes pictograms for low-literacy contexts.

## Core vs Secondary Modules Roadmap
- **Core (phase 1):** Dose/cc calculator, species-specific contraindication traffic light, fluid therapy & infusion-rate calculator, emergency protocol flows, lab reference helper, pain management protocols.
- **Secondary (phase 2):** Antibiotic stewardship, anesthesia/sedation planner, symptom → DDx navigator, multilingual client handouts.

## Offline Access Notes
- Cache formularies, concentration data, reference ranges, and core calculators for offline use; store translations for high-use languages.
- Allow offline calculation and protocol viewing with flagged data freshness; sync stewardship guidelines, DDx probabilities, and handout templates when online.
- Provide visual indicators for stale data and block use of outdated safety thresholds until refreshed.
