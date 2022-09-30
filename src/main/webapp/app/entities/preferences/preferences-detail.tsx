import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './preferences.reducer';

export const PreferencesDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const preferencesEntity = useAppSelector(state => state.preferences.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="preferencesDetailsHeading">
          <Translate contentKey="healthPointsApp.preferences.detail.title">Preferences</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{preferencesEntity.id}</dd>
          <dt>
            <span id="weeklyGoal">
              <Translate contentKey="healthPointsApp.preferences.weeklyGoal">Weekly Goal</Translate>
            </span>
          </dt>
          <dd>{preferencesEntity.weeklyGoal}</dd>
          <dt>
            <span id="weightUnits">
              <Translate contentKey="healthPointsApp.preferences.weightUnits">Weight Units</Translate>
            </span>
          </dt>
          <dd>{preferencesEntity.weightUnits}</dd>
          <dt>
            <Translate contentKey="healthPointsApp.preferences.user">User</Translate>
          </dt>
          <dd>{preferencesEntity.user ? preferencesEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/preferences" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/preferences/${preferencesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PreferencesDetail;
