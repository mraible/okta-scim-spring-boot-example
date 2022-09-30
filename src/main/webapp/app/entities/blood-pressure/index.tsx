import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import BloodPressure from './blood-pressure';
import BloodPressureDetail from './blood-pressure-detail';
import BloodPressureUpdate from './blood-pressure-update';
import BloodPressureDeleteDialog from './blood-pressure-delete-dialog';

const BloodPressureRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<BloodPressure />} />
    <Route path="new" element={<BloodPressureUpdate />} />
    <Route path=":id">
      <Route index element={<BloodPressureDetail />} />
      <Route path="edit" element={<BloodPressureUpdate />} />
      <Route path="delete" element={<BloodPressureDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default BloodPressureRoutes;
