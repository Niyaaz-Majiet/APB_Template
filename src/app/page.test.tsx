/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

// Mock @mui/x-charts and sub-modules used by the page so tests don't depend on complex chart internals
vi.mock("@mui/x-charts", () => ({
  ChartsTooltip: (props: any) => <div data-testid="ChartsTooltip" {...props} />,
  ChartsLegend: (props: any) => <div data-testid="ChartsLegend" {...props} />,
  ChartsAxisHighlight: (props: any) => (
    <div data-testid="ChartsAxisHighlight" {...props} />
  ),
}));

vi.mock("@mui/x-charts/BarChart", () => ({
  BarChart: (props: any) => <div data-testid="BarChart">{props.children}</div>,
}));

vi.mock("@mui/x-charts/LineChart", () => ({
  LineChart: (props: any) => (
    <div data-testid="LineChart">{props.children}</div>
  ),
  lineElementClasses: { root: "line-root" },
  LineHighlightPlot: (props: any) => (
    <div data-testid="LineHighlightPlot">{props.children}</div>
  ),
}));

vi.mock("@mui/x-charts/PieChart", () => ({
  PieChart: (props: any) => <div data-testid="PieChart">{props.children}</div>,
}));

// Import the page component under test
import Page from "./page";

describe("src/app/page", () => {
  it("renders header, controls and table", () => {
    render(<Page />);

    // Basic header
    const header = screen.getByText(/Merchant Lifecycle Dashboard/i);
    expect(header).toBeTruthy();

    // Toggle label exists
    const funnelToggle = screen.getByText(/Application Funnel/i);
    expect(funnelToggle).toBeTruthy();

    // Month Range label (filter) should be present in funnel view
    const monthLabels = screen.getAllByText(/Month Range/i);
    expect(monthLabels.length).toBeGreaterThan(0);

    // Table should render
    const table = screen.getByRole("table");
    expect(table).toBeTruthy();
  });
});
