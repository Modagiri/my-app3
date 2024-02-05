import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Home from "./renderer/components/Home";




const root = createRoot(document.body);
root.render(<Home />);
