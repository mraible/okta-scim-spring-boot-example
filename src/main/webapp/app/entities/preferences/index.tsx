import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Preferences from './preferences';
import PreferencesDetail from './preferences-detail';
import PreferencesUpdate from './preferences-update';
import PreferencesDeleteDialog from './preferences-delete-dialog';

const PreferencesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Preferences />} />
    <Route path="new" element={<PreferencesUpdate />} />
    <Route path=":id">
      <Route index element={<PreferencesDetail />} />
      <Route path="edit" element={<PreferencesUpdate />} />
      <Route path="delete" element={<PreferencesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PreferencesRoutes;
