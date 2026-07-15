# EcoStock Frontend

Ce projet est l’interface web d’EcoStock, une application de gestion d’inventaire destinée à suivre les entrepôts, les produits, leurs statuts et leurs déplacements. Il a été construit avec React, Vite, Zustand, React Router, Tailwind CSS et plusieurs composants UI basés sur shadcn/ui.

Ce document sert de guide pratique pour une personne non développeuse qui veut comprendre, installer, faire tourner, ou faire évoluer l’application.

---

## 1. Objectif du projet

EcoStock permet de :

- consulter la liste des entrepôts,
- créer, modifier ou supprimer des produits,
- déplacer un produit d’un entrepôt à un autre,
- consulter les détails d’un entrepôt,
- lancer un audit d’un entrepôt,
- gérer la connexion de l’utilisateur.

L’application communique avec un backend via des requêtes HTTP réalisées avec Axios.

---

## 2. Prérequis

Avant de lancer le projet, il faut disposer de :

- Node.js installé sur la machine,
- pnpm installé,
- un backend fonctionnel exposant les routes attendues par l’interface.

Les points d’entrée API attendus sont notamment :

- authentification : `token/` et `token/refresh`
- produits : `products/`
- entrepôts : `warehouses/`

---

## 3. Installation et lancement

Depuis la racine du projet, installer les dépendances :

```bash
pnpm install
```

Créer ensuite un fichier `.env` à la racine avec la variable suivante :

```env
VITE_API_URL=http://localhost:8000
```

Remplacer l’URL par celle de votre backend.

Lancer l’application en mode développement :

```bash
pnpm dev
```

L’URL fournie par Vite sera généralement de type `http://localhost:5173`.

---

## 4. Structure du projet

Voici la logique générale du dépôt :

- `src/` : code source principal de l’application,
- `public/` : fichiers statiques et icônes,
- `src/apis/` : appels HTTP vers l’API,
- `src/stores/` : gestion d’état globale avec Zustand,
- `src/pages/` : écrans principaux,
- `src/components/` : composants UI et formulaires,
- `src/utils/` : utilitaires comme Axios et gestion des erreurs,
- `src/validations/` : validation des formulaires,
- `src/constants/` : constantes partagées,
- `src/hooks/` : hooks personnalisés.

---

## 5. Point d’entrée et architecture générale

### 5.1 Point d’entrée

Le fichier principal est `src/main.jsx`.

Il réalise trois actions essentielles :

- créer l’application React,
- configurer le routage avec `react-router-dom`,
- afficher la bonne page selon l’URL.

### 5.2 Mise en page globale

Le fichier `src/layout.jsx` sert de structure générale de l’interface.

Il contient :

- la barre latérale de navigation,
- l’en-tête de l’application,
- la zone où le contenu des pages s’affiche via `Outlet`.

Cette architecture permet d’avoir une structure commune à toutes les pages.

---

## 6. Routage de l’application

Les routes principales sont définies dans `src/main.jsx` :

- `/` : tableau de bord,
- `/warehouse` : liste des entrepôts,
- `/products` : liste des produits,
- `/warehouse/:id` : détail d’un entrepôt,
- `/product/:id` : détail d’un produit,
- `/login` : page de connexion.

Chaque route correspond à une page ou un composant spécifique.

---

## 7. Gestion d’état avec Zustand

Le projet utilise Zustand pour gérer les données partagées et éviter de faire passer des props partout dans l’application.

### 7.1 Store d’authentification : `src/stores/auth.store.js`

Le store `useAuthStore` gère :

- `token` : token d’accès,
- `refreshToken` : token de rafraîchissement,
- `isAuthenticated` : état de connexion,
- `loading` : état de chargement,
- `error` : message d’erreur.

Actions disponibles :

- `login(credentials)` : envoie les identifiants à l’API et met à jour le store si la connexion réussit,
- `refreshAccessToken()` : tente d’obtenir un nouveau token à partir du refresh token.

Le store est persistant grâce à `persist` et `createJSONStorage(() => localStorage)`, ce qui permet de conserver l’état de connexion dans le navigateur.

### 7.2 Store des produits : `src/stores/product.store.js`

Le store `useProductStore` gère les produits dans toute l’application.

Il contient :

- `products` : liste des produits,
- `product` : produit actuellement sélectionné,
- `loading` et `error`.

Actions disponibles :

- `fetchAllProducts()` : charger tous les produits,
- `fetchProduct(id)` : charger un produit par ID,
- `productCreate(data)` : créer un produit,
- `productUpdate(id, data)` : modifier un produit,
- `productDelete(id)` : supprimer un produit,
- `productMove(id, data)` : déplacer un produit vers un autre entrepôt.

### 7.3 Store des entrepôts : `src/stores/warehouse.store.js`

Le store `useWarehouse` gère la logique liée aux entrepôts.

Il contient :

- `warehouses` : liste des entrepôts,
- `warehouse` : entrepôt actuellement sélectionné,
- `loading` et `error`.

Actions disponibles :

- `fetchAllWarehouses()` : charger les entrepôts,
- `fetchWarehouse(id)` : charger un entrepôt précis,
- `warehouseCreate(data)` : créer un entrepôt,
- `warehouseUpdate(id, data)` : modifier un entrepôt,
- `warehouseDelete(id)` : supprimer un entrepôt,
- `warehouseAudit(id)` : lancer un audit sur un entrepôt.

---

## 8. Configuration Axios et interceptor

Le cœur du réseau est défini dans `src/utils/axios.js`.

### 8.1 Instance Axios

Le fichier crée une instance Axios avec :

- `baseURL` venant de `import.meta.env.VITE_API_URL`,
- un header `Content-Type: application/json` par défaut.

Toutes les requêtes du front passent par cette instance.

### 8.2 Interceptor de requête

L’interceptor ajoute automatiquement le header `Authorization: Bearer ...` pour chaque requête, à condition qu’un token soit présent dans le stockage local.

Cela permet de :

- ne pas répéter le token sur chaque appel,
- centraliser l’ajout d’authentification,
- simplifier l’intégration avec le backend.

En cas d’erreur pendant l’injection du header, une erreur est loggée dans la console.

---

## 9. Modules API

Les modules dans `src/apis/` servent de pont entre les stores et le backend.

### 9.1 Authentification : `src/apis/auth.api.js`

Fonctions principales :

- `login(credentials)` : appelle `token/` pour se connecter,
- `refreshToken(refresh)` : appelle `token/refresh` pour rafraîchir le token.

### 9.2 Produits : `src/apis/products.api.js`

Fonctions principales :

- `getAllProducts()` : récupérer tous les produits,
- `getProduct(id)` : récupérer un produit par ID,
- `createProduct(productData)` : créer un produit,
- `updateProduct(id, productData)` : modifier un produit,
- `deleteProduct(id)` : supprimer un produit,
- `moveProduct(id, data)` : déplacer un produit.

### 9.3 Entrepôts : `src/apis/warehouse.api.js`

Fonctions principales :

- `warehouses()` : récupérer tous les entrepôts,
- `warehouse(id)` : récupérer un entrepôt précis,
- `createWarehouse(data)` : créer un entrepôt,
- `updateWarehouse(data, id)` : modifier un entrepôt,
- `deleteWarehouse(id)` : supprimer un entrepôt,
- `auditWarehouse(id)` : obtenir un audit sur un entrepôt.

---

## 10. Pages principales

### 10.1 Page de connexion : `src/pages/Login.jsx`

Cette page permet à l’utilisateur de se connecter.

Elle utilise :

- `react-hook-form` pour gérer le formulaire,
- `zod` pour la validation des champs,
- `useAuthStore` pour appeler la logique d’authentification.

### 10.2 Tableau de bord : `src/App.jsx`

La page d’accueil affiche des statistiques globales :

- nombre d’entrepôts,
- nombre de produits,
- capacité maximale parmi les entrepôts,
- quantité totale en stock.

Elle charge aussi les données si l’utilisateur est connecté.

### 10.3 Page des entrepôts : `src/pages/warehouse.jsx`

Affiche la liste des entrepôts sous forme de cartes. Lorsque l’utilisateur clique sur une carte, il arrive sur la page détail de l’entrepôt.

### 10.4 Page des produits : `src/pages/product.jsx`

Affiche les produits sous forme de tableau avec :

- nom,
- quantité,
- date d’expiration,
- entrepôt associé,
- statut,
- actions de vue, modification et suppression.

### 10.5 Détail d’un produit : `src/components/product/productDetail.jsx`

Cette vue permet de :

- consulter les informations du produit,
- le déplacer vers un autre entrepôt,
- afficher des notifications de succès ou d’erreur.

### 10.6 Détail d’un entrepôt : `src/components/warehouse/detailWarehouse.jsx`

Affiche les informations générales d’un entrepôt et permet de lancer un audit.

---

## 11. Composants d’interaction et formulaires

Le projet utilise beaucoup de composants “drawer” pour créer ou modifier des entités, ce qui donne une expérience fluide sur mobile et sur ordinateur.

### 11.1 Création d’un entrepôt

Le composant `src/components/warehouse/createWarehouse.jsx` permet de :

- saisir le nom de l’entrepôt,
- saisir l’emplacement,
- saisir la capacité,
- envoyer ces données au backend.

### 11.2 Création d’un produit

Le composant `src/components/createProduct.jsx` permet de :

- saisir le nom du produit,
- saisir sa quantité,
- choisir une date d’expiration,
- choisir l’entrepôt associé,
- choisir un statut.

### 11.3 Modification d’un produit

Le composant `src/components/product/UpdateProductModal.jsx` permet de modifier un produit existant avec un formulaire dédié.

Il envoie uniquement les champs réellement modifiés afin d’éviter de provoquer des erreurs côté API.

---

## 12. Validation des formulaires

La validation des formulaires est faite avec `zod` dans `src/validations/form.validate.js`.

Le schéma actuellement utilisé concerne la page de connexion et vérifie que :

- `username` contient au moins 3 caractères,
- `password` contient au moins 3 caractères.

Cette étape évite d’envoyer des données trop courtes au backend.

---

## 13. Interface utilisateur et style

Le front utilise :

- Tailwind CSS pour le style,
- shadcn/ui pour les composants UI de base,
- `lucide-react` pour les icônes,
- `sonner` pour les notifications toast.

Le design est orienté “dashboard moderne”, avec une sidebar latérale et des cartes d’information.

---

## 14. Constantes et réglages partagés

### 14.1 Statuts de produit : `src/constants/enumProduct.js`

Ce fichier contient les statuts possibles d’un produit :

- `disponible`
- `reserve`
- `perime`

### 14.2 Liens du menu : `src/constants/navLinks.js`

Ce fichier contient les liens affichés dans la sidebar avec leurs icônes et chemins associés.

---

## 15. Gestion des erreurs

Le projet fournit un utilitaire dans `src/utils/errors.js` pour transformer les réponses d’erreur backend en messages lisibles pour l’utilisateur.

Il accepte plusieurs formats, par exemple :

- une simple chaîne de texte,
- un objet contenant `detail`,
- des erreurs de validation en cascade.

Cette logique est utilisée dans les composants pour afficher des notifications claires.

---

## 16. Déroulé typique d’une action utilisateur

### 16.1 Se connecter

1. L’utilisateur remplit le formulaire de connexion.
2. Le composant `Login` appelle la méthode `login()` du store d’authentification.
3. Le store appelle l’API de connexion.
4. Si tout est correct, le token est sauvegardé et l’interface passe en mode connecté.

### 16.2 Créer un produit

1. L’utilisateur ouvre le formulaire de création.
2. Le composant envoie les données au store `productCreate()`.
3. Le store appelle la fonction API correspondante.
4. Le backend répond avec le produit créé.
5. Le store met à jour la liste locale et une notification confirme la réussite.

### 16.3 Déplacer un produit

1. L’utilisateur ouvre la page de détail d’un produit.
2. Il choisit un nouvel entrepôt dans la liste.
3. Le composant appelle `productMove()`.
4. Le backend reçoit la demande de déplacement.
5. La page est rechargée avec les informations mises à jour.

---

## 17. Bonnes pratiques pour faire évoluer le projet

Pour ajouter une nouvelle fonctionnalité, le chemin conseillé est le suivant :

1. ajouter la fonction d’appel API dans `src/apis/`,
2. ajouter l’action correspondante dans le store dans `src/stores/`,
3. créer ou modifier un composant dans `src/components/` ou une page dans `src/pages/`,
4. ajouter la route dans `src/main.jsx` si nécessaire,
5. vérifier la cohérence avec le tableau de bord ou les écrans concernés.

---

## 18. Points de vigilance

Avant de faire tourner ou modifier le projet, vérifier les éléments suivants :

- la variable `VITE_API_URL` est bien définie,
- le backend expose bien les endpoints attendus,
- le token est bien envoyé via l’interceptor Axios,
- les stores se mettent à jour correctement après une action utilisateur,
- les données sont persistées correctement si l’on recharge la page.

---

## 19. Commandes utiles

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

---

## 20. Résumé rapide

En résumé, ce frontend :

- affiche une interface d’inventaire moderne,
- communique avec une API backend via Axios,
- utilise Zustand pour la logique de données,
- stocke l’authentification localement,
- gère les entrepôts et les produits depuis une interface claire et simple.

Le meilleur moyen de comprendre le projet est de suivre cet ordre :

1. comprendre la structure des dossiers,
2. lire la configuration Axios,
3. comprendre les stores,
4. suivre le flux d’une action utilisateur depuis la page jusqu’à l’API.

