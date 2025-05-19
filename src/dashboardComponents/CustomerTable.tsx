/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import {
  Customer,
  Customers_Api_call,
  DataContext,
} from "../store/DataContext";
import "./CustomerTable.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApiCalls } from "../store/axios";

import {
  Button,
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
import "dayjs";

interface ActionsContainerProps {
  takeAssessment: () => void;
}

const actions = ["Go to profile", "See plan", "Take Assessment"];

const ActionsContainer = (props: ActionsContainerProps) => {
  const [value, setValue] = useState(actions[0]);

  const changeHandler = (event: SelectChangeEvent) => {
    if (event.target.value === actions[2]) {
      props.takeAssessment();
    }
    setValue(event.target.value as string);
  };
  return (
    <Select
      value={value}
      size="small"
      sx={{
        bgcolor: "#0070FF",
        color: "white",
        fontSize: "0.75rem", // smaller font
        minHeight: "30px", // decrease height
        ".MuiSelect-icon": {
          color: "white", // icon color
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent", // optional: remove border
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "white",
        },
      }}
      onChange={changeHandler}
    >
      {actions.map((action) => (
        <MenuItem value={action}>{action}</MenuItem>
      ))}
    </Select>
  );
};

const CustomerTable = () => {
  const { customers, setSelectComponent, customers_Api_call } =
    useContext(DataContext);
  const [columns, setColumns] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { customers_fetching } = useApiCalls();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await customers_fetching();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // console.log(customers_Api_call);

  const assessmentHandler = () => {
    setSelectComponent("assessment");
  };

  const generateColumns = () => {
    const columns: GridColDef[] = [
      { field: "no", headerName: "SI.No" },
      { field: "name", headerName: "Name" },
      { field: "age", headerName: "Age" },
			{ field: "mobile", headerName: "Mobile" },
      { field: "joinedOn", headerName: "Joined On" },
      { field: "phoneNumber", headerName: "Phone Number" },
      { field: "memberShip", headerName: "Membership" },
      { field: "lastAssessedOn", headerName: "Last Assessed On" },
      { field: "planAllocated", headerName: "Plan Allocated" },
      {
        field: "action",
        headerName: "",
        renderCell: () => (
          <ActionsContainer takeAssessment={assessmentHandler} />
        ),
      },
    ];
    return columns;
  };

  const generateRows = () => {
    const rows = customers_Api_call.map(
      (customer: Customers_Api_call, i: number) => {
        return {
          no: i + 1,
          id: customer.userId,
          name: customer.name,
          age: customer.age,
					mobile: customer.mobile || "-",
          joinedOn: customer.created_on,
          phoneNumber: customer.mobile || "-",
          memberShip: customer.membershipType,
          lastAssessedOn: customer.lastAssessed || "-",
          planAllocated: customer.plansAllocated[0] || "-",
        };
      }
    );
    return rows;
  };

  const formatColumns = (columns: GridColDef[]) => {
    const col = columns.map((column) => {
      const width = ref.current!.clientWidth;
      if (column.field == "no") {
        return { ...column, width: 70, headerAlign: "center", align: "center" };
      } else if (column.field === "action") {
        return {
          ...column,
          width: 170,
          headerAlign: "center",
          align: "center",
        };
      } else {
        return {
          ...column,
          width: width / 9.7,
          headerAlign: "center",
          align: "center",
        };
      }
    });
    return col;
  };

  useEffect(() => {
    if (!ref.current) return;
    const rows = generateRows();
    const columns = generateColumns();
    const formattedColumns = formatColumns(columns);
    setColumns(formattedColumns);
    setRows(rows);
  }, [customers_Api_call]);

  if (isLoading) {
    return <div>Loading customers...</div>;
  }

  return (
    <div className="customer-dashboard-outlay-container">
      <div className="--side-bar"></div>

      <div className="customer-dashboard-container" ref={ref}>
        <div className="customer-dashboard-main-table-container">
          <div className="customer-dashboard-main-top-filter-container">
            <div className="customer-dashboard-search-container">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                sx={{ width: 300 }} // adjust as needed
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
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          maxWidth: 150,
                          fontSize: "0.8rem",
                        },
                      },
                    }}
                    label="Date"
                  />
                </LocalizationProvider>
              </div>
              <div className="--delete">
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    padding: "5px 12px",
                    border: "1.3px solid rgba(0, 0, 0, 0.15)",
                  }}
                  startIcon={<DeleteIcon />}
                  size="small"
                >
                  Delete
                </Button>
              </div>
              <div className="--export">
                <Button
                  variant="outlined"
                  sx={{
                    padding: "5px 12px",
                    background: "#FFFFFF",
                    color: "rgba(0, 0, 0, 0.8)",
                    border: "1.3px solid rgba(0, 0, 0, 0.15)",
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
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0, maxHeight: "600px" }}
            />
          </div>
        </div>
        <div className="customer-dashboard-footer-container">
          <div className="--customer-dashboard-bottom-box">
            <span className="--head">3</span>
            <span className="--tail">Assessment Due</span>
          </div>
          <div className="--customer-dashboard-bottom-box">
            <span className="--head">5</span>
            <span className="--tail">Total Customers</span>
          </div>
          <div className="--customer-dashboard-bottom-box">
            <span className="--head">5</span>
            <span className="--tail">Total Members</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
