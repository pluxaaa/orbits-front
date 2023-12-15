import React from 'react';
import { Form, Row, Col, FormControl, FormLabel, FormCheck, Button } from 'react-bootstrap';

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
    <Form>
      <Row>
        <Col>
          <FormLabel>Название орбиты:</FormLabel>
          <FormControl
            type="text"
            value={name?.toString()}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        <Col>
          <FormCheck
            type="checkbox"
            label="Наклонная"
            checked={incl === "1"}
            onChange={() => setIncl(incl === "1" ? "" : "1")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormCheck
            type="checkbox"
            label="Круговая"
            checked={isCircle === "1"}
            onChange={() => setIsCircle(isCircle === "1" ? "" : "1")}
          />
          <FormCheck
            type="checkbox"
            label="Эллиптическая"
            checked={isCircle === "0"}
            onChange={() => setIsCircle(isCircle === "0" ? "" : "0")}
          />
        </Col>
      </Row>
      <Col>
        <Button onClick={applyFilters}>Поиск</Button>
      </Col>
      <Col>
        <Button variant="secondary" onClick={clearFilters}>Очистить</Button>
      </Col>
    </Form>
  );
};

export default OrbitFilter;
