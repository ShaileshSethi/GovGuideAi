import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock the fetch API
global.fetch = jest.fn();

// Mock toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

const mockActionPlan = {
  isClarificationNeeded: false,
  summary: "Mock summary",
  services: [
    {
      name: "Mock Service",
      description: "Mock description",
      required_documents: [],
      application_steps: ["Step 1"],
      processing_time: "5 days",
      application_fee: "Free",
      official_apply_link: "https://example.com",
      official_information_link: "https://example.com"
    }
  ],
  next_steps: ["Next Step"],
  tips: ["Helpful Tip"]
};

describe('Home Page UI', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  const renderHome = () => {
    render(
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    );
  };

  it('renders the initial UI elements correctly', () => {
    renderHome();
    
    // Check titles
    expect(screen.getByText('GovGuide AI')).toBeInTheDocument();
    expect(screen.getByText('Generate Action Plan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Specify your problem/i)).toBeInTheDocument();
  });

  it('submits a search query and renders the action plan', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockActionPlan,
    });

    renderHome();
    
    const input = screen.getByPlaceholderText(/Specify your problem/i);
    const button = screen.getByText('Generate Action Plan');

    fireEvent.change(input, { target: { value: 'I need a mock service' } });
    fireEvent.click(button);

    // Wait for the action plan to render
    await waitFor(() => {
      expect(screen.getByText('Mock Service')).toBeInTheDocument();
    });

    expect(screen.getByText('Mock summary')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('5 days')).toBeInTheDocument();
  });

  it('can open document info modal and close it', async () => {
    const planWithDocs = {
      ...mockActionPlan,
      services: [
        {
          ...mockActionPlan.services[0],
          required_documents: [{ name: 'Test Document', purpose: 'To test', where_to_get: 'Online', issuing_authority: 'Testing Dept', official_link: 'http://test.com', mandatory: true }]
        }
      ]
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => planWithDocs });
    renderHome();
    
    fireEvent.change(screen.getByPlaceholderText(/Specify your problem/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByText('Generate Action Plan'));
    
    await waitFor(() => {
      expect(screen.getByText('Test Document')).toBeInTheDocument();
    });
    
    // Click Info button
    fireEvent.click(screen.getByText('Info'));
    
    // Check Modal
    expect(screen.getByText('To test')).toBeInTheDocument();
    
    // Click backdrop to close
    fireEvent.click(screen.getByText('To test').parentElement?.parentElement?.parentElement?.firstChild as HTMLElement);
  });
});
