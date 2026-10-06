import { createContext } from 'react';

// Holds { status, features, announcement }. See FeaturesProvider.jsx for the shape.
export const FeaturesContext = createContext(null);