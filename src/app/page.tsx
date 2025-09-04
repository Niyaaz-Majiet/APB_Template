"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ChartsTooltip,
  ChartsLegend,
  ChartsAxisHighlight,
} from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  LineChart,
  lineElementClasses,
  LineHighlightPlot,
} from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import dataSet from "../../public/data.json"; // 👈 JSON file

export default function Complex() {
  const [data, setData] = useState(dataSet);
  const [view, setView] = useState<"funnel" | "sign" | "status">("funnel");
  const [statusView, setStatusView] = useState<"pie" | "area">("pie");
  const [showTable, setShowTable] = useState(true);
  const [monthRange, setMonthRange] = useState("All");

  const handleViewChange = (_: any, newView: "funnel" | "sign" | "status") => {
    if (newView) {
      setView(newView);
    }
  };

  if (
    !data ||
    !data.applicationFunnel ||
    !data.signPerformance ||
    !data.merchantStatus
  ) {
    return <div>Loading chart data...</div>;
  }

  // Sample datasets
  const funnelData = data?.applicationFunnel;
  const signPerformance = data?.signPerformance;
  const merchantStatus = data?.merchantStatus;

  // Month ranges
  const ranges: Record<string, string[]> = {
    All: [],
    "Q1 (Jan-Mar)": ["Jan", "Feb", "Mar"],
    "Q2 (Apr-Jun)": ["Apr", "May", "Jun"],
  };

  // Filter function
  const filterByRange = <T extends { Months?: string }>(dataset: T[]): T[] => {
    if (monthRange === "All") return dataset;
    const selected = ranges[monthRange];
    return dataset.filter((row) => row.Months && selected.includes(row.Months));
  };

  const filteredFunnel = filterByRange(funnelData);
  const filteredStatus = filterByRange(merchantStatus);

  return (
    <Box sx={{ p: 4, minHeight: "100vh", color: "white" }}>
      <Typography variant="h4" gutterBottom mb={5} sx={{ color: "#000" }}>
        Merchant Lifecycle Dashboard
      </Typography>

      {/* Month Filter */}
      {(view === "funnel" || view === "status") && (
        <FormControl sx={{ mb: 3, mr: 2, minWidth: 200 }}>
          <InputLabel id="simple-select-label">Month Range</InputLabel>

          <Select
            value={monthRange}
            onChange={(e) => {
              setMonthRange(e.target.value);
            }}
            label="Month Range"
            labelId="simple-select-label"
            sx={{
              color: "black",
              ".MuiSvgIcon-root": { color: "#39FF14" },
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#39FF14" },
            }}
          >
            {Object.keys(ranges).map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Main View Toggle */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="funnel">Application Funnel</ToggleButton>
        <ToggleButton value="sign">Adobe Sign Performance</ToggleButton>
        <ToggleButton value="status">Merchant Status</ToggleButton>
      </ToggleButtonGroup>

      {/* Chart Section */}
      <Paper sx={{ p: 3, mb: 3,border: "1px solid #39FF14" }}>
        {view === "funnel" && (
          <BarChart
            dataset={filteredFunnel}
            xAxis={[{ scaleType: "band", dataKey: "Months" }]}
            series={[
              { dataKey: "Draft", label: "Draft", color: "grey" },
              {
                dataKey: "Awaiting Signature",
                label: "Awaiting Signature",
                color: "#39FF14",
              },
              { dataKey: "NPI Review", label: "NPI Review", color: "red" },
              { dataKey: "Active", label: "Active", color: "#00bfff" },
            ]}
            height={350}
            layout="vertical"
          />
        )}

        {view === "sign" && (
          <LineChart
            height={500}
            series={[
              {
                data: [0, 43, 100, 23, 21, 33],
                label: "Completion Rate",
              },
            ]}
            xAxis={[
              {
                scaleType: "point",
                data: [
                  "week 1",
                  "week 2",
                  "week 3",
                  "week 4",
                  "week 5",
                  "week 6",
                ],
              },
            ]}
            yAxis={[
              {
                id: "completionRate",
                tickInterval: [0, 25, 50, 75, 100],
                label: "Completion rate",
              },
            ]}
          ></LineChart>
        )}

        {view === "status" && (
          <>
            {/* Toggle Pie vs Area */}
            <ToggleButtonGroup
              value={statusView}
              exclusive
              onChange={(_, newView) => {
                if (newView) {
                  setStatusView(newView);
                }
              }}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="pie">Pie (Latest Month)</ToggleButton>
              <ToggleButton value="area">Area (Trend)</ToggleButton>
            </ToggleButtonGroup>

            {statusView === "pie" ? (
              <PieChart
                series={[
                  {
                    data: Object.entries(
                      filteredStatus[filteredStatus.length - 1]
                    )
                      .filter(([key]) => key !== "Months")
                      .map(([status, value], i) => ({
                        id: i,
                        value: value as number,
                        label: status,
                        color:
                          status === "Active"
                            ? "#39FF14"
                            : status === "Inactive"
                            ? "grey"
                            : "red",
                      })),
                  },
                ]}
                height={350}
              />
            ) : (
              <LineChart
                height={300}
                series={[
                  {
                    data: filteredStatus.map((d) => d.Active),
                    label: "Active",
                    area: true,
                    stack: "total",
                    showMark: false,
                  },
                  {
                    data: filteredStatus.map((d) => d.Inactive),
                    label: "Inactive",
                    area: true,
                    stack: "total",
                    showMark: false,
                  },
                  {
                    data: filteredStatus.map((d) => d.Suspended),
                    label: "Suspended",
                    area: true,
                    stack: "total",
                    showMark: false,
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: filteredStatus.map((d) => d.Months),
                  },
                ]}
                yAxis={[
                  {
                    width: 50,
                    label: "Number of Merchants",
                  },
                ]}
                sx={{
                  [`& .${lineElementClasses.root}`]: {
                    display: "none",
                  },
                }}
              >
                <LineHighlightPlot />
                <ChartsAxisHighlight x="line" />
                <ChartsTooltip trigger="axis" />
                <ChartsLegend />
              </LineChart>
            )}
          </>
        )}
      </Paper>

      {/* Table Toggle */}
      <ToggleButtonGroup
        value={showTable ? "table" : "no-table"}
        exclusive
        onChange={() => setShowTable(!showTable)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="table">Show Table</ToggleButton>
        <ToggleButton value="no-table">Hide Table</ToggleButton>
      </ToggleButtonGroup>

      {showTable && (
        <TableContainer component={Paper} sx={{ mb: 5,border: "1px solid #39FF14" }}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(
                  view === "funnel"
                    ? filteredFunnel[0]
                    : view === "sign"
                    ? signPerformance[0]
                    : filteredStatus[0]
                ).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(view === "funnel"
                ? filteredFunnel
                : view === "sign"
                ? signPerformance
                : filteredStatus
              ).map((row, idx) => (
                <TableRow key={idx}>
                  {Object.values(row).map((val, i) => (
                    <TableCell key={i}>{val}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
