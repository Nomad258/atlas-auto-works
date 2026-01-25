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
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
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
    quote: null,
    booking: null,
  }),
}))

export default useStore
