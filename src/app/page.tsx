// app/page.tsx (Next.js 13+ with App Router)
"use client";

import { useState } from "react";
import { Box, Typography, ToggleButton, ToggleButtonGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import dataSet from "../../public/data.json"; // 👈 JSON file

export default function home() {
  const [data,setData]=useState(dataSet);
  const [view, setView] = useState<"bar" | "line" | "pie">("bar");
  const [showTable, setShowTable] = useState(true);

  const handleViewChange = (_: any, newView: "bar" | "line" | "pie") => {
    if (newView) {
      console.log("Switched view to:", newView);
      setView(newView);
    }
  };

  // Sample datasets from JSON
  const funnelData = data?.applicationFunnel;
  const signPerformance = data?.signPerformance;
  const merchantStatus = data?.merchantStatus;

   if (!data) {
    return <div>Loading chart data...</div>;
  }

  return (
    <Box sx={{ p: 4, bgcolor: "black", minHeight: "100vh", color: "white" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#39FF14" }}>
        🚀 Merchant Lifecycle Dashboard
      </Typography>

      {/* Toggle chart view */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="bar">Application Funnel</ToggleButton>
        <ToggleButton value="line">Adobe Sign Performance</ToggleButton>
        <ToggleButton value="pie">Merchant Status</ToggleButton>
      </ToggleButtonGroup>

      {/* Chart Display */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.900" }}>
        {view === "bar" && (
          <BarChart
            xAxis={[{ scaleType: "band", dataKey: "Months" }]}
            series={[
                  { dataKey: "Draft", label: "Draft" },
                  { dataKey: "Awaiting Signature", label: "Awaiting Signature" },
                  { dataKey: "NPI Review", label: "NPI Review" },
                  { dataKey: "Active", label: "Active" },
                ]}
            dataset={funnelData}
            height={300}
          />
        )}
        {view === "line" && (
          <LineChart
            xAxis={[{ dataKey: "week" }]}
            series={[{ dataKey: "avgTime", label: "Avg Time (days)", color: "#39FF14" }]}
            dataset={signPerformance}
            height={300}
          />
        )}
        {view === "pie" && (
          <PieChart
            series={[
              {
                data: merchantStatus.map((item, i) => ({
                  id: i,
                  value: item.value,
                  label: item.status,
                  color: item.status === "Active" ? "#39FF14" : item.status === "Inactive" ? "grey" : "red",
                })),
              },
            ]}
            height={300}
          />
        )}
      </Paper>

      {/* Toggle Table */}
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
        <TableContainer component={Paper} sx={{ bgcolor: "grey.900" }}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(
                  view === "bar"
                    ? funnelData[0]
                    : view === "line"
                    ? signPerformance[0]
                    : merchantStatus[0]
                ).map((key) => (
                  <TableCell key={key} sx={{ color: "#39FF14" }}>
                    {key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(view === "bar" ? funnelData : view === "line" ? signPerformance : merchantStatus).map(
                (row, idx) => (
                  <TableRow key={idx}>
                    {Object.values(row).map((val, i) => (
                      <TableCell key={i} sx={{ color: "white" }}>
                        {val}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
 
