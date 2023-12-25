import React from 'react';
import { Button, Col, Form, FormCheck, FormControl, FormLabel, Row } from 'react-bootstrap';
import './OrbitFilter.styles.css';

interface OrbitFilterProps {
  name: string | null;
  incl: string | null;
  isCircle: string | null;
  setName: (value: string) => void;
  setIncl: (value: string) => void;
  setIsCircle: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const OrbitFilter: React.FC<OrbitFilterProps> = ({
  name,
  incl,
  isCircle,
  setName,
  setIncl,
  setIsCircle,
  applyFilters,
  clearFilters,
}) => {
  return (
    <Form className="orbit-filter-container">
      <Row>
        <Col>
          <FormControl
            placeholder='Название орбиты'
            type="text"
            value={name?.toString()}
            onChange={(e) => setName(e.target.value)}
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
            onChange={() => setIsCircle(isCircle === '1' ? '' : '1')}
          />
          <FormCheck
            type="checkbox"
            label="Эллиптическая"
            checked={isCircle === '0'}
            onChange={() => setIsCircle(isCircle === '0' ? '' : '0')}
          />
        </Col>
        <Col>
          <FormCheck
            type="checkbox"
            label="Наклонная"
            checked={incl === '1'}
            onChange={() => setIncl(incl === '1' ? '' : '1')}
          />
        </Col>
      </Row>
      <Row className="orbit-buttons">
        <Col>
          <Button className="orbit-button" onClick={applyFilters}>
            Поиск
          </Button>
        </Col>
        <Col>
          <Button className="orbit-button" onClick={clearFilters}>
            Очистить
          </Button>
        </Col>
      </Row>
    </Form>
  );
  
};

export default OrbitFilter;
