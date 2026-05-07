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
- **Passage de flèches**
  - Gérez vos lots de flèches et les passages sur la presse
- **Plans de compétition**
  - Créez et consultez vos plans de compétition
  - Auto-évaluation sur 5 critères (Technique, Physique, Mental, Tactique, Matériel)
  - Définissez vos objectifs en points et vos intentions (stratégie, attitude, jeu, forces)
  - Partagez un lien de lecture seule avec votre entraîneur
  - Sauvegarde locale ou dans le cloud selon la connexion

### 🏹 Jeux disponibles :

- **Tir Compté**
  - Paramétrez le nombre de flèches par volée et le nombre de volées
  - Saisissez vos flèches via un clavier couleur correspondant aux zones du blason
  - Calcul automatique des scores
  - Score cumulatif, sauvegarde locale

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

- **Volée de référence**
  - Paramétrez le nombre de flèches par volée, le nombre de volées et la valeur de la volée de référence
  - Comparez chaque volée à la référence fixe
  - Calcul automatique des scores, sauvegarde locale

- **Volée de référence glissante**
  - Paramétrez le nombre de flèches par volée, le nombre de volées et la valeur initiale de la volée de référence
  - La volée de référence évolue après chaque volée:
    - volée < réf - 3 => réf = réf - 2 
    - volée < réf - 1 => réf = réf - 1
    - volée > réf + 1 => réf = réf + 1 
    - volée > réf + 3 => réf = réf + 2
  - Le but est de finir avec la volée de référence la plus haute possible 

- **Jeu de Zone**
  - Paramétrez la zone de réussite.
  - Les volées rapportent des points en fonction du nombre de flèches dans la zone de réussite.
    - 9/9 => + 4pts
    - 8/9 => + 2pts
    - 7/9 => + 1pt
    - 6/9 => + 0pt
    - 5/9 => - 1pt
    - 4/9 et moins => - 2pts
  - L'objectif du jeu est d'atteindre 20 points le plus rapidememnt possible en faisant des volées de 9 flèches. 

- **Big Ten**
  - Paramétrez le nombre de volées et le nombre de flèches par volée.
  - Tout le jaune vaut 10 pts !

---

### 📱 Fonctionnalités techniques

- Application Angular standalone (sans modules)
- CSS basé sur **Bulma**
- Persistance automatique via **localStorage** ou **FireStore** après connexion via **Google** ou **Email/mot de passe**
- Composants réutilisables (ex : clavier de score, blason interactif SVG)
- Support tactile mobile : touchstart / drag / end pour positionner les flèches sur le blason

---

### 🚀 Installation et lancement en local

```bash
git clone https://github.com/mat-chartier/arcsenal.git
cd arc-senal
npm install
ng serve --open
```

---

### 🌐 Déploiement

Déployée en production sur Firebase Hosting :
```bash
npm run deploy
```

---

### 📃 Licence
Projet distribué sous licence MIT.

---

### 📣 Contributions
Toute suggestion ou contribution est la bienvenue, via issues ou pull requests ✌️

