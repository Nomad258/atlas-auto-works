export const translations = {
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      configurator: 'Configurateur',
      about: 'À propos',
      contact: 'Contact',
      quote: 'Devis',
      booking: 'Réservation'
    },

    // Hero Section
    hero: {
      title: 'Transformez Votre Véhicule En Chef-d\'œuvre',
      subtitle: 'PERSONNALISATION PREMIUM',
      description: 'Atlas Auto Works concrétise votre vision avec des solutions de personnalisation automobile d\'élite. De la peinture sur mesure aux ciels étoilés, nous créons l\'unique.',
      cta: 'Commencer la Configuration',
      stats: {
        vehicles: 'Véhicules Transformés',
        clients: 'Satisfaction Client',
        experience: 'Années d\'Expérience'
      }
    },

    // Features
    features: {
      title: 'Nos Services',
      subtitle: 'Une expertise inégalée pour chaque détail de votre véhicule',
      paint: {
        title: 'Peinture & Wraps',
        description: 'Finitions exclusives et protection durable avec nos peintures et films premium.'
      },
      bodykit: {
        title: 'Kits Carrosserie',
        description: 'Améliorations aérodynamiques et esthétiques pour une présence imposante.'
      },
      wheels: {
        title: 'Jantes & Performance',
        description: 'Jantes forgées sur mesure et améliorations techniques.'
      },
      interior: {
        title: 'Intérieur Luxe',
        description: 'Sellerie cuir, Alcantara et inserts carbone.'
      },
      starlight: {
        title: 'Ciel Étoilé',
        description: 'L\'ambiance ultime avec nos installations fibre optique sur mesure.'
      },
      accessories: {
        title: 'Accessoires',
        description: 'Les détails qui font la différence.'
      }
    },

    // Configurator Page
    configurator: {
      title: 'Configurateur',
      steps: {
        vehicle: 'Véhicule',
        visualization: 'Visualisation',
        quote: 'Devis',
        booking: 'Réservation' // Added Booking step translation
      }
    },

    // VIN Decoder
    vin: {
      title: 'Identifiez votre Véhicule',
      subtitle: 'Entrez votre VIN pour une expérience personnalisée',
      placeholder: 'Entrez votre numéro VIN...',
      decode: 'Configurer',
      help: 'Le VIN se trouve sur votre carte grise ou pare-brise.',
      error: 'VIN invalide. Veuillez vérifier et réessayer.'
    },

    // Products
    products: {
      details: 'Détails du produit',
      remove: 'Retirer',
      notFound: 'Aucun produit disponible dans cette catégorie',
      filters: {
        wrap: 'Films & Wraps'
      },
      specifications: {
        labor: 'main d\'œuvre',
        warranty: 'garantie',
        included: 'Inclus'
      },
      categories: {
        paint: 'Peinture',
        bodykit: 'Carrosserie',
        wheels: 'Jantes',
        interior: 'Intérieur',
        starlight: 'Ciel Étoilé',
        accessories: 'Accessoires'
      }
    },

    // Location Visualizer
    location: {
      title: 'Visualisation Immersion',
      subtitle: 'Découvrez votre configuration dans les plus beaux lieux du Maroc',
      selectLocation: 'Choisir un lieu',
      selectSeason: 'Saison',
      selectTime: 'Moment',
      locations: {
        casablanca: { name: 'Casablanca', description: 'Ambiance urbaine côtière' },
        marrakech: { name: 'Marrakech', description: 'Luxe au cœur de la palmeraie' },
        atlas: { name: 'Atlas', description: 'Cols de montagne spectaculaires' },
        sahara: { name: 'Sahara', description: 'Dunes dorées au coucher du soleil' },
        tangier: { name: 'Tanger', description: 'Entre Méditerranée et Atlantique' },
        chefchaouen: { name: 'Chefchaouen', description: 'La perle bleue du Rif' }
      },
      seasons: {
        spring: 'Printemps',
        summer: 'Été',
        autumn: 'Automne',
        winter: 'Hiver'
      },
      times: {
        dawn: 'Aube',
        day: 'Jour',
        sunset: 'Crépuscule',
        night: 'Nuit'
      }
    },

    // Quote
    quote: {
      title: 'Votre Devis',
      summary: 'Récapitulatif',
      noItems: 'Aucune sélection',
      itemsSelected: 'Articles sélectionnés',
      selectProducts: 'Sélectionnez des options pour estimer le coût.',
      reference: 'Réf',
      validity: 'Valide',
      options: {
        rush: 'Commande Prioritaire'
      },
      breakdown: {
        products: 'Pièces & Matériaux',
        labor: 'Main d\'œuvre',
        rushFee: 'Frais d\'urgence (+25%)',
        vat: 'TVA (20%)',
        total: 'Total Estimé'
      },
      timeline: {
        estimated: 'Délai estimé',
        days: 'jours'
      },
      actions: {
        continue: 'Réserver un Atelier'
      }
    },

    // Booking
    booking: {
      title: 'Réserver Votre Transformation',
      subtitle: 'Planifiez votre rendez-vous dans l\'un de nos ateliers premium',
      steps: {
        location: 'Atelier',
        datetime: 'Date & Heure',
        info: 'Vos Coordonnées'
      },
      selectLocation: {
        casablanca: 'Casablanca Flagship',
        marrakech: 'Marrakech Studio',
        tangier: 'Tanger Workshop'
      },
      selectDate: {
        title: 'Choisir une Date',
        unavailable: 'Aucun créneau disponible'
      },
      selectTime: {
        title: 'Choisir une Heure'
      },
      customerInfo: {
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        placeholders: {
          firstName: 'Votre prénom',
          email: 'email@exemple.com',
          phone: '+212 6...'
        }
      },
      confirmation: {
        details: 'Détails du Rendez-vous',
        location: 'Lieu',
        date: 'Date',
        time: 'Heure'
      }
    },

    // Viewer 3D
    viewer3d: {
      loading: 'Chargement du modèle 3D...'
    },

    // Common
    common: {
      next: 'Suivant',
      previous: 'Précédent',
      back: 'Retour',
      confirm: 'Confirmer',
      cancel: 'Annuler',
      loading: 'Chargement...'
    },

    // Footer
    footer: {
      about: {
        description: 'Le leader marocain de la personnalisation automobile de luxe. Nous transformons chaque véhicule en une expression unique de son propriétaire.'
      },
      links: {
        title: 'Explorer'
      },
      contact: {
        title: 'Nous Contacter',
        phone: '+212 522 123 456',
        email: 'contact@atlasautoworks.ma'
      },
      hours: {
        title: 'HORAIRES',
        weekdays: 'Lun - Sam: 9h00 - 19h00'
      },
      copyright: '© 2025 Atlas Auto Works. Tous droits réservés.'
    },

    // Errors
    errors: {
      validation: 'Veuillez remplir tous les champs obligatoires.',
      generic: 'Une erreur est survenue. Veuillez réessayer.',
      network: 'Erreur de connexion.'
    }
  }
};

export default translations;
