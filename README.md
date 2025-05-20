# 🎯 ArcSenal — Jeux et outils pour le tir à l'arc

**ArcSenal** est une application web Angular open source destinée aux archères et archers qui propose des mini-jeux interactifs et outils adaptés à la discipline.

Cette application est conçue pour être responsive et fonctionner aussi bien en desktop qu’en mobile.

Disponible sur github pages: [https://mat-chartier.github.io/arcsenal/](https://mat-chartier.github.io/arcsenal/)

---

## 📦 Contenu du projet

Actuellement, l'application propose :

### Outils :
 - **Vidéo avec délai**
   - Paramétrez le nombre de secondes de délai
   - Au besoin possibilité d'ajouter un guide fixe sur l'image, pour vérifier sa position
- **Réglage du coupe tube**
  - Entrez toutes les caractéristique de taille de vos élements (tube, pointes, encoche, etc.) et la longueur flèche montée désirée pour savoir comment régler le coupe tube

### 🏹 Jeux disponibles :

- **Tir Compté Double**
  - Paramétrez le nombre de flèches par volée et le nombre de volées
  - Saisissez vos flèches via un clavier couleur correspondant aux zones du blason
  - Calcul automatique des scores des 6 meilleures et 6 moins bonnes flèches par volée
  - Score cumulatif, sauvegarde locale

- **Gold Game**
  - Paramétrez le nombre de flèches par volée, le nombre de volées et la zone de réussite
  - Les flèches rapportent des points selon leur position par rapport à cette zone
    - Flèche < Zone => -1 pt
    - F = Zone => 0pt
    - F = Zone + 1 => 1pt
    - F > Zone + 1 => 2pt
  - Comptage automatique, cumul des scores et sauvegarde locale

- **Tri de flèches**
  - Indiquez le nombre de flèches à trier
  - Positionnez vos impacts sur un blason interactif (desktop et mobile)
  - Déplacement du blason possible en mobile pour affiner le placement
  - Visualisez les impacts et la moyenne pour chaque flèche
  - Visualisez les impacts et la moyenne pour l'ensemble des flèches
  - Effacement des impacts individuellement et relance possible

---

### 📱 Fonctionnalités techniques

- Application Angular standalone (sans modules)
- CSS basé sur **Bulma**
- Persistance automatique via **localStorage**
- Composants réutilisables (ex : clavier de score, blason interactif SVG)
- Support tactile mobile : touchstart / drag / end pour positionner les flèches sur le blason

---

### 🚀 Installation et lancement en local

```bash
git clone https://github.com/mat-chartier/arcsenal.git
cd arcsenal
npm install
ng serve --open
```

---

### 🌐 Déploiement

Déployée en production sur GitHub Pages via :
```bash
ng build --configuration production
npx angular-cli-ghpages --dir=dist/arc-senal/browser
```

---

### 📃 Licence
Projet distribué sous licence MIT.

---

### 📣 Contributions
Toute suggestion ou contribution est la bienvenue, via issues ou pull requests ✌️

