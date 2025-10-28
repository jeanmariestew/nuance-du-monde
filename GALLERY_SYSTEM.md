# Système de Galerie d'Images Centralisé

## 📸 Vue d'ensemble

Le système de galerie permet de gérer toutes les images du site de manière centralisée. Au lieu d'uploader une image à chaque fois, vous pouvez maintenant :
1. Uploader une image une seule fois dans la galerie
2. Ajouter des métadonnées (titre, texte alternatif, tags)
3. Réutiliser cette image partout dans le site

## 🗄️ Structure de la base de données

### Table `gallery_images`

```sql
CREATE TABLE gallery_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  title VARCHAR(255),
  alt_text VARCHAR(255),
  tags TEXT,  -- Mots-clés séparés par des virgules
  file_size INT,
  mime_type VARCHAR(100),
  width INT,
  height INT,
  uploaded_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 Installation

### 1. Initialiser la table

Visitez : `http://localhost:3000/api/admin/gallery/init`

Ou exécutez le script SQL :
```bash
mysql -u root -p nuance_db < database/migrations/create_gallery.sql
```

### 2. Accéder à la galerie

Allez dans le back-office : `http://localhost:3000/admin/gallery`

## 📋 Fonctionnalités

### Dans la galerie (`/admin/gallery`)

1. **Upload d'images**
   - Glissez-déposez ou cliquez pour sélectionner
   - L'image est automatiquement uploadée et enregistrée

2. **Métadonnées**
   - **Titre** : Nom descriptif de l'image
   - **Texte alternatif** : Pour l'accessibilité (SEO)
   - **Tags** : Mots-clés séparés par des virgules (ex: "voyage, nature, montagne")

3. **Recherche et filtrage**
   - Par titre/nom de fichier
   - Par tags
   - Pagination automatique

4. **Actions**
   - Éditer les métadonnées
   - Supprimer une image (fichier + BDD)

## 🔧 Utilisation dans le code

### 1. Composant ImageGalleryPicker

```tsx
import ImageGalleryPicker from "@/components/admin/ImageGalleryPicker";

function MyComponent() {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  return (
    <>
      <button onClick={() => setShowPicker(true)}>
        Sélectionner une image
      </button>

      {showPicker && (
        <ImageGalleryPicker
          selectedUrl={selectedImage}
          onSelect={(image) => {
            setSelectedImage(image.url);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
```

### 2. API Endpoints

#### GET `/api/admin/gallery`
Récupérer toutes les images

**Query params:**
- `search` : Recherche par titre/nom
- `tags` : Filtrer par tags
- `limit` : Nombre d'images (défaut: 50)
- `offset` : Pagination

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "montagne-abc123.jpg",
      "url": "/uploads/montagne-abc123.jpg",
      "title": "Montagne enneigée",
      "alt_text": "Vue panoramique d'une montagne",
      "tags": "montagne, neige, nature",
      "file_size": 245678,
      "mime_type": "image/jpeg",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

#### POST `/api/admin/gallery`
Upload une nouvelle image

**FormData:**
- `file` : Fichier image (requis)
- `title` : Titre (optionnel)
- `alt_text` : Texte alternatif (optionnel)
- `tags` : Tags séparés par virgules (optionnel)

#### PUT `/api/admin/gallery/[id]`
Mettre à jour les métadonnées

**Body:**
```json
{
  "title": "Nouveau titre",
  "alt_text": "Nouveau texte alt",
  "tags": "tag1, tag2, tag3"
}
```

#### DELETE `/api/admin/gallery/[id]`
Supprimer une image (fichier + BDD)

## 🎯 Migration des images existantes

Pour migrer les images déjà uploadées :

1. **Identifier toutes les images** dans `/public/uploads/`
2. **Créer des entrées dans la BDD** :

```sql
INSERT INTO gallery_images (filename, url, title, alt_text, tags)
VALUES 
  ('image1.jpg', '/uploads/image1.jpg', 'Image 1', 'Description', 'tag1, tag2'),
  ('image2.jpg', '/uploads/image2.jpg', 'Image 2', 'Description', 'tag3, tag4');
```

Ou via script Node.js :

```javascript
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'public', 'uploads');
const files = fs.readdirSync(uploadsDir);

files.forEach(async (file) => {
  const url = `/uploads/${file}`;
  await fetch('http://localhost:3000/api/admin/gallery', {
    method: 'POST',
    body: JSON.stringify({
      filename: file,
      url: url,
      title: file,
      alt_text: file,
      tags: ''
    })
  });
});
```

## 🔄 Remplacer les uploads directs

### Avant (upload direct)
```tsx
<input
  type="file"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/uploads', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setImageUrl(data.url);
  }}
/>
```

### Après (sélection depuis galerie)
```tsx
<button onClick={() => setShowGallery(true)}>
  Sélectionner depuis la galerie
</button>

{showGallery && (
  <ImageGalleryPicker
    onSelect={(image) => {
      setImageUrl(image.url);
      setShowGallery(false);
    }}
    onClose={() => setShowGallery(false)}
  />
)}
```

## 📊 Avantages

✅ **Centralisation** : Une seule source pour toutes les images
✅ **Réutilisation** : Pas de doublons, économie d'espace
✅ **SEO** : Métadonnées optimisées (alt text, titre)
✅ **Organisation** : Tags pour catégoriser
✅ **Recherche** : Retrouver facilement une image
✅ **Performance** : Moins d'uploads, meilleure gestion

## 🛠️ Prochaines étapes

1. ✅ Créer la table `gallery_images`
2. ✅ API CRUD complète
3. ✅ Interface de galerie
4. ✅ Composant de sélection
5. ⏳ Intégrer dans les formulaires existants (offres, destinations, etc.)
6. ⏳ Migration des images existantes
7. ⏳ Optimisation des images (resize, compression)
8. ⏳ Support du drag & drop multiple

## 📝 Notes

- Les images sont stockées dans `/public/uploads/`
- Le nom de fichier est hashé pour éviter les conflits
- La suppression d'une image supprime aussi le fichier physique
- Les tags sont stockés en texte, séparés par des virgules
- Possibilité d'ajouter une lib comme `sharp` pour obtenir les dimensions automatiquement
