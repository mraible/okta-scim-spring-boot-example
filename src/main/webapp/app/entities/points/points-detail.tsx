import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './points.reducer';

export const PointsDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const pointsEntity = useAppSelector(state => state.points.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="pointsDetailsHeading">
          <Translate contentKey="healthPointsApp.points.detail.title">Points</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{pointsEntity.id}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="healthPointsApp.points.date">Date</Translate>
            </span>
          </dt>
          <dd>{pointsEntity.date ? <TextFormat value={pointsEntity.date} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="exercise">
              <Translate contentKey="healthPointsApp.points.exercise">Exercise</Translate>
            </span>
          </dt>
          <dd>{pointsEntity.exercise}</dd>
          <dt>
            <span id="meals">
              <Translate contentKey="healthPointsApp.points.meals">Meals</Translate>
            </span>
          </dt>
          <dd>{pointsEntity.meals}</dd>
          <dt>
            <span id="alcohol">
              <Translate contentKey="healthPointsApp.points.alcohol">Alcohol</Translate>
            </span>
          </dt>
          <dd>{pointsEntity.alcohol}</dd>
          <dt>
            <span id="notes">
              <Translate contentKey="healthPointsApp.points.notes">Notes</Translate>
            </span>
          </dt>
          <dd>{pointsEntity.notes}</dd>
          <dt>
            <Translate contentKey="healthPointsApp.points.user">User</Translate>
          </dt>
          <dd>{pointsEntity.user ? pointsEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/points" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/points/${pointsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PointsDetail;
