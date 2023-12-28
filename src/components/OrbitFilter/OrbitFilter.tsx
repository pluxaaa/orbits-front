import React from 'react';
import { Button, Col, Form, FormCheck, FormControl, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setOrbName, setOrbIncl, setOrbCircle } from '../../store/newFilter';
import './OrbitFilter.styles.css';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

interface OrbitFilterProps {
  name: string | null | undefined;
  incl: string | null | undefined;
  isCircle: string | null | undefined;
  setName: React.Dispatch<React.SetStateAction<string | undefined>> | ActionCreatorWithPayload<string, "data/setOrbName">;
  setIncl: React.Dispatch<React.SetStateAction<string | undefined>> | ActionCreatorWithPayload<string, "data/setOrbIncl">;
  setIsCircle: React.Dispatch<React.SetStateAction<string | undefined>> | ActionCreatorWithPayload<string, "data/setOrbCircle">;
  applyFilters: () => void;
  clearFilters: () => void;
}


const OrbitFilter: React.FC<OrbitFilterProps> = ({ applyFilters, clearFilters }) => {
  const dispatch = useDispatch();

  // Use Redux selectors to get values from the Redux state
  const name = useSelector((state: { newFilter: { orbName: string } }) => state.newFilter.orbName);
  const incl = useSelector((state: { newFilter: { orbIncl: string } }) => state.newFilter.orbIncl);
  const isCircle = useSelector((state: { newFilter: { orbCircle: string } }) => state.newFilter.orbCircle);

  return (
    <Form className="orbit-filter-container">
      <Row>
        <Col>
          <FormControl
            placeholder='Название орбиты'
            type="text"
            value={name?.toString()}
            onChange={(e) => dispatch(setOrbName(e.target.value))}
            className="orbit-input"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormCheck
            type="checkbox"
            label="Круговая"
            checked={isCircle === '1'}
            onChange={() => dispatch(setOrbCircle(isCircle === '1' ? '' : '1'))}
          />
          <FormCheck
            type="checkbox"
            label="Эллиптическая"
            checked={isCircle === '0'}
            onChange={() => dispatch(setOrbCircle(isCircle === '0' ? '' : '0'))}
          />
        </Col>
        <Col>
          <FormCheck
            type="checkbox"
            label="Наклонная"
            checked={incl === '1'}
            onChange={() => dispatch(setOrbIncl(incl === '1' ? '' : '1'))}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button className="button" onClick={applyFilters}>
            Поиск
          </Button>
        </Col>
        <Col>
          <Button className="button" style={{ marginRight: '0' }} onClick={clearFilters}>
            Очистить
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default OrbitFilter;
