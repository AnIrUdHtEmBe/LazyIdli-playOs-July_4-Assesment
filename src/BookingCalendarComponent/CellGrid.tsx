import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import TopBar from "./Topbar";
import UserModal from "./UserModal";

export type CellState =
  | "available"
  | "occupied"
  | "blocked"
  | "selected"
  | "unblock"
  | "unbook";

interface CellProps {
  row?: number;
  col?: number;
  state?: CellState;
  label?: string;
  onClick?: (row: number, col: number) => void;
  onDropAction?: (from: [number, number], to: [number, number]) => void;
  isSelected?: any;
}

type Court = { courtId: string; name: string };

type Booking = {
  bookedBy: string;
  sportId: string;
  startTime: string;
  endTime: string;
  status: string;
  joinedUsers: any[];
  price: number | null;
  capacity: number | null;
  st_unix: number;
  et_unix: number;
  bookingId: string;
};

type CourtDetails = {
  arenaId: string;
  name: string;
  capacity: number;
  allowedSports: string[];
  openingTime: string;
  closingTime: string;
  status: string;
  slotSize: number;
  courtId: string;
};

type Sport = {
  name: string;
  description: string;
  maxPlayers: number;
  minPlayers: number;
  minTime: number;
  maxTime: number;
  icon: string;
  instructions: string[];
  category: string;
  sportId: string;
};

const toIST = (utc: string) => {
  const date = new Date(utc);
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
};

function toLocalISOString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

const Cell = ({
  row,
  col,
  state,
  label,
  onClick,
  onDropAction,
  isSelected,
}: CellProps) => {
  const colorMap: Record<CellState, string> = {
    available:
      "bg-neutral-100 border-4 border-green-500 rounded transition focus:bg-green-50 hover:bg-green-300 text-gray-900 flex items-center px-2 py-1",
    occupied: "bg-green-500",
    blocked: "bg-red-500",
    selected: "bg-blue-500",
    unblock:
      "bg-neutral-100 border-4 border-green-500 rounded transition focus:bg-green-50 hover:bg-green-300 text-gray-900 flex items-center px-2 py-1",
    unbook:
      "bg-neutral-100 border-4 border-green-500 rounded transition focus:bg-green-50 hover:bg-green-300 text-gray-900 flex items-center px-2 py-1",
  };

  if (label) {
    return (
      <div
        className="min-w-[4rem] flex-1 h-10 flex items-center justify-center border border-gray-200 rounded-md bg-white text-xs font-semibold text-timeSlot whitespace-nowrap"
        style={{ userSelect: "none" }}
      >
        {label}
      </div>
    );
  }

  const showRing = isSelected && (state === "occupied" || state === "blocked" || state === "unblock" || state === "unbook");

  return (
    <div
      className={clsx(
        "min-w-[4rem] flex-1 h-10 border border-white rounded-md cursor-pointer transition-colors",
        state && colorMap[state],
        showRing &&
          isSelected &&
          "ring-4 ring-blue-500 ring-offset-2 ring-offset-white shadow-lg animate-pulse [animation-duration:5.8s]"
      )}
      onClick={() => {
        if (row !== undefined && col !== undefined && onClick) {
          onClick(row, col);
        }
      }}
      draggable={state === "occupied" || state === "blocked"}
      onDragStart={(e) => {
        if (row !== undefined && col !== undefined) {
          e.dataTransfer.setData("text/plain", `${row},${col}`);
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const [fromRow, fromCol] = e.dataTransfer
          .getData("text/plain")
          .split(",")
          .map(Number);
        if (
          row !== undefined &&
          col !== undefined &&
          onDropAction &&
          (state === "available" || "unblock" || "unbook")
        ) {
          onDropAction([fromRow, fromCol], [row, col]);
        }
      }}
    />
  );
};

const CellGrid = () => {
  const [courtId, setCourtId] = useState<Court[]>([]);
  const [resolvedNames, setResolvedNames] = useState<Record<string, string>>(
    {}
  );

  const [courtDetailsMap, setCourtDetailsMap] = useState<
    Record<string, CourtDetails>
  >({});
  const [courtAllowedSportsMap, setCourtAllowedSportsMap] = useState<
    Record<string, Sport[]>
  >({});

  const [maxPlayers, setMaxPlayers] = useState<number>(1); // default 1
  const [difficultyLevel, setDifficultyLevel] = useState<string>("Beginner"); // default Beginner

  // 24 hours with 30-minute slots = 48 columns
  const cols = 48;
  const rows = courtId.length;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<
    Record<string, { start: Date; end: Date }[]>
  >({});
  const [grid, setGrid] = useState<CellState[][]>(
    Array.from({ length: rows }, () => Array(cols).fill("available"))
  );
  // selected is now an array of selected cells
  const [selected, setSelected] = useState<Array<[number, number]>>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // New state for selected cell details
  const [selectedCellDetails, setSelectedCellDetails] = useState<{
    courtDetails: CourtDetails | null;
    bookings: Booking[];
    gameName: string;
    availableSports: Sport[];
    currentBooking: Booking | null;
  }>({
    courtDetails: null,
    bookings: [],
    gameName: "",
    availableSports: [],
    currentBooking: null,
  });

  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const [isLoadingCellDetails, setIsLoadingCellDetails] = useState(false);

  // Check if all selected cells are in the same row and columns are consecutive
  const isValidSelection = (
    selectedCells: Array<[number, number]>
  ): boolean => {
    if (selectedCells.length === 0) return false;

    // Extract all rows and columns
    const rows = selectedCells.map(([row]) => row);
    const cols = selectedCells.map(([_, col]) => col).sort((a, b) => a - b);

    // Check if all rows are the same
    const uniqueRows = new Set(rows);
    if (uniqueRows.size !== 1) return false;

    // Check if columns are consecutive
    for (let i = 1; i < cols.length; i++) {
      if (cols[i] !== cols[i - 1] + 1) return false;
    }

    return true;
  };

  const getCellData = () => {
    if (!selectedCell) return null;

    const { row, col } = selectedCell;
    const court = courtId[row];
    const courtName = resolvedNames[court.courtId] || court.name;

    // Format the selected time slot (single or multiple)
    const timeSlot = formatSelectedTimeRange(
      selected.length > 0 ? selected : [[row, col]]
    );

    // Use gameName from selectedCellDetails, fallback if needed
    const gameName = selectedCellDetails.gameName || "";

    // Find bookingId for the selected cell if it exists
    let bookingId = "";
    if (selectedCellDetails.currentBooking) {
      bookingId = selectedCellDetails.currentBooking.bookingId;
    }

    return {
      courtName,
      timeSlot,
      gameName,
      bookingId,
    };
  };

  // Format time range only if selection is valid
  const formatSelectedTimeRange = (
    selectedCells: Array<[number, number]>
  ): string => {
    if (!isValidSelection(selectedCells)) {
      return "Invalid selection";
    }

    const colsSelected = selectedCells
      .map(([_, col]) => col)
      .sort((a, b) => a - b);
    const firstCol = colsSelected[0];
    const lastCol = colsSelected[colsSelected.length - 1];

    const formatTime = (col: number) => {
      const hour = Math.floor(col / 2);
      const minute = col % 2 === 0 ? 0 : 30;
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? "AM" : "PM";
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };

    const startTimeStr = formatTime(firstCol);

    let endHour = Math.floor(lastCol / 2);
    let endMinute = lastCol % 2 === 0 ? 0 : 30;
    endMinute += 30;
    if (endMinute === 60) {
      endMinute = 0;
      endHour += 1;
    }
    const displayEndHour = endHour % 12 === 0 ? 12 : endHour % 12;
    const endAmPm = endHour < 12 ? "AM" : "PM";
    const endTimeStr = `${displayEndHour}:${endMinute
      .toString()
      .padStart(2, "0")} ${endAmPm}`;

    return `${startTimeStr} - ${endTimeStr}`;
  };

  // Generate time labels for 24 hours (12 AM to 12 AM)
  const timeLabels = Array.from({ length: cols }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const nextHour = Math.floor((i + 1) / 2);
    const nextMinute = (i + 1) % 2 === 0 ? "00" : "30";

    const formatHour = (h: number) => {
      if (h === 0) return "12 AM";
      if (h < 12) return `${h} AM`;
      if (h === 12) return "12 PM";
      return `${h - 12} PM`;
    };

    const formatHourShort = (h: number) => {
      if (h === 0) return "12";
      if (h <= 12) return h.toString();
      return (h - 12).toString();
    };

    return `${formatHourShort(hour)}:${minute}  ${formatHourShort(
      nextHour
    )}:${nextMinute}`;
  });

  const [courtSlots, setCourtSlots] = useState<Record<string, any[]>>({});
  const [courtBookIds, setCourtBookids] = useState<Record<string, any[]>>({});
  const [slotPrices, setSlotPrices] = useState<
    Record<string, Record<string, number>>
  >({});

  const fetchCourtIDs = async () => {
    try {
      const response = await axios.get(
        "https://play-os-backend.forgehub.in/arena/AREN_JZSW15/courts"
      );
      if (Array.isArray(response.data)) {
        setCourtId(response.data);
        const nameMap: Record<string, string> = {};

        await Promise.all(
          response.data.map(async (court: Court) => {
            if (court.name.startsWith("court_")) {
              const userId = court.name.replace("court_", "");
              try {
                const res = await axios.get(
                  `https://play-os-backend.forgehub.in/human/${userId}`
                );
                nameMap[court.courtId] = res.data.name;
              } catch {
                nameMap[court.courtId] = court.name;
              }
            } else {
              nameMap[court.courtId] = court.name;
            }
          })
        );

        setResolvedNames(nameMap);
      }
    } catch (error) {
      console.error("Failed to fetch court IDs", error);
    }
  };

  const fetchAllCourtDetails = async (courts: Court[]) => {
    const detailsMap: Record<string, CourtDetails> = {};
    const allowedSportsMap: Record<string, Sport[]> = {};

    await Promise.all(
      courts.map(async (court) => {
        try {
          const res = await axios.get(
            `https://play-os-backend.forgehub.in/court/${court.courtId}`
          );
          const courtDetails = res.data;
          console.log("court details ", courtDetails);

          detailsMap[court.courtId] = courtDetails;

          // Fetch allowed sports for this court
          const sports = await Promise.all(
            courtDetails.allowedSports.map(async (sportId: any) => {
              try {
                const sportRes = await axios.get(
                  `https://play-os-backend.forgehub.in/sports/id/${sportId}`
                );
                console.log("sport res data", sportRes);

                return sportRes.data;
              } catch {
                return null;
              }
            })
          );

          allowedSportsMap[court.courtId] = sports.filter(
            (s) => s !== null
          ) as Sport[];
        } catch (error) {
          console.error(
            `Failed to fetch court details or sports for ${court.courtId}`,
            error
          );
        }
      })
    );
    console.log("allowedSportsMap", allowedSportsMap);

    setCourtDetailsMap(detailsMap);
    setCourtAllowedSportsMap(allowedSportsMap);
  };

  const fetchSlotsForCourts = async () => {
    const dateStr = currentDate.toISOString().split("T")[0];
    const slotsMap: Record<string, any[]> = {};
    const bookIdMap: Record<string, any[]> = {};

    await Promise.all(
      courtId.map(async (court) => {
        try {
          const res = await axios.get(
            `https://play-os-backend.forgehub.in/court/${court.courtId}/slots?date=${dateStr}`
          );
          const rawSlots = Array.isArray(res.data) ? res.data : [];

          // Convert all slot times from UTC to IST here
          const istSlots = rawSlots.map((slot) => ({
            ...slot,
            startTime: toIST(slot.startTime),
            endTime: toIST(slot.endTime),
            date: toIST(slot.date),
          }));

          slotsMap[court.courtId] = istSlots;

          bookIdMap[court.courtId] = rawSlots.map((slot) => ({
            ...slot,
            bookingId: slot.bookingInfo,
          }));
        } catch (e) {
          console.error(`Failed to fetch slots for court ${court.courtId}`, e);
          slotsMap[court.courtId] = [];
        }
      })
    );
    console.log("slots map get api", slotsMap);
    console.log("bookzIDnew", bookIdMap);

    setCourtSlots(slotsMap);
    setCourtBookids(bookIdMap);
  };

  const fetchPrices = async () => {
    const newPrices: Record<string, Record<string, number>> = {};

    const allSlots = Object.values(courtSlots).flat();
    console.log("all slots before fetching price", allSlots);

    await Promise.all(
      allSlots.map(async (slot) => {
        try {
          const res = await axios.get(
            `https://play-os-backend.forgehub.in/timeslot/${slot.slotId}`
          );
          if (!newPrices[slot.courtId]) newPrices[slot.courtId] = {};
          newPrices[slot.courtId][slot.slotId] = res.data.price ?? 0;
        } catch (e) {
          console.error(`Failed to fetch price for slot ${slot.slotId}`, e);
          if (!newPrices[slot.courtId]) newPrices[slot.courtId] = {};
          newPrices[slot.courtId][slot.slotId] = 0;
        }
      })
    );
    console.log("new prices response", newPrices);

    setSlotPrices(newPrices);
  };

  useEffect(() => {
    fetchCourtIDs();
  }, []);

  useEffect(() => {
    if (courtId.length > 0) {
      fetchAllCourtDetails(courtId);
    }
  }, [courtId]);

  useEffect(() => {
    if (courtId.length === 0) return;
    fetchSlotsForCourts();
  }, [courtId, currentDate]);

  console.log(courtSlots, "Court Slots state");

  useEffect(() => {
    if (Object.keys(courtSlots).length > 0) {
      fetchPrices();
    }
  }, [courtSlots]);

  // Updated grid generation function
  const updateGridWithBookings = (
    courtsData: Court[],
    bookingsData: Record<string, { start: Date; end: Date }[]>,
    blockedData: Record<string, { start: Date; end: Date }[]>, // new param for blocked slots
    cancelledData: Record<string, { start: Date; end: Date }[]>,
    date: Date
  ) => {
    const newGrid: CellState[][] = Array.from(
      { length: courtsData.length },
      () => Array(cols).fill("available")
    );

    for (let r = 0; r < courtsData.length; r++) {
      const court = courtsData[r];
      const courtBookings = bookingsData[court.courtId] || [];
      const courtBlocked = blockedData[court.courtId] || [];
      const courtCancelled = cancelledData[court.courtId] || [];

      // Mark blocked cells first
      for (const block of courtBlocked) {
        const startTime = block.start.getTime();
        const endTime = block.end.getTime();

        for (let i = 0; i < timeLabels.length; i++) {
          const hour = Math.floor(i / 2);
          const minute = i % 2 === 0 ? 0 : 30;

          const slotTime = new Date(date);
          slotTime.setHours(hour, minute, 0, 0);
          const slotStartMillis = slotTime.getTime();
          const slotEndMillis = slotStartMillis + 30 * 60 * 1000;

          if (slotStartMillis < endTime && slotEndMillis > startTime) {
            newGrid[r][i] = "blocked";
          }
        }
      }

      // Mark occupied cells, but do not override blocked
      for (const booking of courtBookings) {
        const startTime = booking.start.getTime();
        const endTime = booking.end.getTime();

        for (let i = 0; i < timeLabels.length; i++) {
          const hour = Math.floor(i / 2);
          const minute = i % 2 === 0 ? 0 : 30;

          const slotTime = new Date(date);
          slotTime.setHours(hour, minute, 0, 0);
          const slotStartMillis = slotTime.getTime();
          const slotEndMillis = slotStartMillis + 30 * 60 * 1000;

          // Only set to occupied if not blocked
          if (
            slotStartMillis < endTime &&
            slotEndMillis > startTime &&
            newGrid[r][i] !== "blocked"
          ) {
            newGrid[r][i] = "occupied";
          }
        }
      }

      for (const cancelled of courtCancelled) {
        const startTime = cancelled.start.getTime();
        const endTime = cancelled.end.getTime();

        for (let i = 0; i < timeLabels.length; i++) {
          const hour = Math.floor(i / 2);
          const minute = i % 2 === 0 ? 0 : 30;

          const slotTime = new Date(date);
          slotTime.setHours(hour, minute, 0, 0);
          const slotStartMillis = slotTime.getTime();
          const slotEndMillis = slotStartMillis + 30 * 60 * 1000;

          // Only set to occupied if not blocked
          if (
            slotStartMillis < endTime &&
            slotEndMillis > startTime &&
            newGrid[r][i] !== "blocked" &&
            newGrid[r][i] !== "occupied"
          ) {
            console.log(
              `Marking available (cancelled): court ${court.courtId}, row ${r}, col ${i}`
            );
            newGrid[r][i] = "unblock";
          }
        }
      }
    }

    setGrid(newGrid);
  };

  const fetchBukings = async (dateStr: string) => {
    const bookingsMap: Record<string, { start: Date; end: Date }[]> = {};
    const cancelledBookingsMap: Record<string, { start: Date; end: Date }[]> =
      {};

    await Promise.all(
      courtId.map(async (court) => {
        try {
          const res = await axios.get(
            `https://play-os-backend.forgehub.in/court/${court.courtId}/bookings?date=${dateStr}`
          );
          console.log("court bookings and date", res.data);
          console.log("cancelled through booking", res.data.bookings.status);

          const bookings = Array.isArray(res.data.bookings)
            ? res.data.bookings
            : [];

          bookingsMap[court.courtId] = bookings
            .filter((b: any) => b.status === "active")
            .map((b: any) => ({
              start: toIST(b.startTime),
              end: toIST(b.endTime),
            }));

          

          // Filter cancelled bookings only
          cancelledBookingsMap[court.courtId] = bookings
            .filter((b: any) => b.status === "cancelled")
            .map((b: any) => ({
              start: toIST(b.startTime),
              end: toIST(b.endTime),
            }));
        } catch (error) {
          console.error(
            `Failed to fetch bookings for court ${court.courtId}`,
            error
          );
          bookingsMap[court.courtId] = [];
        }
      })
    );
    console.log("BookingMaps 0", bookingsMap);
    console.log("CancelledMao", cancelledBookingsMap);

    return { bookingsMap, cancelledBookingsMap };
  };

  const fetchBlockedSlots = async (dateStr: string) => {
    const blockedMap: Record<string, { start: Date; end: Date }[]> = {};
    await Promise.all(
      courtId.map(async (court) => {
        try {
          // Fetch slots for the court on this date
          const res = await axios.get(
            `https://play-os-backend.forgehub.in/court/${court.courtId}/slots?date=${dateStr}`
          );
          console.log("block response new", res.data);

          const slots = Array.isArray(res.data) ? res.data : [];

          console.log("Slots for court", court.courtId, slots);
          slots.forEach((slot, idx) => {
            console.log(`Slot ${idx}`, {
              bookingInfo: slot.bookingInfo,
              status: slot.status,
              startTime: slot.startTime,
              endTime: slot.endTime,
            });
          });

          // Filter slots that are blocked (outOfOrder)
          const blockedSlotsForCourt = slots
            .filter(
              (slot) =>
                slot.bookingInfo === "outOfOrder" ||
                slot.status === "outOfOrder"
            )
            .map((slot) => ({
              start: toIST(slot.startTime),
              end: toIST(slot.endTime),
            }));
          console.log("blockedSlotsforCourt", blockedSlotsForCourt);

          blockedMap[court.courtId] = blockedSlotsForCourt;
          console.log("blockedMap Array set", blockedMap);
        } catch (error) {
          console.error(
            `Failed to fetch blocked slots for court ${court.courtId}`,
            error
          );
          blockedMap[court.courtId] = [];
        }
      })
    );
    return blockedMap;
  };

  const fetchBookingsAndBlocked = async (date: Date) => {
    if (courtId.length === 0) return;

    setIsLoadingBookings(true);
    const dateStr = date.toISOString().split("T")[0];

    try {
      const [bookingData, newBlocked] = await Promise.all([
        fetchBukings(dateStr),
        fetchBlockedSlots(dateStr),
      ]);

      // Destructure the returned object
      const { bookingsMap, cancelledBookingsMap } = bookingData;

      console.log(newBlocked, "newBlocked");
      console.log("All Bookings:", bookingsMap);
      console.log("Cancelled Bookings:", cancelledBookingsMap);

      setBookings(bookingsMap);
      updateGridWithBookings(
        courtId,
        bookingsMap,
        newBlocked,
        cancelledBookingsMap,
        date
      );
    } catch (error) {
      console.error("Failed to fetch bookings and blocked slots:", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Fetch bookings when courts or date changes
  useEffect(() => {
    if (courtId.length > 0) {
      fetchBookingsAndBlocked(currentDate);
    }
  }, [courtId, currentDate]);

  useEffect(() => {
    setGrid(
      Array.from({ length: courtId.length }, () =>
        Array(cols).fill("available")
      )
    );
  }, [courtId.length]);

  // New function to fetch cell details when a cell is selected
  const fetchCellDetails = async (row: number, col: number) => {
    if (courtId.length === 0) return;

    setIsLoadingCellDetails(true);
    const court = courtId[row];
    const dateStr = currentDate.toISOString().split("T")[0];

    // Initialize all details to null/empty before fetching
    let selectedCourtDetails: CourtDetails | null = null;
    let selectedBookingArray: Booking[] = [];
    let selectedGameName: string = "";
    let selectedAvailableSports: Sport[] = [];
    let selectedCurrentBooking: Booking | null = null;

    try {
      // 1. Fetch court details (including allowedSports)
      const courtRes = await axios.get(
        `https://play-os-backend.forgehub.in/court/${court.courtId}`
      );
      selectedCourtDetails = courtRes.data;

      // 2. Fetch all allowed sports details for this court
      if (
        selectedCourtDetails?.allowedSports &&
        selectedCourtDetails.allowedSports.length > 0
      ) {
        const sportsPromises = selectedCourtDetails.allowedSports.map(
          async (sportId: string) => {
            try {
              const sportRes = await axios.get(
                `https://play-os-backend.forgehub.in/sports/id/${sportId}`
              );
              return sportRes.data;
            } catch (error) {
              console.error(`Failed to fetch sport ${sportId}:`, error);
              return null;
            }
          }
        );
        selectedAvailableSports = (await Promise.all(sportsPromises)).filter(
          (s) => s !== null
        ) as Sport[];
      }

      // Set gameName as comma-separated allowed sports names by default
      selectedGameName = selectedAvailableSports
        .map((sport) => sport.name)
        .join(", ");

      // 3. Fetch bookings for the court on the selected date
      try {
        const bookingsRes = await axios.get(
          `https://play-os-backend.forgehub.in/court/${court.courtId}/bookings?date=${dateStr}`
        );
        selectedBookingArray = bookingsRes?.data?.bookings || [];

        // Find current booking for this cell (if any)
        const hour = Math.floor(col / 2);
        const minute = col % 2 === 0 ? 0 : 30;
        const slotTime = new Date(currentDate);
        slotTime.setHours(hour, minute, 0, 0);
        const slotStartMillis = slotTime.getTime();
        const slotEndMillis = slotStartMillis + 30 * 60 * 1000;

        selectedCurrentBooking =
          selectedBookingArray.find((booking: Booking) => {
            const startTime = toIST(booking.startTime).getTime();
            const endTime = toIST(booking.endTime).getTime();
            return slotStartMillis < endTime && slotEndMillis > startTime;
          }) || null;

        // If current booking exists, override gameName with booked sport's name
        if (selectedCurrentBooking && selectedCurrentBooking.sportId) {
          try {
            const sportRes = await axios.get(
              `https://play-os-backend.forgehub.in/sports/id/${selectedCurrentBooking.sportId}`
            );
            selectedGameName = sportRes.data.name;
          } catch {
            selectedGameName = "Unknown (booked sport not found)";
          }
        }
      } catch (bookingsError) {
        // Booking fetch failed, but do NOT clear court details or available sports
        console.error("Failed to fetch bookings:", bookingsError);
        selectedBookingArray = [];
        selectedCurrentBooking = null;
        // Keep selectedGameName as allowed sports names (do NOT clear)
      }
    } catch (mainError) {
      console.error(
        "Failed to fetch court details or primary info:",
        mainError
      );
      // If court details fail, clear everything
      selectedCourtDetails = null;
      selectedBookingArray = [];
      selectedGameName = "";
      selectedAvailableSports = [];
      selectedCurrentBooking = null;
    } finally {
      setSelectedCellDetails({
        courtDetails: selectedCourtDetails,
        bookings: selectedBookingArray,
        gameName: selectedGameName,
        availableSports: selectedAvailableSports,
        currentBooking: selectedCurrentBooking,
      });
      setIsLoadingCellDetails(false);
    }

    const getSlotForCell = (row: number, col: number) => {
      const slotsForCourt = courtSlots[courtId[row]?.courtId] || [];
      const hour = Math.floor(col / 2);
      const minute = col % 2 === 0 ? 0 : 30;
      const cellStartTime = new Date(currentDate);
      cellStartTime.setHours(hour, minute, 0, 0);

      return slotsForCourt.find((slot) => {
        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);
        return slotStart.getTime() === cellStartTime.getTime();
      });
    };
  };

  // Update updateCell to allow multiple selection toggling
  const updateCell = (row: number, col: number) => {
    //   setSelectedCell({ row, col });
    //    setSelectedCell(prev =>
    //   prev && prev.row === row && prev.col === col ? null : { row, col }
    // );
    setSelectedSportId("");
    setGrid((prev) => {
      const newG = prev.map((r) => [...r]);
      const curr = newG[row][col];

      if (curr === "available" || curr === "selected") {
        // Toggle selection of this cell
        setSelected((prevSelected) => {
          const exists = prevSelected.some(([r, c]) => r === row && c === col);
          if (exists) {
            // Deselect cell
            // setSelectedCell(null);
            return prevSelected.filter(([r, c]) => !(r === row && c === col));
          } else {
            // Select cell (add)
            // setSelectedCell({ row, col });
            return [...prevSelected, [row, col]];
          }
        });

        // Toggle cell state between selected and available
        newG[row][col] = curr === "available" ? "selected" : "available";
        return newG;
      } else {
        // For occupied or blocked cells, toggle selection (single selection)
        // BUT DO NOT CHANGE THE CELL STATE - keep it as occupied/blocked
        setSelected((prevSelected) => {
          const exists = prevSelected.some(([r, c]) => r === row && c === col);
          if (exists) {
            // Deselect the cell if already selected
            setSelectedCell(null);
            return prevSelected.filter(([r, c]) => !(r === row && c === col));
          } else {
            // Select only this cell (deselect others)
            setSelectedCell({ row, col });
            return [[row, col]];
          }
        });
        return prev;
      }
    });

    // Fetch cell details for the clicked cell (last clicked)
    fetchCellDetails(row, col);
  };

  const handleDrop = (
    [fr, fc]: [number, number],
    [tr, tc]: [number, number]
  ) => {
    setGrid((prev) => {
      const newG = prev.map((r) => [...r]);
      const val = newG[fr][fc];
      if (val === "occupied" || val === "blocked") {
        newG[fr][fc] = "available";
        newG[tr][tc] = val;
      }
      return newG;
    });
  };

  type ModalGame = {
    gameId: string;
  };

  const [modalData, setModalData] = useState<ModalGame>();

  // Modify applyAction to handle multiple selected cells for booking
  const applyAction = async (action: CellState) => {
    if (selected.length === 0) return;

    if (
      action === "occupied" ||
      action === "blocked" ||
      action === "unblock" ||
      action === "unbook"
    ) {
      // if (!selectedSportId) {
      //   alert("Please select a sport first");
      //   return;
      // }

      if (action === "blocked") {
        // Find slotId corresponding to selected cells (assuming consecutive cells in same row)
        const rowsSet = new Set(selected.map(([r]) => r));
        if (rowsSet.size > 1) {
          alert("Please select cells in the same court (row) for blocking.");
          return;
        }

        const [row] = selected[0];
        const colsSelected = selected.map(([_, c]) => c).sort((a, b) => a - b);

        // Validate consecutive columns
        for (let i = 1; i < colsSelected.length; i++) {
          if (colsSelected[i] !== colsSelected[i - 1] + 1) {
            alert("Please select consecutive time slots for blocking.");
            return;
          }
        }

        // Find the slotId for this court and selected time range from courtSlots state
        const courtSlotsForCourt = courtSlots[courtId[row].courtId] || [];
        let matchedSlot: any = null;

        // Calculate start and end time of selected cells
        const firstCol = colsSelected[0];
        const lastCol = colsSelected[colsSelected.length - 1];
        const startHour = Math.floor(firstCol / 2);
        const startMinute = firstCol % 2 === 0 ? 0 : 30;
        const endHour = Math.floor(lastCol / 2);
        const endMinute = lastCol % 2 === 0 ? 0 : 30;
        const startTime = new Date(currentDate);
        startTime.setHours(startHour, startMinute, 0, 0);
        const endTime = new Date(currentDate);
        endTime.setHours(endHour, endMinute, 0, 0);
        endTime.setTime(endTime.getTime() + 30 * 60 * 1000); // add 30 mins

        const overlappingSlots = courtSlotsForCourt.filter((slot) => {
          const slotStart = new Date(slot.startTime).getTime();
          const slotEnd = new Date(slot.endTime).getTime();

          return slotStart < endTime.getTime() && slotEnd > startTime.getTime();
        });

        if (overlappingSlots.length === 0) {
          alert("No matching slot found for selected cells.");
          return;
        }
        console.log("overlapping slots", overlappingSlots);

        // PATCH request to update timeslot as blocked
        try {
          await Promise.all(
            overlappingSlots.map((slot) =>
              axios.post(
                `https://play-os-backend.forgehub.in/court/courts/${slot.courtId}/timeslots/action`,
                {
                  startTime: Math.floor(
                    new Date(slot.startTime).getTime() / 1000
                  ),
                  endTime: Math.floor(new Date(slot.endTime).getTime() / 1000),

                  action: "BLOCK",
                }
              )
            )
          );
          alert("Slot(s) successfully blocked.");

          await fetchBookingsAndBlocked(currentDate);

          setSelected([]);
          setSelectedSportId("");
        } catch (error) {
          console.error("Failed to block slot(s):", error);
          alert("Failed to block slot(s). Please try again.");
        }
      } else if (action === "unblock") {
        // Find slotId corresponding to selected cells (assuming consecutive cells in same row)
        const rowsSet = new Set(selected.map(([r]) => r));
        if (rowsSet.size > 1) {
          alert("Please select cells in the same court (row) for blocking.");
          return;
        }

        const [row] = selected[0];
        const colsSelected = selected.map(([_, c]) => c).sort((a, b) => a - b);

        // Validate consecutive columns
        for (let i = 1; i < colsSelected.length; i++) {
          if (colsSelected[i] !== colsSelected[i - 1] + 1) {
            alert("Please select consecutive time slots for blocking.");
            return;
          }
        }

        // Find the slotId for this court and selected time range from courtSlots state
        const courtSlotsForCourt = courtSlots[courtId[row].courtId] || [];
        let matchedSlot: any = null;

        // Calculate start and end time of selected cells
        const firstCol = colsSelected[0];
        const lastCol = colsSelected[colsSelected.length - 1];
        const startHour = Math.floor(firstCol / 2);
        const startMinute = firstCol % 2 === 0 ? 0 : 30;
        const endHour = Math.floor(lastCol / 2);
        const endMinute = lastCol % 2 === 0 ? 0 : 30;
        const startTime = new Date(currentDate);
        startTime.setHours(startHour, startMinute, 0, 0);
        const endTime = new Date(currentDate);
        endTime.setHours(endHour, endMinute, 0, 0);
        endTime.setTime(endTime.getTime() + 30 * 60 * 1000); // add 30 mins

        const overlappingSlots = courtSlotsForCourt.filter((slot) => {
          const slotStart = new Date(slot.startTime).getTime();
          const slotEnd = new Date(slot.endTime).getTime();

          return slotStart < endTime.getTime() && slotEnd > startTime.getTime();
        });

        if (overlappingSlots.length === 0) {
          alert("No matching slot found for selected cells.");
          return;
        }

        // PATCH request to update timeslot as blocked
        try {
          await Promise.all(
            overlappingSlots.map((slot) =>
              axios.post(
                `https://play-os-backend.forgehub.in/court/courts/${slot.courtId}/timeslots/action`,
                {
                  startTime: Math.floor(
                    new Date(slot.startTime).getTime() / 1000
                  ),
                  endTime: Math.floor(new Date(slot.endTime).getTime() / 1000),

                  action: "UNBLOCK",
                }
              )
            )
          );
          alert("Slot(s) successfully cancelled.");

          await fetchBookingsAndBlocked(currentDate);

          setSelected([]);
          setSelectedSportId("");
        } catch (error) {
          console.error("Failed to cancel slot(s):", error);
          alert("Failed to cancel slot(s). Please try again.");
        }
      } else if (action === "unbook") {
        // Find slotId corresponding to selected cells (assuming consecutive cells in same row)
        const rowsSet = new Set(selected.map(([r]) => r));
        if (rowsSet.size > 1) {
          alert("Please select cells in the same court (row) for blocking.");
          return;
        }

        const [row] = selected[0];
        const colsSelected = selected.map(([_, c]) => c).sort((a, b) => a - b);

        // Validate consecutive columns
        for (let i = 1; i < colsSelected.length; i++) {
          if (colsSelected[i] !== colsSelected[i - 1] + 1) {
            alert("Please select consecutive time slots for blocking.");
            return;
          }
        }

        // Find the slotId for this court and selected time range from courtSlots state
        const courtSlotsForCourt = courtSlots[courtId[row].courtId] || [];
        let matchedSlot: any = null;

        // Calculate start and end time of selected cells
        const firstCol = colsSelected[0];
        const lastCol = colsSelected[colsSelected.length - 1];
        const startHour = Math.floor(firstCol / 2);
        const startMinute = firstCol % 2 === 0 ? 0 : 30;
        const endHour = Math.floor(lastCol / 2);
        const endMinute = lastCol % 2 === 0 ? 0 : 30;
        const startTime = new Date(currentDate);
        startTime.setHours(startHour, startMinute, 0, 0);
        const endTime = new Date(currentDate);
        endTime.setHours(endHour, endMinute, 0, 0);
        endTime.setTime(endTime.getTime() + 30 * 60 * 1000); // add 30 mins

        const overlappingSlots = courtSlotsForCourt.filter((slot) => {
          const slotStart = new Date(slot.startTime).getTime();
          const slotEnd = new Date(slot.endTime).getTime();

          return slotStart < endTime.getTime() && slotEnd > startTime.getTime();
        });

        if (overlappingSlots.length === 0) {
          alert("No matching slot found for selected cells.");
          return;
        }

        const courtKey = courtId[row].courtId;

        // For each overlapping slot, find the bookingId from courtBookIds
        const bookingIdsToCancel = overlappingSlots
          .map((slot) => {
            const bookObj = (courtBookIds[courtKey] || []).find(
              (b) => b.slotId === slot.slotId
            );
            return bookObj && bookObj.bookingId ? bookObj.bookingId : null;
          })
          .filter(Boolean); // Remove nulls

        if (bookingIdsToCancel.length === 0) {
          alert("No bookingId found for the selected slots.");
          return;
        }

        // PATCH request to update timeslot as blocked
        try {
          await Promise.all(
            bookingIdsToCancel.map((bookingId) =>
              axios.patch(
                `https://play-os-backend.forgehub.in/court/${bookingId}/cancel`,
                
              )
            )
          );
          alert("Slot(s) successfully cancelled.");

          await fetchBookingsAndBlocked(currentDate);

          setSelected([]);
          setSelectedSportId("");
        } catch (error) {
          console.error("Failed to cancel slot(s):", error);
          alert("Failed to cancel slot(s). Please try again.");
        }
      } else if (action === "occupied") {
        // Existing booking logic here (unchanged)
        if (!selectedSportId) {
          alert("Please select a sport first");
          return;
        }
        const rowsSet = new Set(selected.map(([r]) => r));
        if (rowsSet.size > 1) {
          alert("Please select cells in the same court (row) for booking.");
          return;
        }

        const [row] = selected[0];
        const colsSelected = selected.map(([_, c]) => c).sort((a, b) => a - b);

        // Check if columns are consecutive
        for (let i = 1; i < colsSelected.length; i++) {
          if (colsSelected[i] !== colsSelected[i - 1] + 1) {
            alert("Please select consecutive time slots for booking.");
            return;
          }
        }

        // Calculate startTime from first selected cell
        const firstCol = colsSelected[0];
        const hour = Math.floor(firstCol / 2);
        const minute = firstCol % 2 === 0 ? 0 : 30;
        const startTime = new Date(currentDate);
        startTime.setHours(0, 0, 0, 0);
        startTime.setHours(hour, minute, 0, 0);

        // Calculate endTime from last selected cell + 30 minutes
        const lastCol = colsSelected[colsSelected.length - 1];
        const endHour = Math.floor(lastCol / 2);
        const endMinute = lastCol % 2 === 0 ? 0 : 30;
        const endTime = new Date(currentDate);
        endTime.setHours(0, 0, 0, 0);
        endTime.setHours(endHour, endMinute, 0, 0);
        // Add 30 minutes to endTime slot
        endTime.setTime(endTime.getTime() + 30 * 60 * 1000);

        const bookingData = {
          hostId: "USER_HZSU81",
          sport: selectedCellDetails.availableSports.find(
            (s) => s.sportId === selectedSportId
          )?.name,
          sportId: selectedSportId,
          courtId: courtId[row].courtId,
          startTime: toLocalISOString(startTime),
          endTime: toLocalISOString(endTime),
          bookedBy: "USER_HZSU81",
          difficultyLevel: difficultyLevel, // <-- added here
          maxPlayers: maxPlayers,
          priceType: "",
          rackPrice: 0,
          quotePrice: 0,
        };
        console.log("Start Time:", startTime.toISOString());
        console.log("End Time:", endTime.toISOString());

        console.log("Booking Data payload", bookingData);

        try {
          const response = await axios.post(
            "https://play-os-backend.forgehub.in/game/create",
            bookingData
          );
          console.log("Booking created:", response.data);
          setModalData(response.data.gameId);

          // Refresh bookings after successful creation
          await fetchBookingsAndBlocked(currentDate);

          // Clear selection and reset sport
          setSelected([]);
          setSelectedSportId("");
        } catch (error) {
          console.error("Failed to create booking:", error);
          alert("Failed to create booking. Please try again.");
        }
      } else {
      }
      // ... existing code for booking creation ...
    } else {
    }
  };

  const getSlotForCell = (row: number, col: number) => {
    const slotsForCourt = courtSlots[courtId[row]?.courtId] || [];
    const hour = Math.floor(col / 2);
    const minute = col % 2 === 0 ? 0 : 30;
    const cellStartTime = new Date(currentDate);
    cellStartTime.setHours(hour, minute, 0, 0);

    return slotsForCourt.find((slot) => {
      const slotStart = new Date(slot.startTime);
      return slotStart.getTime() === cellStartTime.getTime();
    });
  };

  // Modify cancelBooking to cancel bookings for all selected cells with bookings

  const gridScrollRef = useRef<HTMLDivElement>(null);

  // Helper for UI: get first selected cell or null
  const firstSelected = selected.length > 0 ? selected[0] : null;
  console.log(firstSelected, "firstSelected");

  const [isModalOpen, setisModalOpen] = useState<boolean>(false);

  function openModal() {
    setisModalOpen(true);
  }

  function closeModal() {
    setisModalOpen(false);
  }
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  function formatDateForInput(date: Date) {
    return date.toISOString().split("T")[0];
  }

  const selectedSlot = selectedCell
    ? getSlotForCell(selectedCell.row, selectedCell.col)
    : null;
  const slotPrice = selectedSlot
    ? slotPrices[selectedSlot.courtId]?.[selectedSlot.slotId]
    : null;

  return (
    <div className="flex flex-col h-screen">
      {/* Top Nav - Fixed */}
      <TopBar />
      <div className="flex items-center justify-between px-4 py-2 bg-white shadow-sm shrink-0">
        <button
          onClick={() =>
            setCurrentDate(
              (prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000)
            )
          }
          className="px-3 py-1 bg-gray-300 rounded"
        >
          ← Prev
        </button>
        <span className="text-xs font-semibold">
          {currentDate.toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          {isLoadingBookings && (
            <span className="ml-2 text-blue-500">Loading...</span>
          )}
        </span>
        <div className="flex items-center gap-4">
          {/* <span className="text-sm font-semibold">
            {formatWeekLabel(getWeekStart(currentDate))}
          </span> */}
          <input
            type="date"
            value={formatDateForInput(currentDate)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!isNaN(newDate.getTime())) setCurrentDate(newDate);
            }}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
        <button
          onClick={() =>
            setCurrentDate(
              (prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000)
            )
          }
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next →
        </button>
      </div>

      {/* Main Content Area - Flexible */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Synchronized with grid vertical scroll */}
        <div className="flex flex-col w-24 shrink-0 bg-white">
          <div className="h-10 shrink-0" />
          <div
            className="flex flex-col overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {courtId.map((court) => (
              <div
                key={court.courtId}
                className="h-10 flex items-center  justify-center border border-gray-200 text-xs text-center shrink-0"
              >
                {resolvedNames[court.courtId] ?? court.name}
              </div>
            ))}
          </div>
        </div>

        {/* Grid Section - Scrollable */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Time Headers - Synchronized with grid horizontal scroll */}
          <div
            className="shrink-0 overflow-x-auto overflow-y-hidden relative"
            ref={(el) => {
              if (el && gridScrollRef.current) {
                el.scrollLeft = gridScrollRef.current.scrollLeft;
              }
            }}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              background: "white",
            }}
          >
            {/* Continuous border line from midnight to 12 PM */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `calc(4rem * 48)`,
                height: "1px",
                backgroundColor: "#D1D5DB",
                pointerEvents: "none",
                zIndex: 10,
              }}
            />

            <div
              className="grid border border-gray-300 rounded-t-md bg-white"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(4rem, 1fr))`,
              }}
            >
              {timeLabels.map((label, i) => (
                <div
                  key={`header-${i}`}
                  className="min-w-0 h-10 flex items-center justify-center text-xs font-semibold text-timeSlot whitespace-nowrap"
                  style={{ userSelect: "none" }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Grid Content - Scrollable */}
          <div
            className="flex-1 overflow-auto"
            ref={gridScrollRef}
            onScroll={(e) => {
              const target = e.target as HTMLElement;

              // Sync horizontal scroll with time headers
              const timeHeaderEl = target.parentElement?.querySelector(
                ".shrink-0"
              ) as HTMLElement;
              if (timeHeaderEl) {
                timeHeaderEl.scrollLeft = target.scrollLeft;
              }

              // Sync vertical scroll with left sidebar
              const leftSidebarEl =
                target.parentElement?.parentElement?.querySelector(
                  ".flex.flex-col.overflow-y-auto"
                ) as HTMLElement;
              if (leftSidebarEl) {
                leftSidebarEl.scrollTop = target.scrollTop;
              }
            }}
          >
            <div
              className="grid border border-gray-200 rounded-b-md"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(4rem, 1fr))`,
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                  <Cell
                    key={`${rIdx}-${cIdx}`}
                    row={rIdx}
                    col={cIdx}
                    state={cell}
                    onClick={updateCell}
                    onDropAction={handleDrop}
                    isSelected={
                      selectedCell?.row === rIdx && selectedCell?.col === cIdx
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Fixed */}
      <div className="w-full bg-white px-6 py-3 shadow-md flex flex-col gap-2 shrink-0 text-sm">
        {/* Main Row: Left, Center, Right */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Side: Court Id and Host */}
          <div className="flex flex-col min-w-[200px] flex-1">
            <div className="bg-white border border-gray-300 rounded-md shadow-sm p-2">
              <p>
                <strong>Court Id:</strong>{" "}
                {firstSelected
                  ? courtId[firstSelected[0]]?.courtId ?? "Unknown"
                  : "N/A"}
              </p>
              <p>
                <strong>Host:</strong> anirudh
              </p>

              {/* Bottom row: Sport Select dropdown - aligned left */}
              {firstSelected &&
                ["available", "selected", "occupied", "blocked", "unbook", "unblock"].includes(
                  grid[firstSelected[0]][firstSelected[1]]
                ) && (
                  <div className="flex items-center gap-2 justify-start w-full">
                    <label className="font-semibold">Sport:</label>
                    <select
                      value={selectedSportId}
                      onChange={(e) => setSelectedSportId(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select a sport</option>
                      {selectedCellDetails.availableSports.map((sport) => (
                        <option key={sport.sportId} value={sport.sportId}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
            </div>
          </div>

          {/* Center: Difficulty, Max Players, Slots, Price, and Sport dropdown */}
          <div className="flex flex-col min-w-[350px] flex-1">
            {/* Top row: Difficulty, Max Players, Slots, Price - centered */}
            <div className="flex flex-wrap items-center gap-4 justify-center w-full mb-2">
              {/* Difficulty */}
              <div>
                <label className="font-semibold mr-2">Difficulty:</label>
                <select
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Max Players */}
              <div className="flex items-center gap-2">
                <label className="font-semibold">Max Players:</label>
                <button
                  className="px-2 py-1 bg-gray-300 rounded"
                  onClick={() => setMaxPlayers((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="w-8 text-center">{maxPlayers}</span>
                <button
                  className="px-2 py-1 bg-gray-300 rounded"
                  onClick={() =>
                    setMaxPlayers((prev) => Math.min(30, prev + 1))
                  }
                >
                  +
                </button>
              </div>

              {/* Slots */}
              <div>
                <strong>Slots:</strong> {formatSelectedTimeRange(selected)}
              </div>

              {/* Game */}
              <div className="ml-4 md:ml-8 lg:ml-16 xl:ml-18 2xl:ml-21">
                <strong>Games:</strong>{" "}
                {selected.length > 0 ? (
                  selectedCellDetails.currentBooking &&
                  selectedCellDetails.currentBooking.sportId ? (
                    // Show only the booked game's name
                    <span>
                      {"'" +
                        (selectedCellDetails.availableSports.find(
                          (s) =>
                            s.sportId ===
                            selectedCellDetails.currentBooking!.sportId
                        )?.name || "Unknown") +
                        "' "}
                    </span>
                  ) : (
                    // Show all available sports
                    selectedCellDetails.availableSports.map((sport) => (
                      <span key={sport.sportId}>{"'" + sport.name + "' "}</span>
                    ))
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Buttons and Status */}
          <div className="flex flex-col items-end gap-2 min-w-[200px] flex-1">
            {/* <div>
              <strong>Price:</strong>{" "}
              {slotPrices !== null && slotPrices !== undefined
                ? slotPrices
                : "N/A"}
            </div> */}

            {firstSelected && (
              <span className="text-sm text-timeSlot mb-2">
                <strong>Status:</strong>{" "}
                {grid[firstSelected[0]][firstSelected[1]]}
              </span>
            )}

            <div className="flex flex-wrap gap-2 justify-end w-full">
              {firstSelected &&
                ["available", "selected", "unbook", "unblock"].includes(
                  grid[firstSelected[0]][firstSelected[1]]
                ) && (
                  <>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => applyAction("occupied")}
                    >
                      Create Game
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => applyAction("blocked")}
                    >
                      Block
                    </button>
                  </>
                )}
              {firstSelected && (
                <>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      applyAction("unblock");
                      setSelected([]);
                    }}
                  >
                    Un-Block
                  </button>

                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      applyAction("unbook");
                      setSelected([]);
                    }}
                  >
                    Un-Book
                  </button>

                  {["occupied", "blocked"].includes(
                    grid[firstSelected[0]][firstSelected[1]]
                  ) && (
                    <button
                      onClick={openModal}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View Details
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Current Date - Full Width */}
        <div className="text-xs text-gray-500 text-center mt-1 w-full">
          Current date:{" "}
          {currentDate.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        cellData={getCellData() ?? { courtName: "" }}
      />
    </div>
  );
};

export default CellGrid;
