import React, { useContext, useEffect, useRef, useState } from "react";
import { ChevronDown, CloudDownload, Filter, Trash2 } from "lucide-react";
import { DataContext } from "../store/DataContext";
import "./CustomerTable.css";
import { DownloadSharp } from "@mui/icons-material";

const CustomerTable: React.FC = () => {
  const { customers, setCustomers, selectComponent, setSelectComponent } =
    useContext(DataContext)!;

  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.membership
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm.toLowerCase().replace(/\s+/g, "")) ||
      customer.plan
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm.toLowerCase().replace(/\s+/g, ""))
  );

  console.log(customers);

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
          <button className="action-button">
            <Filter size={16} style={{ marginRight: "4px" }} />
            <span>Filter</span>
          </button>
          <button
            className="action-button delete-button"
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
          >
            <Trash2 size={16} style={{ marginRight: "4px" }} />
            <span>Delete</span>
          </button>
          <button className="csv-button">
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
                "Joined On",
                "Phone No",
                "Membership",
                "Last Assessed On",
                "Plan Allocated",
                "Actions",
              ].map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paddedCustomers.map((customer, idx) => (
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
                        Actions
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
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div>
          1-{filteredCustomers.length} of {customers.length}
        </div>
        <div className="pagination-buttons">
          <button>
            <ChevronDown size={16} style={{ transform: "rotate(90deg)" }} />
          </button>
          <button>
            <ChevronDown size={16} style={{ transform: "rotate(-90deg)" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
