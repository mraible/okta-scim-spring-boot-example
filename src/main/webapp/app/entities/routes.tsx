import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Points from './points';
import BloodPressure from './blood-pressure';
import Weight from './weight';
import Preferences from './preferences';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="points/*" element={<Points />} />
        <Route path="blood-pressure/*" element={<BloodPressure />} />
        <Route path="weight/*" element={<Weight />} />
        <Route path="preferences/*" element={<Preferences />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
