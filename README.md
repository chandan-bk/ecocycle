# ♻️ EcoCycle: E-Waste Pickup & Recycler Locator

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://ecocycle-beryl.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/chandan-bk/ecocycle)

> **Live Website:** [https://ecocycle-beryl.vercel.app/](https://ecocycle-beryl.vercel.app/)  
> **Vanilla Edition:** [https://ecocycle-vanilla.vercel.app/](https://ecocycle-vanilla.vercel.app/) ([GitHub](https://github.com/chandan-bk/ecocycle-vanilla))  
> **PowerPoint Presentation (.pptx):** [Download EcoCycle_Project_Presentation.pptx](EcoCycle_Project_Presentation.pptx) ([Raw GitHub Download](https://github.com/chandan-bk/ecocycle/raw/main/EcoCycle_Project_Presentation.pptx))  
> **Interactive Web Presentation:** [https://ecocycle-vanilla.vercel.app/presentation.html](https://ecocycle-vanilla.vercel.app/presentation.html)

EcoCycle is a full-stack, cloud-hosted web application designed to combat electronic waste accumulation. Built with **React (Vite)**, **Supabase**, **Leaflet**, and **Chart.js**, it empowers everyday citizens to schedule doorstep pickups for discarded devices and locate certified e-waste dismantling facilities on an interactive map.

---

## 🏛️ Operational Philosophy: Civic Non-Profit Aggregator vs Commercial Buyback

A foundational design principle of EcoCycle is its **Non-Profit Civic Utility & Community Aggregator model**:

| Dimension | 🌿 EcoCycle (Civic NGO Model) | 💼 Commercial Buyback (Cashify / Scrap Dealers) |
| :--- | :--- | :--- |
| **Mission & Priority** | **Environmental safety & public health** (UN SDG 12) | Corporate financial profit & gadget resale |
| **Accepted Items** | **Broken, obsolete, non-working, dead electronics & hazardous waste** | Working or semi-working high-value smartphones & laptops |
| **Financial Cost** | **₹0 Free Service** (Citizens surrender waste for safe disposal) | Cash payments based on device resale condition |
| **The "Last-Mile" Problem** | **Solved**: State-certified recyclers only accept bulk industrial metric tons from corporations. EcoCycle aggregates small household pickups and delivers them in bulk to authorized facilities. | **Ignored**: Cherry-picks lucrative devices; dumps hazardous plastics, lead glass, and toxic cells. |
| **Disposal Route** | **CPCB/KSPCB certified recycling plants** for hydrometallurgical recovery and toxic neutralization. | Secondary markets or informal unorganized scrap burning. |

> **FAQ: Why doesn't EcoCycle pay citizens for e-waste?**  
> Commercial platforms only want gadgets they can resell for a markup. EcoCycle is engineered for the 80%+ of electronic waste that has zero resale value (burnt motherboards, shattered displays, swollen batteries, tangled cables). Our mission is to ensure these hazardous toxins never enter municipal landfills, ground aquifers, or informal acid baths.

---

## 🌟 Key Features

1. **User Authentication & Role-Based Access Control (RBAC)**
   - Secure email & password authentication powered by Supabase Auth.
   - Dual roles: `user` (citizens) and `admin` (facility managers / logistics coordinators).

2. **Doorstep Pickup Scheduling (User)**
   - Schedule pickups for multiple e-waste categories (Smartphones, Laptops, Batteries, Appliances, Cables).
   - Date picker with automated validation (minimum 1 day in advance).
   - Real-time persistence to PostgreSQL.

3. **My Pickups Tracker (User)**
   - Personal dashboard tracking pickup statuses in real time (`Pending` 🟡, `Scheduled` 🔵, `Collected` 🟢, `Cancelled` 🔴).
   - Filter tabs for fast status organization.

4. **Recycler & Collection Center Locator**
   - Free interactive map powered by **Leaflet** and **OpenStreetMap** (no paid Google Maps API keys).
   - Search by facility name or address.
   - Filter by City and accepted e-waste categories.
   - Popups with coordinates and direct Google Maps directions links.

5. **Administrative Operations Dashboard (Admin)**
   - Live overview of all pickup bookings across all users.
   - Inline status updates (`pending` → `scheduled` → `collected`).
   - Full CRUD management (Create, Read, Update, Delete) for collection centers.

6. **Environmental Impact & CO₂ Dashboard**
   - Live analytics charts rendered via **Chart.js** (`react-chartjs-2`).
   - Scientific CO₂ savings estimation benchmarked against UNEP/EPA standards (~15 kg CO₂e per recycled device).
   - Equivalent urban trees planted metric.

7. **E-Waste Literacy & 5-Question Quiz**
   - Educational taxonomy on what counts as e-waste and toxic heavy metal risks (Lead, Mercury, Cadmium).
   - Interactive 5-question challenge with instant scoring, feedback, and certificate rating.

---

## 💻 Tech Stack (100% Free Tier Architecture)

| Layer | Technology | Cost / Tier |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Free / Open Source |
| **Routing** | React Router DOM v6 | Free / Open Source |
| **Styling** | Tailwind CSS v3 | Free / Open Source |
| **Database & Auth** | Supabase (PostgreSQL + RLS) | Free Hobby Tier (No Credit Card) |
| **Maps & Geospatial** | Leaflet + OpenStreetMap | 100% Free / No API Billing |
| **Data Visualization** | Chart.js + React-Chartjs-2 | Free / Open Source |
| **Email Alerts** | EmailJS Browser SDK | Free Tier (200 real emails/mo) |
| **Icons** | Lucide React | Free / Open Source |
| **Frontend Hosting** | Vercel | Free Hobby Tier |

---

## 📸 Screenshots & UI Showcase

```
+-----------------------------------------------------------------------------------+
|  [🌱 EcoCycle]   Home   Locator   Schedule Pickup   My Pickups   Impact   Awareness   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|           Give Your Old Electronics A Second Life.                                |
|           Doorstep E-Waste Collection & Verified Recycler Network                 |
|                                                                                   |
|          [ Schedule Free Pickup ]       [ Find Collection Centers ]               |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Leaflet + OpenStreetMap View ]        |  [ Verified Centers in Bangalore ]     |
|   📍 Whitefield Recycling Depot          |  1. EcoE-Waste Hub - Whitefield        |
|   📍 Electronic City Facility            |  2. GreenTech Depot - Electronic City  |
|   📍 Koramangala Collection Point        |  3. SustainCycle Point - Koramangala   |
|                                          |                                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Live Environmental Impact ]                                                    |
|  Total Pickups: 142  |  Devices Saved: 384  |  CO2 Saved: 5,760 kg (~262 Trees)   |
|  [ Bar Chart: Devices by Category ]   |  [ Doughnut: Pickup Pipeline Status ]     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

*(You can capture real browser screenshots after running `npm run dev`)*

---

## 📬 Automated Real-Time Email Service (EmailJS)

EcoCycle features a decoupled, serverless transactional email notification engine using the **EmailJS Browser SDK** (`src/lib/emailService.js`). Real emails are dispatched through authenticated cloud SMTP relays without running custom backend Node.js daemons.

### Operational Triggers
1. **Booking Confirmation**: Dispatches an instant receipt containing pickup date, gadget stream, item count, and pickup address when a user schedules a collection.
2. **Status Triage Notifications**: Dispatches an alert whenever an administrator updates a request status (`Pending` → `Scheduled` → `Collected` → `Cancelled`), routing customers directly back to their personal tracking dashboard (`https://ecocycle-beryl.vercel.app/my-pickups`).

### Dispatched Template Parameters
- `to_name`, `to_email`, `recipient_email`: Customer identity & destination inbox
- `pickup_id`: 8-character reference token
- `item_type`, `quantity`: E-waste stream and unit count
- `status`, `status_note`: Lifecycle status with user-friendly instructions
- `pickup_date`, `pickup_address`: Doorstep logistical coordinates
- `dashboard_url`: Direct dashboard link

---

## ⚡ Quickstart

1. **Clone or navigate to the project directory**:
   ```bash
   cd ecocycle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 👥 Project Team & Contributors
- **Chandan B K** — Lead & Full-Stack Architect (3rd Sem CSE)
- **Dhanush Gowda R** — Frontend & Leaflet GIS Specialist (3rd Sem CSE)
- **Dore Prasad C K** — Backend & EmailJS Systems Engineer (3rd Sem CSE)
- **Gowri Shankar S** — Data Analytics & Environmental Modeling (3rd Sem CSE)

### 🏫 Academic & Program Details
- **Department:** Department of Computer Science & Engineering
- **Institution:** PES College of Engineering, Mandya
- **Program:** 5-Day Skill Development Program · Web Development Foundations (12–16 Oct 2026)
- **Collaboration:** ExcelR Edtech Pvt. Ltd., Bengaluru
- **Project Repository:** [chandan-bk/ecocycle](https://github.com/chandan-bk/ecocycle)
- **PowerPoint Presentation:** [EcoCycle_Project_Presentation.pptx](EcoCycle_Project_Presentation.pptx)
- **Live Presentation (HTML):** [ecocycle-vanilla.vercel.app/presentation.html](https://ecocycle-vanilla.vercel.app/presentation.html)
