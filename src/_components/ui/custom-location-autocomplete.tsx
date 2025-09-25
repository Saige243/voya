"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { Loader } from "@googlemaps/js-api-loader";
import type {
  GoogleMapsWindow,
  GooglePlacesService,
  GoogleAutocompleteService,
  GooglePlace,
  LocationData,
  PlaceSuggestion,
} from "./types";

interface CustomLocationAutocompleteProps {
  value: string;
  onChange: (location: string) => void;
  onLocationSelect?: (locationData: LocationData) => void;
  placeholder?: string;
  id?: string;
}

export function CustomLocationAutocomplete({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Search for a location...",
  id,
}: CustomLocationAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<Loader | null>(null);
  const placesServiceRef = useRef<GooglePlacesService | null>(null);
  const autocompleteServiceRef = useRef<GoogleAutocompleteService | null>(null);

  const onChangeRef = useRef(onChange);
  const onLocationSelectRef = useRef(onLocationSelect);

  useEffect(() => {
    onChangeRef.current = onChange;
    onLocationSelectRef.current = onLocationSelect;
  }, [onChange, onLocationSelect]);

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        setError("Google Maps API key not configured");
        return;
      }

      try {
        setIsLoading(true);

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places"],
        });

        loaderRef.current = loader;
        await loader.load();

        const google = (window as GoogleMapsWindow).google;

        if (!google?.maps?.places) {
          setError("Google Maps Places API not loaded");
          return;
        }

        placesServiceRef.current = new google.maps.places.PlacesService(
          document.createElement("div"),
        );
        autocompleteServiceRef.current =
          new google.maps.places.AutocompleteService();
      } catch (err) {
        console.error("Error initializing Google Maps:", err);
        setError("Failed to load location search. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void initializeGoogleMaps();
  }, []);

  const hideSuggestions = () => {
    setShowSuggestions(false);
  };

  const searchPlaces = (query: string) => {
    if (!autocompleteServiceRef.current || !query.trim()) {
      hideSuggestions();
      return;
    }

    const request = {
      input: query,
      types: ["establishment", "geocode"],
    };

    autocompleteServiceRef.current.getPlacePredictions(
      request,
      (predictions: PlaceSuggestion[], status: string) => {
        if (status === "OK" && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } else {
          hideSuggestions();
        }
      },
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChangeRef.current(newValue);

    if (newValue.trim()) {
      searchPlaces(newValue);
    } else {
      hideSuggestions();
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      hideSuggestions();
    }, 200);
  };

  const handleSuggestionClick = (suggestion: PlaceSuggestion) => {
    if (!placesServiceRef.current) return;

    const request = {
      placeId: suggestion.place_id,
      fields: ["place_id", "name", "formatted_address", "geometry"],
    };

    placesServiceRef.current.getDetails(
      request,
      (place: GooglePlace | null, status: string) => {
        if (status === "OK" && place) {
          const locationData: LocationData = {
            name: place.name,
            placeId: place.place_id,
            formattedAddress: place.formatted_address || place.name,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          };

          onChangeRef.current(locationData.formattedAddress);

          onLocationSelectRef.current?.(locationData);

          hideSuggestions();
        }
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const suggestion = suggestions[selectedIndex];
          if (suggestion) {
            handleSuggestionClick(suggestion);
          }
        }
        break;
      case "Escape":
        hideSuggestions();
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className={error ? "border-red-500" : ""}
      />

      {isLoading && (
        <p className="text-sm text-gray-500">Loading location search...</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              className={`cursor-pointer border-b border-gray-100 px-3 py-2 last:border-b-0 ${
                index === selectedIndex
                  ? "bg-blue-50 text-blue-900"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="text-sm font-medium">
                {suggestion.structured_formatting.main_text}
              </div>
              <div className="text-xs text-gray-500">
                {suggestion.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
