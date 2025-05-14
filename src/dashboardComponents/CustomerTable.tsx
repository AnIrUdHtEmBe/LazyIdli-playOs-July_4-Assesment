import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Calendar,
  CalendarRangeIcon,
  ChevronDown,
  CloudDownload,
  Filter,
  Trash2,
} from "lucide-react";
import { DataContext } from "../store/DataContext";
import "./CustomerTable.css";
import { ArrowDownwardSharp, DownloadSharp } from "@mui/icons-material";

const CustomerTable: React.FC = () => {
  const { customers, setCustomers, selectComponent, setSelectComponent } =
    useContext(DataContext)!;

  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filteredCustomers = customers.filter((customer) => {
    const MatchedSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.membership
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm.toLowerCase().replace(/\s+/g, "")) ||
      customer.plan
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm.toLowerCase().replace(/\s+/g, ""));

    const joinedDate = new Date(customer.joinedOn);
    const isMonthMatch =
      joinedDate.getMonth() === selectedMonth &&
      joinedDate.getFullYear() === currentYear;

    return MatchedSearch && isMonthMatch;
  });

  console.log(customers);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedIds.length > 0 && selectedIds.length < filteredCustomers.length;
    }
  }, [selectedIds, filteredCustomers.length]);

  const paddedCustomers = [
    ...filteredCustomers,
    ...Array(Math.max(0, 11 - filteredCustomers.length)).fill(null),
  ];
  const nonArrowFilters = ["Gender" , "Phone No" , "Membership" , "Plan Allocated", ""];
  const isAllSelected =
    filteredCustomers.length > 0 &&
    selectedIds.length === filteredCustomers.length;

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : filteredCustomers.map((c) => c.id));
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
  };

  const handleSelectComponent = (name: Object) => {
    localStorage.setItem("user", JSON.stringify(name));
    setSelectComponent("assessment");
  };

  function filterCustomers(filterType: string) {
    if (filterType === "Name") {
      const sortedCustomers = [...customers].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCustomers(sortedCustomers);
    }
    if(filterType === "Sl No"){
      const sortedCustomers = [...customers].sort((a, b) => a.id - b.id);
      setCustomers(sortedCustomers);
    }
    if (filterType === "Age") {
      const sortedCustomers = [...customers].sort((a, b) => a.age - b.age);
      setCustomers(sortedCustomers);
    }
    if (filterType === "Joined On") {
      const sortedCustomers = [...customers].sort(
        (a, b) =>
          new Date(a.joinedOn).getTime() - new Date(b.joinedOn).getTime()
      );
      setCustomers(sortedCustomers);
    }
    if (filterType === "Last Asseessed On") {
      const sortedCustomers = [...customers].sort(
        (a, b) =>
          new Date(a.lastAssessed).getTime() -
          new Date(b.lastAssessed).getTime()
      );
      setCustomers(sortedCustomers);
    }
  }

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCsv = () => {
    if (filteredCustomers.length === 0) return;

    const headers = [
      "ID",
      "Name",
      "Age",
      "Joined On",
      "Phone",
      "Membership",
      "Last Assessed",
      "Plan",
    ];

    const rows = filteredCustomers.map((customer) => [
      customer.id,
      customer.name,
      customer.age,
      customer.joinedOn,
      customer.phone,
      customer.membership,
      customer.lastAssessed,
      customer.plan,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="customer-table">
      {/* Top Bar */}
      <div className="top-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or phone number"
          className="search-input"
        />
        <div className="action-buttons">
          <div className="month-selector">
            <Calendar size={16} className="ml-5" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="dropdown"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  <span>
                    {month} {currentYear}
                  </span>
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="btnFilter"
            >
              <Filter size={16} />
              Filter
              <i className="fa fa-caret-down" style={{ fontSize: "18  px" }}></i>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 z-50 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1 text-sm text-gray-700">
                  {["Name", "Age", "Joined On", "Last Assessed On"].map(
                    (label) => (
                      <li key={label}>
                        <button
                          onClick={() => {
                            filterCustomers(label);
                            setIsFilterOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          {label}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
          >
            <Trash2 size={16} style={{ marginRight: "4px" }} />
            <span>Delete</span>
          </button>
          <button className="csv-button" onClick={handleCsv}>
            <CloudDownload></CloudDownload>
            <span>Export to csv</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  ref={checkboxRef}
                  onChange={toggleSelectAll}
                  checked={isAllSelected}
                />
              </th>
              {[
                "Sl No",
                "Name",
                "Age",
                "Gender",
                "Joined On",
                "Phone No",
                "Membership",
                "Last Assessed On",
                "Plan Allocated",
                "",
              ].map((col) => (
                <th key={col}>
                  {col}
                  {nonArrowFilters.includes(col) ? null : <button className="arrow-down" onClick={() => filterCustomers(col)}> <ArrowDownwardSharp/></button>}
                  </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer, idx) => (
              <tr key={idx}>
                <td>
                  {customer && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(customer.id)}
                      onChange={() => toggleSelectOne(customer.id)}
                    />
                  )}
                </td>
                <td>{customer ? customer.id : ""}</td>
                <td>{customer?.name || ""}</td>
                <td>{customer?.age || ""}</td>
                <td>{customer?.gender || ""}</td>
                <td>{customer?.joinedOn || ""}</td>
                <td>{customer?.phone || ""}</td>
                <td>{customer?.membership || ""}</td>
                <td>{customer?.lastAssessed || ""}</td>
                <td>{customer?.plan || ""}</td>
                <td>
                  {customer && (
                    <select
                      className="actions"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value === "Take_Assessment") {
                          handleSelectComponent(customer);
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        See Actions
                      </option>
                      <option value="Go_To_Profile">Go To Profile</option>
                      <option value="See_Plan">See Plan</option>
                      <option value="Take_Assessment">Take Assessment</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="footer">
        <div>
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div>
          {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} of{" "}
          {filteredCustomers.length}
        </div>

        <div className="pagination-buttons">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronDown size={20} style={{ transform: "rotate(90deg)" }} />
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                endIndex < filteredCustomers.length ? prev + 1 : prev
              )
            }
            disabled={endIndex >= filteredCustomers.length}
          >
            <ChevronDown size={20} style={{ transform: "rotate(-90deg)" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
