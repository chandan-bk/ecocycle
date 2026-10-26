# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **Citizens / Household Residents**: People with obsolete, broken, or end-of-life electronics (burnt chargers, dead batteries, fried laptops, old appliances) who need a friction-free, trustworthy way to dispose of hazardous e-waste from their doorstep without paying fees.
2. **Facility Managers / Logistics Administrators**: Local coordinators who triage pickup requests, schedule transport, update lifecycle statuses, and manage verified drop-off recycling centers.

## Product Purpose

EcoCycle exists to solve the **"last-mile e-waste collection crisis"**. While state-certified industrial recycling facilities (CPCB/KSPCB) have the smelting and chemical recovery infrastructure to safely neutralize toxic heavy metals (lead, mercury, cadmium), they only accept industrial bulk shipments. Everyday citizens are left with no viable disposal channel and dump e-waste in municipal trash or hoarding drawers. EcoCycle acts as a free civic environmental utility, aggregating household collections and routing them to authorized recyclers.

## Positioning

Unlike commercial buyback marketplaces (e.g. Cashify, OLX, scrap brokers) that only purchase working gadgets to resell for corporate profit, **EcoCycle accepts dead, broken, and hazardous e-waste that commercial buyers reject**. It charges ₹0, pays ₹0, and operates purely for environmental health, data security, and circular economy compliance (UN SDG 12).

## Operating Context

- Used on mobile phones and desktop browsers across Mandya, Bangalore, and Karnataka regions.
- Public facing website and citizen booking portal accessible 24/7.
- Low-latency cloud edge delivery (Vercel) connected to Supabase PostgreSQL and EmailJS automated notifications.

## Capabilities and Constraints

- **Free Doorstep Booking**: Schedule collection with minimum 1-day advance validation.
- **Interactive GIS Mapping**: Dual-city Leaflet locator (Mandya and Bangalore) with zero paid Google Maps API dependencies.
- **Live Status Tracking**: Multi-stage pickup pipeline (`Pending` → `Scheduled` → `Collected` → `Cancelled`).
- **Environmental Analytics**: Dynamic empirical carbon offset calculations (~15 kg CO₂e saved per device) with Chart.js visualization.
- **Literacy & Challenge**: 5-question e-waste hazard quiz with instant scoring.
- **Role-Based Access Control**: Secure JWT authentication guarding administrative triage routes.
- **Constraint**: Must remain 100% free-tier cloud architecture with zero server runtime overhead.

## Brand Commitments

- **Name**: EcoCycle
- **Tone**: Authoritative, civic-minded, scientifically grounded, transparent, and encouraging. Never corporate jargon, never guilt-tripping, never commercial marketplace hype.
- **Design Spirit**: Natural material restraint, forest depth, patina vitality, tactile geometry, crisp data hierarchy.

## Product Principles

1. **Frictionless Civic Duty**: Surrendering e-waste should be as easy as ordering groceries; no confusing pricing quotes, no device condition grading.
2. **Honest Environmental Accounting**: Quantify environmental savings using verified empirical LCA standards, not arbitrary eco-buzzwords.
3. **Data Privacy First**: Remind and safeguard citizen data sanitization before hardware leaves the doorstep.
4. **Zero AI Slop**: Human-crafted, distinctive interface without generic SaaS templates, card-nesting clutter, or decorative gimmicks.
