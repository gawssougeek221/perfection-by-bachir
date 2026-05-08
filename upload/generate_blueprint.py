#!/usr/bin/env python3
"""Generate complete PERFECTION BY BACHIR site blueprint PDF."""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm, inch
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, KeepTogether, Flowable
)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.graphics.shapes import Drawing, Rect, Line, String, Circle
from reportlab.graphics import renderPDF

# ─── Font Registration ───
pdfmetrics.registerFont(TTFont('NotoSerif', '/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerif-Bold', '/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuMono', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))

# ─── Color Palette ───
DARK = HexColor('#080709')
LIGHT = HexColor('#F8F8F6')
GOLD = HexColor('#D4AF37')
GOLD_DARK = HexColor('#B8960E')
GOLD_LIGHT = HexColor('#E8C84A')
WHITE = HexColor('#FFFFFF')
GRAY_100 = HexColor('#F5F5F3')
GRAY_200 = HexColor('#E5E5E3')
GRAY_300 = HexColor('#D4D4D4')
GRAY_500 = HexColor('#999999')
GRAY_700 = HexColor('#444444')
GRAY_900 = HexColor('#111111')
DARK_BLUE = HexColor('#0A0A1A')
ACCENT_RED = HexColor('#FF4444')
ACCENT_GREEN = HexColor('#22C55E')

W, H = A4
LEFT_M = 22 * mm
RIGHT_M = 22 * mm
TOP_M = 20 * mm
BOT_M = 25 * mm
CONTENT_W = W - LEFT_M - RIGHT_M

# ─── Styles ───
styles = getSampleStyleSheet()

style_title = ParagraphStyle('TitleCustom', fontName='DejaVuSans-Bold', fontSize=28,
    leading=34, textColor=WHITE, alignment=TA_LEFT, spaceAfter=6*mm)

style_h1 = ParagraphStyle('H1', fontName='DejaVuSans-Bold', fontSize=18,
    leading=24, textColor=DARK, spaceBefore=10*mm, spaceAfter=5*mm,
    borderPadding=(0, 0, 2, 0))

style_h2 = ParagraphStyle('H2', fontName='DejaVuSans-Bold', fontSize=14,
    leading=19, textColor=GRAY_700, spaceBefore=7*mm, spaceAfter=3*mm)

style_h3 = ParagraphStyle('H3', fontName='DejaVuSans-Bold', fontSize=11,
    leading=15, textColor=GRAY_700, spaceBefore=5*mm, spaceAfter=2*mm)

style_body = ParagraphStyle('Body', fontName='DejaVuSans', fontSize=9,
    leading=14, textColor=GRAY_700, alignment=TA_JUSTIFY, spaceAfter=2*mm)

style_body_small = ParagraphStyle('BodySmall', fontName='DejaVuSans', fontSize=8,
    leading=12, textColor=GRAY_500, alignment=TA_JUSTIFY, spaceAfter=1.5*mm)

style_code = ParagraphStyle('Code', fontName='DejaVuMono', fontSize=7.5,
    leading=11, textColor=HexColor('#2D2D2D'), backColor=GRAY_100,
    borderPadding=(4, 6, 4, 6), spaceAfter=2*mm)

style_section_num = ParagraphStyle('SectionNum', fontName='DejaVuSans-Bold',
    fontSize=9, leading=12, textColor=GOLD, spaceBefore=8*mm, spaceAfter=1*mm)

style_label = ParagraphStyle('Label', fontName='DejaVuSans', fontSize=7,
    leading=10, textColor=GRAY_500, spaceAfter=1*mm)

style_table_header = ParagraphStyle('TH', fontName='DejaVuSans-Bold',
    fontSize=8, leading=11, textColor=WHITE)

style_table_cell = ParagraphStyle('TC', fontName='DejaVuSans',
    fontSize=7.5, leading=11, textColor=GRAY_700)

style_table_cell_code = ParagraphStyle('TCC', fontName='DejaVuMono',
    fontSize=6.5, leading=9, textColor=GRAY_700)


# ─── Custom Flowables ───

class ColorBlock(Flowable):
    """A colored rectangle block."""
    def __init__(self, width, height, color, radius=0):
        Flowable.__init__(self)
        self.width = width
        self.height = height
        self.color = color
        self.radius = radius

    def draw(self):
        self.canv.setFillColor(self.color)
        if self.radius:
            self.canv.roundRect(0, 0, self.width, self.height, self.radius, fill=1, stroke=0)
        else:
            self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)


class SectionDivider(Flowable):
    """Gold divider line with dot."""
    def __init__(self, width=CONTENT_W):
        Flowable.__init__(self)
        self.width = width
        self.height = 8

    def draw(self):
        self.canv.setStrokeColor(GOLD)
        self.canv.setLineWidth(0.5)
        self.canv.line(0, 4, self.width * 0.4, 4)
        self.canv.setFillColor(GOLD)
        self.canv.circle(self.width * 0.42, 4, 1.5, fill=1, stroke=0)
        self.canv.line(self.width * 0.44, 4, self.width * 0.5, 4)


class DarkSectionHeader(Flowable):
    """Dark background section header."""
    def __init__(self, text, width=CONTENT_W, number=""):
        Flowable.__init__(self)
        self.text = text
        self.width = width
        self.height = 14
        self.number = number

    def draw(self):
        self.canv.setFillColor(DARK)
        self.canv.roundRect(0, 0, self.width, self.height, 3, fill=1, stroke=0)
        self.canv.setFillColor(GOLD)
        x = 8
        if self.number:
            self.canv.setFont('DejaVuSans-Bold', 7)
            self.canv.drawString(x, 4.5, self.number)
            x += 18
        self.canv.setFont('DejaVuSans-Bold', 8)
        self.canv.setFillColor(WHITE)
        self.canv.drawString(x, 4.5, self.text)


class FlowDiagram(Flowable):
    """Visual flow diagram showing section sequence."""
    def __init__(self, sections, width=CONTENT_W):
        Flowable.__init__(self)
        self.sections = sections
        self.width = width
        self.row_height = 22
        self.gap = 3
        n = len(sections)
        self.height = n * self.row_height + (n - 1) * self.gap + 20

    def draw(self):
        c = self.canv
        n = len(self.sections)
        box_w = self.width * 0.55
        label_w = self.width * 0.38
        x = (self.width - box_w - label_w - 10) / 2

        # Title
        c.setFont('DejaVuSans-Bold', 8)
        c.setFillColor(GRAY_700)
        c.drawCentredString(self.width / 2, self.height - 10, 'SITE FLOW SEQUENCE')

        y = self.height - 28

        for i, sec in enumerate(self.sections):
            name = sec['name']
            zone = sec.get('zone', 'dark')
            is_transition = sec.get('transition', False)

            if is_transition:
                # Arrow transition
                c.setStrokeColor(GOLD)
                c.setLineWidth(1)
                c.setFillColor(GOLD)
                mid_x = x + box_w / 2
                c.line(mid_x, y + 4, mid_x, y - self.gap - 4)
                # Arrow head
                p = c.beginPath()
                p.moveTo(mid_x - 3, y - self.gap + 2)
                p.lineTo(mid_x + 3, y - self.gap + 2)
                p.lineTo(mid_x, y - self.gap - 4)
                p.close()
                c.drawPath(p, fill=1, stroke=0)
                # Label
                c.setFont('DejaVuMono', 6)
                c.setFillColor(GOLD_DARK)
                c.drawString(mid_x + 8, y - 6, name)
            else:
                # Section box
                bg = HexColor('#F8F8F6') if zone == 'light' else HexColor('#1A1A2E')
                fg = GRAY_700 if zone == 'light' else WHITE
                c.setFillColor(bg)
                c.roundRect(x, y - 2, box_w, 16, 4, fill=1, stroke=0)

                # Gold left accent
                c.setFillColor(GOLD)
                c.roundRect(x, y - 2, 3, 16, 1, fill=1, stroke=0)

                # Section name
                c.setFont('DejaVuSans-Bold', 7)
                c.setFillColor(fg)
                c.drawString(x + 10, y + 2, name)

                # Zone label
                c.setFont('DejaVuMono', 6)
                c.setFillColor(GRAY_500)
                zone_label = 'LIGHT' if zone == 'light' else 'DARK'
                c.drawString(x + box_w + 10, y + 2, zone_label)

                # Connecting line to next
                if i < n - 1:
                    c.setStrokeColor(GRAY_300)
                    c.setLineWidth(0.5)
                    mid_x = x + box_w / 2
                    c.line(mid_x, y - 2, mid_x, y - self.row_height - self.gap + 14)

            y -= (self.row_height + self.gap)


# ─── Page Templates ───

def cover_page(canvas, doc):
    canvas.saveState()
    # Dark background
    canvas.setFillColor(DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)

    # Gold accent lines
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.5)
    canvas.line(LEFT_M, H - 60*mm, LEFT_M + 30*mm, H - 60*mm)

    # Corner accents
    canvas.setStrokeColor(HexColor('#D4AF3740'))
    canvas.setLineWidth(0.3)
    # Top right
    canvas.line(W - RIGHT_M - 40*mm, H - TOP_M, W - RIGHT_M, H - TOP_M)
    canvas.line(W - RIGHT_M, H - TOP_M, W - RIGHT_M, H - TOP_M - 40*mm)
    # Bottom left
    canvas.line(LEFT_M, BOT_M, LEFT_M + 40*mm, BOT_M)
    canvas.line(LEFT_M, BOT_M, LEFT_M, BOT_M + 40*mm)

    # Large BACHIR watermark
    canvas.setFont('DejaVuSans-Bold', 72)
    canvas.setFillColor(HexColor('#D4AF3708'))
    canvas.drawCentredString(W/2, H * 0.35, 'BACHIR')

    # Grid pattern
    canvas.setStrokeColor(HexColor('#FFFFFF06'))
    canvas.setLineWidth(0.2)
    for i in range(0, int(W), 30):
        canvas.line(i, 0, i, H)
    for j in range(0, int(H), 30):
        canvas.line(0, j, W, j)

    canvas.restoreState()


def body_page(canvas, doc):
    canvas.saveState()
    # Top bar
    canvas.setFillColor(DARK)
    canvas.rect(0, H - 8*mm, W, 8*mm, fill=1, stroke=0)
    # Gold accent on top bar
    canvas.setFillColor(GOLD)
    canvas.rect(LEFT_M, H - 8.5*mm, 15*mm, 0.5*mm, fill=1, stroke=0)

    # Header text
    canvas.setFont('DejaVuSans', 6)
    canvas.setFillColor(HexColor('#FFFFFF80'))
    canvas.drawString(LEFT_M, H - 6*mm, 'PERFECTION BY BACHIR')
    canvas.setFillColor(HexColor('#D4AF3780'))
    canvas.drawRightString(W - RIGHT_M, H - 6*mm, 'SITE BLUEPRINT')

    # Bottom bar
    canvas.setFillColor(GRAY_200)
    canvas.rect(0, 0, W, 12*mm, fill=1, stroke=0)
    # Page number
    canvas.setFont('DejaVuSans', 8)
    canvas.setFillColor(GRAY_500)
    canvas.drawCentredString(W/2, 5*mm, f'{doc.page}')

    # Gold bottom accent
    canvas.setFillColor(GOLD)
    canvas.rect(W/2 - 10*mm, 12*mm, 20*mm, 0.3*mm, fill=1, stroke=0)

    canvas.restoreState()


# ─── Helper Functions ───

def gold_header(text, number=""):
    """Dark section header block."""
    return DarkSectionHeader(text, number=number)

def section_title(num, title):
    """Section number + title."""
    return [
        Paragraph(f'SECTION {num}', style_section_num),
        Paragraph(title, style_h1),
        SectionDivider(),
    ]

def spec_table(headers, rows):
    """Create a styled spec table."""
    # Header row
    header_row = [Paragraph(h, style_table_header) for h in headers]
    data = [header_row]
    for row in rows:
        data.append([Paragraph(str(c), style_table_cell) for c in row])

    col_w = CONTENT_W / len(headers)
    t = Table(data, colWidths=[col_w] * len(headers))
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('BACKGROUND', (0, 1), (-1, -1), GRAY_100),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, GRAY_100]),
        ('GRID', (0, 0), (-1, -1), 0.3, GRAY_300),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 1), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 4),
    ]))
    return t


def animation_box(title, details):
    """Formatted animation spec box."""
    data = [[Paragraph(f'<b>{title}</b>', ParagraphStyle('ab', fontName='DejaVuSans-Bold', fontSize=7.5, textColor=WHITE, leading=10))],
            [Paragraph(details, ParagraphStyle('abd', fontName='DejaVuMono', fontSize=6.5, textColor=HexColor('#BBBBBB'), leading=9))]]
    t = Table(data, colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), HexColor('#1A1A2E')),
        ('BACKGROUND', (0, 1), (0, 1), HexColor('#0D0D1A')),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('BOX', (0, 0), (-1, -1), 0.5, HexColor('#333355')),
    ]))
    return t


def color_swatch_row(colors):
    """Create color swatches."""
    cells = []
    for name, hex_val in colors:
        cell_content = Table(
            [[ColorBlock(30, 18, HexColor(hex_val), 2)],
             [Paragraph(name, ParagraphStyle('cs', fontName='DejaVuMono', fontSize=5.5, textColor=GRAY_500, alignment=TA_CENTER, leading=7)),
              Paragraph(hex_val, ParagraphStyle('ch', fontName='DejaVuMono', fontSize=5, textColor=GRAY_500, alignment=TA_CENTER, leading=6))]],
            colWidths=[42]
        )
        cell_content.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 1),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ]))
        cells.append(cell_content)
    t = Table([cells], colWidths=[42] * len(colors))
    t.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t


# ─── MAIN DOCUMENT ───

def build_pdf():
    output_path = '/home/z/my-project/download/BACHIR_SITE_BLUEPRINT.pdf'
    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        leftMargin=LEFT_M, rightMargin=RIGHT_M,
        topMargin=TOP_M + 10*mm, bottomMargin=BOT_M + 8*mm
    )

    story = []
    bw = CONTENT_W

    # ══════════════════════════════════════
    # COVER PAGE
    # ══════════════════════════════════════
    story.append(Spacer(1, 55*mm))
    story.append(Paragraph('PERFECTION', ParagraphStyle('cover1',
        fontName='DejaVuSans-Bold', fontSize=36, leading=42, textColor=WHITE)))
    story.append(Paragraph('BY BACHIR', ParagraphStyle('cover2',
        fontName='DejaVuSans-Bold', fontSize=14, leading=18, textColor=GOLD,
        spaceBefore=2*mm, spaceAfter=8*mm)))
    story.append(ColorBlock(40*mm, 0.5, GOLD))
    story.append(Spacer(1, 5*mm))
    story.append(Paragraph('COMPLETE SITE BLUEPRINT', ParagraphStyle('cover3',
        fontName='DejaVuSans', fontSize=10, leading=14, textColor=HexColor('#FFFFFF80'),
        spaceAfter=3*mm)))
    story.append(Paragraph('Architecture, Design System, Animations GSAP', ParagraphStyle('cover4',
        fontName='DejaVuSans', fontSize=8, leading=12, textColor=HexColor('#FFFFFF50'))))
    story.append(Spacer(1, 25*mm))
    story.append(Paragraph('Luxury Car Renovation | Dakar, Senegal', ParagraphStyle('cover5',
        fontName='DejaVuSans', fontSize=7, leading=10, textColor=HexColor('#FFFFFF30'))))
    story.append(Paragraph('Next.js 16 | GSAP ScrollTrigger | Tailwind v4 | TypeScript', ParagraphStyle('cover6',
        fontName='DejaVuMono', fontSize=6, leading=9, textColor=HexColor('#D4AF3760'))))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # TABLE OF CONTENTS
    # ══════════════════════════════════════
    story.append(Paragraph('TABLE DES MATIERES', style_h1))
    story.append(SectionDivider())
    story.append(Spacer(1, 5*mm))

    toc_items = [
        ('01', 'Vue d\'ensemble et Tech Stack'),
        ('02', 'Design System (Couleurs, Typographie, Espacement)'),
        ('03', 'Architecture des Composants'),
        ('04', 'Flow Sequence Complet'),
        ('05', 'Sections Detaillees et Animations GSAP'),
        ('06', 'Systeme de Transitions'),
        ('07', 'Composants UI Reutilisables'),
        ('08', 'Performance et Deploiement'),
    ]

    for num, title in toc_items:
        toc_data = [[
            Paragraph(f'<b>{num}</b>', ParagraphStyle('tn', fontName='DejaVuSans-Bold',
                fontSize=9, textColor=GOLD, leading=12)),
            Paragraph(title, ParagraphStyle('tt', fontName='DejaVuSans',
                fontSize=9, textColor=GRAY_700, leading=12)),
        ]]
        toc_table = Table(toc_data, colWidths=[12*mm, bw - 12*mm])
        toc_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LINEBELOW', (0, 0), (-1, -1), 0.3, GRAY_200),
        ]))
        story.append(toc_table)

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 01 - OVERVIEW & TECH STACK
    # ══════════════════════════════════════
    story.extend(section_title('01', 'Vue d\'ensemble et Tech Stack'))

    story.append(Paragraph(
        'Ce document presente le blueprint complet du site <b>PERFECTION BY BACHIR</b>, '
        'un site vitrine cinematique pour un atelier de renovation automobile haut de gamme a Dakar, Senegal. '
        'Le site est concu comme une experience immersive ou chaque section s\'enchaine via des transitions fluides '
        'et des animations GSAP ScrollTrigger sophistiquees. L\'architecture repose sur une alternance de zones '
        'sombres et claires, reliees par des transitions avec effet de glow dor.', style_body))

    story.append(Paragraph(
        'Le site comprend 13 sections principales, 3 transitions WIPE, 1 transition ClipPath, et un footer '
        'cinematique avec effet curtain reveal. Chaque section utilise des techniques d\'animation avancees : '
        'scrub de frames video, morphing de texte, compteurs animes, curseur personnalise, et barre de progression fluide.',
        style_body))

    story.append(Spacer(1, 3*mm))
    story.append(Paragraph('TECH STACK', style_h2))

    story.append(spec_table(
        ['Technologie', 'Version', 'Usage'],
        [
            ['Next.js (App Router)', '16.1.3', 'Framework React avec SSR/SSG, Turbopack'],
            ['TypeScript', '5.x', 'Typage statique end-to-end'],
            ['Tailwind CSS', 'v4', 'Utility-first CSS avec variables CSS'],
            ['GSAP', '3.15.0', 'ScrollTrigger, timelines, scrub animations'],
            ['@gsap/react', '2.1.2', 'Hook useGSAP pour integration React'],
            ['Lenis', '1.3.23', 'Smooth scroll avec easing personnalise'],
            ['Framer Motion', '12.23.2', 'AnimatePresence, CardStack interactions'],
            ['Lucide React', '0.525.0', 'Icones SVG pour interfaces'],
            ['Three.js / R3F', '0.184+ / 9.6+', 'Rendu 3D (Hero3D, CarModel - reserve)'],
        ]
    ))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('STRUCTURE DU PROJET', style_h2))
    story.append(Paragraph(
        'Le projet suit l\'architecture standard Next.js App Router avec un repertoire components organise '
        'en composants de section et composants UI reutilisables. Les assets media (frames hero, images service, '
        'avant/apres) sont dans le repertoire public.', style_body))

    story.append(spec_table(
        ['Repertoire', 'Contenu', 'Fichiers cles'],
        [
            ['src/app/', 'Routeur App Next.js', 'page.tsx, layout.tsx, globals.css'],
            ['src/components/', 'Sections principales', 'Services, BeforeAfter, CTA, Footer, etc.'],
            ['src/components/ui/', 'Composants reutilisables', 'hero-scrub, card-stack, SplitText, Magnetic'],
            ['public/frames/', '86 frames hero (ezgif)', 'ezgif-frame-001.jpg a 086.jpg'],
            ['public/', 'Assets media', 'before.jpg, after.jpg, service-*.png'],
        ]
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 02 - DESIGN SYSTEM
    # ══════════════════════════════════════
    story.extend(section_title('02', 'Design System'))

    story.append(Paragraph(
        'Le design system est construit autour d\'une palette de 3 couleurs principales : le noir profond pour les zones sombres, '
        'le blanc creme pour les zones claires, et l\'or comme accent premium. Cette trichromie cree une atmosphere luxueuse '
        'et cohérente a travers tout le site.', style_body))

    story.append(Spacer(1, 3*mm))
    story.append(Paragraph('PALETTE DE COULEURS', style_h2))

    story.append(color_swatch_row([
        ('Primary Dark', '#080709'),
        ('Primary Light', '#F8F8F6'),
        ('Gold', '#D4AF37'),
        ('Gold Light', '#E8C84A'),
        ('Gold Dark', '#B8960E'),
    ]))

    story.append(Spacer(1, 3*mm))
    story.append(color_swatch_row([
        ('White', '#FFFFFF'),
        ('Gray 300', '#D4D4D4'),
        ('Gray 500', '#999999'),
        ('Gray 700', '#444444'),
        ('Gray 900', '#111111'),
    ]))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('TYPOGRAPHIE', style_h2))

    story.append(Paragraph(
        'Le systeme typographique utilise la hierarchie suivante pour creer du contraste visuel et guider '
        'l\'oeil de l\'utilisateur a travers le contenu. Les tailles varient du hero massif (7rem) aux labels '
        'ultra-fins (9px) avec un espacement tracking systematique.', style_body))

    story.append(spec_table(
        ['Element', 'Taille', 'Poids', 'Tracking', 'Couleur'],
        [
            ['Hero H1', 'text-7xl (5rem)', 'font-bold (700)', 'tracking-tight', '#FFFFFF'],
            ['Hero H1 Gold', 'text-7xl (5rem)', 'font-bold (700)', 'tracking-tight', '#D4AF37 + glow'],
            ['Section H2', 'text-5xl (3rem)', 'font-semibold (600)', 'tracking-tight', '#FFFFFF / #111'],
            ['Section Label', 'text-[10px]', 'font-medium (500)', 'tracking-[0.5em]', '#D4AF37 / #bbb'],
            ['Body Text', 'text-sm (14px)', 'font-light (300)', 'normal', '#999 / white/50'],
            ['Nav Links', 'text-[11px]', 'font-medium (500)', 'tracking-[0.2em]', 'white/50'],
            ['Kicker/CTA', 'text-[10px]', 'font-semibold (600)', 'tracking-[0.2em]', '#D4AF37 / #111'],
            ['Counter', 'text-[6rem]', 'font-extralight (200)', 'tracking-tight', '#111 + #D4AF37 suffix'],
            ['Morph Text', 'text-[10rem]', 'font-bold (700)', 'tracking-tighter', '#FFF / #D4AF37'],
            ['BACHIR Watermark', '15vw', 'font-bold (700)', '-0.04em', '#D4AF37, opacity 0.1'],
        ]
    ))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('ESPACEMENT ET RYTHME', style_h2))
    story.append(Paragraph(
        'L\'espacement suit un systeme base sur les classes Tailwind avec des valeurs regulieres. '
        'Les sections utilisent py-32 a py-44 pour les grands espaces verticaux, et px-6 a px-24 pour '
        'les marges horizontales responsives. Les transitions entre sections font exactement 35vh de hauteur '
        'pour creer un rythme de defilement cinematique constant.', style_body))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 03 - COMPONENT ARCHITECTURE
    # ══════════════════════════════════════
    story.extend(section_title('03', 'Architecture des Composants'))

    story.append(Paragraph(
        'L\'architecture des composants est divisee en trois couches : les composants systeme ( wrappers globaux), '
        'les composants de section (chaque zone visible du site), et les composants UI reutilisables (animations et '
        'interactions generiques). Cette separation permet une maintenance claire et une reutilisabilite optimale.',
        style_body))

    story.append(Spacer(1, 3*mm))
    story.append(Paragraph('COMPOSANTS SYSTEME (Wrappers Globaux)', style_h2))

    story.append(spec_table(
        ['Composant', 'Fichier', 'Role', 'Technique'],
        [
            ['SmoothScroll', 'SmoothScroll.tsx', 'Lenis smooth scroll + GSAP ticker', 'useEffect, dynamic import lenis'],
            ['Preloader', 'Preloader.tsx', 'Ecran de chargement avec countdown', 'GSAP timeline, safety timeout 3s'],
            ['CustomCursor', 'CustomCursor.tsx', 'Curseur personnalise dot + ring', 'requestAnimationFrame, event listeners'],
            ['GrainOverlay', 'GrainOverlay.tsx', 'Texture grain subtile fixee', 'SVG filter, CSS position fixed'],
            ['LiquidProgress', 'ui/LiquidProgress.tsx', 'Barre de progression dorée en haut', 'GSAP ScrollTrigger scrub sur body'],
            ['Navbar', 'Navbar.tsx', 'Navigation fixe avec scroll detection', 'GSAP entry animation, mobile menu'],
        ]
    ))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('COMPOSANTS DE SECTION', style_h2))

    story.append(spec_table(
        ['Composant', 'Fichier', 'Zone', 'Description'],
        [
            ['HeroScrub', 'ui/hero-scrub.tsx', 'DARK', 'Hero cinematique, 86 frames scrub, 300vh pin'],
            ['ScrubMorphText', 'MorphEffects.tsx', 'DARK', 'REPAIR RESTORE TRANSFORM REBIRTH, pinned morph'],
            ['TrustLogos', 'TrustLogos.tsx', 'LIGHT', 'Logos Mercedes, Porsche, Audi, BMW, Range Rover'],
            ['StatsSection', 'StatsSection.tsx', 'LIGHT', '4 compteurs scrub: 350+, 12ans, 98%, 24h'],
            ['Services', 'Services.tsx', 'DARK', '6 cartes avec hover gold, icones Lucide'],
            ['SenegalDivider', 'SenegalDivider.tsx', 'DARK', 'Separateur decoratif diamonds animes GSAP'],
            ['BeforeAfter', 'BeforeAfter.tsx', 'DARK', 'Slider interactif + video background parallax'],
            ['CTA', 'CTA.tsx', 'LIGHT', 'SplitText anime + Magnetic button WhatsApp'],
            ['Footer', 'Footer.tsx', 'LIGHT', 'CinematicFooter: curtain + BACHIR + marquee'],
        ]
    ))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('COMPOSANTS UI REUTILISABLES', style_h2))

    story.append(spec_table(
        ['Composant', 'Fichier', 'Props cles', 'Animation'],
        [
            ['SplitText', 'ui/SplitText.tsx', 'splitBy, stagger, duration, y', 'Split par mots/lettres, ScrollTrigger fade-up'],
            ['Magnetic', 'ui/Magnetic.tsx', 'strength (0.3), children', 'Suivi souris + elastic spring return'],
            ['ScrubTransition', 'ui/ScrubTransition.tsx', 'direction (d2l/l2d)', 'WIPE 35vh avec glow doré, feathered edge'],
            ['ClipPathTransition', 'ui/ClipPathTransition.tsx', 'className', 'Cercle doré expand depuis centre, 35vh'],
            ['CardStack', 'ui/card-stack.tsx', 'items, renderCard, autoplay', 'Eventail 3D, drag/swipe, autoplay'],
            ['CinematicFooter', 'ui/motion-footer.tsx', 'children', 'Curtain reveal clip-path, BACHIR parallax'],
        ]
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 04 - FLOW SEQUENCE
    # ══════════════════════════════════════
    story.extend(section_title('04', 'Flow Sequence Complet'))

    story.append(Paragraph(
        'Le site suit une sequence cinematique precise, alternant entre zones sombres (#080709) et zones claires (#F8F8F6), '
        'reliees par des transitions WIPE avec effet de glow doré. Chaque transition fait 35vh de hauteur, creant un rythme '
        'de defilement fluide et controlé. Le parcours visuel guide l\'utilisateur de l\'impact initial du hero vers la '
        'conversion finale via le CTA et le footer.', style_body))

    story.append(Spacer(1, 5*mm))

    flow_sections = [
        {'name': '01 HeroScrub (86 frames, 300vh pin)', 'zone': 'dark'},
        {'name': '02 ScrubMorphText (REPAIR > REBIRTH)', 'zone': 'dark'},
        {'name': 'WIPE Dark > White (35vh, gold glow)', 'zone': 'dark', 'transition': True},
        {'name': '03 TrustLogos (Mercedes, Porsche...)', 'zone': 'light'},
        {'name': '04 StatsSection (350+, 12, 98%, 24h)', 'zone': 'light'},
        {'name': 'WIPE White > Dark (35vh, gold glow)', 'zone': 'dark', 'transition': True},
        {'name': 'ClipPath (gold circle expand)', 'zone': 'dark', 'transition': True},
        {'name': '05 Services (6 cards grid)', 'zone': 'dark'},
        {'name': 'SenegalDivider (diamonds)', 'zone': 'dark'},
        {'name': '06 BeforeAfter (slider + video)', 'zone': 'dark'},
        {'name': 'WIPE Dark > White (35vh, gold glow)', 'zone': 'dark', 'transition': True},
        {'name': '07 CTA (SplitText + Magnetic)', 'zone': 'light'},
        {'name': '08 CinematicFooter (curtain + BACHIR)', 'zone': 'light'},
    ]

    story.append(FlowDiagram(flow_sections))

    story.append(Spacer(1, 5*mm))
    story.append(Paragraph('ZONE COLOR MAP', style_h2))
    story.append(Paragraph(
        'L\'alternance des zones de couleur est un element fondamental du design. Les zones sombres mettent en valeur '
        'le contenu premium (hero, services, before/after) tandis que les zones claires creent des respirations visuelles '
        '(trust, stats, CTA). Les transitions WIPE servent de frontieres cinematiques entre ces deux mondes.', style_body))

    zone_data = [
        [Paragraph('<b>Zone</b>', style_table_header),
         Paragraph('<b>Couleur</b>', style_table_header),
         Paragraph('<b>Sections</b>', style_table_header),
         Paragraph('<b>Role</b>', style_table_header)],
        [Paragraph('SOMBRE', ParagraphStyle('z1', fontName='DejaVuSans-Bold', fontSize=7.5, textColor=WHITE, leading=10)),
         Paragraph('#080709', ParagraphStyle('z2', fontName='DejaVuMono', fontSize=7, leading=10, textColor=GRAY_700)),
         Paragraph('Hero, Morph, Services, BeforeAfter', style_table_cell),
         Paragraph('Immersion, premium, impact visuel', style_table_cell)],
        [Paragraph('CLAIRE', ParagraphStyle('z3', fontName='DejaVuSans-Bold', fontSize=7.5, textColor=GRAY_900, leading=10)),
         Paragraph('#F8F8F6', ParagraphStyle('z4', fontName='DejaVuMono', fontSize=7, leading=10, textColor=GRAY_700)),
         Paragraph('Trust, Stats, CTA, Footer', style_table_cell),
         Paragraph('Respiration, confiance, conversion', style_table_cell)],
        [Paragraph('TRANSITION', ParagraphStyle('z5', fontName='DejaVuSans-Bold', fontSize=7.5, textColor=GOLD_DARK, leading=10)),
         Paragraph('Gold Glow #D4AF37', ParagraphStyle('z6', fontName='DejaVuMono', fontSize=7, leading=10, textColor=GRAY_700)),
         Paragraph('WIPE (x3) + ClipPath (x1)', style_table_cell),
         Paragraph('Pont cinematique, effet wow', style_table_cell)],
    ]
    zone_table = Table(zone_data, colWidths=[bw*0.14, bw*0.18, bw*0.35, bw*0.33])
    zone_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK),
        ('BACKGROUND', (0, 1), (0, 1), DARK),
        ('BACKGROUND', (0, 2), (0, 2), GRAY_100),
        ('BACKGROUND', (0, 3), (0, 3), HexColor('#1A1A2E')),
        ('GRID', (0, 0), (-1, -1), 0.3, GRAY_300),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(zone_table)

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 05 - DETAILED SECTIONS & ANIMATIONS
    # ══════════════════════════════════════

    story.extend(section_title('05', 'Sections Detaillees et Animations GSAP'))

    # --- HeroScrub ---
    story.append(gold_header('01. HERO SCRUB - Hero Cinematique', 'SECTION'))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        'Le hero est la section d\'impact initial. Il affiche 86 frames d\'une animation video extraites en images JPG, '
        'presentees en mode scrub lie au defilement. Le hero est "pinned" (fixe) pendant 300% de sa hauteur, ce qui '
        'signifie que l\'utilisateur doit defiler l\'equivalent de 3 fois la hauteur de l\'ecran pour passer cette section. '
        'Un overlay degrade avec un texte hero se deplace en parallax pendant le scrub.', style_body))

    story.append(animation_box(
        'GSAP SCROLLTRIGGER - HeroScrub',
        'ScrollTrigger.create({\n'
        '  trigger: containerRef,\n'
        '  start: "top top",\n'
        '  end: "+=300%",    // Pin pour 3x viewport height\n'
        '  pin: true,        // Section fixee pendant le scroll\n'
        '});\n\n'
        'gsap.to(obj, {\n'
        '  frame: 85,       // 86 frames (0-85)\n'
        '  ease: "none",\n'
        '  scrollTrigger: {\n'
        '    trigger: containerRef,\n'
        '    start: "top top",\n'
        '    end: "+=300%",\n'
        '    scrub: 1.5,    // Smooth interpolation\n'
        '    onUpdate: () => {\n'
        '      frames.forEach((f, i) =>\n'
        '        f.style.opacity = i === idx ? "1" : "0"\n'
        '      );\n'
        '    },\n'
        '  },\n'
        '});\n\n'
        '// Parallax texte hero (se deplace pendant le scrub)\n'
        'gsap.to(textRef, {\n'
        '  y: -120, opacity: 0,\n'
        '  ease: "none",\n'
        '  scrollTrigger: {\n'
        '    start: "top top", end: "+=200%", scrub: 1\n'
        '  },\n'
        '});'
    ))

    story.append(Spacer(1, 2*mm))
    story.append(spec_table(
        ['Propriete', 'Valeur', 'Detail'],
        [
            ['Hauteur section', '100vh (min 600px)', 'Pleine largeur, overflow hidden'],
            ['Durée pin', '300% (3x viewport)', 'Equivalent a 3 ecrans de scroll'],
            ['Frames', '86 images JPG', 'ezgif-frame-001.jpg a 086.jpg, public/frames/'],
            ['Scrub smoothness', '1.5', 'Interpolation douce entre frames'],
            ['Overlay', 'Gradient 105deg', '92% dark a 15% transparent (gauche-droite)'],
            ['Texte parallax', 'y: -120, opacity: 0', 'Disparait progressivement pendant le scrub'],
        ]
    ))

    story.append(Spacer(1, 5*mm))

    # --- ScrubMorphText ---
    story.append(gold_header('02. SCRUB MORPH TEXT - Morphing Philosophie', 'SECTION'))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        'Cette section affiche une sequence de 4 mots (REPAIR, RESTORE, TRANSFORM, REBIRTH) qui se transforment '
        'les uns dans les autres au fur et a mesure du defilement. Le section est egalement pinnee, creant une '
        'experience de morphing fluide. Chaque mot apparait avec un effet de scale, blur et deplacement vertical. '
        'Un fond de blobs morphing animees en SVG ajoute de la profondeur visuelle.', style_body))

    story.append(animation_box(
        'GSAP SCROLLTRIGGER - ScrubMorphText',
        'ScrollTrigger.create({\n'
        '  trigger: section,\n'
        '  start: "top top",\n'
        '  end: "+=300%",   // Pin 3x viewport\n'
        '  pin: true,\n'
        '  scrub: 1,\n'
        '  onUpdate: (self) => {\n'
        '    progress = self.progress;\n'
        '    wordIndex = floor(progress * 4);\n'
        '    wordProgress = progress * 4 - wordIndex;\n\n'
        '    // Active: scale 1->1.5, blur 0->10\n'
        '    // Next: opacity fade in, scale 1.3->1\n'
        '    // Past: opacity 0, scale 0.8, y: 80\n'
        '  },\n'
        '});\n\n'
        '// Background: 5 morphing SVG blobs\n'
        '// requestAnimationFrame loop with smoothPath()'
    ))

    story.append(Spacer(1, 2*mm))
    story.append(spec_table(
        ['Propriete', 'Valeur', 'Detail'],
        [
            ['Sequence', 'REPAIR > RESTORE > TRANSFORM > REBIRTH', '4 mots, morphing continu'],
            ['Morph effects', 'scale, opacity, y, filter blur', 'Transition douce entre chaque mot'],
            ['Progress bar', 'scaleX(progress) gold', 'Barre de progression sous les mots'],
            ['Background', '5 SVG blobs morphing', 'generateBlob() + smoothPath(), blur 40px'],
            ['Dernier mot couleur', '#D4AF37 (or)', 'REBIRTH en doré pour accent final'],
        ]
    ))

    story.append(PageBreak())

    # --- TrustLogos ---
    story.append(gold_header('03. TRUST LOGOS - Marques de Confiance', 'SECTION'))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        'Section de confiance sur fond clair affichant 5 logos de marques automobiles premium : Mercedes, Porsche, '
        'Range Rover, Audi et BMW. Chaque logo est rendu en SVG inline avec un style minimaliste (traits fins, '
        'monochrome). Les logos apparaissent avec une animation stagger de type fade-up au scroll.', style_body))

    story.append(animation_box(
        'GSAP ANIMATIONS - TrustLogos',
        '// Header fade-in\n'
        'gsap.from(".trust-label", {\n'
        '  y: 20, opacity: 0, duration: 0.8,\n'
        '  ease: "power3.out",\n'
        '  scrollTrigger: { start: "top 90%" },\n'
        '});\n\n'
        '// Logos stagger fade-up\n'
        'gsap.utils.toArray(".trust-logo").forEach((logo, i) => {\n'
        '  gsap.from(logo, {\n'
        '    y: 30, opacity: 0, duration: 0.6,\n'
        '    delay: i * 0.08,    // 80ms stagger\n'
        '    ease: "power3.out",\n'
        '  });\n'
        '});'
    ))

    story.append(Spacer(1, 5*mm))

    # --- StatsSection ---
    story.append(gold_header('04. STATS SECTION - Chiffres Cles', 'SECTION'))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        'Section de statistiques sur fond clair avec 4 compteurs animes liees au defilement. Chaque compteur '
        's\'incremente de 0 a sa valeur cible au fur et a mesure que l\'utilisateur scrolle. Les compteurs '
        'utilisent GSAP scrub pour une progression fluide liee au scroll plutot qu\'une animation timee.',
        style_body))

    story.append(animation_box(
        'GSAP SCRUB COUNTERS - StatsSection',
        'gsap.to(obj, {\n'
        '  val: target,        // 350 / 12 / 98 / 24\n'
        '  ease: "none",\n'
        '  scrollTrigger: {\n'
        '    trigger: container,\n'
        '    start: "top 90%",\n'
        '    end: "top 30%",   // 60% de viewport de scroll\n'
        '    scrub: 1.5,\n'
        '    onUpdate: () => {\n'
        '      counter.textContent = round(obj.val);\n'
        '    },\n'
        '  },\n'
        '});'
    ))

    story.append(Spacer(1, 2*mm))
    story.append(spec_table(
        ['Compteur', 'Cible', 'Suffixe', 'Label'],
        [
            ['Voitures transformees', '350', '+', '350+ voitures'],
            ['Annees d\'expertise', '12', '', '12 ans'],
            ['Clients satisfaits', '98', '%', '98% satisfaction'],
            ['Delai moyen devis', '24', 'h', 'Reponse sous 24h'],
        ]
    ))

    story.append(PageBreak())

    # --- Services ---
    story.append(gold_header('05. SERVICES - 6 Cartes Premium', 'SECTION'))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        'Grille de 6 services automobiles sur fond sombre. Chaque carte contient une image, une icone Lucide, '
        'un titre, une description et un lien "En savoir plus". Les cartes apparaissent avec un stagger GSAP '
        'et reagissent au hover avec une bordure dorée et un zoom subtil sur l\'image.', style_body))

    story.append(spec_table(
        ['#', 'Service', 'Icone Lucide', 'Sous-titre'],
        [
            ['01', 'Carrosserie Premium', 'Shield', 'RESTAURATION'],
            ['02', 'Peinture Showroom', 'Palette', 'APPLICATION'],
            ['03', 'Polish Detailing', 'Sparkles', 'PROTECTION'],
            ['04', 'Restauration Complete', 'RefreshCw', 'TRANSFORMATION'],
            ['05', 'Jantes Premium', 'CircleDot', 'PERSONNALISATION'],
            ['06', 'Cuir Interieur', 'Armchair', 'SELLERIE'],
        ]
    ))

    story.append(animation_box(
        'GSAP ANIMATIONS - Services',
        '// Header animation\n'
        'gsap.from(".services-header-title", {\n'
        '  y: 60, opacity: 0, duration: 1,\n'
        '  ease: "power3.out",\n'
        '});\n\n'
        '// Cards stagger\n'
        'gsap.utils.toArray(".service-card").forEach((card, i) => {\n'
        '  gsap.from(card, {\n'
        '    y: 80, opacity: 0, duration: 0.8,\n'
        '    delay: i * 0.1,    // 100ms stagger\n'
        '    ease: "power3.out",\n'
        '  });\n'
        '});\n\n'
        '// Hover: borderColor = rgba(212,175,55,0.2)\n'
        '// Image: scale(1.05) transition 700ms'
    ))

    story.append(Spacer(1, 5*mm))

    # --- BeforeAfter ---
    story.append(gold_header('06. BEFORE/AFTER - Slider Interactif + Video', 'SECTION'))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        'Section de demonstration avant/apres avec un slider interactif (drag souris/touch). Le curseur en or '
        'permet de comparer l\'etat initial et le resultat de la renovation. En fond, une video en boucle montre '
        'le processus de travail avec un effet de parallax lie au scroll et un filtre sombre.', style_body))

    story.append(animation_box(
        'GSAP + INTERACTIONS - BeforeAfter',
        '// Video parallax (scroll-linked)\n'
        'gsap.to(video, {\n'
        '  scale: 1.05, y: -60,\n'
        '  scrollTrigger: {\n'
        '    start: "top bottom", end: "bottom top", scrub: 1\n'
        '  },\n'
        '});\n\n'
        '// Reveal animation\n'
        'gsap.fromTo(".ba-container",\n'
        '  { clipPath: "polygon(0 100%, 0 100%, 0 100%, 0 100%)" },\n'
        '  { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",\n'
        '    duration: 1.5, ease: "power4.inOut" }\n'
        ');\n\n'
        '// Slider: mousedown/touchstart -> track clientX\n'
        '// clipPath: inset(0 ${100-pos}% 0 0) on after image'
    ))

    story.append(PageBreak())

    # --- CTA ---
    story.append(gold_header('07. CTA - Appel a Action', 'SECTION'))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        'Section d\'appel a l\'action sur fond clair. Le titre "Votre voiture merite le meilleur" utilise le composant '
        'SplitText pour une animation lettre par lettre au scroll. Le bouton WhatsApp est enveloppe dans un composant '
        'Magnetic qui suit le curseur avec un effet elastique au retour. Des lignes decoratives verticales apparaissent '
        'avec un stagger GSAP.', style_body))

    story.append(animation_box(
        'SPLITTEXT + MAGNETIC - CTA',
        '// SplitText: decoupe en mots, ScrollTrigger fade-up\n'
        'gsap.from(elements, {\n'
        '  y: 50, opacity: 0,\n'
        '  stagger: 0.08,   // 80ms entre chaque mot\n'
        '  duration: 0.9,\n'
        '  ease: "power3.out",\n'
        '  scrollTrigger: { start: "top 85%" },\n'
        '});\n\n'
        '// Magnetic button: suit le curseur\n'
        'gsap.to(el, {\n'
        '  x: (mouseX - centerX) * 0.3,\n'
        '  y: (mouseY - centerY) * 0.3,\n'
        '  duration: 0.4, ease: "power2.out"\n'
        '});\n'
        '// Return: elastic.out(1, 0.4)'
    ))

    story.append(Spacer(1, 5*mm))

    # --- Footer ---
    story.append(gold_header('08. CINEMATIC FOOTER - Curtain Reveal', 'SECTION'))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        'Le footer utilise un systeme de curtain reveal sophistique : un espaceur de 60vh declenche l\'apparition du '
        'footer qui est fixe en bas de l\'ecran. Le reveal se fait via clip-path anime (inset 100% > 0%). En arriere-plan, '
        'le texte "BACHIR" géant (15vw) avec un effet aurora doré pulsant. Les elements internes apparaissent avec un '
        'stagger scrub, et les pills de services reagissent au curseur comme des boutons magnetiques.', style_body))

    story.append(animation_box(
        'CINEMATIC FOOTER - Curtain + BACHIR + Marquee',
        '// Curtain reveal (clip-path)\n'
        'gsap.timeline({\n'
        '  scrollTrigger: {\n'
        '    trigger: spacer,    // 60vh spacer\n'
        '    start: "top bottom", end: "bottom bottom",\n'
        '    scrub: 1.5,\n'
        '  },\n'
        '}).fromTo(revealWrapper,\n'
        '  { clipPath: "inset(100% 0 0 0)" },\n'
        '  { clipPath: "inset(0% 0 0 0)", ease: "none" }\n'
        ');\n\n'
        '// Giant BACHIR parallax\n'
        'gsap.to(bachirText, { y: -120, scrub: 1.2 });\n\n'
        '// Aurora glow breathing (infinite)\n'
        'gsap.to(aurora, {\n'
        '  scale: 1.15, opacity: 0.25,\n'
        '  duration: 4, ease: "sine.inOut",\n'
        '  yoyo: true, repeat: -1\n'
        '});\n\n'
        '// Stagger reveal des elements internes\n'
        '// Infinite GSAP marquee pour les services\n'
        '// Magnetic pills sur les boutons de service'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 06 - TRANSITION SYSTEM
    # ══════════════════════════════════════
    story.extend(section_title('06', 'Systeme de Transitions'))

    story.append(Paragraph(
        'Le site utilise deux types de transitions pour passer entre les zones sombres et claires. Chaque transition '
        'a une hauteur fixe de 35vh et utilise GSAP ScrollTrigger en mode scrub pour une animation fluide liee au '
        'defilement. Les transitions cree une separation nette mais elegante entre les differents "mondes" visuels du site.',
        style_body))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('SCRUB TRANSITION - WIPE avec Glow Dore', style_h2))
    story.append(Paragraph(
        'Le WIPE est une transition de type "rideau" ou un overlay de la couleur source se deplace vers le haut '
        'pour reveler la couleur destination. Une ligne dorée avec un effet de glow (box-shadow) marque la frontiere '
        'entre les deux couleurs, creant un effet de lumiere premium. Le feathering (gradient transparent) ajoute '
        'de la douceur a la transition.', style_body))

    story.append(animation_box(
        'SCRUB TRANSITION - GSAP Timeline',
        '// Props: direction = "dark-to-light" | "light-to-dark"\n\n'
        'const tl = gsap.timeline({\n'
        '  scrollTrigger: {\n'
        '    trigger: wrapper,       // 35vh height\n'
        '    start: "top bottom",\n'
        '    end: "bottom top",\n'
        '    scrub: 2.0,             // Slow scrub\n'
        '  },\n'
        '});\n\n'
        '// Overlay slides up to reveal new color\n'
        'tl.to(overlay, { yPercent: -100, ease: "none" }, 0);\n\n'
        '// Feather edge fades out\n'
        'tl.to(feather, { opacity: 0 }, 0.6);\n\n'
        '// Gold glow line fades out\n'
        'tl.to(glow, { opacity: 0 }, 0.7);'
    ))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('CLIP PATH TRANSITION - Cercle Dore Expand', style_h2))
    story.append(Paragraph(
        'La ClipPathTransition utilise un cercle doré qui s\'etend depuis le centre de l\'ecran pour reveler la '
        'zone sombre. Un anneau doré avec un fort glow apparait en premier, suivi d\'un pulse lumineux, puis le '
        'cercle s\'ouvre progressivement. Cette transition cree un effet de "portal" entre les zones claires et sombres.',
        style_body))

    story.append(animation_box(
        'CLIP PATH TRANSITION - GSAP Timeline',
        'const tl = gsap.timeline({\n'
        '  scrollTrigger: {\n'
        '    trigger: wrapper,   // 35vh height\n'
        '    start: "top bottom", end: "bottom top",\n'
        '    scrub: 2,\n'
        '  },\n'
        '});\n\n'
        '// Pulse glow appears and fades\n'
        'tl.fromTo(pulse,\n'
        '  { opacity: 0, scale: 0 },\n'
        '  { opacity: 0.6, scale: 1, duration: 0.4 }, 0\n'
        ').fromTo(pulse, { opacity: 0 }, { duration: 0.3 }, 0.4\n\n'
        '// Gold ring expands\n'
        'tl.fromTo(ring,\n'
        '  { scale: 0, opacity: 1 },\n'
        '  { scale: 1, opacity: 1, duration: 0.5 }, 0\n'
        ').to(ring, { opacity: 0, duration: 0.35 }, 0.6\n\n'
        '// Circle clip-path expands from 0% to 150%\n'
        'tl.fromTo(circle,\n'
        '  { clipPath: "circle(0% at 50% 50%)" },\n'
        '  { clipPath: "circle(150% at 50% 50%)", duration: 0.85 }, 0.15\n'
        ');'
    ))

    story.append(Spacer(1, 3*mm))
    story.append(spec_table(
        ['Propriete', 'WIPE Transition', 'ClipPath Transition'],
        [
            ['Hauteur', '35vh', '35vh'],
            ['Scrub speed', '2.0 (lent)', '2.0 (lent)'],
            ['Methode', 'yPercent overlay + glow', 'clip-path circle + ring + pulse'],
            ['Effet visuel', 'Rideau horizontal + ligne dorée', 'Cercle portal + halo lumineux'],
            ['Gold element', 'Ligne + box-shadow glow', 'Anneau + pulse radial gradient'],
            ['Utilisations', 'Dark>Light (x2), Light>Dark (x1)', 'Light>Dark (x1, apres Stats)'],
        ]
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 07 - REUSABLE COMPONENTS
    # ══════════════════════════════════════
    story.extend(section_title('07', 'Composants UI Reutilisables'))

    story.append(Paragraph(
        'Ces composants sont des briques generiques utilisees a travers le site. Ils encapsulent des patterns '
        'd\'animation courants et peuvent etre reutilises dans d\'autres projets avec des props configurables.',
        style_body))

    story.append(Spacer(1, 3*mm))
    story.append(Paragraph('SPLITTEXT - Animation Lettre par Lettre', style_h2))
    story.append(Paragraph(
        'Decoupe un texte en elements individuels (mots ou caracteres) et les anime avec un effet de fade-up '
        'stagger declenche au scroll via ScrollTrigger. Utilise le composant natif React avec ref pour selectionner '
        'les elements ".split-el" et leur appliquer l\'animation GSAP.', style_body))

    story.append(animation_box(
        'SplitText - Props et Animation',
        '// Props: as, children, splitBy, stagger, duration, y\n\n'
        'interface SplitTextProps {\n'
        '  as?: React.ElementType;  // "h2", "p", "span"\n'
        '  children: string;         // Texte a animer\n'
        '  splitBy?: "chars" | "words";\n'
        '  stagger?: number;         // 0.05 par defaut\n'
        '  duration?: number;        // 0.8 par defaut\n'
        '  y?: number;               // 40px par defaut\n'
        '}\n\n'
        '// Implementation:\n'
        'gsap.from(".split-el", {\n'
        '  y, opacity: 0, stagger, duration,\n'
        '  ease: "power3.out",\n'
        '  scrollTrigger: { trigger, start: "top 85%" },\n'
        '});'
    ))

    story.append(Spacer(1, 3*mm))
    story.append(Paragraph('MAGNETIC - Boutons Magnetiques', style_h2))
    story.append(Paragraph(
        'Enveloppe un enfant dans un conteneur qui suit le curseur de la souris avec une force configurable. '
        'Au mouseleave, l\'element revient a sa position originale avec un effet elastique. Utilise directement '
        'les event listeners natifs pour une performance optimale.', style_body))

    story.append(animation_box(
        'Magnetic - Props et Animation',
        '// Props: strength (0.3), children, className\n\n'
        '// Mouse move: suit le curseur\n'
        'gsap.to(el, {\n'
        '  x: (mouseX - centerX) * strength,\n'
        '  y: (mouseY - centerY) * strength,\n'
        '  duration: 0.4, ease: "power2.out"\n'
        '});\n\n'
        '// Mouse leave: elastic return\n'
        'gsap.to(el, {\n'
        '  x: 0, y: 0,\n'
        '  duration: 0.7,\n'
        '  ease: "elastic.out(1, 0.4)"  // Spring effect\n'
        '});'
    ))

    story.append(Spacer(1, 3*mm))
    story.append(Paragraph('CARD STACK - Eventail 3D', style_h2))
    story.append(Paragraph(
        'Systeme d\'eventail 3D pour afficher des cartes empilees. Les cartes sont disposees avec un decalage '
        'en X, Y et rotation proportionnel a leur distance de la carte active. Supporte le drag tactile et '
        'l\'autoplay avec un intervalle configurable.', style_body))

    story.append(animation_box(
        'CardStack - Arrangement 3D',
        'cards.forEach((card, i) => {\n'
        '  offset = i - activeIndex;\n'
        '  absOffset = Math.abs(offset);\n\n'
        '  gsap.to(card, {\n'
        '    x: offset * 60,       // Decalage horizontal\n'
        '    y: offset * 20,       // Decalage vertical\n'
        '    rotation: offset * 3, // Rotation subtile\n'
        '    scale: 1 - absOffset * 0.05,\n'
        '    opacity: 1 - absOffset * 0.25,\n'
        '    zIndex: length - absOffset,\n'
        '    duration: 0.6, ease: "power3.out"\n'
        '  });\n'
        '});\n\n'
        '// Autoplay: setInterval(activeIndex++)\n'
        '// Touch: swipe gauche/droite pour naviguer'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 08 - PERFORMANCE & DEPLOYMENT
    # ══════════════════════════════════════
    story.extend(section_title('08', 'Performance et Deploiement'))

    story.append(Paragraph(
        'Le site est optimise pour le deploiement sur Vercel avec une configuration Next.js adaptee. Les frames hero '
        'utilisent le chargement conditionnel (3 eager + 83 lazy). Le smooth scroll via Lenis est integre au GSAP '
        'ticker pour une synchronisation parfaite avec ScrollTrigger. Le preloader inclut un timeout de securite '
        'de 3 secondes pour garantir que le site reste accessible meme si les ressources mettent du temps a charger.',
        style_body))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('CONFIGURATION NEXT.JS', style_h2))

    story.append(animation_box(
        'next.config.ts - Configuration Vercel',
        'const nextConfig: NextConfig = {\n'
        '  typescript: { ignoreBuildErrors: true },\n'
        '  reactStrictMode: false,\n'
        '  images: { qualities: [75, 90] },\n'
        '};\n'
        '// NOTE: Pas de "output: standalone"\n'
        '// (incompatible avec le deploiement Vercel)'
    ))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('OPTIMISATIONS PERFORMANCE', style_h2))

    story.append(spec_table(
        ['Optimisation', 'Technique', 'Impact'],
        [
            ['Image loading', '3 eager + 83 lazy frames', 'Chargement initial rapide'],
            ['Safety timeout', 'Preloader 3s max', 'Site accessible meme si chargement lent'],
            ['SSR guards', 'typeof window checks', 'Pas d\'erreur server-side rendering'],
            ['ScrollTrigger cleanup', 'ctx.revert() on unmount', 'Pas de memory leaks'],
            ['Lenis + GSAP sync', 'gsap.ticker.add(lenis.raf)', 'Scroll fluide synchronise'],
            ['willChange hints', 'CSS willChange sur elements animes', 'GPU acceleration'],
            ['Scrub vs Time', 'Animations liees au scroll', 'Pas d\'animations actives en arriere-plan'],
            ['Dynamic imports', 'Lenis import dynamique', 'Code splitting pour le bundle initial'],
        ]
    ))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('PIPELINE DE DEPLOIEMENT', style_h2))
    story.append(Paragraph(
        'Le pipeline de deploiement est simple et automatise. Chaque push sur la branche main du repository GitHub '
        'declenche automatiquement un build Vercel. Le site est accessible a l\'adresse bachir-perfection.vercel.app. '
        'La configuration est configuree pour ne pas utiliser "output: standalone" qui est incompatible avec '
        'l\'environnement serverless de Vercel.', style_body))

    story.append(Spacer(1, 3*mm))
    story.append(spec_table(
        ['Etape', 'Commande/Outil', 'Detail'],
        [
            ['Development', 'next dev -p 3000', 'Serveur local avec Turbopack'],
            ['Build', 'next build', 'Compilation + optimisation Next.js'],
            ['Git', 'git push origin main', 'Push vers GitHub'],
            ['Vercel', 'Auto-deploy', 'Build + deploy automatique'],
            ['Domaine', 'bachir-perfection.vercel.app', 'URL de production'],
        ]
    ))

    # ─── Build PDF ───
    doc.build(story, onFirstPage=cover_page, onLaterPages=body_page)
    print(f'Blueprint PDF generated: {output_path}')
    return output_path


if __name__ == '__main__':
    path = build_pdf()
