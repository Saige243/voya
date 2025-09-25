// Google Maps API types
export interface GoogleMapsWindow extends Window {
  google?: {
    maps: {
      places: {
        PlacesService: new (div: HTMLDivElement) => GooglePlacesService;
        AutocompleteService: new () => GoogleAutocompleteService;
        PlacesServiceStatus: {
          OK: string;
        };
      };
    };
  };
}

export interface GooglePlacesService {
  getDetails: (
    request: { placeId: string; fields: string[] },
    callback: (place: GooglePlace | null, status: string) => void,
  ) => void;
}

export interface GoogleAutocompleteService {
  getPlacePredictions: (
    request: { input: string; types: string[] },
    callback: (predictions: PlaceSuggestion[], status: string) => void,
  ) => void;
}

export interface GooglePlace {
  name: string;
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
}

// Location autocomplete types
export interface LocationData {
  name: string;
  placeId: string;
  formattedAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
}

export interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
