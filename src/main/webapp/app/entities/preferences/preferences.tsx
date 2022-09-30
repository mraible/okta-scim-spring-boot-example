import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input, InputGroup, FormGroup, Form, Row, Col, Table } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IPreferences } from 'app/shared/model/preferences.model';
import { searchEntities, getEntities } from './preferences.reducer';

export const Preferences = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const preferencesList = useAppSelector(state => state.preferences.entities);
  const loading = useAppSelector(state => state.preferences.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const startSearching = e => {
    if (search) {
      dispatch(searchEntities({ query: search }));
    }
    e.preventDefault();
  };

  const clear = () => {
    setSearch('');
    dispatch(getEntities({}));
  };

  const handleSearch = event => setSearch(event.target.value);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="preferences-heading" data-cy="PreferencesHeading">
        <Translate contentKey="healthPointsApp.preferences.home.title">Preferences</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="healthPointsApp.preferences.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/preferences/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="healthPointsApp.preferences.home.createLabel">Create new Preferences</Translate>
          </Link>
        </div>
      </h2>
      <Row>
        <Col sm="12">
          <Form onSubmit={startSearching}>
            <FormGroup>
              <InputGroup>
                <Input
                  type="text"
                  name="search"
                  defaultValue={search}
                  onChange={handleSearch}
                  placeholder={translate('healthPointsApp.preferences.home.search')}
                />
                <Button className="input-group-addon">
                  <FontAwesomeIcon icon="search" />
                </Button>
                <Button type="reset" className="input-group-addon" onClick={clear}>
                  <FontAwesomeIcon icon="trash" />
                </Button>
              </InputGroup>
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <div className="table-responsive">
        {preferencesList && preferencesList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="healthPointsApp.preferences.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="healthPointsApp.preferences.weeklyGoal">Weekly Goal</Translate>
                </th>
                <th>
                  <Translate contentKey="healthPointsApp.preferences.weightUnits">Weight Units</Translate>
                </th>
                <th>
                  <Translate contentKey="healthPointsApp.preferences.user">User</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {preferencesList.map((preferences, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/preferences/${preferences.id}`} color="link" size="sm">
                      {preferences.id}
                    </Button>
                  </td>
                  <td>{preferences.weeklyGoal}</td>
                  <td>
                    <Translate contentKey={`healthPointsApp.Units.${preferences.weightUnits}`} />
                  </td>
                  <td>{preferences.user ? preferences.user.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/preferences/${preferences.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/preferences/${preferences.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/preferences/${preferences.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="healthPointsApp.preferences.home.notFound">No Preferences found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Preferences;
