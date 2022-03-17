import { render, screen } from '@testing-library/react';
import { PatientStatistics } from '../PatientStatistics';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import store from "../../store.js";


describe("Patients statistics form", () => {
    it('renders without crashing', () => {
        render(<Provider store={store}><MemoryRouter><PatientStatistics/></MemoryRouter></Provider>);
    });
    it('Correct traced count value is outputted', () => {
        render(<MemoryRouter><PatientStatistics/></MemoryRouter>)
        const traced = screen.getByTestId('patient-users-traced');
        expect(parseInt(traced.innerHTML)).toBe(4);
    });
});
