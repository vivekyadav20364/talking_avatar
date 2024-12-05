// import * as React from 'react';
// import { useState } from 'react';
// import { Box, Drawer, Button, IconButton, Typography, Select, MenuItem } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
// import { python } from '@codemirror/lang-python';
// import { cpp } from '@codemirror/lang-cpp';
// import { java } from '@codemirror/lang-java';
// import { go } from '@codemirror/lang-go';
// import { dracula } from '@uiw/codemirror-theme-dracula';

// const SideBarCode = ({ open, setOpen }) => {
//   const [code, setCode] = useState('');
//   const [language, setLanguage] = useState('javascript');

//   const toggleDrawer = (newOpen) => () => {
//     setOpen(newOpen);
//   };

//   const handleLanguageChange = (event) => {
//     setLanguage(event.target.value);
//     setCode(getBasicSyntax(event.target.value));
//   };

//   const handleCodeChange = (value) => {
//     setCode(value);
//   };

//   const handleSubmit = () => {
//     console.log('Submitted code:', code);
//     setCode('');
//     setOpen(false);
//   };

//   const getBasicSyntax = (language) => {
//     switch (language) {
//       case 'cpp':
//         return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`;
//       case 'java':
//         return `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`;
//       case 'python':
//         return `def main():\n    # Your code here\n\nif __name__ == "__main__":\n    main()`;
//       case 'javascript':
//         return `function main() {\n    // Your code here\n}\n\nmain();`;
//       case 'go':
//         return `package main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n}`;
//       default:
//         return '';
//     }
//   };

//   const getLanguageMode = (language) => {
//     switch (language) {
//       case 'cpp':
//         return cpp();
//       case 'java':
//         return java();
//       case 'python':
//         return python();
//       case 'javascript':
//         return javascript();
//       case 'go':
//         return go();
//       default:
//         return javascript();
//     }
//   };

//   return (
//     <div>
//       <Drawer open={open}>
//         <Box
//           sx={{
//             width: 400,
//             padding: '20px',
//             display: 'flex',
//             flexDirection: 'column',
//             height: '100%',
//             backgroundColor: '#f5f5f5', // Light background for the drawer
//             color: '#333', // Darker text color
//           }}
//           role="presentation"
//         >
//           <IconButton
//             aria-label="close"
//             onClick={toggleDrawer(false)}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//               color: '#333', // Darker close button color
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <Typography variant="h6" gutterBottom className="text-xl mb-4">
//             Code Editor
//           </Typography>

//           <Select
//             value={language}
//             onChange={handleLanguageChange}
//             className="mb-4 rounded"
//             style={{ marginBottom: '20px', backgroundColor: '#e0e0e0', color: '#333' }} // Light background for the select box
//           >
//             <MenuItem value="cpp">C++</MenuItem>
//             <MenuItem value="java">Java</MenuItem>
//             <MenuItem value="python">Python</MenuItem>
//             <MenuItem value="javascript">JavaScript</MenuItem>
//             <MenuItem value="go">Go</MenuItem>
//           </Select>

//           <CodeMirror
//             value={code}
//             extensions={[getLanguageMode(language)]}
//             theme={dracula}
//             onChange={handleCodeChange}
//             height="70vh"
//             className="bg-gray-900 text-white rounded"
//             style={{ height: '70vh', backgroundColor: '#282a36', color: '#f8f8f2'}} // Dark background for the code editor
//           />

//           <Button variant="contained" onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
//             Submit
//           </Button>
//         </Box>
//       </Drawer>
//     </div>
//   );
// };

// export default SideBarCode;

import * as React from "react";
import { useState } from "react";
import {
  Box,
  Drawer,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { go } from "@codemirror/lang-go";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { sql } from "@codemirror/lang-sql"; // Importing SQL language support

import {
  LightMode as SunIcon,
  DarkMode as MoonIcon,
} from "@mui/icons-material"; // Importing icons
import { useInterviewStart } from "../context/InterviewContext";

const SideBarCode = ({ open, setOpen }) => {
  const {setSubmitedCode,language,setLanguage} = useInterviewStart();
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`);

  const [isNightMode, setIsNightMode] = useState(true); // State for day/night mode

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    setCode(getBasicSyntax(event.target.value));
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleSubmit = () => {
    console.log("Submitted code:", code);
    setSubmitedCode(code);
    setCode("");
    setOpen(false);
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  const getBasicSyntax = (language) => {
    switch (language) {
      case "cpp":
        return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`;
      case "java":
        return `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`;
      case "python":
        return `def main():\n    # Your code here\n\nif __name__ == "__main__":\n    main()`;
      case "javascript":
        return `function main() {\n    // Your code here\n}\n\nmain();`;
      case "go":
        return `package main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n}`;
      
      case "sql":
          return `SELECT * FROM table_name WHERE condition;`; // Basic SQL syntax  
      default:
        return "";
    }
  };

  const getLanguageMode = (language) => {
    switch (language) {
      case "cpp":
        return cpp();
      case "java":
        return java();
      case "python":
        return python();
      case "javascript":
        return javascript();
      case "go":
        return go();
      case "sql":
        return sql(); // SQL language mode

      default:
        return javascript();
    }
  };

  return (
    <div>
      <Drawer open={open}>
        <Box
          sx={{
            width: 400,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: isNightMode ? "#282a36" : "#f5f5f5", // Toggle background color
            color: isNightMode ? "#f8f8f2" : "#333", // Toggle text color
          }}
          role="presentation"
        >
          <IconButton
            aria-label="close"
            onClick={toggleDrawer(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: isNightMode ? "#f8f8f2" : "#333", // Close button color
            }}
          >
            <CloseIcon />
          </IconButton>

          <IconButton
            aria-label="toggle day/night mode"
            onClick={toggleNightMode}
            sx={{
              position: "absolute",
              right: 40, // Adjusted to fit before the close button
              top: 8,
              color: isNightMode ? "#f8f8f2" : "#333", // Icon color
            }}
          >
            {isNightMode ? <MoonIcon /> : <SunIcon />}
          </IconButton>

          <Typography variant="h6" gutterBottom className="text-xl mb-4">
            Code Editor
          </Typography>

          <Select
            value={language}
            onChange={handleLanguageChange}
            className="mb-4 rounded"
            style={{
              marginBottom: "20px",
              backgroundColor: isNightMode ? "#44475a" : "#e0e0e0",
              color: isNightMode ? "#f8f8f2" : "#333",
            }} // Toggle select box color
          >
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="go">Go</MenuItem>
            <MenuItem value="sql">SQL</MenuItem> {/* Added SQL as an option */}
          </Select>

          <CodeMirror
            value={code}
            extensions={[getLanguageMode(language)]}
            theme={isNightMode ? dracula : "light"} // Switch theme based on day/night mode
            onChange={handleCodeChange}
            height="70vh"
            className="rounded"
            style={{
              height: "70vh",
              backgroundColor: isNightMode ? "#282a36" : "#ffffff", // Dark background for night mode, light background for day mode
              color: isNightMode ? "#f8f8f2" : "#000000", // Light text color for night mode, dark text color for day mode
              borderColor: isNightMode ? "#44475a" : "#d1d5db", // Darker border for night mode, lighter border for day mode
              borderWidth: "3px",
              borderStyle: "solid",
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default SideBarCode;
