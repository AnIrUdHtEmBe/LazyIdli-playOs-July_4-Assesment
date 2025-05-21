import { Cross, FileText, Plus, Save, Trash, Trash2, X } from "lucide-react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Box,
  TextField,
} from "@mui/material";

import ShortTextIcon from "@mui/icons-material/ShortText";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import NumbersIcon from "@mui/icons-material/LooksOne";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import "./QuestionBank.css";
import { useState } from "react";

import { useApiCalls} from "../store/axios";

const questionTypes = [
  { label: "Text Input", value: "text", icon: <ShortTextIcon /> },
  { label: "Single Choice", value: "choose_one", icon: <RadioButtonCheckedIcon /> },
  { label: "Multiple Choice", value: "choose_many", icon: <CheckBoxIcon /> },
  { label: "Number Input", value: "number", icon: <NumbersIcon /> },
  { label: "Yes No", value: "yesno", icon: <RadioButtonCheckedIcon /> },
  { label: "Date Selector", value: "date", icon: <CalendarTodayIcon /> },
];

const QuestionBank = () => {
  const { Question_creation_Api_call } = useApiCalls();
  const [question, setQuestion] = useState([]);
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [options, setOptions] = useState([]);

  console.log(type);
  console.log(value);
  console.log(options);
  console.log(question);

  const handleApiCall = async () => {
    console.log("API call initiated");
    try {
      if(!question.length) {
        alert("Please add a question before making the API call.");
        return;
      }

      const response = await Question_creation_Api_call(question);
      console.log("API call successful:", response);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handleAddQuestion = () => {
    if (!value.trim() || !type.trim()) {
      alert("Please enter a question and select a question type.");
      return;
    }

    const filteredOptions =
    type === "choose_one" || type === "choose_many"
      ? options
          .map((opt) =>
            typeof opt === "string"
              ? opt.trim()
              : typeof opt === "object" && opt.value
          ).filter((opt) => opt !== "")
      : [];


    const newQuestion = {
      checked: checked,
      mainText: value,
      answerType: type,
      options: filteredOptions, // this can be an empty array, it's fine
    };

    setQuestion((prev) => [...prev, newQuestion]);

    // Reset fields if desired
    setValue("");
    setType("");
    setOptions([]);
    setChecked(false);
  };


  return (
    <div className="question-bank-container">
      {/* header */}
      <div className="question-bank-header-container">
        <div className="header-top">
          <FileText size={28} className="text-gray-800" />
          <span className="header-title">Questionnaire Creation</span>
        </div>
        <div className="header-tabs">
          <button className="header-tab">Questions</button>
          <button className="header-tab">Settings</button>
        </div>
      </div>

      {/* main body */}
      <div className="question-bank-body-container">
        <div className="question-bank-main-container">
          {/* main conatiner header */}
          <div className="question-bank-main-header">
            <span className="question-bank-main-header-title">
              Create Question Bank
            </span>
            <button className="question-bank-main-header-button"
            onClick={handleApiCall}>
              <Save></Save>
              <span>Save</span>
            </button>
          </div>

          {/* main conatianer body */}
          <div className="question-bank-main-body">
            {/* main body left side  */}
            <div className="question-bank-main-body-left">
              <div className="question-bank-main-body-left-header">
                <span className="question-bank-main-body-left-header-title">
                  Questions
                </span>
                <button className="question-bank-main-body-left-header-button"
                  onClick={() => {setQuestion([])}}
                >
                  <Trash2 size={20}></Trash2>
                </button>
              </div>

              <div className="question-bank-main-body-left-content">
                {question.map((item, index) => (
                  <div
                    key={index}
                    className="question-bank-main-body-left-item"
                  >
                    <input
                      type="checkbox"
                      className="question-bank-main-body-left-item-checkbox"
                      checked={item.checked}
                      onChange={() => {
                        const updatedQuestions = [...question];
                        updatedQuestions[index].checked =
                          !updatedQuestions[index].checked;
                        setQuestion(updatedQuestions);
                      }}
                    />

                    <span>{index + 1} )</span>
                    <span className="question-bank-main-body-left-item-text">
                      {item.mainText}
                    </span>
                  </div>
                ))}

                <div className="question-bank-main-body-left-content-add">
                  <button
                    className="question-bank-main-body-left-content-add-button"
                    onClick={handleAddQuestion}
                  >
                    <Plus size={13}></Plus>
                    <span>Add Question</span>
                  </button>
                </div>
              </div>
            </div>

            {/* main body right side */}
            <div className="question-bank-main-body-right">
              <div className="question-bank-main-body-right-box">
                <div className="question-bank-main-body-right-header">
                  <span className="question-bank-main-body-right-header-title">
                    Question {question.length + 1}
                  </span>
                  <FormControl size="small" sx={{ width: "200px" }}>
                    <InputLabel id="question-type-label">
                      Select Question Type
                    </InputLabel>
                    <Select
                      labelId="question-type-label"
                      id="question-type-select"
                      value={type}
                      label="Select Question Type"
                      onChange={(e) => setType(e.target.value)}
                      renderValue={(selected) => {
                        const selectedItem = questionTypes.find(
                          (item) => item.value === selected
                        );
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {selectedItem?.icon}
                            {selectedItem?.label}
                          </Box>
                        );
                      }}
                    >
                      {questionTypes.map((item) => (
                        <MenuItem
                          key={item.value}
                          value={item.value}
                          sx={{ fontSize: "0.875rem", py: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontSize: "0.875rem" }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="question-bank-main-body-right-content">
                  <TextField
                    label="Question..."
                    value={value}
                    variant="standard"
                    onChange={(e) => setValue(e.target.value)}
                    InputProps={{
                      sx: {
                        fontSize: "0.9rem", // input text size
                        fontWeight: 500, // input text weight
                        paddingY: 0.5, // vertical padding
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        fontSize: "1rem", // label text size
                        fontWeight: 400, // label text weight
                      },
                    }}
                    sx={{
                      width: "250px", // control the overall width
                    }}
                  />

                  {type === "choose_one" || type === "choose_many" ? (
                    <div className="question-option-container">
                      {options.map((option, index) => (
                        <div key={index} className="question-option">
                          <input type="Checkbox" />
                          <TextField
                            label={`Option ${index + 1}`}
                            variant="standard"
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index] = e.target.value;
                              setOptions(newOptions);
                            }}
                            InputProps={{
                              sx: {
                                fontSize: "0.9rem", // input text size
                                fontWeight: 500, // input text weight
                                paddingY: 0.5, // vertical padding
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: "1rem", // label text size
                                fontWeight: 400, // label text weight
                              },
                            }}
                            sx={{
                              width: "200px", // control the overall width
                            }}
                          />
                          <button
                            className="remove-option-button"
                            onClick={() => {
                              const newOptions = options.filter(
                                (_, i) => i !== index
                              );
                              setOptions(newOptions);
                            }}
                          >
                            <X className="border-2 rounded-full" size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        className="add-option-button"
                        onClick={() => {
                          const newOption = {
                            label: `Option ${options.length + 1}`,
                            value: `option${options.length + 1}`,
                          };
                          setOptions([...options, newOption]);
                        }}
                      >
                        <Plus size={13}></Plus>
                        <span>Add Option</span>
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
