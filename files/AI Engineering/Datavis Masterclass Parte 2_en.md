# 📊 Data Visualization Masterclass — Part 2

We will see how to choose the right chart, transform data, and other advanced techniques

**Context:** Educational notebook created for the advanced Data Analysis class for Mondadori.
**Prerequisite:** Having completed Part 1
**Dataset:** Same editorial dataset as Part 1

---

| Part | Content |
|-------|----------|
| **8** | The decision matrix: which chart for which objective |
| **9** | Data transformation for visualization |
| **10** | Advanced charts: Slope, Bump, Dumbbell, Waterfall, Waffle |
| **11** | Dashboard design: composing charts into a coherent view |
| **12** | Final exercise: brief → analysis → complete presentation |

---
# Setup:
Let's recreate the dataset from Part 1

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import matplotlib.dates as mdates
import matplotlib.patches as mpatches
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')
import plotly.express as px
import plotly.graph_objects as go

plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['figure.dpi'] = 100
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['axes.spines.top'] = False
plt.rcParams['axes.spines.right'] = False
sns.set_palette("husl")
np.random.seed(42)

GENERI = ['Narrativa','Thriller','Saggistica','Fantasy','Romance','Storico','Sci-Fi','Poesia','Bambini','Young Adult']
COLLANE = ['Oscar Mondadori','Strade Blu','Contemporanea','Chrysalide','Omnibus','Piccoli Brividi','Classici Moderni','Voci']
FORMATI = ['Cartaceo','Ebook','Audiolibro']
CANALI = ['Libreria fisica','Amazon','E-commerce proprio','GDO','Fiere/Eventi']
GW = {'Narrativa':.22,'Thriller':.18,'Saggistica':.15,'Fantasy':.10,'Romance':.09,'Storico':.08,'Sci-Fi':.06,'Poesia':.02,'Bambini':.05,'Young Adult':.05}
n_libri=500; n_mesi=24
libri = pd.DataFrame({'libro_id':range(1,n_libri+1),'titolo':[f"Titolo_{i:03d}" for i in range(1,n_libri+1)],
    'genere':np.random.choice(list(GW.keys()),n_libri,p=list(GW.values())),'collana':np.random.choice(COLLANE,n_libri),
    'anno_pubblicazione':np.random.choice(range(2018,2025),n_libri,p=[.05,.05,.08,.10,.15,.25,.32]),
    'pagine':np.random.normal(280,80,n_libri).astype(int).clip(80,800),
    'prezzo_copertina':np.round(np.random.uniform(9.90,24.90,n_libri),2),
    'rating_goodreads':np.round(np.random.normal(3.7,0.5,n_libri).clip(1.5,5.0),1),
    'n_recensioni':np.random.exponential(150,n_libri).astype(int).clip(5,5000)})
libri.loc[libri['genere']=='Thriller','prezzo_copertina'] *= 1.1
libri.loc[libri['genere']=='Narrativa','prezzo_copertina'] *= 1.05
libri.loc[libri['genere']=='Poesia','prezzo_copertina'] *= 0.8
libri['prezzo_copertina'] = libri['prezzo_copertina'].round(2)
date_range = pd.date_range('2023-01-01',periods=n_mesi,freq='MS')
recs = []
for _,libro in libri.iterrows():
    base={'Narrativa':120,'Thriller':150,'Saggistica':80,'Fantasy':90,'Romance':70,'Storico':50,'Sci-Fi':45,'Poesia':15,'Bambini':60,'Young Adult':55}[libro['genere']]
    lm=np.random.lognormal(0,0.8)
    for i,data in enumerate(date_range):
        m=data.month;stag={12:1.8,11:1.3,6:1.2,7:1.2,1:0.7,2:0.7}.get(m,1.0)
        trend={'Thriller':1+i*0.015,'Fantasy':1+i*0.01,'Young Adult':1+i*0.012,'Poesia':1-i*0.008,'Saggistica':1-i*0.003}.get(libro['genere'],1.0)
        for fmt in FORMATI:
            fs={'Cartaceo':0.55,'Ebook':0.30,'Audiolibro':0.15}[fmt]
            if fmt=='Ebook':fs*=(1+i*0.005)
            if fmt=='Audiolibro':fs*=(1+i*0.02)
            copie=max(0,int(base*lm*stag*trend*fs*np.random.lognormal(0,0.3)))
            if copie>0:
                recs.append({'libro_id':libro['libro_id'],'data':data,'formato':fmt,'canale':np.random.choice(CANALI,p=[.30,.35,.15,.12,.08]),'copie_vendute':copie,'ricavo':round(copie*libro['prezzo_copertina']*{'Cartaceo':1,'Ebook':.65,'Audiolibro':.55}[fmt],2)})
vendite=pd.DataFrame(recs)
df=vendite.merge(libri,on='libro_id',how='left')
df['anno']=df['data'].dt.year;df['trimestre']=df['data'].dt.to_period('Q').astype(str)
print(f"Dataset: {len(df):,} record")
```

```text
Dataset: 35,904 record
```

---
# The Decision Matrix

The chart is not chosen for aesthetics, it is chosen for a communicative objective.

Every time you are faced with a dataset, the first question is not "what chart should I make?" but "what do I want the reader to understand?". The answer often falls into one of these five objectives: comparison (who is bigger?), trend (how does it change over time?), distribution (how are the values distributed?), composition (what is the weight of each part on the whole?), relationship (do two variables move together?).

The second parameter is the number of elements: a comparison between 3 genres calls for a vertical bar chart, a comparison between 15 calls for a horizontal one, between 40 a lollipop. The scale changes readability, not just aesthetics.

## The 5 communication objectives

| # | Objective | Key question | Recommended charts |
|---|-----------|---------------|-------------------|
| 1 | **Comparison** | Which is bigger? | Bar, Lollipop |
| 2 | **Trend** | How does it change over time? | Line, Area, Slope |
| 3 | **Distribution** | How are they spread? | Histo, Box, Violin |
| 4 | **Composition** | What makes up the total? | Stacked bar, Treemap, Waffle |
| 5 | **Relationship** | Are X and Y linked? | Scatter, Bubble, Heatmap |

## Editorial scenarios

| Business question | Objective | Chart |
|---------------------|-----------|--------|
| Which genre sells the most? | Comparison | Horizontal bar |
| Sales going up or down? | Trend | Line chart |
| How much does digital weigh? | Composition | Stacked bar 100% |
| Price-sales link? | Relationship | Scatter plot |
| Uniform prices across genres? | Distribution | Box plot |
| How does genre share change? | Trend+Composition | Stacked area |
| Who gained share? | Comparison (delta) | **Slope chart** |
| Who overtakes whom? | Trend+Ranking | **Bump chart** |

The `suggerisci_grafico(obiettivo, n)` function formalizes these rules in code: not to replace judgment, but to make explicit the reasoning that usually remains implicit. Use it as a checklist, not as an oracle.

```python
# Chart suggestion function
def suggerisci_grafico(obiettivo, n=None):
    """Suggests the best chart."""
    rules = {
        'confronto':[(1,5,'Vertical bar'),(6,15,'Horizontal bar'),(16,50,'Lollipop'),(51,999,'Treemap')],
        'andamento':[(1,3,'Line chart'),(4,7,'Line+highlight'),(8,999,'Small multiples')],
        'distribuzione':[(1,1,'Histogram+KDE'),(2,5,'Box/Violin'),(6,999,'Ridge plot')],
        'relazione':[(2,2,'Scatter'),(3,3,'Bubble'),(4,999,'Heatmap')]
    }
    print(f"\n{'='*40}\n  OBJECTIVE: {obiettivo.upper()}\n{'='*40}")
    if obiettivo=='composizione':
        print('  Static -> Stacked bar 100%'); print('  Temporal -> Stacked area'); return
    if n and obiettivo in rules:
        for lo,hi,chart in rules[obiettivo]:
            if lo<=n<=hi: print(f'  With {n} elements -> {chart}'); return chart

suggerisci_grafico('confronto', 10)
suggerisci_grafico('andamento', 2)
suggerisci_grafico('distribuzione', 4)
suggerisci_grafico('composizione')
suggerisci_grafico('relazione', 2)
```

```text

========================================
  OBJECTIVE: CONFRONTO
========================================
  With 10 elements -> Horizontal bar

========================================
  OBJECTIVE: ANDAMENTO
========================================
  With 2 elements -> Line chart

========================================
  OBJECTIVE: DISTRIBUZIONE
========================================
  With 4 elements -> Box/Violin

========================================
  OBJECTIVE: COMPOSIZIONE
========================================
  Static -> Stacked bar 100%
  Temporal -> Stacked area

========================================
  OBJECTIVE: RELAZIONE
========================================
  With 2 elements -> Scatter
```

```text
'Scatter'
```

---
# Data Transformation

Raw data often lies by omission: not because it's wrong, but because the scale or form in which you present it hides what's behind it.

Transformations do not alter the data, but remove the visual noise that prevents seeing it.

- **Log scale**: book revenues follow an extreme Pareto distribution: a few bestsellers, a very long tail of low-selling titles. On a linear scale, 90% of books are compressed to the left and nothing is visible. The logarithmic scale expands low values and reveals the real structure of the distribution.
> **Practical rule**: if skewness is $>2$, consider a log scale or report the median instead of the mean.
- **Moving average**: monthly sales data is noisy by definition: seasonality, promotions, timely releases. The moving average separates signal from noise. At 3 months it is reactive but still noisy; at 6 months it reveals the structural trend. Use them together: the gray area shows real volatility, the red line tells where the market is going.
- **% MoM vs YoY change**: month-over-month change amplifies seasonality and is good for operational monitoring. Year-over-year change eliminates it by definition and is what interests management: are we growing compared to the same period last year? Simple rule: YoY for executives, MoM for those managing operations week by week.
- **Binning**: transforming a continuous variable (price, revenue) into categories (low/medium/high band) allows for building actionable segments. The choice of breakpoints is not neutral: bins of equal width work on symmetric distributions; quantile bins work better on skewed distributions like editorial revenues.

**Golden rule**: always transform before visualizing, not instead of visualizing. Transformation is a step in analytical reasoning, not a graphical trick.

| Transformation | When | Effect |
|---------------|--------|--------|
| **Normalization (%)** | Different scales | Comparable |
| **Log scale** | Skewed | Expands low values |
| **Moving Average** | Noise | Shows trend |
| **% Change** | Change | Focus on delta |
| **Binning** | Continuous->categ. | Creates groups |

> 📌 Pareto Distribution (80/20 rule)
> A distribution is called "Pareto-like" when a small minority of elements produces the vast majority of the result.

In publishing: typically 20% of titles generate 80% of revenue. It is not a physical law, but a surprisingly stable empirical pattern in many markets — music, app stores, e-commerce.

The visual consequence is a strongly right-skewed distribution: many low values clustered on the left, very few very high values stretching the tail to the right. This is why the mean is a misleading indicator in these contexts — a single bestseller can shift it enormously — and the median or logarithmic scale become essential tools.

## Log scale

```python
# LOG SCALE
libro_ricavi = df.groupby('libro_id')['ricavo'].sum()
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 5))
ax1.hist(libro_ricavi.values/1000, bins=50, color='#3498db', edgecolor='white', alpha=0.8)
ax1.set_title('LINEAR SCALE: 90% compressed', fontsize=12, fontweight='bold', loc='left')
ax1.set_xlabel('Revenue (EUR K)')
ax2.hist(np.log10(libro_ricavi.values.clip(1)), bins=50, color='#e74c3c', edgecolor='white', alpha=0.8)
ax2.set_title('LOG10 SCALE: real distribution', fontsize=12, fontweight='bold', loc='left')
ax2.set_xlabel('log10(Revenue)')
ax2.axvline(np.log10(libro_ricavi.median()), color='#2c3e50', linestyle='--', linewidth=2)
for ax in [ax1,ax2]: ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout(); plt.show()
print(f'Skewness: {libro_ricavi.skew():.1f} (>2 = very skewed -> use log or median)')
```

![Notebook output 1](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-01.png)

```text
Skewness: 3.9 (>2 = very skewed -> use log or median)
```

## Moving average

```python
# MOVING AVERAGE
vt = df.groupby('data')['copie_vendute'].sum()/1000
fig, ax = plt.subplots(figsize=(14, 6))
ax.plot(vt.index, vt.values, color='#bdc3c7', linewidth=1, alpha=0.7, label='Monthly data')
for w,c,s in [(3,'#3498db','--'),(6,'#e74c3c','-')]:
    ma = vt.rolling(w,center=True).mean()
    ax.plot(ma.index, ma.values, color=c, linewidth=2.5, linestyle=s, label=f'MA {w} months')
ax.set_title('6-month MA reveals the hidden trend', fontsize=13, fontweight='bold', loc='left', pad=15)
ax.set_ylabel('Copies (K)'); ax.legend(loc='upper left')
ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y')); plt.xticks(rotation=30)
plt.tight_layout(); plt.show()
```

![Notebook output 2](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-02.png)

## % Change: MoM vs YoY

```python
# MoM vs YoY
rm = df.groupby('data')['ricavo'].sum()
fig, (ax1,ax2) = plt.subplots(2,1,figsize=(14,8),sharex=True)
mom = rm.pct_change()*100
cm = ['#27ae60' if v>=0 else '#e74c3c' for v in mom.values[1:]]
ax1.bar(mom.index[1:],mom.values[1:],color=cm,width=20,alpha=0.8); ax1.axhline(0,color='#2c3e50',linewidth=0.8)
ax1.set_title('MoM: high volatility = seasonality',fontsize=12,fontweight='bold',loc='left'); ax1.set_ylabel('%')
yoy_s = rm.pct_change(12)*100; vy = yoy_s.dropna()
cy = ['#27ae60' if v>=0 else '#e74c3c' for v in vy.values]
ax2.bar(vy.index,vy.values,color=cy,width=20,alpha=0.8); ax2.axhline(0,color='#2c3e50',linewidth=0.8)
ax2.set_title('YoY: shows the real trend without seasonality',fontsize=12,fontweight='bold',loc='left'); ax2.set_ylabel('%')
for ax in [ax1,ax2]: ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
plt.tight_layout(); plt.show()
print('Rule: YoY for executives, MoM for operational monitoring.')
```

![Notebook output 3](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-03.png)

```text
Rule: YoY for executives, MoM for operational monitoring.
```

## Binning

```python
# BINNING
lp = df.groupby('libro_id').agg(ricavo_tot=('ricavo','sum'),genere=('genere','first')).reset_index()
lp['seg'] = pd.cut(lp['ricavo_tot'],bins=[0,5000,20000,100000,float('inf')],labels=['Flop (<5K)','Medio (5-20K)','Buono (20-100K)','Bestseller (>100K)'])
fig,(ax1,ax2)=plt.subplots(1,2,figsize=(16,6))
sc=lp['seg'].value_counts().sort_index(); cs=['#e74c3c','#f39c12','#3498db','#27ae60']
bars=ax1.bar(range(len(sc)),sc.values,color=cs); ax1.set_xticks(range(len(sc))); ax1.set_xticklabels(sc.index,fontsize=9)
for b,v in zip(bars,sc.values): ax1.text(b.get_x()+b.get_width()/2,v+5,f'{v} ({v/len(lp)*100:.0f}%)',ha='center',fontsize=10,fontweight='bold')
ax1.set_title('Libri per segmento',fontsize=12,fontweight='bold',loc='left')
sr=lp.groupby('seg')['ricavo_tot'].sum().sort_index()/1e6
bars2=ax2.bar(range(len(sr)),sr.values,color=cs); ax2.set_xticks(range(len(sr))); ax2.set_xticklabels(sr.index,fontsize=9)
for b,v in zip(bars2,sr.values): ax2.text(b.get_x()+b.get_width()/2,v+0.2,f'EUR {v:.1f}M',ha='center',fontsize=10,fontweight='bold')
ax2.set_title('Pochi bestseller = quasi tutto il fatturato',fontsize=12,fontweight='bold',loc='left')
for ax in [ax1,ax2]: ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
plt.tight_layout(); plt.show()
```

![Notebook output 4](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-04.png)

---
# Advanced charts
The charts from the previous parts cover 90% of cases. This part covers the 10% where you need to communicate something specific that standard charts don't do well: variations between two points in time, ranking evolutions, growth decompositions, intuitive compositions.

## Slope Chart: the before and after
This is the right chart when you have exactly two moments (2023 → 2024) and want to show who went up and who went down. A line chart with only two points per category. Its strength lies in its simplicity: the slope of the line is immediately readable, and the color (green/red) adds a layer of judgment without words. Use it instead of a grouped bar chart when movement matters more than absolute value.

```python
# SLOPE CHART: Quota 2023 vs 2024
r23=df[df['anno']==2023].groupby('genere')['ricavo'].sum()
r24=df[df['anno']==2024].groupby('genere')['ricavo'].sum()
sh23=(r23/r23.sum()*100).sort_values(ascending=False); sh24=r24/r24.sum()*100
fig,ax=plt.subplots(figsize=(10,8))
for g in sh23.index:
    v1,v2=sh23[g],sh24[g]; d=v2-v1
    c='#27ae60' if d>0.5 else '#e74c3c' if d<-0.5 else '#bdc3c7'
    ax.plot([0,1],[v1,v2],'o-',color=c,linewidth=2.5,markersize=8)
    ax.text(-0.05,v1,f'{g} ({v1:.1f}%)',ha='right',va='center',fontsize=10,fontweight='bold',color=c)
    ax.text(1.05,v2,f'{v2:.1f}% ({d:+.1f})',ha='left',va='center',fontsize=10,fontweight='bold',color=c)
ax.set_xlim(-0.4,1.4);ax.set_xticks([0,1]);ax.set_xticklabels(['2023','2024'],fontsize=14,fontweight='bold')
ax.set_title('Slope: chi guadagna e chi perde quota',fontsize=14,fontweight='bold',loc='left',pad=15)
for sp in ['top','right','bottom','left']:ax.spines[sp].set_visible(False)
ax.yaxis.set_visible(False)
plt.tight_layout();plt.show()
```

![Notebook output 5](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-05.png)

## Bump Chart: ranking evolution
This is like a slope chart, but over $N$ periods and with ranking instead of absolute values. It answers the question "who overtakes whom over time?" in a much more readable way than a table or a line chart with absolute values. The inverted Y-axis (1 at the top) is counter-intuitive to build but natural to read.

```python
# BUMP CHART: Ranking per trimestre
tr=df.groupby(['trimestre','genere'])['ricavo'].sum().reset_index()
tr['rank']=tr.groupby('trimestre')['ricavo'].rank(ascending=False,method='min')
top6=df.groupby('genere')['ricavo'].sum().nlargest(6).index
bd=tr[tr['genere'].isin(top6)]
fig,ax=plt.subplots(figsize=(14,7))
pal=dict(zip(top6,['#e74c3c','#2c3e50','#3498db','#27ae60','#f39c12','#9b59b6']))
trimestri=sorted(bd['trimestre'].unique())
for g in top6:
    gd=bd[bd['genere']==g].set_index('trimestre').reindex(trimestri)
    y=gd['rank'].values
    ax.plot(range(len(trimestri)),y,'o-',color=pal[g],linewidth=3,markersize=10,zorder=3)
    ax.text(len(trimestri)-0.7,y[-1],f'  {g}',va='center',fontsize=11,fontweight='bold',color=pal[g])
ax.set_xticks(range(len(trimestri)));ax.set_xticklabels(trimestri,fontsize=10,rotation=30)
ax.set_yticks(range(1,7));ax.set_ylabel('Posizione');ax.invert_yaxis()
ax.set_title('Thriller stabile #1, Fantasy scala',fontsize=14,fontweight='bold',loc='left',pad=15)
ax.grid(axis='y',alpha=0.3)
plt.tight_layout();plt.show()
```

![Notebook output 6](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-06.png)

## Waterfall Chart: decomposing change
This chart breaks down a total change into its positive and negative components. It answers "where does the €2M growth come from?": it's not enough to know the final result, you need to see which genres contributed and which detracted. It's management's favorite chart for performance reviews because it tells a causal story, not just a result.

```python
# WATERFALL: Da 2023 a 2024
r23t=df[df['anno']==2023].groupby('genere')['ricavo'].sum()/1e6
r24t=df[df['anno']==2024].groupby('genere')['ricavo'].sum()/1e6
delta=(r24t-r23t).sort_values(ascending=False)
fig,ax=plt.subplots(figsize=(14,7))
start=r23t.sum()
labels=['Ricavi 2023'];vals=[start];cols=['#2c3e50']
for g,d in delta.items():
    labels.append(g);vals.append(d);cols.append('#27ae60' if d>=0 else '#e74c3c')
labels.append('Ricavi 2024');vals.append(r24t.sum());cols.append('#2c3e50')
running=0
for i,(lb,v) in enumerate(zip(labels,vals)):
    if i==0:
        ax.bar(i,v,color=cols[i],width=0.6);running=v
        ax.text(i,v+0.3,f'EUR {v:.1f}M',ha='center',fontsize=9,fontweight='bold')
    elif i==len(labels)-1:
        ax.bar(i,v,color=cols[i],width=0.6)
        ax.text(i,v+0.3,f'EUR {v:.1f}M',ha='center',fontsize=9,fontweight='bold')
    else:
        ax.bar(i,v,bottom=running,color=cols[i],width=0.6)
        lbl=f'+{v:.1f}' if v>=0 else f'{v:.1f}'
        yt=running+v+0.2 if v>=0 else running+v-0.3
        ax.text(i,yt,lbl,ha='center',fontsize=8,color=cols[i],fontweight='bold')
        running+=v
        if i<len(labels)-1:ax.plot([i-0.3,i+1.3],[running,running],color='gray',linewidth=0.5,linestyle=':')
ax.set_xticks(range(len(labels)));ax.set_xticklabels(labels,fontsize=9,rotation=35,ha='right')
ax.set_title('Waterfall: il Thriller = meta della crescita',fontsize=13,fontweight='bold',loc='left',pad=15)
plt.tight_layout();plt.show()
```

![Notebook output 7](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-07.png)

## Waffle Chart: another treat for compositions

It was created as an alternative to the pie chart to show compositions. A 10x10 grid where each cell is worth 1% of the total. Less precise than a 100% stacked bar, but much more intuitive for non-technical audiences: "30 out of 100 cells are Thriller" is immediately understandable even without reading the labels.

```python
# WAFFLE CHART
fsh=df.groupby('formato')['ricavo'].sum()
fp=(fsh/fsh.sum()*100).round().astype(int)
fp.iloc[fp.values.argmax()]+=(100-fp.sum())
fig,ax=plt.subplots(figsize=(10,10))
cw={'Cartaceo':'#2c3e50','Ebook':'#3498db','Audiolibro':'#e74c3c'}
grid=[]
for fmt in ['Cartaceo','Ebook','Audiolibro']:grid.extend([cw[fmt]]*fp[fmt])
for i in range(100):
    r,c=divmod(i,10)
    ax.add_patch(plt.Rectangle((c,9-r),0.9,0.9,facecolor=grid[i],edgecolor='white',linewidth=2))
ax.set_xlim(-0.5,10.5);ax.set_ylim(-0.5,10.5);ax.set_aspect('equal');ax.axis('off')
li=[mpatches.Patch(color=cw[f],label=f'{f}: {fp[f]}%') for f in ['Cartaceo','Ebook','Audiolibro']]
ax.legend(handles=li,loc='upper center',bbox_to_anchor=(0.5,-0.02),ncol=3,fontsize=12,frameon=False)
ax.set_title('Ogni quadratino = 1% dei ricavi',fontsize=14,fontweight='bold',pad=15)
plt.tight_layout();plt.show()
```

![Notebook output 8](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-08.png)

---
# Dashboard Design

A dashboard is not a collection of charts. It is a structured visual story, and as such, it follows the same logic as the Pyramid Principle: the main message at the top, supporting arguments in the middle, and detailed evidence at the bottom.

The three-level structure is not an aesthetic convention; it must be functional.

The KPI cards at the top answer the question every executive has in mind even before opening the report: "are we doing well or poorly?". The charts in the middle row explain why. The bottom row provides detail for those who want to verify.

**Principles:**
1. KPIs at the top — key figures
2. Supporting charts in the middle
3. Detail at the bottom

**Rules:**
- **Max 6-8 charts**: Beyond that threshold, the brain stops reading and starts scanning. If you have more messages to communicate, you need more dashboards, not a larger one.
- **Consistent palette across the entire dashboard**. If Thriller is red in the bar chart, it must also be red in the line chart and heatmap. Using different colors for the same category across different charts forces the reader to mentally reconstruct the correspondences. A task they shouldn't have to do!!
- **One message per dashboard**. The general title of the dashboard must be a "So What?" exactly like the titles of individual charts. "EDITORIAL DASHBOARD — Q4 2024" is a descriptive title. "The catalog grows (+15% YoY) but with risks of concentration and seasonality" is a title that tells a story.

```python
# EXECUTIVE DASHBOARD
fig=plt.figure(figsize=(20,14))
fig.suptitle('EDITORIAL DASHBOARD - Q4 2024',fontsize=18,fontweight='bold',y=0.98)
fig.text(0.5,0.955,'Grows (+15% YoY) but with concentration and seasonality risks',fontsize=12,color='gray',ha='center')
gs=fig.add_gridspec(3,4,hspace=0.35,wspace=0.3,top=0.93,bottom=0.05,left=0.06,right=0.97)
# KPI
rt=df['ricavo'].sum()/1e6;ct=df['copie_vendute'].sum()/1000;nt=df['libro_id'].nunique()
r23x=df[df['anno']==2023]['ricavo'].sum();r24x=df[df['anno']==2024]['ricavo'].sum();yt=(r24x-r23x)/r23x*100
for i,(v,l,c) in enumerate([(f'EUR {rt:.1f}M','Revenue','#2c3e50'),(f'{ct:.0f}K','Copies','#3498db'),(f'{nt}','Titles','#27ae60'),(f'{yt:+.1f}%','YoY','#27ae60' if yt>0 else '#e74c3c')]):
    ax=fig.add_subplot(gs[0,i]);ax.text(0.5,0.6,v,ha='center',va='center',fontsize=24,fontweight='bold',color=c)
    ax.text(0.5,0.2,l,ha='center',va='center',fontsize=11,color='gray');ax.set_xlim(0,1);ax.set_ylim(0,1);ax.axis('off')
# Trend
axt=fig.add_subplot(gs[1,:2])
for fmt,c in [('Print','#2c3e50'),('Ebook','#3498db'),('Audiobook','#e74c3c')]:
    s=df[df['formato']==fmt].groupby('data')['copie_vendute'].sum()/1000
    axt.plot(s.index,s.values,label=fmt,color=c,linewidth=2)
axt.set_title('Sales trend',fontsize=11,fontweight='bold',loc='left');axt.legend(fontsize=8)
axt.xaxis.set_major_formatter(mdates.DateFormatter('%b %y'))
# Bar
axb=fig.add_subplot(gs[1,2:])
rg=df.groupby('genere')['ricavo'].sum().sort_values(ascending=True)/1e6
cb=['#e74c3c' if g in rg.nlargest(2).index else '#bdc3c7' for g in rg.index]
axb.barh(rg.index,rg.values,color=cb,height=0.6)
for i,(g,v) in enumerate(rg.items()):axb.text(v+0.05,i,f'{v:.1f}M',va='center',fontsize=8,fontweight='bold')
axb.set_title('Revenue by genre',fontsize=11,fontweight='bold',loc='left')
axb.xaxis.set_visible(False)
for sp in ['bottom','left']:axb.spines[sp].set_visible(False)
axb.tick_params(left=False)
# Heatmap
axh=fig.add_subplot(gs[2,:2])
hd=df.groupby([df['data'].dt.month,'genere'])['copie_vendute'].sum().reset_index()
hd.columns=['mese','genere','copie']
ph=hd.pivot(index='genere',columns='mese',values='copie')
pn=ph.div(ph.max(axis=1),axis=0)
sns.heatmap(pn,cmap='YlOrRd',xticklabels=['J','F','M','A','M','J','J','A','S','O','N','D'],ax=axh,cbar=False,linewidths=0.3)
axh.set_title('Seasonality',fontsize=11,fontweight='bold',loc='left');axh.set_ylabel('');axh.tick_params(labelsize=8)
# YoY
axy=fig.add_subplot(gs[2,2:])
r23g=df[df['anno']==2023].groupby('genere')['ricavo'].sum()
r24g=df[df['anno']==2024].groupby('genere')['ricavo'].sum()
yg=((r24g-r23g)/r23g*100).sort_values()
cyy=['#e74c3c' if v<0 else '#bdc3c7' if v<15 else '#27ae60' for v in yg.values]
axy.barh(yg.index,yg.values,color=cyy,height=0.6);axy.axvline(0,color='#2c3e50',linewidth=0.8)
for bar,val in zip(axy.patches,yg.values):
    axy.text(val+(0.8 if val>=0 else -0.8),bar.get_y()+bar.get_height()/2,f'{val:+.1f}%',va='center',ha='left' if val>=0 else 'right',fontsize=8,fontweight='bold')
axy.set_title('YoY growth',fontsize=11,fontweight='bold',loc='left')
for sp in ['top','right','bottom','left']:axy.spines[sp].set_visible(False)
axy.xaxis.set_visible(False);axy.tick_params(left=False,labelsize=9)
plt.show()
```
![Notebook output 9](../Assets/Notebook/generated/datavis_masterclass_parte2/datavis_masterclass_parte2-output-09.png)

> The golden rule: \
> **Don't ask "what chart should I make?". Ask "what do I need to communicate?".**

## Resources

- **The Pyramid Principle** — Barbara Minto
- **Storytelling with Data** — Cole Nussbaumer Knaflic
- **The Visual Display of Quantitative Information** — Edward Tufte
- **Fundamentals of Data Visualization** — Claus Wilke (free online)

---

*"The greatest value of a picture is when it forces us to notice what we never expected to see."* — John Tukey

> Source notebook: [datavis_masterclass_parte2.ipynb](../Assets/Notebook/datavis_masterclass_parte2.ipynb)