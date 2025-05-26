/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { Customers_Api_call, DataContext } from "../store/DataContext";
import "./CustomerTable.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApiCalls } from "../store/axios";
import {
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const actions = ["Go to profile", "See plan", "Take Assessment"];

interface ActionsContainerProps {
  takeAssessment: () => void;
}

const ActionsContainer = ({ takeAssessment }: ActionsContainerProps) => {
  const [value, setValue] = useState(actions[0]);

  const changeHandler = (event: SelectChangeEvent) => {
    if (event.target.value === actions[2]) {
      takeAssessment();
    }
    setValue(event.target.value);
  };

  return (
    <Select
      value={value}
      size="small"
      sx={{
        bgcolor: "#0070FF",
        color: "white",
        fontSize: "0.75rem",
        minHeight: "30px",
        ".MuiSelect-icon": { color: "white" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
        },
      }}
      onChange={changeHandler}
    >
      {actions.map((action) => (
        <MenuItem key={action} value={action}>
          {action}
        </MenuItem>
      ))}
    </Select>
  );
};

const CustomerTable = () => {
  const { setSelectComponent, customers_Api_call } = useContext(DataContext);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [term, setTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<any | null>(null);

  const { customers_fetching } = useApiCalls();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await customers_fetching();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const assessmentHandler = (customer: Customers_Api_call) => {
    localStorage.setItem("user", JSON.stringify(customer));
    setSelectComponent("assessment");
  };

  const dateChangeHandler = (date: any) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generateColumns = () => {
    return [
      { field: "no", headerName: "SI.No" },
      { field: "name", headerName: "Name" },
      { field: "age", headerName: "Age" },
      { field: "gender", headerName: "Gender" },
      { field: "joinedOn", headerName: "Joined On" },
      { field: "phoneNumber", headerName: "Phone Number" },
      { field: "memberShip", headerName: "Membership" },
      { field: "lastAssessedOn", headerName: "Last Assessed On" },
      { field: "planAllocated", headerName: "Plan Allocated" },
      {
        field: "action",
        headerName: "",
        renderCell: (params: any) => (
          <ActionsContainer
            takeAssessment={() => assessmentHandler(params.row.customerData)}
          />
        ),
      },
    ];
  };

  const generateRows = () => {
    return customers_Api_call.map((customer, i) => ({
      no: i + 1,
      id: customer.userId,
      name: customer.name,
      age: customer.age,
      gender: customer.gender || "-",
      joinedOn: dateChangeHandler(customer.created_on),
      phoneNumber: customer.mobile || "-",
      memberShip: customer.membershipType,
      lastAssessedOn: customer.lastAssessed || "-",
      planAllocated: customer.plansAllocated?.[0] || "-",
      customerData: customer,
    }));
  };

  const formatColumns = (columns: GridColDef[]) => {
    const width = ref.current?.clientWidth || 900;
    return columns.map((col) => {
      if (col.field === "no") {
        return { ...col, width: 70, headerAlign: "center", align: "center" };
      }
      if (col.field === "action") {
        return { ...col, width: 170, headerAlign: "center", align: "center" };
      }
      return {
        ...col,
        width: width / 9.7,
        headerAlign: "center",
        align: "center",
      };
    });
  };

  useEffect(() => {
    if (!ref.current) return;
    const _rows = generateRows();
    const _columns = formatColumns(generateColumns());
    setRows(_rows);
    setFilteredRows(_rows); // initially same as full list
    setColumns(_columns);
  }, [customers_Api_call]);

  useEffect(() => {
    const lowerTerm = term.toLowerCase();
    const filtered = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(lowerTerm) ||
        row.mobile?.toLowerCase().includes(lowerTerm) ||
        row.memberShip?.toLowerCase().includes(lowerTerm)
    );
    setFilteredRows(filtered);
  }, [term, rows]);


  useEffect(() => {
    if (!selectedDate) {
      setFilteredRows(rows);
      return;
    }
  
    const targetDate = new Date(selectedDate).toDateString();
  
    const filtered = rows.filter((row) => {
      const rowDate = new Date(row.joinedOn).toDateString();
      return rowDate === targetDate;
    });
  
    setFilteredRows(filtered);
  }, [selectedDate, rows]);
  

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      filteredRows
        .map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <CircularProgress style={{ color: "#1976d2" }} /> {/* Default MUI blue */}
      </div>
    );
  }
  const neverAssessedCount = rows.filter(
    (row) => !row.lastAssessedOn || row.lastAssessedOn === "-"
  ).length;
  

  return (
    <div className="customer-dashboard-outlay-container">
      <div className="--side-bar"></div>
      <div className="customer-dashboard-container" ref={ref}>
        <div className="customer-dashboard-main-table-container">
          <div className="customer-dashboard-main-top-filter-container">
            <div className="customer-dashboard-search-container">
              <TextField
                onChange={(e) => setTerm(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Search by name, mobile or membership..."
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="customer-dashboard-filter-container">
              <div className="--date">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    onChange={(newDate) => setSelectedDate(newDate)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { maxWidth: 150, fontSize: "0.8rem" },
                      },
                    }}
                    label="Joined On"
                  />
                </LocalizationProvider>
              </div>
              <div className="--delete">
                <Button
                  onClick={() => alert("Cannot delete")}
                  variant="outlined"
                  color="error"
                  sx={{
                    padding: "5px 12px",
                    border: "1.3px solid rgba(0,0,0,0.15)",
                  }}
                  startIcon={<DeleteIcon />}
                  size="small"
                >
                  Delete
                </Button>
              </div>
              <div className="--export">
                <Button
                  onClick={handleExport}
                  variant="outlined"
                  sx={{
                    padding: "5px 12px",
                    background: "#FFFFFF",
                    color: "rgba(0, 0, 0, 0.8)",
                    border: "1.3px solid rgba(0,0,0,0.15)",
                  }}
                  startIcon={<FileDownloadIcon />}
                  size="small"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
          <div className="customer-dashboard-table">
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0, maxHeight: "600px" }}
            />
          </div>
        </div>
        <div className="customer-dashboard-footer-container">
          <div className="--customer-dashboard-bottom-box">
            <span className="--head">{neverAssessedCount}</span>
            <span className="--tail">Assessment Due</span>
          </div>
          <div className="--customer-dashboard-bottom-box">
            <span className="--head">{rows.length}</span>
            <span className="--tail">Total Customers</span>
          </div>
          <div className="--customer-dashboard-bottom-box">
            <span className="--head">{rows.length}</span>
            <span className="--tail">Total Members</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
