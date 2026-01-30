import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Current step in the configurator
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),

  // Vehicle data from VIN
  vehicle: null,
  setVehicle: (vehicle) => set({ vehicle }),

  // Selected configuration
  configuration: {
    paint: null,
    wrap: null,
    bodykit: null,
    wheels: null,
    interior: null,
    starlight: null,
    accessories: [],
  },
  setConfiguration: (key, value) => set((state) => ({
    configuration: { ...state.configuration, [key]: value }
  })),
  addAccessory: (accessory) => set((state) => ({
    configuration: {
      ...state.configuration,
      accessories: [...state.configuration.accessories, accessory]
    }
  })),
  removeAccessory: (accessoryId) => set((state) => ({
    configuration: {
      ...state.configuration,
      accessories: state.configuration.accessories.filter(a => a.id !== accessoryId)
    }
  })),
  clearConfiguration: () => set({
    configuration: {
      paint: null,
      wrap: null,
      bodykit: null,
      wheels: null,
      interior: null,
      starlight: null,
      accessories: [],
    }
  }),

  // Car color/appearance for 3D viewer
  carColor: '#1C1C1C',
  setCarColor: (color) => set({ carColor: color }),

  wheelColor: '#1C1C1C',
  setWheelColor: (color) => set({ wheelColor: color }),

  // Wheel model for 3D viewer (product ID for config lookup)
  wheelProductId: null,
  setWheelProductId: (productId) => set({ wheelProductId: productId }),

  // Legacy wheel model path (for backwards compatibility)
  wheelModel: null,
  setWheelModel: (model) => set({ wheelModel: model }),

  // Body kit product ID for config lookup
  bodykitProductId: null,
  setBodykitProductId: (productId) => set({ bodykitProductId: productId }),

  // Body kit components (separate GLB models) - legacy support
  bodyKitParts: {
    frontBumper: null,
    sideskirts: null,
    rearDiffuser: null,
    spoiler: null,
  },
  setBodyKitPart: (part, model) => set((state) => ({
    bodyKitParts: { ...state.bodyKitParts, [part]: model }
  })),
  clearBodyKitParts: () => set({
    bodyKitParts: {
      frontBumper: null,
      sideskirts: null,
      rearDiffuser: null,
      spoiler: null,
    }
  }),

  // Interior configuration
  interiorProductId: null,
  setInteriorProductId: (productId) => set({ interiorProductId: productId }),
  interiorColor: null, // Selected color variant
  setInteriorColor: (color) => set({ interiorColor: color }),

  // Starlight configuration
  starlightProductId: null,
  setStarlightProductId: (productId) => set({ starlightProductId: productId }),
  starlightColor: '#FFFFFF', // RGB color for starlight
  setStarlightColor: (color) => set({ starlightColor: color }),

  // Accessories - multiple can be selected
  accessoryProductIds: [],
  addAccessoryProductId: (productId) => set((state) => ({
    accessoryProductIds: [...state.accessoryProductIds, productId]
  })),
  removeAccessoryProductId: (productId) => set((state) => ({
    accessoryProductIds: state.accessoryProductIds.filter(id => id !== productId)
  })),
  clearAccessoryProductIds: () => set({ accessoryProductIds: [] }),

  // Brake caliper color (for Brembo kit)
  caliperColor: '#CC0000',
  setCaliperColor: (color) => set({ caliperColor: color }),

  // Window tint level
  windowTintLevel: null,
  setWindowTintLevel: (level) => set({ windowTintLevel: level }),

  // Preview mode - for live preview when hovering products
  previewMode: {
    active: false,
    type: null, // 'paint', 'wrap', 'wheels', etc.
    value: null, // The preview color/model
  },
  setPreview: (type, value) => set({
    previewMode: { active: true, type, value }
  }),
  clearPreview: () => set({
    previewMode: { active: false, type: null, value: null }
  }),

  // Location visualization
  selectedLocation: 'casablanca',
  setSelectedLocation: (location) => set({ selectedLocation: location }),

  selectedSeason: 'summer',
  setSelectedSeason: (season) => set({ selectedSeason: season }),

  timeOfDay: 'day',
  setTimeOfDay: (time) => set({ timeOfDay: time }),

  // Quote data
  quote: null,
  setQuote: (quote) => set({ quote }),

  // Booking data
  booking: null,
  setBooking: (booking) => set({ booking }),

  // Products catalog
  products: null,
  setProducts: (products) => set({ products }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Get all selected items for quote
  getSelectedItems: () => {
    const config = get().configuration;
    const items = [];

    if (config.paint) items.push(config.paint);
    if (config.wrap) items.push(config.wrap);
    if (config.bodykit) items.push(config.bodykit);
    if (config.wheels) items.push(config.wheels);
    if (config.interior) items.push(config.interior);
    if (config.starlight) items.push(config.starlight);
    items.push(...config.accessories);

    return items;
  },

  // Calculate total
  getTotal: () => {
    const items = get().getSelectedItems();
    return items.reduce((sum, item) => {
      const price = parseFloat(item?.price) || 0;
      return sum + price;
    }, 0);
  },

  // Reset all
  reset: () => set({
    currentStep: 0,
    vehicle: null,
    configuration: {
      paint: null,
      wrap: null,
      bodykit: null,
      wheels: null,
      interior: null,
      starlight: null,
      accessories: [],
    },
    carColor: '#1C1C1C',
    wheelColor: '#1C1C1C',
    wheelProductId: null,
    bodykitProductId: null,
    bodyKitParts: {
      frontBumper: null,
      sideskirts: null,
      rearDiffuser: null,
      spoiler: null,
    },
    interiorProductId: null,
    interiorColor: null,
    starlightProductId: null,
    starlightColor: '#FFFFFF',
    accessoryProductIds: [],
    caliperColor: '#CC0000',
    windowTintLevel: null,
    quote: null,
    booking: null,
  }),
}))

export default useStore
