import { createContext } from 'react';

// Holds { status, deadlines }. See DeadlinesProvider.jsx for the shape.
export const DeadlinesContext = createContext(null);
