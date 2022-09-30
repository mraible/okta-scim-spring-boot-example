import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Points from './points';
import PointsDetail from './points-detail';
import PointsUpdate from './points-update';
import PointsDeleteDialog from './points-delete-dialog';

const PointsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Points />} />
    <Route path="new" element={<PointsUpdate />} />
    <Route path=":id">
      <Route index element={<PointsDetail />} />
      <Route path="edit" element={<PointsUpdate />} />
      <Route path="delete" element={<PointsDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PointsRoutes;
