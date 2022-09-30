import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Weight from './weight';
import WeightDetail from './weight-detail';
import WeightUpdate from './weight-update';
import WeightDeleteDialog from './weight-delete-dialog';

const WeightRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Weight />} />
    <Route path="new" element={<WeightUpdate />} />
    <Route path=":id">
      <Route index element={<WeightDetail />} />
      <Route path="edit" element={<WeightUpdate />} />
      <Route path="delete" element={<WeightDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default WeightRoutes;
