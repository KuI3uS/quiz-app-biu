import { test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import QuizInfo from './QuizInfo';

test('wyświetla tytuł quizu', async () => {
    render(
        <MemoryRouter initialEntries={['/quiz/info/123']}>
            <Routes>
                <Route path="/quiz/info/:id" element={<QuizInfo />} />
            </Routes>
        </MemoryRouter>
    );

    const title = await screen.findByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
});