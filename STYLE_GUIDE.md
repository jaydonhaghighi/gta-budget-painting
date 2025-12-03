Below is a **complete `.md` style guide** you can paste directly into your project.
It captures the exact aesthetic from the images you provided: **grainy gradients + soft neo-brutalism + minimal Swiss typography**.

---

# **Grainy Gradient Minimalist UI – Style Guide**

*A design system for modern digital agency / portfolio interfaces.*

---

## **1. Overview**

This style combines **soft neo-brutalism**, **grainy gradient blobs**, and **minimal Swiss-style typography**.
It uses bold headings, extreme whitespace, subtle noise textures, and vibrant organic gradients to create a futuristic editorial look.

---

## **2. Brand Principles**

* **Bold yet minimal** — strong typography with almost no decorative elements.
* **Soft gradients** — organic blurry blobs with noise for warmth.
* **Purposeful whitespace** — layouts breathe; focus is on content clarity.
* **Editorial rhythm** — grid alignment, big text, clean structure.
* **Futuristic simplicity** — sharp UI combined with soft gradients for contrast.

---

## **3. Color System**

### **Primary Neutrals**

| Name             | HEX       | Usage              |
| ---------------- | --------- | ------------------ |
| **Canvas Light** | `#F5F5F5` | Main background    |
| **Ink Black**    | `#0A0A0A` | Primary text       |
| **Soft Black**   | `#1C1C1C` | Headlines, accents |
| **Muted Gray**   | `#8C8C8C` | Secondary text     |

---

### **Accent Gradient Colors**

Used for grainy blobs and hero sections.

| Name               | HEX       |
| ------------------ | --------- |
| **Electric Blue**  | `#3F61FF` |
| **Neon Pink**      | `#FF3C6A` |
| **Apricot Orange** | `#FFA640` |
| **Violet Mist**    | `#B694FF` |
| **Mint Cyan**      | `#4BF0D9` |

#### **Gradient Examples**

```css
background: radial-gradient(circle at 40% 40%, #3F61FF 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, #FF3C6A 0%, transparent 60%);
```

---

## **4. Typography**

### **Headings**

* **Font:** “Inter”, “Space Grotesk”, “Söhne”, or “Neue Haas Grotesk”
* **Weight:** 600–800
* **Letter spacing:** -1% to -3%
* **Style:** UPPERCASE for hero titles
* **Sizing Scale:**

  * H1: 72–120px
  * H2: 48–64px
  * H3: 24–32px

### **Body**

* **Font:** Same family as headings, weight 300–400
* **Size:** 16–20px
* **Line height:** 140%
* **Color:** Muted Gray or Black depending on hierarchy

### **Microtext**

* 10–12px
* All-caps
* Extra letter spacing

---

## **5. Layout & Grid**

* **Max width:** 1280–1440px
* **Columns:** 12
* **Gutters:** 24–40px
* **Padding:** 120px top/bottom for hero sections
* **Extreme whitespace** is intentional.

**Key rule:**

> The gradient blob is a “visual anchor,” the typography is the “hero.”

---

## **6. UI Elements**

### **Buttons**

**Primary Button Style**

```css
padding: 14px 28px;
border-radius: 32px;
border: 1px solid #1C1C1C;
background: transparent;
font-weight: 500;
letter-spacing: -0.5px;
transition: 0.2s ease;
```

**Hover:** Slight scale-up (1.03) + darker border.

---

### **Cards**

* Rounded corners: **24–32px**
* Border: 1px solid rgba(0,0,0,0.1)
* Background: white or light neutral
* Optional subtle noise texture overlay `5–8% opacity`

---

## **7. Grainy Gradient Blob Guidelines**

The gradient blobs follow a consistent pattern:

### **Shape Rules**

* Organic, overlapping, never symmetrical
* Soft edges, blurred center
* Grain/noise added on top (`10–20%` opacity)

### **Placement**

* Behind text but not overpowering
* Often anchored left or right in hero
* Can extend outside viewport edges

### **Export Settings**

* PNGs or SVGs with noise
* 2500–3500px size for crisp quality
* Blur radius: **100–300px**

---

## **8. Iconography**

* Thin stroke (1–1.5px)
* Minimal geometric forms
* All icons monochrome
* Use “outline-only” style
* Icons rarely exceed 20–24px

---

## **9. Motion & Interaction**

* **Fade-in + soft zoom** for gradients
* **Text slides in slightly** (10–20px)
* **Cursor interactivity** (hover ripple, subtle distortion)
* Overall motion is **elegant, slow, atmospheric**

---

## **10. Sample Component Styles (CSS)**

### **Hero Section**

```css
.hero {
  padding: 160px 0;
  background: #F5F5F5;
  position: relative;
}

.hero-title {
  font-size: 96px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}

.hero-blob {
  position: absolute;
  top: 20%;
  right: 10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #FF3C6A, transparent),
              radial-gradient(circle, #3F61FF, transparent);
  filter: blur(120px);
  opacity: 0.8;
}
```

---

# **11. Voice & Tone**

* Clean
* Confident
* Simple statements
* No filler words
* Agency-style language (e.g., “We create. We design. We build.”)

---