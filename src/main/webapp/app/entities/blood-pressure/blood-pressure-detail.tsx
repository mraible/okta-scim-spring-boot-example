import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './blood-pressure.reducer';

export const BloodPressureDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const bloodPressureEntity = useAppSelector(state => state.bloodPressure.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bloodPressureDetailsHeading">
          <Translate contentKey="healthPointsApp.bloodPressure.detail.title">BloodPressure</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{bloodPressureEntity.id}</dd>
          <dt>
            <span id="timestamp">
              <Translate contentKey="healthPointsApp.bloodPressure.timestamp">Timestamp</Translate>
            </span>
          </dt>
          <dd>
            {bloodPressureEntity.timestamp ? (
              <TextFormat value={bloodPressureEntity.timestamp} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="systolic">
              <Translate contentKey="healthPointsApp.bloodPressure.systolic">Systolic</Translate>
            </span>
          </dt>
          <dd>{bloodPressureEntity.systolic}</dd>
          <dt>
            <span id="diastolic">
              <Translate contentKey="healthPointsApp.bloodPressure.diastolic">Diastolic</Translate>
            </span>
          </dt>
          <dd>{bloodPressureEntity.diastolic}</dd>
          <dt>
            <Translate contentKey="healthPointsApp.bloodPressure.user">User</Translate>
          </dt>
          <dd>{bloodPressureEntity.user ? bloodPressureEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/blood-pressure" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/blood-pressure/${bloodPressureEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default BloodPressureDetail;
