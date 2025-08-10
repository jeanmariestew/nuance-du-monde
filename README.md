# Nuance du Monde - Site Web Next.js

Ce projet est une migration complète du site WordPress "Nuance du Monde" vers une application Next.js fullstack avec base de données MySQL.

## 🚀 Fonctionnalités

- **Frontend moderne** : Interface utilisateur responsive avec Next.js 15 et Tailwind CSS
- **API REST complète** : API Routes Next.js pour toutes les opérations CRUD
- **Base de données MySQL** : Schéma optimisé pour la gestion du contenu
- **Gestion des destinations** : Affichage et gestion des destinations de voyage
- **Types et thèmes de voyage** : Catégorisation flexible des offres
- **Système de témoignages** : Avis clients avec notation
- **Formulaire de devis** : Demandes personnalisées avec validation
- **Newsletter** : Système d'abonnement avec gestion des désabonnements
- **Pages statiques** : Gestion des pages d'information
- **Responsive design** : Compatible mobile et desktop

## 🛠 Technologies utilisées

- **Frontend** : Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : MySQL avec mysql2
- **Authentification** : JWT (préparé pour l'administration)
- **Email** : Nodemailer (configuration requise)
- **Validation** : Validation côté client et serveur

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd nuance-du-monde
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   
   Copier `.env.local.example` vers `.env.local` et configurer :
   ```env
   # Base de données MySQL
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=nuance_du_monde

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key

   # Configuration email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # URL de base
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Créer la base de données**
   ```bash
   # Créer la base de données MySQL
   mysql -u root -p -e "CREATE DATABASE nuance_du_monde;"
   
   # Importer le schéma
   mysql -u root -p nuance_du_monde < database_schema.sql
   
   # Importer les données d'exemple
   mysql -u root -p nuance_du_monde < database_seed.sql
   ```

5. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
nuance-du-monde/
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── destinations/  # API destinations
│   │   │   ├── travel-types/  # API types de voyage
│   │   │   ├── travel-themes/ # API thèmes
│   │   │   ├── testimonials/  # API témoignages
│   │   │   ├── quote-request/ # API demandes de devis
│   │   │   ├── newsletter/    # API newsletter
│   │   │   └── pages/         # API pages statiques
│   │   ├── destinations/      # Pages destinations
│   │   ├── demander-devis/    # Page formulaire devis
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Page d'accueil
│   ├── components/            # Composants React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── NewsletterForm.tsx
│   ├── lib/                   # Utilitaires
│   │   └── db.ts             # Configuration base de données
│   └── types/                 # Types TypeScript
│       └── index.ts
├── public/
│   └── images/               # Images du site
├── database_schema.sql       # Schéma de base de données
├── database_seed.sql         # Données d'exemple
└── README.md
```

## 🗄 Base de données

### Tables principales

- **destinations** : Destinations de voyage avec prix, durée, etc.
- **travel_types** : Types de voyage (groupe, individuel, etc.)
- **travel_themes** : Thèmes de voyage (culinaire, safari, etc.)
- **testimonials** : Avis clients avec notation
- **quote_requests** : Demandes de devis des clients
- **newsletter_subscriptions** : Abonnements newsletter
- **pages** : Pages statiques du site
- **users** : Utilisateurs administrateurs (pour futur backoffice)

### Relations

- Destinations ↔ Types de voyage (many-to-many)
- Destinations ↔ Thèmes de voyage (many-to-many)
- Témoignages → Destinations (optional)
- Témoignages → Thèmes (optional)

## 🔧 API Endpoints

### Destinations
- `GET /api/destinations` - Liste des destinations
- `GET /api/destinations/[slug]` - Destination spécifique
- `POST /api/destinations` - Créer une destination
- `PUT /api/destinations/[slug]` - Modifier une destination
- `DELETE /api/destinations/[slug]` - Supprimer une destination

### Types de voyage
- `GET /api/travel-types` - Liste des types
- `POST /api/travel-types` - Créer un type

### Thèmes de voyage
- `GET /api/travel-themes` - Liste des thèmes
- `POST /api/travel-themes` - Créer un thème

### Témoignages
- `GET /api/testimonials` - Liste des témoignages
- `POST /api/testimonials` - Créer un témoignage

### Demandes de devis
- `GET /api/quote-request` - Liste des demandes
- `POST /api/quote-request` - Créer une demande

### Newsletter
- `POST /api/newsletter` - S'abonner
- `DELETE /api/newsletter?email=...` - Se désabonner

### Pages statiques
- `GET /api/pages/[slug]` - Contenu d'une page

## 🎨 Design et UX

Le design reproduit fidèlement l'apparence du site WordPress original avec :

- **Header sticky** avec navigation responsive
- **Hero section** avec image de fond et call-to-action
- **Sections thématiques** pour types, destinations et thèmes
- **Grille de cartes** pour l'affichage des contenus
- **Formulaires modernes** avec validation
- **Footer complet** avec liens et informations de contact
- **Animations subtiles** et transitions fluides

## 🚀 Déploiement

### Développement local
```bash
npm run dev
```

### Build de production
```bash
npm run build
npm start
```

### Variables d'environnement de production

Assurez-vous de configurer toutes les variables d'environnement en production :
- Base de données MySQL accessible
- Clés SMTP valides pour l'envoi d'emails
- JWT_SECRET sécurisé
- NEXT_PUBLIC_BASE_URL avec le bon domaine

## 📝 TODO / Améliorations futures

- [ ] Interface d'administration (backoffice)
- [ ] Authentification administrateur
- [ ] Upload d'images
- [ ] Système de cache Redis
- [ ] Tests automatisés
- [ ] Optimisation SEO avancée
- [ ] Intégration système de paiement
- [ ] Notifications push
- [ ] Multilingue (FR/EN)
- [ ] Analytics et tracking

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email : info@nuancedumonde.com
- Téléphone : 1-844-362-0555

---

**Nuance du Monde** - Votre spécialiste du voyage sur mesure

